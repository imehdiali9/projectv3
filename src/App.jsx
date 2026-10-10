import { useCallback, useEffect, useRef } from 'react';
import { useScrollState } from './hooks/useScrollState';
import { useTransitionProgress } from './hooks/useTransitionProgress';
import { STATES } from './data/content';
import {
  playStateTransition,
  playTransformationHarmonic,
  playBuildLockConfirmation,
} from './utils/audio';

import AmbientField from './components/AmbientField';
import SignalNetworkField from './components/SignalNetworkField';
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
 * ARCHITECTURE — PERSONAL FREQUENCY
 *
 * MILESTONE 01: PRESENCE → BUILD MOTION SYSTEM
 *
 * The journey from State 01 (PRESENCE) to State 02 (BUILD) is a physical transformation:
 * PERSON → SIGNAL → FRAGMENTATION → NETWORK → BUILD
 *
 * Transmissions for States 03 (BROADCAST), 04 (EVOLVE), 05 (REACH) remain isolated
 * in their document panels, as per Milestone 01 constraints.
 */

const LATER_TRANSMISSIONS = [
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
  const {
    stateIndex,
    localProgress,
    globalProgress,
    rawState,
    presenceToBuildProgress,
    velocity,
  } = useScrollState(5);

  const transitionMeta = useTransitionProgress(rawState, velocity);
  const prevStateRef = useRef(stateIndex);
  const prevPhaseRef = useRef(transitionMeta.phase);

  // Jump to state index with smooth scroll
  const scrollToState = useCallback((targetIndex) => {
    const idx = Math.max(0, Math.min(4, targetIndex));
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = maxScroll * ((idx + 0.08) / 5);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  const handleNodeClick = useCallback(
    (targetKey) => {
      const stateMap = {
        presence: 0,
        build: 1,
        broadcast: 2,
        evolve: 3,
        reach: 4,
      };
      const idx = stateMap[targetKey] ?? 0;
      scrollToState(idx);
    },
    [scrollToState]
  );

  // Harmonic tone when state changes
  useEffect(() => {
    if (prevStateRef.current !== stateIndex) {
      playStateTransition(stateIndex);
      prevStateRef.current = stateIndex;
    }
  }, [stateIndex]);

  // Subtle tonal cues during PRESENCE → BUILD transformation phases
  useEffect(() => {
    const currentPhase = transitionMeta.phase;
    if (prevPhaseRef.current !== currentPhase) {
      if (currentPhase === 'B') {
        playTransformationHarmonic('B');
      } else if (currentPhase === 'C') {
        playTransformationHarmonic('C');
      } else if (currentPhase === 'E') {
        playBuildLockConfirmation();
      }
      prevPhaseRef.current = currentPhase;
    }
  }, [transitionMeta.phase]);

  // Keyboard navigation: 1-5 to jump to state
  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const targetIdx = parseInt(e.key, 10) - 1;
        scrollToState(targetIdx);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scrollToState]);

  // Editorial copy is visible in Phase A, smoothly fading in Phase B
  const isPresenceCopyVisible = presenceToBuildProgress < 0.25 && stateIndex === 0;

  // Signal network field lifecycle: active strictly during PRESENCE -> BUILD and settling into BUILD (0.12 <= rawState < 1.15)
  const isTransitionFieldActive = rawState >= 0.12 && rawState < 1.15;
  const transitionFieldProgress = Math.min(1, Math.max(0, (rawState - 0.12) / 0.88));

  return (
    <>
      <AmbientField
        stateIndex={stateIndex}
        globalProgress={globalProgress}
        presenceToBuildProgress={presenceToBuildProgress}
        velocity={velocity}
      />

      {/* Vector signal network layer specifically for PRESENCE → BUILD */}
      <SignalNetworkField
        isActive={isTransitionFieldActive}
        transitionProgress={transitionFieldProgress}
        rawState={rawState}
        velocity={velocity}
      />

      <HUD
        stateIndex={stateIndex}
        globalProgress={globalProgress}
        states={STATES}
        onStateSelect={scrollToState}
      />

      <div className="page-body">
        <div className="stage" role="main" id="main-stage">
          {/* The physical transformation instrument */}
          <OrbitalCore
            stateIndex={stateIndex}
            localProgress={localProgress}
            presenceToBuildProgress={presenceToBuildProgress}
            velocity={velocity}
            onNodeClick={handleNodeClick}
          />

          {/* PRESENCE state editorial statement */}
          <div
            className="presence-copy-block"
            style={{
              opacity: isPresenceCopyVisible ? Math.max(0, 1 - presenceToBuildProgress * 4) : 0,
              transform: `translateY(${presenceToBuildProgress * 24}px)`,
              pointerEvents: isPresenceCopyVisible ? 'auto' : 'none',
              visibility: presenceToBuildProgress >= 0.25 ? 'hidden' : 'visible',
            }}
            aria-hidden={!isPresenceCopyVisible}
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

          {/* Emergent spatial BUILD state — no opaque wall */}
          <StateBuild
            localProgress={localProgress}
            isActive={stateIndex === 1}
            rawState={rawState}
          />

          {/* Preserved document transmissions for States 03, 04, 05 */}
          {LATER_TRANSMISSIONS.map((t) => (
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
