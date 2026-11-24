/* ============================================================================
   Cyber Defense: Proteja sua Smart Home — Web Audio Sound Synthesizer
   Zero external audio files required; works offline and via file://
   ============================================================================ */

(function () {
  window.CyberDefense = window.CyberDefense || {};

  let audioCtx = null;
  let enabled = true;

  function getContext() {
    if (!enabled) return null;
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playTone(freq, duration, type = 'sine', volume = 0.08, delay = 0) {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  window.CyberDefense.Sound = {
    setEnabled(val) {
      enabled = Boolean(val);
    },
    isEnabled() {
      return enabled;
    },
    click() {
      playTone(620, 0.06, 'triangle', 0.05);
    },
    scan() {
      playTone(440, 0.08, 'sine', 0.05, 0);
      playTone(660, 0.1, 'sine', 0.05, 0.06);
    },
    success() {
      playTone(523.25, 0.14, 'triangle', 0.08, 0);
      playTone(659.25, 0.14, 'triangle', 0.08, 0.09);
      playTone(783.99, 0.24, 'sine', 0.09, 0.18);
    },
    partial() {
      playTone(440, 0.14, 'triangle', 0.07, 0);
      playTone(493.88, 0.18, 'triangle', 0.06, 0.11);
    },
    error() {
      playTone(240, 0.16, 'sawtooth', 0.06, 0);
      playTone(185, 0.22, 'sawtooth', 0.06, 0.12);
    },
    alert() {
      playTone(740, 0.1, 'sine', 0.06, 0);
      playTone(587, 0.14, 'sine', 0.06, 0.1);
    },
    victory() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => playTone(n, 0.22, 'triangle', 0.08, i * 0.1));
    },
    badge() {
      playTone(880, 0.1, 'sine', 0.07, 0);
      playTone(1174.66, 0.22, 'sine', 0.08, 0.09);
    }
  };
})();
