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
 * Play a gentle resonant frequency ping when changing states.
 * Frequencies correspond to an A major pentatonic chord progression:
 * 0: 220Hz (PRESENCE)
 * 1: 277.18Hz (BUILD)
 * 2: 329.63Hz (BROADCAST)
 * 3: 440Hz (EVOLVE)
 * 4: 554.37Hz (REACH)
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
