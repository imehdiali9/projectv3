import { useMemo } from 'react';

/**
 * useTransitionProgress — maps continuous scroll rawState and velocity
 * into the 5 distinct phases of the PRESENCE → BUILD motion transformation:
 *
 * Phase A (0.00 – 0.15): PRESENCE (Equilibrium)
 * Phase B (0.15 – 0.40): DESTABILIZATION (Eccentric drift, ring acceleration)
 * Phase C (0.40 – 0.65): FRACTURE (Typographic glyph fragmentation)
 * Phase D (0.65 – 0.85): NETWORK FORMATION (Vector paths, convergence)
 * Phase E (0.85 – 1.00): BUILD LOCK (The Ledger settles, technical armature)
 *
 * Continuously reversible: scrolling backward returns exact deterministic values.
 */
export function useTransitionProgress(rawState = 0, velocity = 0) {
  return useMemo(() => {
    // Clamp to [0, 1] for PRESENCE -> BUILD
    const t = Math.min(1, Math.max(0, rawState));

    let phase = 'A';
    let phaseProgress = 0;

    if (t < 0.15) {
      phase = 'A';
      phaseProgress = t / 0.15;
    } else if (t < 0.4) {
      phase = 'B';
      phaseProgress = (t - 0.15) / 0.25;
    } else if (t < 0.65) {
      phase = 'C';
      phaseProgress = (t - 0.4) / 0.25;
    } else if (t < 0.85) {
      phase = 'D';
      phaseProgress = (t - 0.65) / 0.2;
    } else {
      phase = 'E';
      phaseProgress = (t - 0.85) / 0.15;
    }

    // Normalized velocity impact [-1.0, 1.0] -> dampening factor
    const absVel = Math.min(1.0, Math.abs(velocity));
    const velDirection = Math.sign(velocity);

    return {
      progress: t,
      phase,
      phaseProgress,
      velocity,
      absVel,
      velDirection,
      isPresence: t < 0.2,
      isTransitioning: t >= 0.15 && t < 0.85,
      isBuildLocked: t >= 0.85,
    };
  }, [rawState, velocity]);
}
