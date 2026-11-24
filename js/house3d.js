/* ============================================================================
   Cyber Defense: Proteja sua Smart Home — Interactive 3D Smart Home Engine
   Powered by Three.js (local offline vendor bundle) — 360° Orbit, Zoom, Fly-To,
   Interactive 3D IoT Models, Curved Network Topology & Dynamic Shield Dome
   ============================================================================ */

(function () {
  window.CyberDefense = window.CyberDefense || {};

  // Exact 3D world coordinates for every IoT device inside the architectural house
  // Coordinate system: X = Left(-7) to Right(+7), Y = Height(0..3), Z = Back(-4.6) to Front(+5.2)
  const DEVICE_3D_SLOTS = {
    // Entrada & Fachada (Front-left exterior)
    camera:     { x: -6.2, y: 2.35, z: 2.65, labelY: 2.95 },
    lock:       { x: -2.4, y: 1.25, z: 2.55, labelY: 2.15 },
    sensor:     { x: -0.6, y: 1.45, z: 2.55, labelY: 2.3 },
    gardenLamp: { x: -4.2, y: 0.72, z: 4.35, labelY: 1.45 },

    // Sala de Estar (Back-left interior)
    router:     { x: -5.75, y: 0.92, z: -2.4, labelY: 1.85 },
    lamp:       { x: -3.1,  y: 2.35, z: -1.4, labelY: 2.95 },
    assistant:  { x: -3.0,  y: 0.68, z: -0.45, labelY: 1.45 },
    tv:         { x: -0.18, y: 1.5,  z: -1.4, labelY: 2.35 },

    // Escritório & Cozinha Conectada (Right wing)
    thermostat: { x: 0.35, y: 1.55, z: -2.9, labelY: 2.35 },
    webcam:     { x: 4.65, y: 1.58, z: -3.55, labelY: 2.35 },
    nas:        { x: 1.65, y: 1.05, z: -0.95, labelY: 1.95 },
    fridge:     { x: 5.75, y: 1.55, z: 2.45, labelY: 2.75 }
  };

  // Smooth camera preset views (azimuth theta, polar phi, distance, lookAt target)
  const CAMERA_PRESETS = {
    all:        { theta: 0.42,  phi: 0.88, radius: 16.8, target: [0.0, 0.6, 0.3] },
    fachada:    { theta: -0.22, phi: 0.96, radius: 10.2, target: [-3.2, 0.9, 3.0] },
    sala:       { theta: 0.56,  phi: 0.86, radius: 10.4, target: [-3.3, 0.8, -1.2] },
    escritorio: { theta: -0.58, phi: 0.86, radius: 11.4, target: [3.4, 0.9, -0.3] }
  };

  const STATUS_COLORS = {
    pending: 0x38bdf8,
    alert:   0xfbbf24,
    safe:    0x34d399,
    partial: 0xfbbf24,
    danger:  0xfb7185
  };

  class SmartHome3D {
    constructor(canvasHost, labelsHost, onSelectDevice) {
      this.canvasHost = canvasHost;
      this.labelsHost = labelsHost;
      this.onSelectDevice = onSelectDevice;

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2(-99, -99);

      // Orbit & damped target state
      this.cur = { theta: 0.42, phi: 0.88, radius: 16.8, tx: 0, ty: 0.6, tz: 0.3 };
      this.dst = { theta: 0.42, phi: 0.88, radius: 16.8, tx: 0, ty: 0.6, tz: 0.3 };
      this.autoRotate = false;
      this.isDragging = false;
      this.dragMoved = false;
      this.dragButton = 0;
      this.lastX = 0;
      this.lastY = 0;

      // Dynamic groups
      this.deviceEntries = []; // { dev, group, hitMesh, haloMesh, beaconMesh, labelEl, pos3D, labelPos3D }
      this.topologyGroup = null;
      this.devicesGroup = null;
      this.officeLockVeil = null;
      this.shieldDome = null;
      this.shieldRing = null;
      this.hoveredDeviceId = null;
      this.selectedDeviceId = null;

      this.clock = new THREE.Clock();
      this.rafId = null;
      this.isActive = false;

      this.initScene();
      this.buildArchitecture();
      this.bindControls();
      this.startLoop();
    }

    initScene() {
      const w = this.canvasHost.clientWidth || 800;
      const h = this.canvasHost.clientHeight || 460;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x080d18);
      this.scene.fog = new THREE.FogExp2(0x080d18, 0.017);

      this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 120);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.18;

      this.canvasHost.innerHTML = '';
      this.canvasHost.appendChild(this.renderer.domElement);

      // Lighting Setup (Clean modern architectural dusk lighting)
      const hemiLight = new THREE.HemisphereLight(0x9bd5ff, 0x162238, 0.82);
      this.scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xeef6ff, 1.15);
      keyLight.position.set(11, 18, 12);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 45;
      const d = 12;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0008;
      this.scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
      rimLight.position.set(-14, 10, -12);
      this.scene.add(rimLight);

      // Warm cozy interior light in Sala de Estar
      const livingWarm = new THREE.PointLight(0xffcb80, 1.05, 11, 1.6);
      livingWarm.position.set(-3.1, 2.2, -1.2);
      this.scene.add(livingWarm);

      // Crisp cool-warm office/kitchen light
      const officeLight = new THREE.PointLight(0xa5d8ff, 0.72, 11, 1.6);
      officeLight.position.set(3.6, 2.4, -1.6);
      this.scene.add(officeLight);

      const kitchenWarm = new THREE.PointLight(0xffe0a3, 0.65, 10, 1.7);
      kitchenWarm.position.set(3.8, 2.3, 2.4);
      this.scene.add(kitchenWarm);

      this.devicesGroup = new THREE.Group();
      this.topologyGroup = new THREE.Group();
      this.scene.add(this.devicesGroup);
      this.scene.add(this.topologyGroup);

      // Responsive observer
      if (window.ResizeObserver) {
        this.resizeObs = new ResizeObserver(() => this.handleResize());
        this.resizeObs.observe(this.canvasHost);
      } else {
        window.addEventListener('resize', () => this.handleResize());
      }
    }

    handleResize() {
      if (!this.canvasHost || !this.renderer) return;
      const w = this.canvasHost.clientWidth;
      const h = this.canvasHost.clientHeight;
      if (w < 10 || h < 10) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    // Helper to create meshes cleanly
    addBox(parent, w, h, d, color, x, y, z, opts = {}) {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: opts.roughness ?? 0.68,
        metalness: opts.metalness ?? 0.12,
        transparent: Boolean(opts.opacity !== undefined && opts.opacity < 1),
        opacity: opts.opacity ?? 1,
        emissive: opts.emissive ?? 0x000000,
        emissiveIntensity: opts.emissiveIntensity ?? 0
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      if (opts.ry) mesh.rotation.y = opts.ry;
      mesh.castShadow = opts.castShadow ?? true;
      mesh.receiveShadow = opts.receiveShadow ?? true;
      parent.add(mesh);
      return mesh;
    }

    buildArchitecture() {
      const arch = new THREE.Group();

      // Subtle infinite ground grid beneath the diorama
      const grid = new THREE.GridHelper(38, 38, 0x1e324d, 0x111c2e);
      grid.position.y = -0.32;
      arch.add(grid);

      // Architectural Diorama Base Plinth
      this.addBox(arch, 15.6, 0.34, 11.4, 0x0d1524, 0, -0.17, 0.35, { roughness: 0.85, castShadow: false });
      // Subtle glowing trim border on plinth
      const trimGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(15.62, 0.35, 11.42));
      const trimLine = new THREE.LineSegments(trimGeo, new THREE.LineBasicMaterial({ color: 0x264366 }));
      trimLine.position.set(0, -0.17, 0.35);
      arch.add(trimLine);

      // ==================== FLOORS ====================
      // Sala de Estar (Warm dark slate wood)
      this.addBox(arch, 7.2, 0.08, 7.1, 0x1a263a, -3.4, 0.04, -1.05, { roughness: 0.72, castShadow: false });
      // Escritório (Cool architectural slate)
      this.addBox(arch, 6.8, 0.08, 4.8, 0x162133, 3.6, 0.04, -2.2, { roughness: 0.75, castShadow: false });
      // Cozinha (Clean lighter charcoal ceramic)
      this.addBox(arch, 6.8, 0.08, 4.5, 0x1c293f, 3.6, 0.04, 2.45, { roughness: 0.55, castShadow: false });
      // Front Yard Lawn & Porch
      this.addBox(arch, 7.2, 0.06, 2.9, 0x10282a, -3.4, 0.03, 3.95, { roughness: 0.92, castShadow: false });
      this.addBox(arch, 4.8, 0.1, 1.35, 0x213148, -2.2, 0.05, 3.15, { roughness: 0.75, castShadow: false });
      // Garden Stepping Stones
      for (let i = 0; i < 3; i++) {
        this.addBox(arch, 1.2, 0.07, 0.36, 0x2d415c, -2.4, 0.04, 4.1 + i * 0.52, { roughness: 0.8, castShadow: false });
      }

      // ==================== CUTAWAY ARCHITECTURAL WALLS ====================
      const wallCol = 0x24344d;
      const wallTopCol = 0x38bdf8;
      const wallH = 2.55;
      const lowWallH = 0.55;

      // Back Wall (Left + Right with wide panoramic window gaps)
      this.addBox(arch, 2.1, wallH, 0.22, wallCol, -5.95, wallH / 2, -4.6);
      this.addBox(arch, 2.2, wallH, 0.22, wallCol, 0.2, wallH / 2, -4.6);
      this.addBox(arch, 1.9, wallH, 0.22, wallCol, 6.05, wallH / 2, -4.6);
      // Window low sills + translucent glass panes on back wall
      this.addBox(arch, 4.0, 0.75, 0.22, wallCol, -2.9, 0.375, -4.6);
      this.addBox(arch, 4.0, 1.55, 0.07, 0x38bdf8, -2.9, 1.55, -4.6, { opacity: 0.2, roughness: 0.1, metalness: 0.6, castShadow: false });
      this.addBox(arch, 4.0, 0.25, 0.22, wallCol, -2.9, 2.43, -4.6);

      this.addBox(arch, 3.8, 0.85, 0.22, wallCol, 3.2, 0.425, -4.6);
      this.addBox(arch, 3.8, 1.45, 0.07, 0x38bdf8, 3.2, 1.6, -4.6, { opacity: 0.2, roughness: 0.1, metalness: 0.6, castShadow: false });
      this.addBox(arch, 3.8, 0.25, 0.22, wallCol, 3.2, 2.43, -4.6);

      // Left Exterior Wall (full height back half, sloping/cutaway towards front)
      this.addBox(arch, 0.22, wallH, 4.5, wallCol, -7.0, wallH / 2, -2.35);
      this.addBox(arch, 0.22, wallH, 2.6, wallCol, -7.0, wallH / 2, 1.2);
      // Right Exterior Wall (Cutaway height for open view into office/kitchen)
      this.addBox(arch, 0.22, wallH, 4.8, wallCol, 7.0, wallH / 2, -2.2);
      this.addBox(arch, 0.22, 1.9, 4.5, wallCol, 7.0, 0.95, 2.45);
      // Front Kitchen Cutaway Wall
      this.addBox(arch, 6.8, lowWallH, 0.2, wallCol, 3.6, lowWallH / 2, 4.7);

      // Central Dividing Wall (Sala | Escritório & Cozinha) with hallway doorway
      this.addBox(arch, 0.2, wallH, 2.2, wallCol, 0.2, wallH / 2, -3.5);
      this.addBox(arch, 0.2, wallH, 3.9, wallCol, 0.2, wallH / 2, 0.65);
      this.addBox(arch, 0.2, lowWallH, 2.2, wallCol, 0.2, lowWallH / 2, 3.6);

      // Office / Kitchen Half Divider Wall
      this.addBox(arch, 2.4, 1.4, 0.18, 0x1e2d44, 1.5, 0.7, 0.2);
      this.addBox(arch, 2.1, 1.4, 0.18, 0x1e2d44, 5.95, 0.7, 0.2);

      // Front Facade Entrance Wall (z = 2.5) with Wooden Door + Glass Patio Door
      this.addBox(arch, 3.7, wallH, 0.22, wallCol, -5.15, wallH / 2, 2.5);
      // Main Wooden Front Door (centered at x = -2.6)
      this.addBox(arch, 1.25, 2.15, 0.12, 0x7a4b2a, -2.65, 1.075, 2.5, { roughness: 0.65 });
      this.addBox(arch, 1.45, 0.35, 0.22, wallCol, -2.65, 2.38, 2.5);
      // Pillar between doors
      this.addBox(arch, 0.55, wallH, 0.22, wallCol, -1.7, wallH / 2, 2.5);
      // Glass Sliding Patio Door (x = -1.4 to +0.1)
      this.addBox(arch, 1.5, 2.15, 0.08, 0x38bdf8, -0.65, 1.08, 2.5, { opacity: 0.26, roughness: 0.1, metalness: 0.5, castShadow: false });
      this.addBox(arch, 1.6, 0.35, 0.22, wallCol, -0.65, 2.38, 2.5);

      // Sleek architectural glowing accent strip along top of back wall
      this.addBox(arch, 14.1, 0.04, 0.04, wallTopCol, 0, wallH + 0.02, -4.6, {
        emissive: wallTopCol,
        emissiveIntensity: 0.6,
        castShadow: false
      });

      // ==================== MINIMALIST 3D FURNITURE ====================
      // --- SALA DE ESTAR ---
      // Plush Area Rug
      this.addBox(arch, 3.8, 0.03, 2.8, 0x152236, -3.1, 0.09, -0.9, { roughness: 0.95, castShadow: false });
      // Modern L-Sofa
      this.addBox(arch, 2.8, 0.44, 0.9, 0x263854, -3.0, 0.3, 0.65, { roughness: 0.85 });
      this.addBox(arch, 2.8, 0.42, 0.24, 0x1f2f47, -3.0, 0.66, 0.98, { roughness: 0.85 });
      this.addBox(arch, 0.9, 0.44, 1.9, 0x263854, -4.05, 0.3, -0.3, { roughness: 0.85 });
      this.addBox(arch, 0.24, 0.42, 1.9, 0x1f2f47, -4.38, 0.66, -0.3, { roughness: 0.85 });
      // Throw pillows
      this.addBox(arch, 0.36, 0.32, 0.14, 0x38bdf8, -2.0, 0.66, 0.78, { ry: -0.25, roughness: 0.9 });
      this.addBox(arch, 0.36, 0.32, 0.14, 0x10b981, -3.85, 0.66, 0.76, { ry: 0.3, roughness: 0.9 });
      // Coffee Table
      this.addBox(arch, 1.45, 0.08, 0.82, 0x324866, -3.0, 0.46, -0.45, { roughness: 0.35, metalness: 0.2 });
      this.addBox(arch, 1.2, 0.34, 0.6, 0x162234, -3.0, 0.25, -0.45, { roughness: 0.7 });
      // Router Console Table (left wall)
      this.addBox(arch, 1.15, 0.68, 1.85, 0x1e2e46, -6.15, 0.42, -2.4, { roughness: 0.6 });
      // TV Credenza (dividing wall)
      this.addBox(arch, 0.58, 0.5, 2.6, 0x1e2e46, -0.22, 0.33, -1.4, { roughness: 0.6 });
      // Ceiling rail beam for pendant smart lamps
      this.addBox(arch, 2.2, 0.08, 0.14, 0x334155, -3.1, 2.52, -1.4);

      // --- ESCRITÓRIO ---
      // Workstation Desk
      this.addBox(arch, 2.6, 0.09, 1.05, 0x2b3e59, 4.65, 0.8, -3.55, { roughness: 0.45 });
      this.addBox(arch, 0.1, 0.76, 0.9, 0x19263a, 3.45, 0.42, -3.55);
      this.addBox(arch, 0.1, 0.76, 0.9, 0x19263a, 5.85, 0.42, -3.55);
      // Ultrawide Monitor on Desk
      this.addBox(arch, 1.25, 0.56, 0.06, 0x0b1220, 4.65, 1.24, -3.65);
      this.addBox(arch, 1.16, 0.48, 0.02, 0x143356, 4.65, 1.24, -3.61, {
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.45,
        castShadow: false
      });
      this.addBox(arch, 0.14, 0.24, 0.08, 0x334155, 4.65, 0.95, -3.65);
      // Office Chair
      const chairSeat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: 0x263854, roughness: 0.8 })
      );
      chairSeat.position.set(4.65, 0.52, -2.55);
      chairSeat.castShadow = true;
      arch.add(chairSeat);
      this.addBox(arch, 0.66, 0.6, 0.12, 0x1f2f47, 4.65, 0.84, -2.22);
      // Tech Rack Shelf (for NAS)
      this.addBox(arch, 1.45, 0.76, 0.85, 0x1a283e, 1.65, 0.46, -0.95, { roughness: 0.55 });

      // --- COZINHA CONECTADA ---
      // L-Countertop
      this.addBox(arch, 5.2, 0.92, 0.85, 0x22334c, 3.8, 0.5, 4.1, { roughness: 0.5 });
      this.addBox(arch, 0.85, 0.92, 2.2, 0x22334c, 6.4, 0.5, 2.6, { roughness: 0.5 });
      // Cooktop glowing dark glass
      this.addBox(arch, 1.1, 0.04, 0.6, 0x0a101d, 3.5, 0.98, 4.1, { roughness: 0.15, metalness: 0.5 });
      // Kitchen Island
      this.addBox(arch, 2.35, 0.92, 1.05, 0x283c59, 3.2, 0.5, 1.85, { roughness: 0.45 });
      this.addBox(arch, 2.45, 0.08, 1.15, 0x3b5275, 3.2, 0.98, 1.85, { roughness: 0.3 });

      // --- FRONT YARD SHRUBS & TREES ---
      const bushMat = new THREE.MeshStandardMaterial({ color: 0x134e4a, roughness: 0.9 });
      [
        [-6.1, 0.34, 4.4, 0.46],
        [-5.4, 0.26, 4.7, 0.34],
        [-0.4, 0.32, 4.45, 0.42],
        [-1.0, 0.24, 4.75, 0.3]
      ].forEach(([bx, by, bz, r]) => {
        const s = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), bushMat);
        s.position.set(bx, by, bz);
        s.castShadow = true;
        arch.add(s);
      });

      // ==================== LOCKED WING VEIL (LEVEL 1) ====================
      this.officeLockVeil = this.addBox(arch, 6.9, 2.55, 9.4, 0x070c17, 3.6, 1.32, 0.05, {
        opacity: 0.62,
        roughness: 0.9,
        castShadow: false,
        receiveShadow: false
      });
      this.officeLockVeil.visible = false;

      // ==================== PROTECTIVE 3D CYBER SHIELD DOME ====================
      const domeGeo = new THREE.SphereGeometry(9.3, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.48);
      const domeMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.055
      });
      this.shieldDome = new THREE.Mesh(domeGeo, domeMat);
      this.shieldDome.position.set(0, -0.1, 0.3);
      arch.add(this.shieldDome);

      const ringGeo = new THREE.RingGeometry(9.2, 9.36, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25
      });
      this.shieldRing = new THREE.Mesh(ringGeo, ringMat);
      this.shieldRing.rotation.x = -Math.PI / 2;
      this.shieldRing.position.set(0, -0.02, 0.3);
      arch.add(this.shieldRing);

      this.scene.add(arch);
    }

    // Build custom 3D miniature mesh for each IoT device type
    createDeviceMesh(slot, statusColor) {
      const g = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.45 });
      const lightMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.3 });
      const glowMat = new THREE.MeshStandardMaterial({
        color: statusColor,
        emissive: statusColor,
        emissiveIntensity: 0.85,
        roughness: 0.2
      });

      if (slot === 'router') {
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.14, 0.42), bodyMat);
        box.castShadow = true;
        g.add(box);
        [-0.22, 0, 0.22].forEach((ax) => {
          const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.46, 8), bodyMat);
          ant.position.set(ax, 0.25, -0.14);
          g.add(ant);
        });
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.035, 0.03), glowMat);
        led.position.set(0, 0.01, 0.21);
        g.add(led);
      } else if (slot === 'camera') {
        const cam = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.42, 12), lightMat);
        cam.rotation.x = Math.PI / 2.6;
        cam.castShadow = true;
        g.add(cam);
        const lens = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), glowMat);
        lens.position.set(0, -0.07, 0.2);
        g.add(lens);
        // Subtle scan cone
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(0.85, 2.2, 16, 1, true),
          new THREE.MeshBasicMaterial({ color: statusColor, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
        );
        cone.position.set(0, -0.95, 1.05);
        cone.rotation.x = -Math.PI / 3.4;
        g.add(cone);
      } else if (slot === 'lock') {
        const pad = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.46, 0.14), bodyMat);
        pad.castShadow = true;
        g.add(pad);
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.03), glowMat);
        screen.position.set(0, 0.06, 0.075);
        g.add(screen);
      } else if (slot === 'sensor') {
        const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.12), lightMat);
        s1.position.x = -0.08;
        const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.24, 0.1), lightMat);
        s2.position.x = 0.08;
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), glowMat);
        dot.position.set(-0.08, 0.08, 0.07);
        g.add(s1, s2, dot);
      } else if (slot === 'gardenLamp') {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.72, 10), bodyMat);
        pole.position.y = -0.22;
        const head = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.22, 12), glowMat);
        head.position.y = 0.2;
        g.add(pole, head);
      } else if (slot === 'lamp') {
        [-0.55, 0, 0.55].forEach((lx, i) => {
          const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.28 + (i === 1 ? 0.12 : 0), 6), bodyMat);
          cord.position.set(lx, 0.1, 0);
          const shade = new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.18, 16), lightMat);
          shade.position.set(lx, -0.06, 0);
          const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), glowMat);
          bulb.position.set(lx, -0.14, 0);
          g.add(cord, shade, bulb);
        });
      } else if (slot === 'assistant') {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.38, 18), bodyMat);
        cyl.castShadow = true;
        const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.024, 8, 24), glowMat);
        topRing.rotation.x = Math.PI / 2;
        topRing.position.y = 0.19;
        g.add(cyl, topRing);
      } else if (slot === 'tv') {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.05, 1.85), bodyMat);
        frame.castShadow = true;
        const scr = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.94, 1.74), glowMat);
        scr.position.x = -0.05;
        g.add(frame, scr);
      } else if (slot === 'thermostat') {
        const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.1, 20), bodyMat);
        dial.rotation.z = Math.PI / 2;
        const face = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 20), glowMat);
        face.rotation.z = Math.PI / 2;
        g.add(dial, face);
      } else if (slot === 'webcam') {
        const cam = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.18), bodyMat);
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 14), glowMat);
        lens.rotation.x = Math.PI / 2;
        lens.position.z = 0.09;
        g.add(cam, lens);
      } else if (slot === 'nas') {
        const tower = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.56, 0.56), bodyMat);
        tower.castShadow = true;
        g.add(tower);
        [-0.2, -0.07, 0.07, 0.2].forEach((bx) => {
          const led = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.04), glowMat);
          led.position.set(bx, 0.16, 0.29);
          g.add(led);
        });
      } else if (slot === 'fridge') {
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.05, 0.92), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.28, metalness: 0.65 }));
        body.position.y = -0.45;
        body.castShadow = true;
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.62, 0.36), glowMat);
        screen.position.set(-0.53, -0.05, -0.18);
        g.add(body, screen);
      }

      // Ground/device pulsing selection halo ring
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.38, 0.48, 28),
        new THREE.MeshBasicMaterial({ color: statusColor, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
      );
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = -0.25;
      g.add(halo);

      // Invisible generous hit-sphere for easy 3D clicking
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.68, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      g.add(hitMesh);

      return { group: g, hitMesh, haloMesh: halo };
    }

    /**
     * Syncs all 3D devices, topology lines, shield dome, and floating labels with app state
     */
    syncState({ devices, unlockedRooms, selectedDeviceId, securityPercent, showHints, icons, shortLabels }) {
      this.selectedDeviceId = selectedDeviceId;

      // Toggle Level 1 locked wing veil
      if (this.officeLockVeil) {
        this.officeLockVeil.visible = !unlockedRooms.includes('escritorio');
      }

      // Update Protective Dome color & intensity based on house Security %
      if (this.shieldDome && this.shieldRing) {
        const domeCol = securityPercent >= 85 ? 0x34d399 : securityPercent >= 55 ? 0x38bdf8 : 0xfb7185;
        this.shieldDome.material.color.setHex(domeCol);
        this.shieldDome.material.opacity = 0.035 + (securityPercent / 100) * 0.08;
        this.shieldRing.material.color.setHex(domeCol);
        this.shieldRing.material.opacity = 0.16 + (securityPercent / 100) * 0.34;
      }

      // Clear previous dynamic devices & labels
      while (this.devicesGroup.children.length) {
        this.devicesGroup.remove(this.devicesGroup.children[0]);
      }
      while (this.topologyGroup.children.length) {
        this.topologyGroup.remove(this.topologyGroup.children[0]);
      }
      this.labelsHost.innerHTML = '';
      this.deviceEntries = [];

      const routerSlot = DEVICE_3D_SLOTS.router;
      const routerVec = new THREE.Vector3(routerSlot.x, routerSlot.y + 0.15, routerSlot.z);

      devices.forEach((dev) => {
        const slot = DEVICE_3D_SLOTS[dev.sceneSlot] || { x: 0, y: 1, z: 0, labelY: 2 };
        const isSelected = dev.id === selectedDeviceId;
        const isAlertHint = showHints && dev.hasAlert && dev.status === 'pending';

        const colorKey = isAlertHint ? 'alert' : dev.status;
        const statusColor = STATUS_COLORS[colorKey] || STATUS_COLORS.pending;

        const { group, hitMesh, haloMesh } = this.createDeviceMesh(dev.sceneSlot, statusColor);
        group.position.set(slot.x, slot.y, slot.z);
        hitMesh.userData.deviceId = dev.id;
        this.devicesGroup.add(group);

        // Curved 3D network topology arc from Router to device
        if (dev.sceneSlot !== 'router') {
          const devVec = new THREE.Vector3(slot.x, slot.y, slot.z);
          const mid = routerVec.clone().lerp(devVec, 0.5);
          mid.y += 1.35;
          const curve = new THREE.QuadraticBezierCurve3(routerVec, mid, devVec);
          const pts = curve.getPoints(24);
          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
          const lineMat = new THREE.LineBasicMaterial({
            color: statusColor,
            transparent: true,
            opacity: isSelected ? 0.92 : 0.28
          });
          this.topologyGroup.add(new THREE.Line(lineGeo, lineMat));
        }

        // Floating projected HTML glass badge
        let miniSymbol = '?';
        if (dev.status === 'safe') miniSymbol = '✓';
        else if (dev.status === 'partial') miniSymbol = '!';
        else if (dev.status === 'danger') miniSymbol = '✕';
        else if (isAlertHint) miniSymbol = '!';

        const labelBtn = document.createElement('button');
        labelBtn.className = `pin-3d status-${dev.status} ${isAlertHint ? 'has-hint' : ''} ${isSelected ? 'selected' : ''}`;
        labelBtn.title = `Inspecionar ${dev.name}`;
        labelBtn.innerHTML = `
          <span class="pin-3d-icon">
            ${icons[dev.icon] || ''}
            <span class="pin-3d-dot">${miniSymbol}</span>
          </span>
          <span class="pin-3d-name">${shortLabels[dev.sceneSlot] || dev.name}</span>
        `;
        labelBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onSelectDevice(dev.id);
        });
        this.labelsHost.appendChild(labelBtn);

        this.deviceEntries.push({
          dev,
          group,
          hitMesh,
          haloMesh,
          labelEl: labelBtn,
          labelPos3D: new THREE.Vector3(slot.x, slot.labelY, slot.z)
        });
      });
    }

    focusRoom(roomId) {
      const p = CAMERA_PRESETS[roomId] || CAMERA_PRESETS.all;
      this.dst.theta = p.theta;
      this.dst.phi = p.phi;
      this.dst.radius = p.radius;
      this.dst.tx = p.target[0];
      this.dst.ty = p.target[1];
      this.dst.tz = p.target[2];
    }

    focusDevice(sceneSlot) {
      const s = DEVICE_3D_SLOTS[sceneSlot];
      if (!s) return;
      this.dst.tx = s.x * 0.72;
      this.dst.ty = Math.max(0.7, s.y * 0.65);
      this.dst.tz = s.z * 0.72;
      this.dst.radius = Math.min(this.dst.radius, 11.8);
    }

    resetCamera() {
      this.focusRoom('all');
    }

    zoomBy(delta) {
      this.dst.radius = Math.max(8.2, Math.min(23.5, this.dst.radius + delta));
    }

    toggleAutoRotate() {
      this.autoRotate = !this.autoRotate;
      return this.autoRotate;
    }

    setActive(active) {
      this.isActive = active;
      if (active) this.handleResize();
    }

    // ==================== POINTER, TOUCH & RAYCAST CONTROLS ====================
    bindControls() {
      const dom = this.renderer.domElement;

      dom.addEventListener('contextmenu', (e) => e.preventDefault());

      const onDown = (clientX, clientY, button = 0) => {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragButton = button;
        this.lastX = clientX;
        this.lastY = clientY;
        dom.style.cursor = 'grabbing';
      };

      const onMove = (clientX, clientY, shiftKey = false) => {
        const rect = dom.getBoundingClientRect();
        this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        if (!this.isDragging) {
          this.updateHover();
          return;
        }

        const dx = clientX - this.lastX;
        const dy = clientY - this.lastY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) this.dragMoved = true;
        this.lastX = clientX;
        this.lastY = clientY;

        if (this.dragButton === 2 || shiftKey) {
          // Gentle horizontal pan
          const panScale = 0.015 * (this.dst.radius / 14);
          const cosT = Math.cos(this.cur.theta);
          const sinT = Math.sin(this.cur.theta);
          this.dst.tx = Math.max(-6, Math.min(6, this.dst.tx - (dx * cosT + dy * sinT) * panScale));
          this.dst.tz = Math.max(-5, Math.min(5, this.dst.tz - (-dx * sinT + dy * cosT) * panScale));
        } else {
          // 360° Smooth Orbit
          this.dst.theta -= dx * 0.0085;
          this.dst.phi = Math.max(0.28, Math.min(1.26, this.dst.phi - dy * 0.0068));
        }
      };

      const onUp = () => {
        if (this.isDragging && !this.dragMoved) {
          this.handleClickPick();
        }
        this.isDragging = false;
        dom.style.cursor = this.hoveredDeviceId ? 'pointer' : 'grab';
      };

      dom.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY, e.button));
      window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY, e.shiftKey));
      window.addEventListener('mouseup', onUp);

      dom.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          this.zoomBy(e.deltaY * 0.01);
        },
        { passive: false }
      );

      // Touch support (drag orbit)
      dom.addEventListener(
        'touchstart',
        (e) => {
          if (e.touches.length === 1) {
            onDown(e.touches[0].clientX, e.touches[0].clientY, 0);
          }
        },
        { passive: true }
      );
      dom.addEventListener(
        'touchmove',
        (e) => {
          if (e.touches.length === 1) {
            onMove(e.touches[0].clientX, e.touches[0].clientY, false);
          }
        },
        { passive: true }
      );
      dom.addEventListener('touchend', onUp);

      dom.style.cursor = 'grab';
    }

    updateHover() {
      if (!this.deviceEntries.length) return;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const meshes = this.deviceEntries.map((e) => e.hitMesh);
      const hits = this.raycaster.intersectObjects(meshes, false);
      const hitId = hits.length ? hits[0].object.userData.deviceId : null;
      this.hoveredDeviceId = hitId;
      this.renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
    }

    handleClickPick() {
      if (!this.deviceEntries.length) return;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const meshes = this.deviceEntries.map((e) => e.hitMesh);
      const hits = this.raycaster.intersectObjects(meshes, false);
      if (hits.length) {
        const id = hits[0].object.userData.deviceId;
        if (id) this.onSelectDevice(id);
      }
    }

    // ==================== RENDER LOOP ====================
    startLoop() {
      const tick = () => {
        this.rafId = requestAnimationFrame(tick);
        if (!this.isActive) return;

        const dt = Math.min(this.clock.getDelta(), 0.05);
        const t = this.clock.elapsedTime;

        if (this.autoRotate && !this.isDragging) {
          this.dst.theta += dt * 0.22;
        }

        // Smooth camera damping
        const ease = 1 - Math.exp(-7.5 * dt);
        this.cur.theta += (this.dst.theta - this.cur.theta) * ease;
        this.cur.phi += (this.dst.phi - this.cur.phi) * ease;
        this.cur.radius += (this.dst.radius - this.cur.radius) * ease;
        this.cur.tx += (this.dst.tx - this.cur.tx) * ease;
        this.cur.ty += (this.dst.ty - this.cur.ty) * ease;
        this.cur.tz += (this.dst.tz - this.cur.tz) * ease;

        const sinP = Math.sin(this.cur.phi);
        const cx = this.cur.tx + this.cur.radius * sinP * Math.sin(this.cur.theta);
        const cy = this.cur.ty + this.cur.radius * Math.cos(this.cur.phi);
        const cz = this.cur.tz + this.cur.radius * sinP * Math.cos(this.cur.theta);

        this.camera.position.set(cx, cy, cz);
        this.camera.lookAt(this.cur.tx, this.cur.ty, this.cur.tz);

        // Gentle shield dome rotation
        if (this.shieldDome) {
          this.shieldDome.rotation.y = t * 0.04;
        }

        // Animate halos & project floating 3D labels cleanly to screen coordinates
        const w = this.canvasHost.clientWidth;
        const h = this.canvasHost.clientHeight;

        for (let i = 0; i < this.deviceEntries.length; i++) {
          const entry = this.deviceEntries[i];
          const isSel = entry.dev.id === this.selectedDeviceId;
          const isHov = entry.dev.id === this.hoveredDeviceId;

          const pulse = 1 + Math.sin(t * 3.2 + i) * 0.1;
          const scale = isSel ? 1.28 : isHov ? 1.18 : pulse;
          entry.haloMesh.scale.set(scale, scale, 1);

          // Project 3D label anchor -> 2D overlay pixel coordinates
          const proj = entry.labelPos3D.clone().project(this.camera);
          const visible = proj.z < 1 && proj.x > -1.08 && proj.x < 1.08 && proj.y > -1.08 && proj.y < 1.08;
          if (visible) {
            const sx = (proj.x * 0.5 + 0.5) * w;
            const sy = (-proj.y * 0.5 + 0.5) * h;
            entry.labelEl.style.display = 'flex';
            entry.labelEl.style.transform = `translate(-50%, -100%) translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
          } else {
            entry.labelEl.style.display = 'none';
          }
        }

        this.renderer.render(this.scene, this.camera);
      };

      tick();
    }
  }

  window.CyberDefense.House3D = {
    create(canvasHost, labelsHost, onSelectDevice) {
      if (typeof THREE === 'undefined') return null;
      return new SmartHome3D(canvasHost, labelsHost, onSelectDevice);
    }
  };
})();
