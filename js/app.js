/* ============================================================================
   Cyber Defense: Proteja sua Smart Home — Application Controller
   ============================================================================ */

(function () {
  const { DATA, Scenes, Sound, House3D } = window.CyberDefense;
  const STORAGE_KEY = 'cyber_defense_smart_home_v1';
  let house3d = null;

  // ==================== STATE MANAGEMENT ====================
  function createDefaultState() {
    return {
      activeView: 'home',
      currentLevelId: 1,
      currentRoomId: 'all',
      selectedDeviceId: null,
      levelSessions: {}, // { [levelId]: { [deviceId]: DeviceSession } }
      completedLevels: {}, // { [levelId]: { bestScore, lastScore, stars, completedAt } }
      unlockedAchievements: [],
      settings: {
        sound: true,
        hints: true,
        reducedMotion: false
      }
    };
  }

  let state = loadState();
  let activeDiagTab = 'telemetry'; // 'telemetry' | 'logs'

  const SHORT_LABELS = {
    camera: 'Câmera IP',
    lock: 'Fechadura',
    sensor: 'Sensor',
    gardenLamp: 'Luz Jardim',
    router: 'Roteador',
    lamp: 'Lâmpadas',
    assistant: 'Assistente',
    tv: 'Smart TV',
    thermostat: 'Termostato',
    webcam: 'Webcam',
    nas: 'NAS / Hub',
    fridge: 'Geladeira'
  };

  function getShortDeviceLabel(dev) {
    return SHORT_LABELS[dev.sceneSlot] || dev.name;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      return {
        ...createDefaultState(),
        ...parsed,
        settings: { ...createDefaultState().settings, ...(parsed.settings || {}) }
      };
    } catch {
      return createDefaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota / private mode issues
    }
  }

  // Deterministic hash & shuffle so option positions vary naturally without jumping
  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededShuffle(items, seedKey) {
    const arr = items.slice();
    let seed = hashStr(seedKey);
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ==================== HELPERS ====================
  function getCurrentLevel() {
    return DATA.LEVELS.find((l) => l.id === state.currentLevelId) || DATA.LEVELS[0];
  }

  function getLevelSession(levelId) {
    if (!state.levelSessions[levelId]) {
      state.levelSessions[levelId] = {};
    }
    return state.levelSessions[levelId];
  }

  function getDeviceRecord(levelId, deviceId) {
    const session = getLevelSession(levelId);
    if (!session[deviceId]) {
      session[deviceId] = {
        step: 1, // 1: vuln, 2: threat, 3: measure, 'done': completed
        vulnChoiceId: null,
        vulnCorrect: false,
        threatChoiceId: null,
        threatCorrect: false,
        measureChoiceId: null,
        measureQuality: null,
        scoreEarned: 0,
        status: 'pending' // pending | safe | partial | danger
      };
    }
    return session[deviceId];
  }

  function computeLevelSecurity(levelId) {
    const level = DATA.LEVELS.find((l) => l.id === levelId) || DATA.LEVELS[0];
    const total = level.devices.length;
    let sum = 0;
    let analyzedCount = 0;

    level.devices.forEach((dev) => {
      const rec = getDeviceRecord(levelId, dev.id);
      if (rec.step === 'done') {
        analyzedCount++;
        sum += rec.scoreEarned;
      } else {
        // Before inspection, already-secure devices contribute baseline protection
        sum += dev.isVulnerable ? 0 : 100;
      }
    });

    const percent = Math.round(sum / (total * 100) * 100);
    return { percent, analyzedCount, total };
  }

  function getProtectionTier(percent) {
    if (percent >= 95) {
      return {
        label: 'Casa 100% Blindada',
        cls: 'tier-max',
        stars: 5,
        summary: 'Desempenho impecável! Sua Smart Home está fortemente protegida contra invasões e vazamentos.'
      };
    }
    if (percent >= 80) {
      return {
        label: 'Casa Protegida',
        cls: 'tier-good',
        stars: 4,
        summary: 'Excelente trabalho! A maioria das ameaças foi neutralizada, com pequenos pontos para aperfeiçoar.'
      };
    }
    if (percent >= 60) {
      return {
        label: 'Proteção Parcial',
        cls: 'tier-mid',
        stars: 3,
        summary: 'Atenção: algumas vulnerabilidades foram corrigidas parcialmente ou passaram despercebidas.'
      };
    }
    return {
      label: 'Residência Vulnerável',
      cls: 'tier-low',
      stars: percent >= 35 ? 2 : 1,
      summary: 'Alerta crítico! Dispositivos importantes continuam expostos. Revise o relatório e refaça a auditoria.'
    };
  }

  function showToast(title, message, isBadge = false) {
    const stack = document.getElementById('toast-stack');
    const el = document.createElement('div');
    el.className = `toast ${isBadge ? 'toast-badge' : ''}`;
    el.innerHTML = `
      <div style="font-size:20px">${isBadge ? '🏆' : '🛡️'}</div>
      <div>
        <strong style="display:block;font-size:13.5px;margin-bottom:2px">${title}</strong>
        <span style="font-size:12.5px;color:#b8d4ee">${message}</span>
      </div>
    `;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'all 0.25s ease';
      setTimeout(() => el.remove(), 260);
    }, 4200);
  }

  // ==================== ACHIEVEMENTS ENGINE ====================
  function evaluateAchievements() {
    let idealTotal = 0;
    let passwordFixed = 0;
    let networkFixed = 0;
    let firmwareFixed = 0;
    let anyEagleEye = false;
    let anyPerfectHome = false;

    DATA.LEVELS.forEach((level) => {
      const session = state.levelSessions[level.id] || {};
      let allDone = true;
      let safeTotal = 0;
      let safeCorrect = 0;

      level.devices.forEach((dev) => {
        const rec = session[dev.id];
        if (!rec || rec.step !== 'done') {
          allDone = false;
          return;
        }
        if (!dev.isVulnerable) {
          safeTotal++;
          if (rec.vulnCorrect) safeCorrect++;
        } else if (rec.measureQuality === 'ideal') {
          idealTotal++;
          if (dev.category === 'password') passwordFixed++;
          if (dev.category === 'network') networkFixed++;
          if (dev.category === 'firmware') firmwareFixed++;
        }
      });

      if (allDone) {
        const { percent } = computeLevelSecurity(level.id);
        if (safeTotal > 0 && safeCorrect === safeTotal) anyEagleEye = true;
        if (percent === 100) anyPerfectHome = true;
      }
    });

    const c1 = state.completedLevels[1];
    const c2 = state.completedLevels[2];
    const c3 = state.completedLevels[3];

    const checks = {
      'first-shield': idealTotal >= 1,
      'eagle-eye': anyEagleEye,
      'password-hunter': passwordFixed >= 3,
      'network-defender': networkFixed >= 4,
      'firmware-master': firmwareFixed >= 2,
      'perfect-home': anyPerfectHome,
      'incident-responder': Boolean(c3 && c3.bestScore >= 80),
      'iot-guardian': Boolean(c1 && c2 && c3)
    };

    let unlockedNow = false;
    Object.entries(checks).forEach(([id, passed]) => {
      if (passed && !state.unlockedAchievements.includes(id)) {
        state.unlockedAchievements.push(id);
        unlockedNow = true;
        const ach = DATA.ACHIEVEMENTS.find((a) => a.id === id);
        if (ach) {
          Sound.badge();
          showToast(`Conquista desbloqueada: ${ach.title}`, ach.description, true);
        }
      }
    });

    if (unlockedNow) {
      saveState();
    }
    updateSidebarBadges();
  }

  function updateSidebarBadges() {
    const el = document.getElementById('nav-ach-count');
    if (el) {
      el.textContent = `${state.unlockedAchievements.length}/${DATA.ACHIEVEMENTS.length}`;
    }
  }

  // ==================== NAVIGATION & HUD ====================
  function navigateTo(viewName) {
    state.activeView = viewName;
    document.querySelectorAll('.view-section').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view-${viewName}`);
    });
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    document.getElementById('sidebar').classList.remove('mobile-open');

    if (viewName === 'play') {
      ensureHouse3D();
      if (house3d) house3d.setActive(true);
      renderPlayView();
    } else if (house3d) {
      house3d.setActive(false);
    }
    if (viewName === 'report') renderReportView();
    if (viewName === 'progress') renderProgressView();
    if (viewName === 'achievements') renderAchievementsView();
    if (viewName === 'content') renderContentView();

    updateHUD();
    saveState();
  }

  function updateHUD() {
    const level = getCurrentLevel();
    const { percent } = computeLevelSecurity(level.id);

    document.getElementById('hud-level-text').textContent = `Nível ${level.id}`;

    // Progress dots per device in current level
    const dotsWrap = document.getElementById('hud-dots');
    dotsWrap.innerHTML = level.devices
      .map((dev) => {
        const rec = getDeviceRecord(level.id, dev.id);
        let cls = '';
        if (rec.status === 'safe') cls = 'done-ok';
        else if (rec.status === 'partial') cls = 'done-warn';
        else if (rec.status === 'danger') cls = 'done-bad';
        return `<span class="hud-dot ${cls}" title="${dev.name}"></span>`;
      })
      .join('');

    // Security percentage badge
    const secPill = document.getElementById('hud-security-pill');
    const secVal = document.getElementById('hud-security-value');
    secVal.textContent = `${percent}%`;
    secPill.classList.remove('tier-mid', 'tier-low');
    if (percent < 55) secPill.classList.add('tier-low');
    else if (percent < 85) secPill.classList.add('tier-mid');

    // Unresolved alerts counter
    const unresolvedAlerts = level.alerts.filter((al) => {
      const rec = getDeviceRecord(level.id, al.deviceId);
      return rec.step !== 'done';
    });
    const alertBadge = document.getElementById('alert-count-badge');
    alertBadge.textContent = unresolvedAlerts.length;
    alertBadge.classList.toggle('hidden', unresolvedAlerts.length === 0);

    // Sound icon
    document.getElementById('icon-sound-on').style.display = state.settings.sound ? 'block' : 'none';
    document.getElementById('icon-sound-off').style.display = state.settings.sound ? 'none' : 'block';
  }

  // ==================== HERO VIEW ====================
  function renderHeroView() {
    document.getElementById('hero-bg-wrap').innerHTML = Scenes.getHeroScene();
    const grid = document.getElementById('hero-callouts-layer');
    const tipBar = document.getElementById('hero-tip-bar');

    grid.innerHTML = DATA.HERO_CALLOUTS.map(
      (c) => `
      <button class="hero-mini-device" data-callout="${c.id}">
        <span class="hero-mini-icon">${DATA.ICONS[c.icon]}</span>
        <span>${c.label}</span>
      </button>
    `
    ).join('');

    grid.querySelectorAll('.hero-mini-device').forEach((btn) => {
      const item = DATA.HERO_CALLOUTS.find((c) => c.id === btn.dataset.callout);
      const showTip = () => {
        if (tipBar && item) {
          tipBar.innerHTML = `<strong>${item.label}:</strong><span>${item.tip}</span>`;
        }
      };
      btn.addEventListener('mouseenter', showTip);
      btn.addEventListener('focus', showTip);
      btn.addEventListener('click', () => {
        Sound.click();
        navigateTo('play');
      });
    });
  }

  function ensureHouse3D() {
    if (house3d || !House3D) return;
    const canvasHost = document.getElementById('room-scene-wrap');
    const labelsHost = document.getElementById('hotspots-layer');
    try {
      house3d = House3D.create(canvasHost, labelsHost, (deviceId) => {
        selectDevice(deviceId);
      });
    } catch {
      house3d = null;
    }
  }

  // ==================== PLAY / SIMULATOR VIEW ====================
  function selectLevel(levelId) {
    state.currentLevelId = levelId;
    state.currentRoomId = 'all';
    state.selectedDeviceId = null;
    Sound.click();
    if (house3d) house3d.focusRoom('all');
    renderPlayView();
    updateHUD();
    saveState();
  }

  function selectRoom(roomId) {
    state.currentRoomId = roomId;
    if (roomId !== 'all') {
      const level = getCurrentLevel();
      const dev = level.devices.find((d) => d.id === state.selectedDeviceId);
      if (!dev || dev.roomId !== roomId) {
        state.selectedDeviceId = null;
      }
    }
    Sound.click();
    if (house3d) house3d.focusRoom(roomId);
    renderPlayView();
  }

  function selectDevice(deviceId) {
    state.selectedDeviceId = deviceId;
    activeDiagTab = 'telemetry';
    Sound.scan();
    const level = getCurrentLevel();
    const dev = level.devices.find((d) => d.id === deviceId);
    if (house3d && dev) {
      house3d.focusDevice(dev.sceneSlot);
    }
    renderRoomStage();
    renderInspector();
  }

  function renderPlayView() {
    const level = getCurrentLevel();
    if (state.currentRoomId !== 'all' && !level.rooms.includes(state.currentRoomId)) {
      state.currentRoomId = 'all';
    }

    // Level switcher pills
    const lvlGroup = document.getElementById('level-selector-group');
    lvlGroup.innerHTML = DATA.LEVELS.map((l) => {
      const done = state.completedLevels[l.id];
      return `
        <button class="level-pill ${l.id === level.id ? 'active' : ''}" data-level-id="${l.id}">
          <span>Nível ${l.id}: ${l.difficulty}</span>
          ${done ? `<span class="done-check">✓ ${done.bestScore}%</span>` : ''}
        </button>
      `;
    }).join('');

    lvlGroup.querySelectorAll('.level-pill').forEach((btn) => {
      btn.addEventListener('click', () => selectLevel(Number(btn.dataset.levelId)));
    });

    // Room filter tabs: Planta Completa + individual rooms
    const totalPending = level.devices.filter((d) => getDeviceRecord(level.id, d.id).step !== 'done').length;
    const roomTabs = document.getElementById('room-tabs');
    const allTabHTML = `
      <button class="room-tab ${state.currentRoomId === 'all' ? 'active' : ''}" data-room-id="all">
        <span>Casa Completa 3D</span>
        <span class="room-pending-pill ${totalPending === 0 ? 'all-done' : ''}">
          ${totalPending === 0 ? '✓ Ok' : `${totalPending} pend.`}
        </span>
      </button>
    `;

    roomTabs.innerHTML =
      allTabHTML +
      level.rooms
        .map((rId) => {
          const room = DATA.ROOMS[rId];
          const roomDevices = level.devices.filter((d) => d.roomId === rId);
          const pendingCount = roomDevices.filter((d) => getDeviceRecord(level.id, d.id).step !== 'done').length;
          return `
            <button class="room-tab ${rId === state.currentRoomId ? 'active' : ''}" data-room-id="${rId}">
              <span>${room.name}</span>
              <span class="room-pending-pill ${pendingCount === 0 ? 'all-done' : ''}">
                ${pendingCount === 0 ? '✓ Ok' : `${pendingCount} pend.`}
              </span>
            </button>
          `;
        })
        .join('');

    roomTabs.querySelectorAll('.room-tab').forEach((btn) => {
      btn.addEventListener('click', () => selectRoom(btn.dataset.roomId));
    });

    // Progress bar
    const { analyzedCount, total } = computeLevelSecurity(level.id);
    document.getElementById('sim-progress-text').textContent = `${analyzedCount} / ${total} dispositivos analisados`;
    document.getElementById('sim-progress-fill').style.width = `${Math.round((analyzedCount / total) * 100)}%`;

    renderRoomStage();
    renderInspector();
    updateHUD();
  }

  function renderRoomStage() {
    const level = getCurrentLevel();
    const isAll = state.currentRoomId === 'all';
    const activeRoom = isAll ? null : DATA.ROOMS[state.currentRoomId];
    const visibleDevices = isAll
      ? level.devices
      : level.devices.filter((d) => d.roomId === state.currentRoomId);

    document.getElementById('stage-room-title').textContent = isAll
      ? `${level.title} — Maquete 3D Interativa`
      : `${level.title} — ${activeRoom.name}`;
    document.getElementById('stage-room-desc').textContent = isAll
      ? 'Arraste para girar a Smart Home em 360°, dê zoom e clique em qualquer dispositivo IoT.'
      : activeRoom.description;

    const { percent } = computeLevelSecurity(level.id);
    const devicesWithStatus = level.devices.map((d) => ({
      ...d,
      status: getDeviceRecord(level.id, d.id).status
    }));

    if (house3d) {
      house3d.syncState({
        devices: devicesWithStatus,
        unlockedRooms: level.rooms,
        selectedDeviceId: state.selectedDeviceId,
        securityPercent: percent,
        showHints: state.settings.hints,
        icons: DATA.ICONS,
        shortLabels: SHORT_LABELS
      });
    } else {
      // Automatic fallback if WebGL is unavailable
      document.getElementById('room-scene-wrap').innerHTML = Scenes.getFloorPlanScene({
        activeRoomId: state.currentRoomId,
        unlockedRooms: level.rooms,
        devices: devicesWithStatus,
        selectedDeviceId: state.selectedDeviceId
      });
    }

    // Quick device strip below 3D viewport
    const strip = document.getElementById('room-devices-strip');
    strip.innerHTML = visibleDevices
      .map((dev) => {
        const rec = getDeviceRecord(level.id, dev.id);
        const isSelected = state.selectedDeviceId === dev.id;
        return `
          <button class="device-chip-btn status-${rec.status} ${isSelected ? 'active' : ''}" data-device-id="${dev.id}">
            <span class="dot"></span>
            <span>${dev.name}</span>
          </button>
        `;
      })
      .join('');

    strip.querySelectorAll('.device-chip-btn').forEach((btn) => {
      btn.addEventListener('click', () => selectDevice(btn.dataset.deviceId));
    });
  }

  // ==================== DEVICE INSPECTOR & 3-STEP WIZARD ====================
  function renderInspector() {
    const container = document.getElementById('inspector-card');
    const level = getCurrentLevel();
    const dev = level.devices.find((d) => d.id === state.selectedDeviceId);

    if (!dev) {
      const nextPending = level.devices.find((d) => getDeviceRecord(level.id, d.id).step !== 'done');
      container.innerHTML = `
        <div class="inspector-empty">
          <div class="inspector-empty-icon">${DATA.ICONS.shield}</div>
          <h3>Console de Inspeção IoT</h3>
          <p>${level.description}</p>
          <div class="inspector-tip-box">
            <strong>Dica do Analista:</strong>
            Clique em qualquer dispositivo na cena ao lado (ou abra o sino de Alertas no topo) para ler as configurações técnicas, logs de rede e decidir se há vulnerabilidade.
          </div>
          ${
            nextPending
              ? `<button class="btn-primary" id="btn-inspect-next" style="margin-top:16px">Inspecionar: ${nextPending.name} ›</button>`
              : `<button class="btn-emerald" id="btn-empty-report" style="margin-top:16px">Todos analisados! Abrir Relatório ›</button>`
          }
        </div>
      `;
      const nextBtn = document.getElementById('btn-inspect-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          state.currentRoomId = nextPending.roomId;
          selectDevice(nextPending.id);
          renderPlayView();
        });
      }
      const repBtn = document.getElementById('btn-empty-report');
      if (repBtn) {
        repBtn.addEventListener('click', () => navigateTo('report'));
      }
      return;
    }

    const rec = getDeviceRecord(level.id, dev.id);

    // Status pill text
    const statusMap = {
      pending: { text: 'Em análise', cls: 'pending' },
      safe: { text: 'Protegido', cls: 'safe' },
      partial: { text: 'Atenção', cls: 'partial' },
      danger: { text: 'Vulnerável', cls: 'danger' }
    };
    const st = statusMap[rec.status];

    // Render Telemetry + Logs
    const telemetryHTML = dev.telemetry
      .map(
        (t) => `
      <div class="telemetry-row">
        <span class="telemetry-label">${t.label}</span>
        <span class="telemetry-value ${t.flag}">${t.value}</span>
      </div>
    `
      )
      .join('');

    const logsHTML = dev.logs
      .map((line) => {
        const cls = line.includes('ALERT') ? 'is-alert' : line.includes('WARN') ? 'is-warn' : '';
        return `<div class="log-line ${cls}">${line}</div>`;
      })
      .join('');

    // Build Wizard Body depending on step
    let wizardHTML = '';

    if (rec.step === 'done') {
      wizardHTML = renderResolvedDeviceSummary(dev, rec, level);
    } else {
      const s1Class = rec.step === 1 ? 'active' : 'completed';
      const s2Class = rec.step === 2 ? 'active' : rec.step === 3 ? 'completed' : '';
      const s3Class = rec.step === 3 ? 'active' : '';

      wizardHTML = `
        <div class="wizard-steps-bar">
          <div class="wizard-step-tab ${s1Class}">1. Vulnerabilidade</div>
          <div class="wizard-step-tab ${s2Class}">2. Ameaça</div>
          <div class="wizard-step-tab ${s3Class}">3. Proteção</div>
        </div>
        <div id="wizard-step-content">${renderWizardStepContent(dev, rec)}</div>
      `;
    }

    const alertLogCount = dev.logs.filter((l) => l.includes('ALERT') || l.includes('WARN')).length;

    container.innerHTML = `
      <div class="inspector-header">
        <div class="inspector-dev-icon">${DATA.ICONS[dev.icon]}</div>
        <div class="inspector-dev-meta">
          <h3>${dev.name}</h3>
          <div class="inspector-dev-sub">${dev.ip} • ${dev.protocol}</div>
        </div>
        <span class="status-pill ${st.cls}">${st.text}</span>
      </div>

      <div class="diag-box">
        <div class="diag-header-tabs">
          <button class="diag-tab-btn ${activeDiagTab === 'telemetry' ? 'active' : ''}" data-diag-tab="telemetry">
            Configurações
          </button>
          <button class="diag-tab-btn ${activeDiagTab === 'logs' ? 'active' : ''}" data-diag-tab="logs">
            Logs de Rede ${alertLogCount > 0 ? `(${alertLogCount} alertas)` : `(${dev.logs.length})`}
          </button>
        </div>
        <div class="diag-pane">
          ${
            activeDiagTab === 'telemetry'
              ? `<div class="telemetry-grid">${telemetryHTML}</div>`
              : `<div class="logs-terminal">${logsHTML}</div>`
          }
        </div>
      </div>

      ${wizardHTML}
    `;

    container.querySelectorAll('.diag-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeDiagTab = btn.dataset.diagTab;
        Sound.click();
        renderInspector();
      });
    });

    bindWizardEvents(dev, rec, level);
  }

  function renderWizardStepContent(dev, rec) {
    const letters = ['A', 'B', 'C', 'D'];

    // STEP 1: IDENTIFY VULNERABILITY
    if (rec.step === 1) {
      const opts = seededShuffle(dev.vulnerability.options, `${dev.id}-v`);
      const answered = rec.vulnChoiceId !== null;
      let feedbackHTML = '';

      if (answered) {
        if (rec.vulnCorrect) {
          feedbackHTML = `
            <div class="feedback-box ok">
              <strong>✓ Diagnóstico correto!</strong>
              ${dev.vulnerability.explanation}
            </div>
          `;
        } else if (!dev.isVulnerable) {
          feedbackHTML = `
            <div class="feedback-box warn">
              <strong>⚠ Falso Positivo!</strong>
              Este dispositivo já estava configurado de forma segura. ${dev.vulnerability.explanation}
            </div>
          `;
        } else {
          feedbackHTML = `
            <div class="feedback-box bad">
              <strong>✕ Vulnerabilidade não identificada corretamente</strong>
              ${dev.vulnerability.explanation}
            </div>
          `;
        }
      }

      return `
        <div class="wizard-question">${dev.vulnerability.question}</div>
        <div class="options-list">
          ${opts
            .map((o, idx) => {
              let cls = '';
              if (answered) {
                if (o.correct) cls = 'opt-correct';
                else if (o.id === rec.vulnChoiceId) cls = 'opt-wrong';
              }
              return `
                <button class="option-btn ${cls}" data-step="1" data-opt-id="${o.id}" ${answered ? 'disabled' : ''}>
                  <span class="option-letter">${letters[idx]}</span>
                  <span>${o.text}</span>
                </button>
              `;
            })
            .join('')}
        </div>
        ${feedbackHTML}
        ${
          answered && dev.isVulnerable
            ? `<div class="wizard-footer-actions">
                 <button class="btn-primary" id="btn-next-step">Etapa 2: Reconhecer Ameaça ›</button>
               </div>`
            : ''
        }
      `;
    }

    // STEP 2: RECOGNIZE THREAT
    if (rec.step === 2) {
      const opts = seededShuffle(dev.threat.options, `${dev.id}-t`);
      const answered = rec.threatChoiceId !== null;
      let feedbackHTML = '';

      if (answered) {
        feedbackHTML = `
          <div class="feedback-box ${rec.threatCorrect ? 'ok' : 'bad'}">
            <strong>${rec.threatCorrect ? '✓ Ameaça reconhecida com precisão!' : '✕ Ameaça incorreta'}</strong>
            ${dev.threat.explanation}
          </div>
        `;
      }

      return `
        <div class="wizard-question">${dev.threat.question}</div>
        <div class="options-list">
          ${opts
            .map((o, idx) => {
              let cls = '';
              if (answered) {
                if (o.correct) cls = 'opt-correct';
                else if (o.id === rec.threatChoiceId) cls = 'opt-wrong';
              }
              return `
                <button class="option-btn ${cls}" data-step="2" data-opt-id="${o.id}" ${answered ? 'disabled' : ''}>
                  <span class="option-letter">${letters[idx]}</span>
                  <span>${o.text}</span>
                </button>
              `;
            })
            .join('')}
        </div>
        ${feedbackHTML}
        ${
          answered
            ? `<div class="wizard-footer-actions">
                 <button class="btn-primary" id="btn-next-step">Etapa 3: Selecionar Proteção ›</button>
               </div>`
            : ''
        }
      `;
    }

    // STEP 3: SELECT PROTECTION MEASURE
    if (rec.step === 3) {
      const opts = seededShuffle(dev.measure.options, `${dev.id}-m`);
      return `
        <div class="wizard-question">${dev.measure.question}</div>
        <div class="options-list">
          ${opts
            .map(
              (o, idx) => `
              <button class="option-btn" data-step="3" data-opt-id="${o.id}">
                <span class="option-letter">${letters[idx]}</span>
                <span>${o.text}</span>
              </button>
            `
            )
            .join('')}
        </div>
      `;
    }

    return '';
  }

  function renderResolvedDeviceSummary(dev, rec, level) {
    const nextPending = level.devices.find((d) => getDeviceRecord(level.id, d.id).step !== 'done');

    let summaryRows = '';
    if (!dev.isVulnerable) {
      const feedbackCls = rec.vulnCorrect ? 'ok' : 'warn';
      summaryRows = `
        <div class="feedback-box ${feedbackCls}" style="margin-top:0">
          <strong>${rec.vulnCorrect ? '✓ Dispositivo Seguro Confirmado (+100 pts)' : '⚠ Falso Positivo Registrado (+60 pts)'}</strong>
          ${dev.vulnerability.explanation}
        </div>
      `;
    } else {
      const chosenMeasure = dev.measure.options.find((m) => m.id === rec.measureChoiceId);
      const fbCls = rec.measureQuality === 'ideal' ? 'ok' : rec.measureQuality === 'partial' ? 'warn' : 'bad';
      const titleText =
        rec.measureQuality === 'ideal'
          ? `✓ Proteção Aplicada com Sucesso (+${rec.scoreEarned} pts)`
          : rec.measureQuality === 'partial'
          ? `⚠ Proteção Parcial (+${rec.scoreEarned} pts)`
          : `✕ Medida Inadequada (+${rec.scoreEarned} pts)`;

      summaryRows = `
        <div class="feedback-box ${fbCls}" style="margin-top:0">
          <strong>${titleText}</strong>
          ${chosenMeasure ? chosenMeasure.feedback : ''}
        </div>
        <div class="resolved-row">
          <span>1. Vulnerabilidade (${rec.vulnCorrect ? 'Acertou' : 'Errou'})</span>
          ${dev.vulnerability.options.find((o) => o.correct).text}
        </div>
        <div class="resolved-row">
          <span>2. Ameaça (${rec.threatCorrect ? 'Acertou' : 'Errou'})</span>
          ${dev.threat.options.find((o) => o.correct).text}
        </div>
        <div class="resolved-row">
          <span>3. Medida Aplicada</span>
          ${chosenMeasure ? chosenMeasure.text : '-'}
        </div>
      `;
    }

    const actionBtn = nextPending
      ? `<button class="btn-primary" id="btn-go-next-device">Próximo dispositivo: ${nextPending.name} ›</button>`
      : `<button class="btn-emerald" id="btn-go-final-report">Auditoria Concluída! Ver Relatório Final ›</button>`;

    return `
      <div class="resolved-summary">
        ${summaryRows}
        <div class="wizard-footer-actions">${actionBtn}</div>
      </div>
    `;
  }

  function bindWizardEvents(dev, rec, level) {
    const container = document.getElementById('inspector-card');

    container.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = Number(btn.dataset.step);
        const optId = btn.dataset.optId;
        handleWizardAnswer(dev, rec, level, step, optId);
      });
    });

    const nextStepBtn = document.getElementById('btn-next-step');
    if (nextStepBtn) {
      nextStepBtn.addEventListener('click', () => {
        Sound.click();
        rec.step = rec.step === 1 ? 2 : 3;
        saveState();
        renderInspector();
      });
    }

    const nextDevBtn = document.getElementById('btn-go-next-device');
    if (nextDevBtn) {
      nextDevBtn.addEventListener('click', () => {
        const nextPending = level.devices.find((d) => getDeviceRecord(level.id, d.id).step !== 'done');
        if (nextPending) {
          state.currentRoomId = nextPending.roomId;
          selectDevice(nextPending.id);
          renderPlayView();
        }
      });
    }

    const repBtn = document.getElementById('btn-go-final-report');
    if (repBtn) {
      repBtn.addEventListener('click', () => {
        Sound.click();
        navigateTo('report');
      });
    }
  }

  function handleWizardAnswer(dev, rec, level, step, optId) {
    if (step === 1) {
      const opt = dev.vulnerability.options.find((o) => o.id === optId);
      rec.vulnChoiceId = optId;
      rec.vulnCorrect = Boolean(opt && opt.correct);

      if (!dev.isVulnerable) {
        // Safe device completes in Step 1!
        rec.step = 'done';
        rec.measureQuality = rec.vulnCorrect ? 'safe-ok' : 'false-positive';
        rec.scoreEarned = rec.vulnCorrect ? 100 : 60;
        rec.status = rec.vulnCorrect ? 'safe' : 'partial';
        if (rec.vulnCorrect) Sound.success();
        else Sound.partial();
        checkLevelCompletion(level);
      } else {
        if (rec.vulnCorrect) Sound.success();
        else Sound.error();
      }
      saveState();
      renderPlayView();
      return;
    }

    if (step === 2) {
      const opt = dev.threat.options.find((o) => o.id === optId);
      rec.threatChoiceId = optId;
      rec.threatCorrect = Boolean(opt && opt.correct);
      if (rec.threatCorrect) Sound.success();
      else Sound.error();
      saveState();
      renderInspector();
      return;
    }

    if (step === 3) {
      const opt = dev.measure.options.find((o) => o.id === optId);
      rec.measureChoiceId = optId;
      rec.measureQuality = opt ? opt.quality : 'wrong';

      const ptsVuln = rec.vulnCorrect ? 30 : 0;
      const ptsThreat = rec.threatCorrect ? 25 : 0;
      const ptsMeasure = rec.measureQuality === 'ideal' ? 45 : rec.measureQuality === 'partial' ? 22 : 0;
      rec.scoreEarned = ptsVuln + ptsThreat + ptsMeasure;

      if (rec.measureQuality === 'ideal' && rec.vulnCorrect) {
        rec.status = 'safe';
        Sound.success();
      } else if (rec.measureQuality === 'ideal' || rec.measureQuality === 'partial') {
        rec.status = 'partial';
        Sound.partial();
      } else {
        rec.status = 'danger';
        Sound.error();
      }

      rec.step = 'done';
      checkLevelCompletion(level);
      saveState();
      renderPlayView();
    }
  }

  function checkLevelCompletion(level) {
    const { percent, analyzedCount, total } = computeLevelSecurity(level.id);
    if (analyzedCount === total) {
      const tier = getProtectionTier(percent);
      const prev = state.completedLevels[level.id];
      state.completedLevels[level.id] = {
        bestScore: prev ? Math.max(prev.bestScore, percent) : percent,
        lastScore: percent,
        stars: prev ? Math.max(prev.stars, tier.stars) : tier.stars,
        completedAt: new Date().toLocaleDateString('pt-BR')
      };
      Sound.victory();
      showToast(`${level.title} concluído!`, `Nível final de proteção: ${percent}% (${tier.label}). Abra o Relatório Final!`);
    }
    evaluateAchievements();
  }

  function resetCurrentLevel() {
    const level = getCurrentLevel();
    state.levelSessions[level.id] = {};
    state.selectedDeviceId = null;
    state.currentRoomId = 'all';
    Sound.click();
    saveState();
    renderPlayView();
    showToast('Nível reiniciado', `${level.title} pronto para uma nova auditoria.`);
  }

  // ==================== FINAL REPORT VIEW ====================
  function renderReportView() {
    const level = getCurrentLevel();
    const { percent, analyzedCount, total } = computeLevelSecurity(level.id);
    const tier = getProtectionTier(percent);

    // Compute KPIs
    let vulnsTotal = 0;
    let vulnsFound = 0;
    let threatsFound = 0;
    let idealMeasures = 0;
    let safeTotal = 0;
    let safeConfirmed = 0;

    level.devices.forEach((dev) => {
      const rec = getDeviceRecord(level.id, dev.id);
      if (dev.isVulnerable) {
        vulnsTotal++;
        if (rec.step === 'done') {
          if (rec.vulnCorrect) vulnsFound++;
          if (rec.threatCorrect) threatsFound++;
          if (rec.measureQuality === 'ideal') idealMeasures++;
        }
      } else {
        safeTotal++;
        if (rec.step === 'done' && rec.vulnCorrect) safeConfirmed++;
      }
    });

    const circumference = 2 * Math.PI * 76;
    const offset = circumference - (percent / 100) * circumference;
    const strokeColor =
      percent >= 85 ? '#34d399' : percent >= 60 ? '#fbbf24' : '#fb7185';

    const starsStr = '★'.repeat(tier.stars) + '☆'.repeat(5 - tier.stars);
    const nextLevel = DATA.LEVELS.find((l) => l.id === level.id + 1);

    const deviceCardsHTML = level.devices
      .map((dev) => {
        const rec = getDeviceRecord(level.id, dev.id);
        const room = DATA.ROOMS[dev.roomId];
        const done = rec.step === 'done';

        const statusLabel = !done
          ? { text: 'Não analisado', cls: 'pending' }
          : rec.status === 'safe'
          ? { text: 'Protegido', cls: 'safe' }
          : rec.status === 'partial'
          ? { text: 'Parcial / Atenção', cls: 'partial' }
          : { text: 'Em Risco', cls: 'danger' };

        if (!dev.isVulnerable) {
          return `
            <div class="report-device-card">
              <div class="report-device-head">
                <div>
                  <h4>${dev.name}</h4>
                  <small style="color:var(--text-muted)">${room.name} • Estado Real: Já Seguro</small>
                </div>
                <span class="status-pill ${statusLabel.cls}">${statusLabel.text}</span>
              </div>
              <div class="report-detail-line">
                <strong>Sua análise:</strong> ${
                  !done
                    ? 'Dispositivo não inspecionado.'
                    : rec.vulnCorrect
                    ? 'Confirmado corretamente como seguro (sem falso positivo).'
                    : 'Marcado incorretamente como vulnerável (falso positivo).'
                }
              </div>
              <div class="report-detail-line">
                <strong>Observação técnica:</strong> ${dev.vulnerability.explanation}
              </div>
            </div>
          `;
        }

        const realVuln = dev.vulnerability.options.find((o) => o.correct).text;
        const chosenVuln = dev.vulnerability.options.find((o) => o.id === rec.vulnChoiceId);
        const realThreat = dev.threat.options.find((o) => o.correct).text;
        const chosenThreat = dev.threat.options.find((o) => o.id === rec.threatChoiceId);
        const idealMeasure = dev.measure.options.find((m) => m.quality === 'ideal').text;
        const chosenMeasure = dev.measure.options.find((m) => m.id === rec.measureChoiceId);

        return `
          <div class="report-device-card">
            <div class="report-device-head">
              <div>
                <h4>${dev.name}</h4>
                <small style="color:var(--text-muted)">${room.name} • Estado Real: Vulnerável</small>
              </div>
              <span class="status-pill ${statusLabel.cls}">${statusLabel.text}</span>
            </div>
            <div class="report-detail-line">
              <strong>Vulnerabilidade real:</strong> ${realVuln}
              ${done ? (rec.vulnCorrect ? ' <span style="color:#10f587">(Identificada ✓)</span>' : ` <span style="color:#ff7c94">(Sua escolha: ${chosenVuln ? chosenVuln.text : '-'})</span>`) : ''}
            </div>
            <div class="report-detail-line">
              <strong>Ameaça associada:</strong> ${realThreat}
              ${done ? (rec.threatCorrect ? ' <span style="color:#10f587">(Reconhecida ✓)</span>' : ` <span style="color:#ff7c94">(Sua escolha: ${chosenThreat ? chosenThreat.text : '-'})</span>`) : ''}
            </div>
            <div class="report-detail-line">
              <strong>Sua medida de proteção:</strong> ${done && chosenMeasure ? chosenMeasure.text : 'Nenhuma medida aplicada ainda.'}
            </div>
            ${
              !done || rec.measureQuality !== 'ideal'
                ? `<div class="report-detail-line" style="color:#9ef5cf"><strong>Recomendação ideal:</strong> ${idealMeasure}</div>`
                : ''
            }
          </div>
        `;
      })
      .join('');

    const container = document.getElementById('report-container');
    container.innerHTML = `
      <div class="section-header">
        <h2>Relatório de Segurança Residencial — ${level.title}</h2>
        <p>Auditoria completa dos dispositivos conectados, vulnerabilidades identificadas, ameaças reconhecidas e eficácia das medidas aplicadas.</p>
      </div>

      ${
        analyzedCount < total
          ? `<div class="feedback-box warn" style="margin-bottom:18px">
               <strong>Auditoria em andamento (${analyzedCount}/${total} dispositivos analisados)</strong>
               Você ainda possui ${total - analyzedCount} dispositivo(s) pendente(s) neste nível. Você pode voltar ao simulador para concluir a proteção completa da casa.
             </div>`
          : ''
      }

      <div class="report-hero">
        <div class="report-gauge-wrap">
          <svg class="report-gauge-svg" viewBox="0 0 180 180">
            <circle class="gauge-track" cx="90" cy="90" r="76" />
            <circle
              class="gauge-progress"
              cx="90" cy="90" r="76"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"
              style="stroke:${strokeColor}"
            />
          </svg>
          <div class="report-gauge-center">
            <div class="report-score-num" style="color:${strokeColor}">${percent}%</div>
            <div class="report-score-sub">Proteção Final</div>
          </div>
        </div>

        <div>
          <div class="report-stars" aria-label="${tier.stars} de 5 estrelas">${starsStr}</div>
          <span class="report-tier-badge ${tier.cls}">${tier.label}</span>
          <h3 style="font-family:var(--font-display);font-size:22px;margin-bottom:6px">${level.subtitle}</h3>
          <p style="color:var(--text-secondary)">${tier.summary}</p>

          <div class="report-kpis">
            <div class="kpi-card">
              <strong>${vulnsFound}/${vulnsTotal}</strong>
              <span>Vulnerabilidades identificadas</span>
            </div>
            <div class="kpi-card">
              <strong>${threatsFound}/${vulnsTotal}</strong>
              <span>Ameaças reconhecidas</span>
            </div>
            <div class="kpi-card">
              <strong>${idealMeasures}/${vulnsTotal}</strong>
              <span>Proteções ideais aplicadas</span>
            </div>
            <div class="kpi-card">
              <strong>${safeConfirmed}/${safeTotal}</strong>
              <span>Dispositivos seguros confirmados</span>
            </div>
          </div>

          <div class="report-actions">
            <button class="btn-outline" id="rep-back-sim">← Voltar ao Simulador</button>
            <button class="btn-outline" id="rep-retry-level">Refazer Nível ${level.id}</button>
            <button class="btn-primary" id="rep-print">Imprimir / Salvar PDF</button>
            ${
              nextLevel
                ? `<button class="btn-emerald" id="rep-next-level">Avançar para Nível ${nextLevel.id} ›</button>`
                : ''
            }
          </div>
        </div>
      </div>

      <h3 style="font-family:var(--font-display);font-size:19px;margin-bottom:14px">Detalhamento por Dispositivo (${total})</h3>
      <div class="report-list">${deviceCardsHTML}</div>
    `;

    document.getElementById('rep-back-sim').addEventListener('click', () => navigateTo('play'));
    document.getElementById('rep-retry-level').addEventListener('click', () => {
      resetCurrentLevel();
      navigateTo('play');
    });
    document.getElementById('rep-print').addEventListener('click', () => window.print());
    const nextBtn = document.getElementById('rep-next-level');
    if (nextBtn && nextLevel) {
      nextBtn.addEventListener('click', () => {
        selectLevel(nextLevel.id);
        navigateTo('play');
      });
    }
  }

  // ==================== PROGRESS, ACHIEVEMENTS & CONTENT ====================
  function renderProgressView() {
    const completedCount = Object.keys(state.completedLevels).length;
    const totalDevices = DATA.LEVELS.reduce((acc, l) => acc + l.devices.length, 0);
    let totalAnalyzed = 0;
    DATA.LEVELS.forEach((l) => {
      totalAnalyzed += computeLevelSecurity(l.id).analyzedCount;
    });

    const cards = DATA.LEVELS.map((l) => {
      const comp = state.completedLevels[l.id];
      const live = computeLevelSecurity(l.id);
      const stars = comp ? '★'.repeat(comp.stars) + '☆'.repeat(5 - comp.stars) : '☆☆☆☆☆';
      return `
        <div class="glass-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span class="content-tag" style="margin:0">${l.difficulty}</span>
            <span style="color:var(--amber);letter-spacing:2px">${stars}</span>
          </div>
          <h3>${l.title}</h3>
          <p style="margin-bottom:14px">${l.subtitle} — ${l.devices.length} dispositivos em ${l.rooms.length} cômodo(s).</p>
          <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);margin-bottom:6px">
            <span>Sessão atual: ${live.analyzedCount}/${live.total} analisados</span>
            <strong style="color:var(--emerald)">Melhor: ${comp ? `${comp.bestScore}%` : '—'}</strong>
          </div>
          <div class="mini-progress-track" style="width:100%;margin-bottom:16px">
            <div class="mini-progress-fill" style="width:${Math.round((live.analyzedCount / live.total) * 100)}%"></div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn-primary progress-play-btn" data-lvl="${l.id}">${comp ? 'Jogar Novamente' : 'Iniciar Nível'}</button>
            <button class="btn-outline progress-rep-btn" data-lvl="${l.id}">Ver Relatório</button>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('progress-content').innerHTML = `
      <div class="report-kpis" style="margin-bottom:22px;margin-top:0">
        <div class="kpi-card"><strong>${completedCount}/${DATA.LEVELS.length}</strong><span>Níveis concluídos</span></div>
        <div class="kpi-card"><strong>${totalAnalyzed}/${totalDevices}</strong><span>Dispositivos auditados</span></div>
        <div class="kpi-card"><strong>${state.unlockedAchievements.length}/${DATA.ACHIEVEMENTS.length}</strong><span>Conquistas obtidas</span></div>
        <div class="kpi-card"><strong>${computeLevelSecurity(state.currentLevelId).percent}%</strong><span>Segurança no nível atual</span></div>
      </div>
      <div class="cards-grid-3">${cards}</div>
    `;

    document.querySelectorAll('.progress-play-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectLevel(Number(btn.dataset.lvl));
        navigateTo('play');
      });
    });

    document.querySelectorAll('.progress-rep-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.currentLevelId = Number(btn.dataset.lvl);
        navigateTo('report');
      });
    });
  }

  function renderAchievementsView() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = DATA.ACHIEVEMENTS.map((ach) => {
      const unlocked = state.unlockedAchievements.includes(ach.id);
      return `
        <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="ach-icon">${ach.icon}</div>
          <div>
            <h3 style="font-family:var(--font-display);font-size:16.5px;margin-bottom:4px">${ach.title}</h3>
            <p style="font-size:13.3px;color:var(--text-secondary)">${ach.description}</p>
            <span class="ach-status">${unlocked ? '✓ Desbloqueada' : `Meta: ${ach.conditionText}`}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderContentView() {
    const grid = document.getElementById('content-grid');
    grid.innerHTML = DATA.CONTENTS.map(
      (c) => `
      <article class="glass-card">
        <span class="content-tag">${c.tag}</span>
        <h3>${c.title}</h3>
        <p>${c.summary}</p>
        <ul class="content-bullets">
          ${c.bullets.map((b) => `<li>${b}</li>`).join('')}
        </ul>
      </article>
    `
    ).join('');
  }

  // ==================== ALERTS DRAWER ====================
  function openAlertsDrawer() {
    const level = getCurrentLevel();
    document.getElementById('drawer-level-name').textContent = `Nível ${level.id}`;

    const body = document.getElementById('alerts-drawer-body');
    body.innerHTML = level.alerts
      .map((al) => {
        const rec = getDeviceRecord(level.id, al.deviceId);
        const resolved = rec.step === 'done';
        const room = DATA.ROOMS[al.roomId];
        return `
          <button class="alert-item ${al.severity} ${resolved ? 'resolved' : ''}" data-room="${al.roomId}" data-dev="${al.deviceId}">
            <div class="alert-item-top">
              <span class="alert-sev">${resolved ? 'Verificado' : al.severity === 'high' ? 'Alta Prioridade' : 'Alerta'}</span>
              <span style="font-size:11.5px;color:var(--text-muted)">${room.shortName}</span>
            </div>
            <h4>${al.title}</h4>
            <p>${al.message}</p>
          </button>
        `;
      })
      .join('');

    body.querySelectorAll('.alert-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.currentRoomId = btn.dataset.room;
        state.selectedDeviceId = btn.dataset.dev;
        closeAlertsDrawer();
        Sound.scan();
        navigateTo('play');
        const dev = level.devices.find((d) => d.id === btn.dataset.dev);
        if (house3d && dev) house3d.focusDevice(dev.sceneSlot);
      });
    });

    document.getElementById('drawer-backdrop').classList.add('open');
    document.getElementById('alerts-drawer').classList.add('open');
    Sound.alert();
  }

  function closeAlertsDrawer() {
    document.getElementById('drawer-backdrop').classList.remove('open');
    document.getElementById('alerts-drawer').classList.remove('open');
  }

  // ==================== SETTINGS & INIT ====================
  function applySettings() {
    Sound.setEnabled(state.settings.sound);
    document.body.classList.toggle('reduced-motion', state.settings.reducedMotion);
    document.getElementById('setting-sound').checked = state.settings.sound;
    document.getElementById('setting-hints').checked = state.settings.hints;
    document.getElementById('setting-reduced-motion').checked = state.settings.reducedMotion;
    updateHUD();
  }

  function bindGlobalEvents() {
    // Sidebar navigation
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        Sound.click();
        navigateTo(btn.dataset.view);
      });
    });

    // Mobile sidebar toggle
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });

    // Hero & HowTo CTAs
    document.getElementById('hero-play-btn').addEventListener('click', () => {
      Sound.click();
      navigateTo('play');
    });
    document.getElementById('hero-howto-btn').addEventListener('click', () => {
      Sound.click();
      navigateTo('howto');
    });
    document.getElementById('howto-start-btn').addEventListener('click', () => {
      Sound.click();
      navigateTo('play');
    });

    // Play actions
    document.getElementById('btn-reset-level').addEventListener('click', resetCurrentLevel);
    document.getElementById('btn-open-report').addEventListener('click', () => {
      Sound.click();
      navigateTo('report');
    });

    // 3D Camera Controls
    document.getElementById('btn-cam-reset').addEventListener('click', () => {
      Sound.click();
      if (house3d) house3d.resetCamera();
    });
    const rotBtn = document.getElementById('btn-cam-rotate');
    rotBtn.addEventListener('click', () => {
      Sound.click();
      if (house3d) {
        const active = house3d.toggleAutoRotate();
        rotBtn.classList.toggle('active', active);
      }
    });
    document.getElementById('btn-cam-zin').addEventListener('click', () => {
      Sound.click();
      if (house3d) house3d.zoomBy(-2.2);
    });
    document.getElementById('btn-cam-zout').addEventListener('click', () => {
      Sound.click();
      if (house3d) house3d.zoomBy(2.2);
    });

    // Topbar controls
    document.getElementById('btn-alerts').addEventListener('click', openAlertsDrawer);
    document.getElementById('btn-close-drawer').addEventListener('click', closeAlertsDrawer);
    document.getElementById('drawer-backdrop').addEventListener('click', closeAlertsDrawer);

    document.getElementById('btn-sound').addEventListener('click', () => {
      state.settings.sound = !state.settings.sound;
      applySettings();
      if (state.settings.sound) Sound.click();
      saveState();
    });

    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      Sound.click();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Settings checkboxes
    document.getElementById('setting-sound').addEventListener('change', (e) => {
      state.settings.sound = e.target.checked;
      applySettings();
      saveState();
    });

    document.getElementById('setting-hints').addEventListener('change', (e) => {
      state.settings.hints = e.target.checked;
      saveState();
      if (state.activeView === 'play') renderRoomStage();
    });

    document.getElementById('setting-reduced-motion').addEventListener('change', (e) => {
      state.settings.reducedMotion = e.target.checked;
      applySettings();
      saveState();
    });

    document.getElementById('btn-reset-all').addEventListener('click', () => {
      if (confirm('Deseja realmente apagar todo o progresso, pontuações e conquistas salvas?')) {
        state = createDefaultState();
        saveState();
        applySettings();
        updateSidebarBadges();
        navigateTo('home');
        showToast('Progresso reiniciado', 'Todos os dados do simulador foram restaurados.');
      }
    });
  }

  function init() {
    renderHeroView();
    applySettings();
    updateSidebarBadges();
    bindGlobalEvents();
    navigateTo('home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
