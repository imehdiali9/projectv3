import { IDENTITY } from '../data/content';
import './StateReach.css';

export default function StateReach() {
  return (
    <div className="reach">
      {/* Conceptual headline */}
      <div className="reach-headline">
        <h2 className="reach-title">
          START A<br />
          <span className="reach-title-accent">THREAD.</span>
        </h2>
        <div className="reach-sub mono">
          05 / REACH — open frequency
        </div>
      </div>

      {/* Contact links */}
      <div className="reach-contacts">
        <div className="reach-label mono">COLLABORATIONS / PROJECTS / OPPORTUNITIES</div>

        <a
          href={`mailto:${IDENTITY.email}`}
          className="reach-primary-link"
          aria-label="Send email"
        >
          <span className="reach-email">{IDENTITY.email}</span>
          <span className="reach-email-arrow">↗</span>
        </a>

        <div className="reach-links" role="list">
          {[
            { label: 'GITHUB', href: IDENTITY.github },
            { label: 'LINKEDIN', href: IDENTITY.linkedin },
            { label: 'YOUTUBE', href: IDENTITY.youtube },
            { label: 'INSTAGRAM', href: IDENTITY.instagram },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="reach-link"
              role="listitem"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${label}`}
            >
              <span>{label}</span>
              <span className="reach-link-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Terminal note */}
      <div className="reach-terminal mono">
        <div className="reach-terminal-bar">
          <span>END OF SIGNAL PATH</span>
          <span>FREQ / MEHDI ALI / 2026</span>
        </div>
        <div className="reach-terminal-body">
          <span className="reach-cursor">_</span>
        </div>
      </div>
    </div>
  );
}
