import { useRef, useEffect } from 'react';
import { NODES, STATES } from '../data/content';
import { playNodeClick } from '../utils/audio';
import './OrbitalCore.css';

/**
 * OrbitalCore — the physical transformation instrument.
 *
 * Implements the full 5-phase motion lifecycle:
 * Phase A (0.00 – 0.15): PRESENCE equilibrium
 * Phase B (0.15 – 0.40): DESTABILIZATION (eccentric drift, ring acceleration)
 * Phase C (0.40 – 0.65): FRACTURE (physical typographic glyph fragmentation)
 * Phase D (0.65 – 0.85): NETWORK FORMATION (convergence toward THE LEDGER)
 * Phase E (0.85 – 1.00): BUILD LOCK (settles into architectural armature)
 *
 * Continuously reversible: every coordinate is a pure function of progress.
 */
export default function OrbitalCore({
  stateIndex = 0,
  localProgress = 0,
  presenceToBuildProgress = 0,
  velocity = 0,
  onNodeClick,
}) {
  const coreRef = useRef(null);
  const dotRef = useRef(null);
  const identityRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const decorRef = useRef(null);
  const telemetryRef = useRef(null);

  // Individual glyph refs for MEHDI (0-4) and ALI. (5-8)
  const glyphRefs = useRef([]);

  // Store live state in a ref so RAF always reads fresh values
  const stateRef = useRef({
    stateIndex,
    localProgress,
    presenceToBuildProgress,
    velocity,
  });

  useEffect(() => {
    stateRef.current = {
      stateIndex,
      localProgress,
      presenceToBuildProgress,
      velocity,
    };
  }, [stateIndex, localProgress, presenceToBuildProgress, velocity]);

  // Pointer smoothing & RAF transformation controller
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

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = () => {
      // Lerp pointer
      currentNx += (targetNx - currentNx) * 0.08;
      currentNy += (targetNy - currentNy) * 0.08;

      const tSec = performance.now() * 0.001;
      const {
        presenceToBuildProgress: t,
        velocity: vel,
      } = stateRef.current;

      const vFactor = prefersReducedMotion ? 0 : Math.max(-1.5, Math.min(1.5, vel));
      const absV = Math.abs(vFactor);

      // ─── 1. CORE TRANSFORM & SCALE ─────────────────────────────
      // In Presence: centered, scale ~ 1.0.
      // During Transition: scales and shifts slightly based on progress.
      // In Build Lock: settles as wide background framework.
      let coreScale = 1.0;
      let coreX = -50;
      let coreY = -50;
      let coreRot = currentNx * 2.2;

      if (t < 0.15) {
        coreScale = 1.0 - t * 0.2;
      } else if (t < 0.65) {
        const midT = (t - 0.15) / 0.5;
        coreScale = 0.97 + midT * 0.15 + absV * 0.06;
        coreX = -50 + currentNx * 12 + vFactor * 8;
        coreY = -50 + currentNy * 10;
        coreRot = currentNx * 2.2 + vFactor * 3;
      } else {
        const lockT = (t - 0.65) / 0.35;
        coreScale = 1.12 - lockT * 0.22;
        coreX = -50 + lockT * 8; // gentle shift toward right-center to frame Build
        coreY = -50 - lockT * 6;
      }

      if (coreRef.current) {
        coreRef.current.style.transform = `translate(${coreX}%, ${coreY}%) rotate(${prefersReducedMotion ? 0 : coreRot}deg) scale(${coreScale})`;
      }

      // ─── 2. CONCENTRIC RINGS TRANSFORMATION ─────────────────────
      // Continuous counter-rotation + phase-based morphing
      const rotSpeed1 = tSec * (4 + (t >= 0.15 && t < 0.65 ? (t - 0.15) * 16 : 0) + absV * 8);
      const rotSpeed2 = -tSec * (6.5 + (t >= 0.15 && t < 0.65 ? (t - 0.15) * 24 : 0) + absV * 12);
      const rotSpeed3 = tSec * (2.8 + absV * 4);

      if (ring1Ref.current) {
        let r1Scale = 1.0;
        let r1Opacity = 1.0;
        if (t >= 0.15 && t < 0.65) {
          const p = (t - 0.15) / 0.5;
          r1Scale = 1.0 + p * 0.32 + absV * 0.1;
          r1Opacity = 1.0 - p * 0.6;
        } else if (t >= 0.65) {
          r1Scale = 1.32;
          r1Opacity = 0.22;
        }
        ring1Ref.current.style.transform = `rotate(${prefersReducedMotion ? 0 : currentNx * 2 + rotSpeed1}deg) scale(${r1Scale})`;
        ring1Ref.current.style.opacity = r1Opacity;
      }

      if (ring2Ref.current) {
        let r2ScaleX = 1.0;
        let r2ScaleY = 1.0;
        let r2Opacity = 1.0;
        if (t >= 0.15 && t < 0.65) {
          const p = (t - 0.15) / 0.5;
          r2ScaleX = 1.0 + p * 0.25;
          r2ScaleY = 1.0 - p * 0.35; // flattens into baseline calibrator
          r2Opacity = 1.0 - p * 0.7;
        } else if (t >= 0.65) {
          r2ScaleX = 1.25;
          r2ScaleY = 0.65;
          r2Opacity = 0.18;
        }
        ring2Ref.current.style.transform = `rotate(${prefersReducedMotion ? 0 : -currentNx * 1.5 + rotSpeed2}deg) scale(${r2ScaleX}, ${r2ScaleY})`;
        ring2Ref.current.style.opacity = r2Opacity;
      }

      if (ring3Ref.current) {
        let r3OffsetX = 0;
        let r3OffsetY = 0;
        let r3Scale = 1.0;
        let r3Opacity = 1.0;
        if (t >= 0.15 && t < 0.85) {
          const p = (t - 0.15) / 0.7;
          r3OffsetX = -45 * p;
          r3OffsetY = -25 * p;
          r3Scale = 1.0 - p * 0.35;
          r3Opacity = Math.max(0.3, 1.0 - p * 0.4);
        } else if (t >= 0.85) {
          r3OffsetX = -45;
          r3OffsetY = -25;
          r3Scale = 0.65;
          r3Opacity = 0.35;
        }
        ring3Ref.current.style.transform = `translate(${r3OffsetX}px, ${r3OffsetY}px) rotate(${prefersReducedMotion ? 0 : currentNx * 3 + rotSpeed3}deg) scale(${r3Scale})`;
        ring3Ref.current.style.opacity = r3Opacity;
      }

      // ─── 3. CENTRAL REACTIVE DOT ────────────────────────────────
      // Destabilizes, pulls away from exact center along eccentric vector
      if (dotRef.current) {
        let dotX = currentNx * 16;
        let dotY = currentNy * 16;
        if (t >= 0.15 && t < 0.85) {
          const p = (t - 0.15) / 0.7;
          dotX += 65 * p + vFactor * 25;
          dotY += 35 * p;
        } else if (t >= 0.85) {
          dotX += 65;
          dotY += 35;
        }
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px)`;
      }

      // ─── 4. TYPOGRAPHIC FRACTURE TRAJECTORIES ────────────────────
      // Individual glyph physics across Phase A, B, C, D, E
      const glyphTrajectories = [
        // MEHDI
        { bx: -30, by: 0,   cx: -150, cy: -75, rot: -14 }, // M
        { bx: -20, by: 0,   cx: -80,  cy: -35, rot: -6  }, // E
        { bx: -10, by: 0,   cx: -25,  cy: +15, rot: +5  }, // H
        { bx: +10, by: 0,   cx: +55,  cy: -45, rot: +11 }, // D
        { bx: +25, by: 0,   cx: +105, cy: -20, rot: -8  }, // I
        // ALI.
        { bx: +15, by: 0,   cx: -65,  cy: +65, rot: +15 }, // A
        { bx: +30, by: 0,   cx: +35,  cy: +80, rot: -11 }, // L
        { bx: +45, by: 0,   cx: +115, cy: +50, rot: +7  }, // I
        { bx: +60, by: 0,   cx: -15,  cy: -95, rot: 0, scale: 1.8 }, // . (accent dot)
      ];

      glyphRefs.current.forEach((el, idx) => {
        if (!el) return;
        const traj = glyphTrajectories[idx] || { bx: 0, by: 0, cx: 0, cy: 0, rot: 0 };

        let gx = 0;
        let gy = 0;
        let gRot = 0;
        let gScale = 1.0;
        let gOpacity = 1.0;

        if (t < 0.15) {
          // Phase A: Stable
          gx = 0;
          gy = 0;
        } else if (t < 0.40) {
          // Phase B: Word Destabilization
          const pB = (t - 0.15) / 0.25;
          gx = traj.bx * pB + vFactor * 8;
          gy = traj.by * pB;
          gRot = (traj.rot * 0.25) * pB;
        } else if (t < 0.65) {
          // Phase C: Full Fracture & Detachment
          const pC = (t - 0.40) / 0.25;
          const scat = prefersReducedMotion ? 0.3 : 1.0 + absV * 0.5;
          gx = (traj.bx + (traj.cx - traj.bx) * pC) * scat;
          gy = (traj.by + (traj.cy - traj.by) * pC) * scat;
          gRot = (traj.rot * pC);
          if (traj.scale) gScale = 1.0 + (traj.scale - 1.0) * pC;
          gOpacity = 1.0 - pC * 0.15; // stays clearly visible
        } else if (t < 0.85) {
          // Phase D: Convergence toward THE LEDGER anchor
          const pD = (t - 0.65) / 0.20;
          const targetX = -120 + idx * 18;
          const targetY = -120;
          gx = traj.cx + (targetX - traj.cx) * pD;
          gy = traj.cy + (targetY - traj.cy) * pD;
          gRot = traj.rot * (1 - pD);
          gOpacity = Math.max(0, 0.85 - pD * 0.95);
        } else {
          // Phase E: Locked into Build
          gOpacity = 0;
        }

        if (prefersReducedMotion) gRot = 0;

        el.style.transform = `translate(${gx}px, ${gy}px) rotate(${gRot}deg) scale(${gScale})`;
        el.style.opacity = gOpacity;
      });

      // Sub-copy (student / builder / creator): fades in Phase B
      if (identityRef.current) {
        const idOpacity = t < 0.15 ? 1.0 : Math.max(0, 1.0 - (t - 0.15) * 4);
        identityRef.current.style.opacity = idOpacity;
      }

      // ─── 5. PRESENCE DECORATIONS & ANNOTATIONS ──────────────────
      if (decorRef.current) {
        const decorOpacity = t < 0.12 ? 1.0 : Math.max(0, 1.0 - (t - 0.12) * 5);
        decorRef.current.style.opacity = decorOpacity;
        decorRef.current.style.pointerEvents = decorOpacity > 0.1 ? 'auto' : 'none';
      }

      // ─── 6. TELEMETRY FREQUENCY READOUT ─────────────────────────
      if (telemetryRef.current) {
        if (t >= 0.15 && t < 0.95) {
          telemetryRef.current.style.opacity = Math.sin(((t - 0.15) / 0.8) * Math.PI) * 0.85;
          const freqVal = (102.4 + t * 40.4).toFixed(1);
          telemetryRef.current.textContent = `TUNING / ${freqVal} MHz / PHASE ${t < 0.4 ? 'B: DRIFT' : t < 0.65 ? 'C: FRACTURE' : 'D: LOCK'}`;
        } else {
          telemetryRef.current.style.opacity = 0;
        }
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
      {/* Concentric rings — physical transformation instruments */}
      <div className="c-ring r1" ref={ring1Ref} aria-hidden="true" />
      <div className="c-ring r2" ref={ring2Ref} aria-hidden="true" />
      <div className="c-ring r3" ref={ring3Ref} aria-hidden="true" />

      {/* Central reactive dot */}
      <div className="c-dot" ref={dotRef} aria-hidden="true" />

      {/* Live transformation telemetry readout */}
      <div className="c-telemetry mono" ref={telemetryRef} aria-hidden="true" />

      {/* Identity block with individual fracture glyphs */}
      <div className="c-identity">
        <div className="c-identity-pre mono" ref={identityRef}>
          student / builder / creator
        </div>
        <h1 className="c-identity-name" aria-label="Mehdi Ali">
          <span className="c-word c-word-mehdi">
            {['M', 'E', 'H', 'D', 'I'].map((char, i) => (
              <span
                key={i}
                className="c-glyph"
                ref={(el) => (glyphRefs.current[i] = el)}
              >
                {char}
              </span>
            ))}
          </span>
          <span className="c-word c-word-ali accent">
            {['A', 'L', 'I', '.'].map((char, i) => (
              <span
                key={i}
                className={`c-glyph ${char === '.' ? 'c-glyph-dot' : ''}`}
                ref={(el) => (glyphRefs.current[5 + i] = el)}
              >
                {char}
              </span>
            ))}
          </span>
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
