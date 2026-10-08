import { useRef, useEffect } from 'react';
import { NODES, STATES } from '../data/content';
import { playNodeClick } from '../utils/audio';
import './OrbitalCore.css';

/**
 * OrbitalCore — the persistent central instrument.
 * Contains: 3 concentric rings, reactive dot, identity text,
 * orbital navigation nodes, and corner status annotations.
 *
 * Runs a continuous requestAnimationFrame loop for perpetual counter-rotation
 * and buttery smooth pointer physics.
 */
export default function OrbitalCore({
  stateIndex = 0,
  localProgress = 0,
  onNodeClick,
}) {
  const coreRef = useRef(null);
  const dotRef = useRef(null);
  const identityRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const namePart1Ref = useRef(null);
  const namePart2Ref = useRef(null);
  const decorRef = useRef(null);

  // Store live state values in refs so the RAF loop always reads fresh numbers
  const stateRef = useRef({ stateIndex, localProgress });
  useEffect(() => {
    stateRef.current = { stateIndex, localProgress };
  }, [stateIndex, localProgress]);

  // Pointer smoothing & continuous RAF loop
  useEffect(() => {
    let animId;
    let targetNx = 0;
    let targetNy = 0;
    let currentNx = 0;
    let currentNy = 0;

    const onPointerMove = (e) => {
      targetNx = (e.clientX / window.innerWidth) - 0.5;
      targetNy = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const tick = () => {
      // Smooth lerp pointer
      currentNx += (targetNx - currentNx) * 0.08;
      currentNy += (targetNy - currentNy) * 0.08;

      const t = performance.now() * 0.001; // seconds
      const { stateIndex: si, localProgress: lp } = stateRef.current;

      // Central core scale & tilt
      const baseScale = si === 0 ? Math.max(0.88, 1 - lp * 0.12) : 0.7;
      if (coreRef.current) {
        coreRef.current.style.transform =
          `translate(-50%, -50%) rotate(${currentNx * 2.2}deg) scale(${baseScale})`;
      }

      // Reactive dot follows pointer
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${currentNx * 16}px, ${currentNy * 16}px)`;
      }

      // Rings perpetual counter-rotation
      if (ring1Ref.current) {
        ring1Ref.current.style.transform =
          `rotate(${currentNx * 2 + t * 4}deg)`;
      }
      if (ring2Ref.current) {
        ring2Ref.current.style.transform =
          `rotate(${-currentNx * 1.5 - t * 6.5}deg)`;
      }
      if (ring3Ref.current) {
        ring3Ref.current.style.transform =
          `rotate(${currentNx * 3 + t * 2.8}deg)`;
      }

      // Identity: visible throughout PRESENCE, fades out as user scrolls toward BUILD
      if (identityRef.current) {
        const identityOpacity = si === 0
          ? Math.max(0, 1 - Math.max(0, lp - 0.65) * (1 / 0.35))
          : 0;
        identityRef.current.style.opacity = identityOpacity;
        identityRef.current.style.pointerEvents = identityOpacity > 0.1 ? 'auto' : 'none';
        if (si === 0) {
          identityRef.current.style.transform =
            `translate(${currentNx * 8}px, ${currentNy * 8}px)`;
        }
      }

      // Name splits: spread horizontally during PRESENCE transition
      const spread = si === 0 ? lp * 20 : 20;
      if (namePart1Ref.current) {
        namePart1Ref.current.style.transform = `translateX(${spread}px)`;
      }
      if (namePart2Ref.current) {
        namePart2Ref.current.style.transform = `translateX(${-spread}px)`;
      }

      // Corner notes & edge labels: fade out when leaving PRESENCE
      if (decorRef.current) {
        const decorOpacity = si === 0
          ? Math.max(0, 1 - lp * 2.5)
          : 0;
        decorRef.current.style.opacity = decorOpacity;
        decorRef.current.style.pointerEvents = decorOpacity > 0.1 ? 'auto' : 'none';
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  const handleNodeClick = (target) => {
    playNodeClick();
    onNodeClick?.(target);
  };

  const currentStateKey = STATES[stateIndex]?.key || 'presence';

  return (
    <div className="orbital-core" ref={coreRef} id="core">
      {/* Concentric rings */}
      <div className="c-ring r1" ref={ring1Ref} aria-hidden="true" />
      <div className="c-ring r2" ref={ring2Ref} aria-hidden="true" />
      <div className="c-ring r3" ref={ring3Ref} aria-hidden="true" />

      {/* Central reactive dot */}
      <div className="c-dot" ref={dotRef} aria-hidden="true" />

      {/* Identity block */}
      <div className="c-identity" ref={identityRef}>
        <div className="c-identity-pre mono">student / builder / creator</div>
        <h1 className="c-identity-name">
          <span className="c-name-part" ref={namePart1Ref}>MEHDI</span>
          <span className="c-name-part accent" ref={namePart2Ref}>ALI.</span>
        </h1>
      </div>

      {/* Orbital navigation nodes */}
      <nav className="c-orbit" aria-label="Page sections">
        {NODES.map((node) => {
          const isActive = node.target === currentStateKey;
          return (
            <button
              key={node.signal}
              className={`c-node ${isActive ? 'is-active' : ''}`}
              style={node.pos}
              onClick={() => handleNodeClick(node.target)}
              aria-label={`Navigate to ${node.label}`}
            >
              <span className="c-node-signal mono">{`signal ${node.signal}`}</span>
              <span className="c-node-label">{node.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Presence-only decorative annotations & guides */}
      <div className="c-decorations" ref={decorRef} aria-hidden="true">
        {/* Edge labels */}
        <span className="c-edge-label" style={{ left: '27%', top: '23%' }}>
          curiosity → output
        </span>
        <span className="c-edge-label" style={{ right: '20%', top: '21%' }}>
          ideas → systems
        </span>
        <span className="c-edge-label" style={{ right: '18%', bottom: '19%' }}>
          systems → stories
        </span>
        <span className="c-edge-label" style={{ left: '17%', bottom: '16%' }}>
          stories → people
        </span>

        {/* Corner labels */}
        <div className="c-corner-note mono">
          THIS PAGE DOESN'T HAVE SECTIONS.<br />
          IT HAS STATES.<br /><br />
          SCROLL TO CHANGE THE SIGNAL.
        </div>

        <div className="c-scroll-hint mono">
          <span className="c-scroll-line" />
          KEEP MOVING
        </div>
      </div>
    </div>
  );
}
