import './HUD.css';

/**
 * HUD — persistent floating heads-up display.
 * Shows current state label and scroll progress bar.
 */
export default function HUD({ stateIndex = 0, globalProgress = 0, states = [] }) {
  const current = states[stateIndex] || states[0];

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
        aria-label="Page progress"
      />

      {/* Top bar */}
      <header className="hud mono" role="banner">
        <span className="hud-identity">MEHDI / PERSONAL FREQUENCY</span>
        <span className="hud-state" aria-live="polite">
          {current?.id} — {current?.label}
        </span>
      </header>
    </>
  );
}
