import { useCallback, useEffect, useRef } from 'react';
import { useScrollState } from './hooks/useScrollState';
import { STATES } from './data/content';
import { playStateTransition } from './utils/audio';

import AmbientField from './components/AmbientField';
import HUD from './components/HUD';
import OrbitalCore from './components/OrbitalCore';
import Transmission from './components/Transmission';

import StateBuild from './components/StateBuild';
import StateBroadcast from './components/StateBroadcast';
import StateEvolve from './components/StateEvolve';
import StateReach from './components/StateReach';

import './styles/global.css';
import './App.css';

/**
 * ARCHITECTURE:
 * 
 * State 0 — PRESENCE: The orbital core is fully visible + identity text.
 *   No occluding transmission panel — the human signal editorial statement lives
 *   cleanly in the lower stage quadrant, harmonizing with the orbital geometry.
 *
 * States 1–4 — BUILD, BROADCAST, EVOLVE, REACH:
 *   The orbital core contracts into a persistent instrument background.
 *   The active Transmission panel reveals with an opaque paper background and document borders.
 *   Orbital nodes remain interactive for navigation.
 *
 * Controls:
 *   - Scroll wheel / touch swipe
 *   - Orbital navigation nodes (signal 01..06)
 *   - Top HUD channel indicators
 *   - Keyboard shortcuts: Keys 1..5 for direct tuning
 */

const TRANSMISSIONS = [
  {
    id: 'build',
    stateIndex: 1,
    stateId: '02',
    stateLabel: 'BUILD',
    stateDesc: 'selected instruments',
    Component: StateBuild,
  },
  {
    id: 'broadcast',
    stateIndex: 2,
    stateId: '03',
    stateLabel: 'BROADCAST',
    stateDesc: 'things made for people',
    Component: StateBroadcast,
  },
  {
    id: 'evolve',
    stateIndex: 3,
    stateId: '04',
    stateLabel: 'EVOLVE',
    stateDesc: 'measured, not manufactured',
    Component: StateEvolve,
  },
  {
    id: 'reach',
    stateIndex: 4,
    stateId: '05',
    stateLabel: 'REACH',
    stateDesc: 'open frequency',
    Component: StateReach,
  },
];

export default function App() {
  const { stateIndex, localProgress, globalProgress } = useScrollState(5);
  const prevStateRef = useRef(stateIndex);

  // Jump to state index with smooth scroll
  const scrollToState = useCallback((targetIndex) => {
    const idx = Math.max(0, Math.min(4, targetIndex));
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = maxScroll * ((idx + 0.08) / 5);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  const handleNodeClick = useCallback((targetKey) => {
    const stateMap = {
      presence: 0,
      build: 1,
      broadcast: 2,
      evolve: 3,
      reach: 4,
    };
    const idx = stateMap[targetKey] ?? 0;
    scrollToState(idx);
  }, [scrollToState]);

  // Harmonic tone when state changes
  useEffect(() => {
    if (prevStateRef.current !== stateIndex) {
      playStateTransition(stateIndex);
      prevStateRef.current = stateIndex;
    }
  }, [stateIndex]);

  // Keyboard navigation: 1-5 to jump to state
  useEffect(() => {
    const onKeyDown = (e) => {
      // Don't intercept if typing in an input field (e.g. terminal)
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const targetIdx = parseInt(e.key, 10) - 1;
        scrollToState(targetIdx);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scrollToState]);

  const isPresence = stateIndex === 0;

  return (
    <>
      <AmbientField stateIndex={stateIndex} globalProgress={globalProgress} />
      <HUD
        stateIndex={stateIndex}
        globalProgress={globalProgress}
        states={STATES}
        onStateSelect={scrollToState}
      />

      <div className="page-body">
        <div className="stage" role="main" id="main-stage">
          {/* The persistent orbital instrument */}
          <OrbitalCore
            stateIndex={stateIndex}
            localProgress={localProgress}
            onNodeClick={handleNodeClick}
          />

          {/* PRESENCE state editorial statement — lives outside the core */}
          <div
            className={`presence-copy-block ${isPresence ? 'visible' : 'hidden'}`}
            aria-hidden={!isPresence}
          >
            <div className="presence-copy-inner">
              <div className="presence-tag mono">01 / PRESENCE — human signal</div>
              <p className="presence-statement serif">
                A student<br />
                <em>in motion.</em>
              </p>
              <p className="presence-about">
                B.Tech student. Developer. Content creator.<br />
                Standing at the intersection of engineering and expression.
              </p>
              <p className="presence-micro mono">
                THE POINT IS NOT TO LOOK FINISHED.<br />
                It is to make the work visible while it is still changing.
              </p>
            </div>
          </div>

          {/* State transmissions for states 1-4 */}
          {TRANSMISSIONS.map((t) => (
            <Transmission
              key={t.id}
              id={t.id}
              stateId={t.stateId}
              stateLabel={t.stateLabel}
              stateDesc={t.stateDesc}
              isActive={t.stateIndex === stateIndex}
            >
              <t.Component />
            </Transmission>
          ))}
        </div>

        {/* Scroll chapters — creates the scroll height */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="scroll-chapter"
            aria-hidden="true"
            data-chapter={i}
          />
        ))}
      </div>

      <a href="#main-stage" className="skip-link">Skip to main content</a>
    </>
  );
}
