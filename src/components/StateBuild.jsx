import { useState } from 'react';
import { PROJECTS } from '../data/content';
import BuildWave from './BuildWave';
import { playNodeClick } from '../utils/audio';
import './StateBuild.css';

/**
 * StateBuild — the architectural BUILD environment.
 *
 * MILESTONE 01A: STRUCTURAL STABILIZATION
 * - Centered via dedicated .build-stage-wrapper element (immune to transform overwrite)
 * - Single source of vertical scroll: ZERO nested overflow/scroll containers
 * - Full viewport composition fitting 1366x768, 1440x900, 1920x1080 and mobile
 * - Hierarchical progression: THE LEDGER is the primary dominant specimen;
 *   secondary specimens (002 ESTATE PRO & 003 EXPERIMENTS) are subordinate and
 *   progressively established via scroll (localProgress) or direct tab selection.
 * - 100% reversible and deterministic with document scroll.
 */
export default function StateBuild({
  progress = 0,
  localProgress = 0,
  isActive = false,
  rawState = 0,
}) {
  // Derive default view purely from scroll position:
  // localProgress < 0.48: Primary Specimen (THE LEDGER) dominates
  // localProgress >= 0.48: Secondary Instruments (ESTATE PRO & EXPERIMENTS) prominent
  const scrollDefaultView = localProgress >= 0.48 ? 'secondary' : 'ledger';
  const currentZone = localProgress >= 0.48 ? 1 : 0;

  // Track intentional manual tab click within the active scroll zone
  const [userSelection, setUserSelection] = useState({ view: null, zone: null });

  // When scrolling crosses zone boundary, scroll automatically drives the view
  const activeView =
    userSelection.zone === currentZone && userSelection.view
      ? userSelection.view
      : scrollDefaultView;

  const ledger = PROJECTS[0];
  const estatePro = PROJECTS[1];
  const experiments = PROJECTS[2];

  // Visibility range: emerges in Phase C/D (progress >= 0.40) and remains active during State 1
  const isEmerging = (progress >= 0.40 && rawState < 2.05) || isActive;
  if (!isEmerging && !isActive) {
    return null;
  }

  // Emergence calculation (0.40 -> 0.85)
  const emergenceProgress = Math.min(1, Math.max(0, (progress - 0.40) / 0.45));
  const displayOpacity = isActive ? 1 : emergenceProgress;
  const translateY = isActive ? 0 : (1 - emergenceProgress) * 32;

  const handleSelectView = (viewKey) => {
    playNodeClick();
    setUserSelection({ view: viewKey, zone: currentZone });
  };

  return (
    <div
      className="build-stage-wrapper"
      aria-hidden={!isActive && displayOpacity < 0.1}
    >
      <div
        className={`build-spatial-stage ${isActive ? 'is-active' : ''}`}
        style={{
          '--build-offset-y': `${translateY}px`,
          '--build-opacity': displayOpacity,
          pointerEvents: isActive ? 'auto' : 'none',
        }}
        role="region"
        aria-label="02 BUILD — Selected Instruments"
      >
        {/* Top Architecture Status Bar */}
        <header className="build-status-bar mono" aria-label="System calibration">
          <div className="build-status-left">
            <span className="build-status-dot" aria-hidden="true" />
            <span className="build-status-channel">02 / BUILD — SELECTED INSTRUMENTS</span>
          </div>

          {/* Hierarchical Specimen Selector Pills */}
          <nav className="build-specimen-nav" aria-label="Specimen views">
            <button
              className={`specimen-nav-btn ${activeView === 'ledger' ? 'is-active' : ''}`}
              onClick={() => handleSelectView('ledger')}
              aria-pressed={activeView === 'ledger'}
            >
              <span className="specimen-nav-id">001</span>
              <span>THE LEDGER</span>
            </button>
            <button
              className={`specimen-nav-btn ${activeView === 'secondary' ? 'is-active' : ''}`}
              onClick={() => handleSelectView('secondary')}
              aria-pressed={activeView === 'secondary'}
            >
              <span className="specimen-nav-id">002–003</span>
              <span>ORBITAL SPECIMENS</span>
            </button>
          </nav>

          <div className="build-status-right">
            <span className="build-telemetry">SIGNAL: LOCKED</span>
            <span className="build-telemetry">FREQ: 142.8 MHz</span>
            <span className="build-telemetry">
              {activeView === 'ledger' ? 'SPECIMEN: 001/003' : 'SPECIMEN: 002-003/003'}
            </span>
          </div>
        </header>

        {/* ─── PRIMARY SPECIMEN VIEW: THE LEDGER (001) ─── */}
        {activeView === 'ledger' && (
          <section className="build-specimen-panel" aria-label="Primary Instrument: The Ledger">
            <div className="specimen-main-grid">
              {/* Left Column: Title, Metadata, Narrative, Stack, Actions */}
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
                        transform: isActive
                          ? 'none'
                          : `translateY(${(1 - emergenceProgress) * (i % 2 ? 12 : -12)}px)`,
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

              {/* Right Column: Oscilloscope Waveform & Interface Specimen */}
              <div className="specimen-right">
                <div className="specimen-instrument-panel">
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
        )}

        {/* ─── SECONDARY SPECIMENS VIEW: ESTATE PRO & EXPERIMENTS ─── */}
        {activeView === 'secondary' && (
          <section className="build-secondary-panel" aria-label="Secondary Instruments">
            <div className="secondary-specimens-grid">
              {/* Card 002: ESTATE PRO */}
              <article className="secondary-instrument-card" aria-label="Artifact 002: Estate Pro">
                <div className="sec-card-header">
                  <div className="specimen-badge-row">
                    <span className="specimen-badge mono">ARTIFACT {estatePro.id}</span>
                    <span className="specimen-type mono">{estatePro.type}</span>
                    <span className="specimen-year mono">{estatePro.year}</span>
                  </div>
                  <h3 className="sec-card-title">{estatePro.name}</h3>
                  <p className="specimen-subtitle mono">{estatePro.subtitle}</p>
                </div>

                <div className="sec-card-narrative">
                  <div className="narrative-block">
                    <span className="narrative-label mono">RATIONALE</span>
                    <p className="narrative-text">{estatePro.why}</p>
                  </div>
                  <div className="narrative-block">
                    <span className="narrative-label mono">LESSON</span>
                    <p className="narrative-text">{estatePro.lesson}</p>
                  </div>
                </div>

                <div className="sec-card-footer">
                  <div className="specimen-stack" role="list">
                    {estatePro.stack.map((t) => (
                      <span key={t} className="tech-chip mono" role="listitem">{t}</span>
                    ))}
                  </div>
                  {estatePro.github && (
                    <a
                      href={estatePro.github}
                      className="specimen-btn secondary mono sec-action-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View Estate Pro repository"
                    >
                      <span>SOURCE CODE</span>
                      <span className="btn-arrow" aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>

              {/* Card 003: EXPERIMENTS */}
              <article className="secondary-instrument-card" aria-label="Artifact 003: Experiments">
                <div className="sec-card-header">
                  <div className="specimen-badge-row">
                    <span className="specimen-badge mono">ARTIFACT {experiments.id}</span>
                    <span className="specimen-type mono">{experiments.type}</span>
                    <span className="specimen-year mono">{experiments.year}</span>
                  </div>
                  <h3 className="sec-card-title">{experiments.name}</h3>
                  <p className="specimen-subtitle mono">{experiments.subtitle}</p>
                </div>

                <div className="sec-card-narrative">
                  <div className="narrative-block">
                    <span className="narrative-label mono">RATIONALE</span>
                    <p className="narrative-text">{experiments.why}</p>
                  </div>
                  <div className="narrative-block">
                    <span className="narrative-label mono">LESSON</span>
                    <p className="narrative-text">{experiments.lesson}</p>
                  </div>
                </div>

                <div className="sec-card-footer">
                  <div className="specimen-stack" role="list">
                    {experiments.stack.map((t) => (
                      <span key={t} className="tech-chip mono" role="listitem">{t}</span>
                    ))}
                  </div>
                  {experiments.github && (
                    <a
                      href={experiments.github}
                      className="specimen-btn secondary mono sec-action-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View Experiments repository"
                    >
                      <span>SOURCE CODE</span>
                      <span className="btn-arrow" aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Bottom Subordinate Bar / Scroll Prompt */}
        <footer className="build-bottom-bar mono">
          <div className="build-bottom-hint">
            {activeView === 'ledger' ? (
              <span>SPECIMEN 001/003 (PRIMARY) · SCROLL FOR ORBITAL INSTRUMENTS ↓</span>
            ) : (
              <span>SPECIMENS 002–003/003 (ORBITAL) · SCROLL UP FOR THE LEDGER ↑</span>
            )}
          </div>
          <div className="build-bottom-toggle">
            <button
              className={`bottom-toggle-btn ${activeView === 'ledger' ? 'is-active' : ''}`}
              onClick={() => handleSelectView('ledger')}
            >
              001 THE LEDGER
            </button>
            <button
              className={`bottom-toggle-btn ${activeView === 'secondary' ? 'is-active' : ''}`}
              onClick={() => handleSelectView('secondary')}
            >
              002–003 SECONDARY
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
