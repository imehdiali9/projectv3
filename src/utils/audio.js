/**
 * Zero-dependency Web Audio synthesiser for Personal Frequency.
 * Completely opt-in: muted by default, initialized only after user enables sound.
 */

let ctx = null;
let isAudioEnabled = false;

export function initAudio() {
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      ctx = new AudioContextClass();
    }
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  isAudioEnabled = true;
  return isAudioEnabled;
}

export function disableAudio() {
  isAudioEnabled = false;
  if (ctx && ctx.state === 'running') {
    ctx.suspend();
  }
}

export function toggleAudio() {
  if (isAudioEnabled) {
    disableAudio();
    return false;
  } else {
    return initAudio();
  }
}

export function getAudioEnabled() {
  return isAudioEnabled;
}

/**
 * Play a delicate mechanical click for node navigation.
 */
export function playNodeClick() {
  if (!isAudioEnabled || !ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch {
    // Graceful fallback if Web Audio is restricted
  }
}

/**
 * Play a low mechanical confirmation when BUILD locks into place.
 */
export function playBuildLockConfirmation() {
  if (!isAudioEnabled || !ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Play a subtle harmonic shift during PRESENCE → BUILD transformation.
 */
export function playTransformationHarmonic(phase = 'B') {
  if (!isAudioEnabled || !ctx) return;
  try {
    const freq = phase === 'B' ? 246.94 : phase === 'C' ? 261.63 : 277.18;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(freq + 12, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.24);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Play a gentle resonant frequency ping when changing states.
 */
const STATE_FREQUENCIES = [220, 277.18, 329.63, 440, 554.37];

export function playStateTransition(stateIndex = 0) {
  if (!isAudioEnabled || !ctx) return;
  try {
    const freq = STATE_FREQUENCIES[stateIndex % STATE_FREQUENCIES.length] || 220;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.38);
  } catch {
    // Ignore audio errors
  }
}
