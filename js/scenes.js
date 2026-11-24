/* ============================================================================
   Cyber Defense: Proteja sua Smart Home — Refined Architectural SVG Scenes
   Minimalist Dark Glass Blueprint Floor Plan & Hero Smart Home Preview
   ============================================================================ */

(function () {
  window.CyberDefense = window.CyberDefense || {};

  /**
   * Sleek, clean minimalist Smart Home architectural preview for the Hero Card
   */
  function getHeroScene() {
    return `
    <svg class="scene-svg hero-preview-svg" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hp-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#94a3b8" fill-opacity="0.16"/>
        </pattern>
        <radialGradient id="hp-ambient" cx="52%" cy="46%" r="54%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.18"/>
          <stop offset="55%" stop-color="#10b981" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#070b14" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="hp-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.14"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.02"/>
        </linearGradient>
        <linearGradient id="hp-room-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>

      <!-- Clean Obsidian Blueprint Background -->
      <rect width="800" height="460" fill="#080d18"/>
      <rect width="800" height="460" fill="url(#hp-dots)"/>
      <rect width="800" height="460" fill="url(#hp-ambient)"/>

      <!-- Protective Energy Dome Arc (Minimal & Refined) -->
      <path d="M115 375 A 295 275 0 0 1 685 375" fill="url(#hp-dome)" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1.6"/>
      <path d="M148 375 A 262 242 0 0 1 652 375" fill="none" stroke="#34d399" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="4 6"/>

      <!-- Minimalist Architectural Smart Home Cutaway / Isometric Card -->
      <g transform="translate(150, 128)">
        <!-- Base shadow -->
        <rect x="18" y="228" width="464" height="18" rx="9" fill="#020617" opacity="0.7"/>

        <!-- Outer Blueprint Frame -->
        <rect x="28" y="28" width="444" height="206" rx="10" fill="url(#hp-room-glow)" stroke="#334155" stroke-width="2"/>

        <!-- Interior architectural divisions -->
        <line x1="250" y1="28" x2="250" y2="234" stroke="#334155" stroke-width="1.8"/>
        <line x1="250" y1="134" x2="472" y2="134" stroke="#334155" stroke-width="1.5"/>
        <line x1="28" y1="158" x2="250" y2="158" stroke="#334155" stroke-width="1.5"/>

        <!-- Subtle Room Fills -->
        <rect x="30" y="30" width="219" height="127" fill="#38bdf8" opacity="0.04"/>
        <rect x="251" y="30" width="219" height="103" fill="#34d399" opacity="0.035"/>

        <!-- Room micro-labels -->
        <g fill="#64748b" font-family="monospace" font-size="9" letter-spacing="1.2">
          <text x="44" y="48">SALA DE ESTAR</text>
          <text x="44" y="176">ENTRADA &amp; PERÍMETRO</text>
          <text x="266" y="48">ESCRITÓRIO IOT</text>
          <text x="266" y="152">COZINHA CONECTADA</text>
        </g>

        <!-- Clean Minimalist Furniture Lines -->
        <rect x="108" y="88" width="84" height="30" rx="6" fill="none" stroke="#475569" stroke-width="1.2"/>
        <rect x="128" y="66" width="44" height="14" rx="3" fill="none" stroke="#475569" stroke-width="1.1"/>
        <rect x="336" y="54" width="96" height="28" rx="4" fill="none" stroke="#475569" stroke-width="1.2"/>
        <rect x="310" y="176" width="118" height="32" rx="5" fill="none" stroke="#475569" stroke-width="1.2"/>

        <!-- Live Network Topology Mesh inside Preview -->
        <g stroke="#38bdf8" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="3 4">
          <line x1="80" y1="88" x2="188" y2="86"/>
          <line x1="80" y1="88" x2="86" y2="202"/>
          <line x1="80" y1="88" x2="190" y2="202"/>
          <line x1="80" y1="88" x2="310" y2="96"/>
          <line x1="80" y1="88" x2="412" y2="74"/>
          <line x1="80" y1="88" x2="418" y2="196"/>
        </g>

        <!-- Glowing Smart Device Nodes -->
        <!-- Router (Hub) -->
        <circle cx="80" cy="88" r="18" fill="#38bdf8" opacity="0.1"/>
        <circle cx="80" cy="88" r="7" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="80" cy="88" r="2.5" fill="#38bdf8"/>

        <!-- Safe nodes (Emerald) -->
        <circle cx="188" cy="86" r="6" fill="#064e3b" stroke="#34d399" stroke-width="1.8"/>
        <circle cx="190" cy="202" r="6" fill="#064e3b" stroke="#34d399" stroke-width="1.8"/>
        <circle cx="412" cy="74" r="6" fill="#064e3b" stroke="#34d399" stroke-width="1.8"/>

        <!-- Alert / Vulnerability nodes (Amber & Rose) -->
        <circle cx="86" cy="202" r="13" fill="#f43f5e" opacity="0.16"/>
        <circle cx="86" cy="202" r="6" fill="#4c0519" stroke="#fb7185" stroke-width="1.8"/>

        <circle cx="310" cy="96" r="13" fill="#f59e0b" opacity="0.16"/>
        <circle cx="310" cy="96" r="6" fill="#451a03" stroke="#fbbf24" stroke-width="1.8"/>

        <circle cx="418" cy="196" r="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/>
      </g>

      <!-- Floating Top Shield Pill inside Preview -->
      <g transform="translate(400, 74)">
        <rect x="-86" y="-17" width="172" height="34" rx="17" fill="#0f172a" fill-opacity="0.92" stroke="#34d399" stroke-opacity="0.45" stroke-width="1.2"/>
        <circle cx="-64" cy="0" r="4" fill="#34d399"/>
        <text x="6" y="4" text-anchor="middle" fill="#e2e8f0" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="600">Escudo Smart Home</text>
      </g>
    </svg>`;
  }

  /**
   * Ultra-clean Modern Architectural SVG Floor Plan
   */
  function getFloorPlanScene({
    activeRoomId = 'all',
    unlockedRooms = ['fachada', 'sala'],
    devices = [],
    selectedDeviceId = null
  }) {
    const isUnlocked = (rId) => unlockedRooms.includes(rId);
    const zoneOpacity = (rId) => {
      if (!isUnlocked(rId)) return 0.36;
      if (activeRoomId === 'all' || activeRoomId === rId) return 1;
      return 0.28;
    };
    const isHighlight = (rId) => activeRoomId === rId && isUnlocked(rId);

    // Subtle network topology lines from Router (150, 157) to active devices
    const routerX = 150;
    const routerY = 157;
    const statusStroke = {
      pending: '#38bdf8',
      safe: '#34d399',
      partial: '#fbbf24',
      danger: '#fb7185'
    };

    const topologyLines = devices
      .filter((d) => d.icon !== 'router')
      .map((d) => {
        const dx = Math.round((d.x / 100) * 1000);
        const dy = Math.round((d.y / 100) * 562);
        const isSel = selectedDeviceId === d.id;
        const stroke = statusStroke[d.status] || '#38bdf8';
        const baseOp = activeRoomId === 'all' || activeRoomId === d.roomId ? 0.24 : 0.06;
        const op = isSel ? 0.8 : baseOp;
        const width = isSel ? 2.2 : 1.2;
        const dash = d.status === 'safe' ? 'none' : '4 5';
        return `<line x1="${routerX}" y1="${routerY}" x2="${dx}" y2="${dy}" stroke="${stroke}" stroke-width="${width}" stroke-dasharray="${dash}" opacity="${op}"/>`;
      })
      .join('');

    return `
    <svg class="scene-svg floorplan-svg" viewBox="0 0 1000 562" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Refined Subtle Dot Grid -->
        <pattern id="fp-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#94a3b8" fill-opacity="0.14"/>
        </pattern>
        <!-- Locked room clean hatch -->
        <pattern id="fp-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#64748b" stroke-width="1.2" stroke-opacity="0.22"/>
        </pattern>
        <radialGradient id="fp-wifi" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.14"/>
          <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.03"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Obsidian Canvas -->
      <rect width="1000" height="562" fill="#090e1a"/>
      <rect width="1000" height="562" fill="url(#fp-dots)"/>

      <!-- Subtle Architectural Dimension Header -->
      <g fill="#475569" font-family="monospace" font-size="9.5">
        <line x1="56" y1="26" x2="944" y2="26" stroke="#1e293b" stroke-width="1"/>
        <line x1="56" y1="21" x2="56" y2="31" stroke="#334155" stroke-width="1"/>
        <line x1="944" y1="21" x2="944" y2="31" stroke="#334155" stroke-width="1"/>
        <text x="500" y="21" text-anchor="middle" letter-spacing="1.8">PLANTA BAIXA ARQUITETÔNICA • SMART HOME • 14,5m × 9,2m</text>
      </g>

      <!-- ==================== ZONE 1: ENTRADA & FACHADA ==================== -->
      <g opacity="${zoneOpacity('fachada')}">
        <rect x="56" y="362" width="456" height="164" rx="8" fill="#0d1524" stroke="${isHighlight('fachada') ? '#38bdf8' : '#1e293b'}" stroke-width="${isHighlight('fachada') ? 2 : 1.2}" stroke-dasharray="5 4"/>
        <!-- Porch Deck -->
        <rect x="200" y="362" width="302" height="66" fill="#131e33" opacity="0.85" stroke="#1e293b" stroke-width="1"/>
        <!-- Minimal Stepping Stones -->
        <g fill="#162238" stroke="#24344f" stroke-width="1">
          <rect x="275" y="440" width="68" height="16" rx="4"/>
          <rect x="275" y="466" width="68" height="16" rx="4"/>
          <rect x="275" y="492" width="68" height="16" rx="4"/>
        </g>
        <!-- Subtle Landscape Circles -->
        <g fill="#0d292a" stroke="#1b4d4a" stroke-width="1" opacity="0.75">
          <circle cx="94" cy="462" r="16"/><circle cx="118" cy="474" r="11"/>
          <circle cx="478" cy="480" r="17"/><circle cx="452" cy="494" r="11"/>
        </g>
        <!-- Camera FOV Cone -->
        <polygon points="140,416 84,504 222,504" fill="#38bdf8" opacity="0.06"/>
        <text x="74" y="512" fill="#64748b" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="700" letter-spacing="1.2">ENTRADA &amp; FACHADA</text>
      </g>

      <!-- ==================== ZONE 2: SALA DE ESTAR ==================== -->
      <g opacity="${zoneOpacity('sala')}">
        <rect x="56" y="46" width="456" height="316" fill="#0f1728" stroke="${isHighlight('sala') ? '#38bdf8' : 'none'}" stroke-width="2"/>

        <!-- Wi-Fi Coverage Glow at Router (150, 157) -->
        <circle cx="150" cy="157" r="108" fill="url(#fp-wifi)"/>
        <circle cx="150" cy="157" r="54" fill="none" stroke="#38bdf8" stroke-opacity="0.16" stroke-dasharray="3 4"/>

        <!-- Minimalist Furniture Silhouettes -->
        <rect x="218" y="168" width="206" height="148" rx="8" fill="#131e33" opacity="0.65" stroke="#1e2d47" stroke-width="1"/>
        <!-- Console on left -->
        <rect x="78" y="130" width="96" height="44" rx="5" fill="#152238" stroke="#263959" stroke-width="1.2"/>
        <!-- L-Sofa -->
        <g fill="#17253d" stroke="#2b4063" stroke-width="1.2">
          <rect x="226" y="274" width="166" height="42" rx="7"/>
          <rect x="226" y="210" width="40" height="106" rx="7"/>
        </g>
        <!-- Coffee Table (center) -->
        <rect x="272" y="232" width="76" height="34" rx="5" fill="#1a2942" stroke="#30486e" stroke-width="1.2"/>
        <!-- TV Unit along dividing wall -->
        <rect x="478" y="128" width="26" height="122" rx="3" fill="#152238" stroke="#263959" stroke-width="1.2"/>
        <rect x="500" y="144" width="5" height="90" rx="2" fill="#38bdf8" opacity="0.5"/>
        <!-- Ceiling light subtle marker -->
        <circle cx="340" cy="112" r="20" fill="#fbbf24" opacity="0.08" stroke="#fbbf24" stroke-opacity="0.28" stroke-dasharray="3 3"/>

        <text x="74" y="72" fill="#94a3b8" font-family="Space Grotesk, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1.2">SALA DE ESTAR</text>
      </g>

      <!-- ==================== ZONE 3: ESCRITÓRIO & COZINHA ==================== -->
      <g opacity="${zoneOpacity('escritorio')}">
        <rect x="512" y="46" width="432" height="234" fill="#0d1525" stroke="${isHighlight('escritorio') ? '#38bdf8' : 'none'}" stroke-width="2"/>
        <rect x="512" y="280" width="432" height="216" fill="#0d1525" stroke="${isHighlight('escritorio') ? '#38bdf8' : 'none'}" stroke-width="2"/>

        <!-- Office Desk (Top Right) -->
        <rect x="744" y="88" width="152" height="58" rx="5" fill="#152238" stroke="#263959" stroke-width="1.2"/>
        <rect x="790" y="100" width="60" height="8" rx="2" fill="#38bdf8" opacity="0.35"/>
        <circle cx="820" cy="168" r="18" fill="#131e33" stroke="#263959" stroke-width="1.2"/>

        <!-- Tech Rack / NAS Cabinet -->
        <rect x="594" y="218" width="92" height="44" rx="5" fill="#131f34" stroke="#2d456b" stroke-width="1.2"/>

        <!-- Kitchen Counter & Island -->
        <path d="M548 452 L930 452 L930 318 L880 318 L880 412 L548 412 Z" fill="#142036" stroke="#253857" stroke-width="1.2"/>
        <rect x="598" y="334" width="144" height="44" rx="5" fill="#17253d" stroke="#2b4063" stroke-width="1.2"/>
        <rect x="636" y="422" width="42" height="20" rx="3" fill="#0a111f" stroke="#334155" stroke-width="1"/>
        <!-- Fridge Footprint -->
        <rect x="814" y="358" width="54" height="68" rx="5" fill="#1b2b47" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1.4"/>

        <text x="532" y="72" fill="#94a3b8" font-family="Space Grotesk, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1.2">ESCRITÓRIO</text>
        <text x="532" y="306" fill="#94a3b8" font-family="Space Grotesk, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1.2">COZINHA CONECTADA</text>

        ${
          !isUnlocked('escritorio')
            ? `
          <rect x="512" y="46" width="432" height="450" fill="url(#fp-hatch)"/>
          <g transform="translate(728, 270)">
            <rect x="-118" y="-25" width="236" height="50" rx="10" fill="#0a101d" fill-opacity="0.94" stroke="#334155" stroke-width="1.2"/>
            <text x="0" y="-3" text-anchor="middle" fill="#cbd5e1" font-family="Space Grotesk, sans-serif" font-size="12.5" font-weight="700">ÁREA EXPANDIDA</text>
            <text x="0" y="14" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="9.5">LIBERADA NOS NÍVEIS 2 E 3</text>
          </g>
        `
            : ''
        }
      </g>

      <!-- ==================== CLEAN ARCHITECTURAL WALLS ==================== -->
      <g fill="none" stroke="#64748b" stroke-linecap="square">
        <!-- Exterior Walls -->
        <path d="M56 362 L56 46 L944 46 L944 496 L512 496 L512 362" stroke-width="4.5"/>
        <!-- Front Facade Wall with Door Openings -->
        <line x1="56" y1="362" x2="274" y2="362" stroke-width="4.5"/>
        <line x1="344" y1="362" x2="420" y2="362" stroke-width="4.5"/>
        <line x1="494" y1="362" x2="512" y2="362" stroke-width="4.5"/>
        <!-- Interior Walls -->
        <line x1="512" y1="46" x2="512" y2="112" stroke-width="3.2" stroke="#475569"/>
        <line x1="512" y1="178" x2="512" y2="362" stroke-width="3.2" stroke="#475569"/>
        <line x1="512" y1="280" x2="650" y2="280" stroke-width="2.8" stroke="#475569"/>
        <line x1="752" y1="280" x2="944" y2="280" stroke-width="2.8" stroke="#475569"/>
      </g>

      <!-- Architectural Glass Windows -->
      <g stroke="#38bdf8" stroke-width="1.8" opacity="0.7">
        <line x1="156" y1="46" x2="364" y2="46" stroke="#090e1a" stroke-width="6"/>
        <line x1="156" y1="44.5" x2="364" y2="44.5"/><line x1="156" y1="47.5" x2="364" y2="47.5"/>

        <line x1="684" y1="46" x2="876" y2="46" stroke="#090e1a" stroke-width="6"/>
        <line x1="684" y1="44.5" x2="876" y2="44.5"/><line x1="684" y1="47.5" x2="876" y2="47.5"/>
      </g>

      <!-- Clean Door Swing Arcs -->
      <g fill="none" stroke="#34d399" stroke-width="1.4" opacity="0.65">
        <line x1="274" y1="362" x2="274" y2="302" stroke="#94a3b8" stroke-width="2"/>
        <path d="M274 302 A 60 60 0 0 1 334 362" stroke-dasharray="3 3"/>

        <!-- Patio Sliding Door -->
        <line x1="420" y1="360" x2="462" y2="360" stroke="#38bdf8" stroke-width="2.2"/>
        <line x1="454" y1="364" x2="494" y2="364" stroke="#38bdf8" stroke-width="2.2"/>

        <!-- Interior Passage Arc -->
        <line x1="512" y1="112" x2="568" y2="112" stroke="#64748b" stroke-width="1.6"/>
        <path d="M568 112 A 56 56 0 0 1 512 168" stroke="#64748b" stroke-dasharray="3 3" opacity="0.65"/>
      </g>

      <!-- Live Network Topology Overlay -->
      <g class="topology-layer">
        ${topologyLines}
      </g>
    </svg>`;
  }

  window.CyberDefense.Scenes = {
    getHeroScene,
    getFloorPlanScene
  };
})();
