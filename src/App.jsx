import { useCallback } from 'react';
import { useScrollState, usePointer } from './hooks/useScrollState';
import { STATES } from './data/content';

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
 *   No transmission panel — the "about" copy lives directly in the stage as a
 *   corner annotation (echoing the original prototype).
 *
 * States 1–4 — BUILD, BROADCAST, EVOLVE, REACH:
 *   The orbital shrinks. A solid-background Transmission panel reveals.
 *   Nodes remain accessible for navigation.
 *
 * Total scroll: 6 × 100vh chapters → 6 full pages of scroll depth.
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
  const pointer = usePointer();

  const handleNodeClick = useCallback((targetKey) => {
    // Map target key to scroll position
    const stateMap = {
      presence: 0,
      build: 1,
      broadcast: 2,
      evolve: 3,
      reach: 4,
    };
    const idx = stateMap[targetKey] ?? 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = maxScroll * ((idx + 0.08) / 5);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  const isPresence = stateIndex === 0;

  return (
    <>
      <AmbientField stateIndex={stateIndex} globalProgress={globalProgress} />
      <HUD stateIndex={stateIndex} globalProgress={globalProgress} states={STATES} />

      <div className="page-body">
        <div className="stage" role="main" id="main-stage">

          {/* The persistent orbital instrument */}
          <OrbitalCore
            pointer={pointer}
            stateIndex={stateIndex}
            localProgress={localProgress}
            onNodeClick={handleNodeClick}
          />

          {/* PRESENCE state copy — lives outside the core, in the lower half */}
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
