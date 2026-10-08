import { TIMELINE } from '../data/content';
import './StateEvolve.css';

export default function StateEvolve() {
  return (
    <div className="evolve">
      <h2 className="evolve-title">
        THE WORK<br />
        <span className="evolve-title-accent">KEEPS MOVING.</span>
      </h2>

      {/* Measuring instrument */}
      <div className="evolve-instrument" role="img" aria-label="Timeline measuring instrument">
        {/* Horizontal rule / baseline */}
        <div className="evolve-baseline" aria-hidden="true" />

        {/* Tick marks */}
        {TIMELINE.map((point, i) => (
          <div
            key={i}
            className={`evolve-tick ${point.isNow ? 'is-now' : ''}`}
            style={{
              left: `${point.position}%`,
              height: `${point.height}px`,
            }}
            aria-hidden="true"
          >
            {/* Label position: alternate above/below */}
            <div
              className={`evolve-tick-label mono ${i % 2 === 0 ? 'label-top' : 'label-bottom'}`}
            >
              <span className="evolve-tick-year">{point.year}</span>
              <span className="evolve-tick-event">{point.label}</span>
            </div>

            {point.isNow && (
              <div className="evolve-now-dot" aria-label="Current position" />
            )}
          </div>
        ))}

        {/* "YOU ARE HERE" indicator */}
        <div
          className="evolve-here mono"
          style={{ left: `${TIMELINE.find(t => t.isNow)?.position ?? 88}%` }}
          aria-hidden="true"
        >
          YOU ARE HERE
        </div>
      </div>

      {/* Milestone notes */}
      <div className="evolve-notes mono">
        {TIMELINE.map((point, i) => (
          <div key={i} className={`evolve-note ${point.isNow ? 'is-active' : ''}`}>
            <span className="evolve-note-marker">{point.isNow ? '→' : '·'}</span>
            <span className="evolve-note-text">{point.year} / {point.label} — {point.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
