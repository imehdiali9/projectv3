import { useState, useRef } from 'react';
import { PROJECTS } from '../data/content';
import BuildWave from './BuildWave';
import './StateBuild.css';

export default function StateBuild() {
  const [activeProject, setActiveProject] = useState(null);

  const handleRowClick = (slug) => {
    setActiveProject(prev => prev === slug ? null : slug);
  };

  return (
    <div className="build">
      {/* Instrument list */}
      <div className="build-instrument" role="list">
        {PROJECTS.map((project) => {
          const isExpanded = activeProject === project.slug;
          return (
            <div key={project.slug} className="build-artifact" role="listitem">
              {/* Artifact header row */}
              <button
                className={`build-row ${isExpanded ? 'is-expanded' : ''}`}
                onClick={() => handleRowClick(project.slug)}
                aria-expanded={isExpanded}
                aria-controls={`artifact-${project.slug}`}
              >
                <span className="build-row-id mono">{project.id}</span>
                <span className="build-row-name">{project.name}</span>
                <span className="build-row-meta">
                  <span className="build-row-type mono">{project.type}</span>
                  <span className="build-row-year mono">{project.year}</span>
                  <span className={`build-row-arrow ${isExpanded ? 'open' : ''}`} aria-hidden="true">+</span>
                </span>
              </button>

              {/* Expanded artifact detail */}
              <div
                id={`artifact-${project.slug}`}
                className={`build-artifact-detail ${isExpanded ? 'open' : ''}`}
                aria-hidden={!isExpanded}
              >
                <div className="artifact-inner">
                  {/* Artifact header strip */}
                  <div className="artifact-strip" style={{ '--project-color': project.color }}>
                    <div className="artifact-strip-num mono">{project.id}</div>
                    <div className="artifact-strip-title">{project.name}</div>
                    <div className="artifact-strip-subtitle mono">{project.subtitle}</div>
                  </div>

                  {/* Main content grid */}
                  <div className="artifact-grid">
                    <div className="artifact-left">
                      <div className="artifact-field">
                        <div className="artifact-field-label mono">WHY IT EXISTS</div>
                        <p className="artifact-field-value">{project.why}</p>
                      </div>
                      <div className="artifact-field">
                        <div className="artifact-field-label mono">WHAT IT IS</div>
                        <p className="artifact-field-value">{project.detail}</p>
                      </div>
                      <div className="artifact-field">
                        <div className="artifact-field-label mono">WHAT IT TAUGHT ME</div>
                        <p className="artifact-field-value">{project.lesson}</p>
                      </div>
                    </div>

                    <div className="artifact-right">
                      <div className="artifact-field">
                        <div className="artifact-field-label mono">STACK</div>
                        <div className="artifact-stack">
                          {project.stack.map(tech => (
                            <span key={tech} className="artifact-tech mono">{tech}</span>
                          ))}
                        </div>
                      </div>

                      <div className="artifact-links">
                        {project.live && (
                          <a
                            href={project.live}
                            className="artifact-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} live site`}
                          >
                            <span>LIVE SITE</span>
                            <span className="artifact-link-arrow">↗</span>
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            className="artifact-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} GitHub`}
                          >
                            <span>GITHUB</span>
                            <span className="artifact-link-arrow">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live build waveform */}
      <BuildWave />
    </div>
  );
}
