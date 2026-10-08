import { useRef, useEffect } from 'react';
import { NODES } from '../data/content';
import './OrbitalCore.css';

/**
 * OrbitalCore — the persistent central instrument.
 * Contains: 3 concentric rings, a reactive dot, identity text,
 * and orbital navigation nodes.
 *
 * Responds to:
 * - pointer position (subtle drift)
 * - scroll state (scale, ring rotation, identity shift)
 */
export default function OrbitalCore({
  pointer = { nx: 0, ny: 0 },
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

  useEffect(() => {
    const { nx, ny } = pointer;
    const lp = localProgress;
    const si = stateIndex;

    // Core scale — only on PRESENCE (si=0), slightly compress as you move into it
    const baseScale = si === 0 ? Math.max(0.88, 1 - lp * 0.12) : 0.7;

    const rx = nx * 14;
    const ry = ny * 14;

    if (coreRef.current) {
      coreRef.current.style.transform =
        `translate(-50%, -50%) rotate(${nx * 2}deg) scale(${baseScale})`;
    }

    // Dot follows pointer
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
    }

    // Identity: stays visible throughout PRESENCE, fades in the last 30%
    if (identityRef.current) {
      const identityOpacity = si === 0
        ? Math.max(0, 1 - Math.max(0, lp - 0.7) * (1 / 0.3))
        : 0;
      identityRef.current.style.opacity = identityOpacity;
      identityRef.current.style.pointerEvents = identityOpacity > 0.1 ? 'auto' : 'none';
      if (si === 0) {
        identityRef.current.style.transform = `translate(${nx * 8}px, ${ny * 8}px)`;
      }
    }

    // Name splits: spread apart only during PRESENCE transition
    const spread = si === 0 ? lp * 18 : 18;
    if (namePart1Ref.current) {
      namePart1Ref.current.style.transform = `translateX(${spread}px)`;
    }
    if (namePart2Ref.current) {
      namePart2Ref.current.style.transform = `translateX(${-spread}px)`;
    }

    // Rings slowly counter-rotate
    const t = performance.now() * 0.00008;
    if (ring1Ref.current) {
      ring1Ref.current.style.transform = `rotate(${nx * 2 + t * 4}deg)`;
    }
    if (ring2Ref.current) {
      ring2Ref.current.style.transform = `rotate(${-nx * 1.5 + t * 6}deg)`;
    }
    if (ring3Ref.current) {
      ring3Ref.current.style.transform = `rotate(${nx * 3 - t * 2.5}deg)`;
    }
  }, [pointer, stateIndex, localProgress]);

  return (
    <div className="orbital-core" ref={coreRef} id="core">
      {/* Concentric rings */}
      <div className="c-ring r1" ref={ring1Ref} aria-hidden="true" />
      <div className="c-ring r2" ref={ring2Ref} aria-hidden="true" />
      <div className="c-ring r3" ref={ring3Ref} aria-hidden="true" />

      {/* Central reactive dot */}
      <div className="c-dot" ref={dotRef} aria-hidden="true" />

      {/* Identity block — only contains name, sub-copy is in App's presence block */}
      <div className="c-identity" ref={identityRef}>
        <div className="c-identity-pre mono">student / builder / creator</div>
        <h1 className="c-identity-name">
          <span className="c-name-part" ref={namePart1Ref}>MEHDI</span>
          <span className="c-name-part accent" ref={namePart2Ref}>ALI.</span>
        </h1>
      </div>

      {/* Orbital navigation nodes */}
      <nav className="c-orbit" aria-label="Page sections">
        {NODES.map((node) => (
          <button
            key={node.signal}
            className="c-node"
            style={node.pos}
            onClick={() => onNodeClick?.(node.target)}
            aria-label={`Navigate to ${node.label}`}
          >
            <span className="c-node-signal mono">{`signal ${node.signal}`}</span>
            <span className="c-node-label">{node.label}</span>
          </button>
        ))}

        {/* Edge labels */}
        <span className="c-edge-label" style={{ left: '27%', top: '23%' }} aria-hidden="true">
          curiosity → output
        </span>
        <span className="c-edge-label" style={{ right: '20%', top: '21%' }} aria-hidden="true">
          ideas → systems
        </span>
        <span className="c-edge-label" style={{ right: '18%', bottom: '19%' }} aria-hidden="true">
          systems → stories
        </span>
        <span className="c-edge-label" style={{ left: '17%', bottom: '16%' }} aria-hidden="true">
          stories → people
        </span>
      </nav>

      {/* Corner labels */}
      <div className="c-corner-note mono" aria-hidden="true">
        THIS PAGE DOESN'T HAVE SECTIONS.<br />
        IT HAS STATES.<br /><br />
        SCROLL TO CHANGE THE SIGNAL.
      </div>

      <div className="c-scroll-hint mono" aria-hidden="true">
        <span className="c-scroll-line" />
        KEEP MOVING
      </div>
    </div>
  );
}
