import { useState } from 'react';
import { PROJECTS } from '../data/content';
import BuildWave from './BuildWave';
import { playNodeClick } from '../utils/audio';
import './StateBuild.css';

/**
 * StateBuild — the architectural BUILD environment.
 *
 * Emerges directly FROM the PRESENCE → BUILD physical transformation:
 * - No opaque wall hiding the orbital system.
 * - Spatial, edge-to-edge composition across the full viewport.
 * - Primary emerged specimen: THE LEDGER (001).
 * - Secondary instruments: ESTATE PRO (002), EXPERIMENTS (003).
 */
export default function StateBuild({
  progress = 0,
  isActive = false,
}) {
  const [activeSecondary, setActiveSecondary] = useState(null);

  // The primary emerged hero project
  const ledger = PROJECTS[0];
  // Secondary projects
  const secondaryProjects = PROJECTS.slice(1);

  // Calculate emergence opacity and displacement based on transition progress (0.45 → 1.0)
  const isEmerging = progress >= 0.45 || isActive;
  const emergenceProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.4));
  
  // Opacity: 0 at t=0.45 -> 1.0 at t=0.85+
  const displayOpacity = isActive ? 1 : emergenceProgress;
  const translateY = isActive ? 0 : (1 - emergenceProgress) * 40;

  const handleSecondaryToggle = (slug) => {
    playNodeClick();
    setActiveSecondary((prev) => (prev === slug ? null : slug));
  };

  if (!isEmerging && !isActive) {
    return null;
  }

  return (
    <div
      className={`build-spatial-stage ${isActive ? 'is-active' : ''}`}
      style={{
        opacity: displayOpacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      role="region"
      aria-label="02 BUILD — Selected Instruments"
    >
      {/* Top Architecture Status Bar */}
      <header className="build-status-bar mono" aria-label="System calibration">
        <div className="build-status-left">
          <span className="build-status-dot" />
          <span className="build-status-channel">02 / BUILD — SELECTED INSTRUMENTS</span>
        </div>
        <div className="build-status-right">
          <span className="build-telemetry">SIGNAL: LOCKED</span>
          <span className="build-telemetry">FREQ: 142.8 MHz</span>
          <span className="build-telemetry">SPECIMEN: 001/003</span>
        </div>
      </header>

      {/* Primary Emerged Specimen: THE LEDGER */}
      <section className="build-specimen" aria-label="Primary Instrument: The Ledger">
        <div className="specimen-main-grid">
          {/* Left Column: Architectural Title, Metadata, Narrative */}
          <div className="specimen-left">
            <div className="specimen-badge-row">
              <span className="specimen-badge mono">ARTIFACT {ledger.id}</span>
              <span className="specimen-type mono">{ledger.type}</span>
              <span className="specimen-year mono">{ledger.year}</span>
            </div>

            <h2 className="specimen-title" aria-label={ledger.name}>
              {['T', 'H', 'E', ' ', 'L', 'E', 'D', 'G', 'E', 'R'].map((char, i) => (
                <span
                  key={i}
                  className="specimen-char"
                  style={{
                    display: 'inline-block',
                    transitionDelay: `${i * 15}ms`,
                    transform: isActive ? 'none' : `translateY(${(1 - emergenceProgress) * (i % 2 ? 15 : -15)}px)`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h2>

            <p className="specimen-subtitle mono">{ledger.subtitle}</p>

            <div className="specimen-narrative">
              <div className="narrative-block">
                <span className="narrative-label mono">WHY IT EXISTS</span>
                <p className="narrative-text">{ledger.why}</p>
              </div>

              <div className="narrative-block">
                <span className="narrative-label mono">WHAT IT TAUGHT ME</span>
                <p className="narrative-text">{ledger.lesson}</p>
              </div>
            </div>

            {/* Stack badges */}
            <div className="specimen-stack-wrap">
              <span className="stack-label mono">ENGINEERING STACK</span>
              <div className="specimen-stack" role="list">
                {ledger.stack.map((tech) => (
                  <span key={tech} className="tech-chip mono" role="listitem">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Triggers */}
            <div className="specimen-actions">
              {ledger.live && (
                <a
                  href={ledger.live}
                  className="specimen-btn primary mono"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View live application"
                >
                  <span>LAUNCH SITE</span>
                  <span className="btn-arrow" aria-hidden="true">↗</span>
                </a>
              )}
              {ledger.github && (
                <a
                  href={ledger.github}
                  className="specimen-btn secondary mono"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View repository source"
                >
                  <span>SOURCE CODE</span>
                  <span className="btn-arrow" aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Live Oscilloscope Waveform & Interface Specimen */}
          <div className="specimen-right">
            <div className="specimen-instrument-panel">
              <div className="panel-header mono">
                <span>SIGNAL OSCILLOSCOPE / TRACE</span>
                <span className="panel-status">LIVE FEED</span>
              </div>
              <BuildWave />
            </div>

            <div className="specimen-detail-card">
              <div className="detail-card-header mono">
                <span>SYSTEM ARCHITECTURE</span>
                <span>SUPABASE / PG</span>
              </div>
              <p className="detail-card-body">{ledger.detail}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Instruments Explorer */}
      <section className="build-secondary" aria-label="Secondary Instruments">
        <div className="secondary-header mono">
          <span>ADDITIONAL INSTRUMENTS IN ORBIT</span>
          <span>SELECT TO INSPECT</span>
        </div>

        <div className="secondary-list" role="list">
          {secondaryProjects.map((proj) => {
            const isExpanded = activeSecondary === proj.slug;
            return (
              <div key={proj.slug} className="secondary-row-item" role="listitem">
                <button
                  className={`secondary-trigger ${isExpanded ? 'is-open' : ''}`}
                  onClick={() => handleSecondaryToggle(proj.slug)}
                  aria-expanded={isExpanded}
                >
                  <div className="secondary-meta mono">
                    <span className="sec-id">{proj.id}</span>
                    <span className="sec-type">{proj.type}</span>
                  </div>
                  <span className="sec-name">{proj.name}</span>
                  <span className="sec-subtitle mono">{proj.subtitle}</span>
                  <span className="sec-arrow" aria-hidden="true">
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="secondary-drawer">
                    <div className="drawer-grid">
                      <div className="drawer-text">
                        <span className="drawer-sublabel mono">RATIONALE</span>
                        <p>{proj.why}</p>
                        <span className="drawer-sublabel mono">LESSON</span>
                        <p>{proj.lesson}</p>
                      </div>
                      <div className="drawer-stack">
                        <span className="drawer-sublabel mono">STACK</span>
                        <div className="drawer-chips">
                          {proj.stack.map((t) => (
                            <span key={t} className="tech-chip mono">{t}</span>
                          ))}
                        </div>
                        {proj.github && (
                          <a
                            href={proj.github}
                            className="specimen-btn secondary mono drawer-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>GITHUB REPO</span>
                            <span className="btn-arrow">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
