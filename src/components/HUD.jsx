import { useState, useCallback } from 'react';
import { toggleAudio } from '../utils/audio';
import './HUD.css';

/**
 * HUD — persistent floating heads-up display.
 * Shows current state label, interactive channel pills, audio instrument toggle, and scroll progress.
 */
export default function HUD({
  stateIndex = 0,
  globalProgress = 0,
  states = [],
  onStateSelect,
}) {
  const [audioActive, setAudioActive] = useState(false);
  const current = states[stateIndex] || states[0];

  const handleAudioToggle = useCallback(() => {
    const isNowActive = toggleAudio();
    setAudioActive(isNowActive);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="hud-progress"
        style={{ width: `${globalProgress * 100}%` }}
        role="progressbar"
        aria-valuenow={Math.round(globalProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Frequency tuning progress"
      />

      {/* Top HUD bar */}
      <header className="hud mono" role="banner">
        <div className="hud-left">
          <span className="hud-identity">MEHDI / PERSONAL FREQUENCY</span>
          <span className="hud-freq-readout" aria-hidden="true">
            {`CH-0${stateIndex + 1} / ${(102.4 + stateIndex * 8.6 + globalProgress * 2.2).toFixed(1)} MHz`}
          </span>
        </div>

        {/* State channel indicators */}
        <nav className="hud-channels" aria-label="Frequency channels">
          {states.map((st, i) => (
            <button
              key={st.id}
              className={`hud-channel-btn ${i === stateIndex ? 'active' : ''}`}
              onClick={() => onStateSelect?.(i)}
              aria-label={`Jump to State ${st.id}: ${st.label}`}
              title={`Press ${i + 1} to jump`}
            >
              <span className="hud-ch-num">{st.id}</span>
              <span className="hud-ch-label">{st.label}</span>
            </button>
          ))}
        </nav>

        <div className="hud-right">
          <button
            className={`hud-audio-toggle ${audioActive ? 'is-on' : ''}`}
            onClick={handleAudioToggle}
            aria-label={audioActive ? 'Mute frequency audio' : 'Enable frequency audio'}
            title="Toggle synthesizer tones"
          >
            <span className="hud-audio-dot" />
            <span>{audioActive ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>
          <span className="hud-state" aria-live="polite">
            {current?.id} — {current?.label}
          </span>
        </div>
      </header>
    </>
  );
}
