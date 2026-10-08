import { useEffect, useRef } from 'react';
import './SignalNetworkField.css';

/**
 * SignalNetworkField — high-performance SVG/Canvas vector signal layer
 * specifically orchestrating the PRESENCE → BUILD transition.
 *
 * Connects:
 * - Orbital center point
 * - Concentric ring anchors
 * - Fragmented typographic positions
 * - Orbital nodes (signal 01..06)
 * - Emerging project anchor (THE LEDGER at 001)
 *
 * Causes & Reactions:
 * - Bends dynamically with pointer coordinates
 * - Vibrates and deflects with scroll velocity
 * - Fully reversible based on progress (0→1)
 */
export default function SignalNetworkField({
  progress = 0,
  velocity = 0,
  pointer = { nx: 0, ny: 0 },
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ progress, velocity, pointer });

  useEffect(() => {
    stateRef.current = { progress, velocity, pointer };
  }, [progress, velocity, pointer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();

    let animId;
    let time = 0;

    function render() {
      time += 0.02;
      const { progress: t, velocity: vel, pointer: ptr } = stateRef.current;

      ctx.clearRect(0, 0, w, h);

      // Only active during transition and early BUILD
      if (t < 0.12) {
        animId = requestAnimationFrame(render);
        return;
      }

      const cx = w * 0.5 + ptr.nx * 20;
      const cy = h * 0.5 + ptr.ny * 20;

      // Project target anchor in upper-left quadrant
      const projectTargetX = w * 0.16;
      const projectTargetY = h * 0.28;

      // Velocity deflection factor
      const vDeflect = Math.max(-40, Math.min(40, vel * 35));

      // ─── 1. Destabilization Arcs (Phase B: 0.15 → 0.40) ───
      if (t >= 0.15 && t < 0.6) {
        const bProgress = Math.min(1, Math.max(0, (t - 0.15) / 0.25));
        const alpha = bProgress * (1 - Math.max(0, (t - 0.45) / 0.15)) * 0.45;

        ctx.strokeStyle = `rgba(25, 71, 229, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);

        // Expanding eccentric ellipses
        ctx.beginPath();
        const rEccentric = Math.min(w, h) * 0.28 * (1 + bProgress * 0.35);
        ctx.ellipse(
          cx + bProgress * 40 + vDeflect * 0.4,
          cy - bProgress * 20,
          rEccentric * 1.1,
          rEccentric * 0.75,
          ptr.nx * 0.2 + time * 0.1,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        // Crosshairs at orbital anchor
        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(23, 23, 23, ${alpha * 0.6})`;
        const crossSize = 10 + bProgress * 8;
        ctx.beginPath();
        ctx.moveTo(cx - crossSize, cy);
        ctx.lineTo(cx + crossSize, cy);
        ctx.moveTo(cx, cy - crossSize);
        ctx.lineTo(cx, cy + crossSize);
        ctx.stroke();
      }

      // ─── 2. Fracture Network Vectors (Phase C & D: 0.35 → 0.85) ───
      if (t >= 0.35 && t <= 0.95) {
        const cdProgress = Math.min(1, Math.max(0, (t - 0.35) / 0.5));
        const alpha = Math.sin(cdProgress * Math.PI) * 0.7;

        // Coordinates of 6 migrating glyph clusters
        const nodes = [
          { x: cx - 180 * cdProgress + ptr.nx * 15, y: cy - 90 * cdProgress + ptr.ny * 10, label: 'M' },
          { x: cx - 70 * cdProgress + ptr.nx * 10,  y: cy - 40 * cdProgress + ptr.ny * 8,  label: 'E' },
          { x: cx + 40 * cdProgress + ptr.nx * 8,   y: cy - 60 * cdProgress + ptr.ny * 12, label: 'H' },
          { x: cx + 120 * cdProgress + ptr.nx * 14, y: cy + 30 * cdProgress + ptr.ny * 6,  label: 'D' },
          { x: cx - 110 * cdProgress + ptr.nx * 6,  y: cy + 80 * cdProgress + ptr.ny * 10, label: 'A' },
          { x: cx + 80 * cdProgress + ptr.nx * 12,  y: cy + 100 * cdProgress + ptr.ny * 8, label: 'L' },
        ];

        // Draw curved vectors from glyph nodes to the project target
        ctx.lineWidth = 1;
        nodes.forEach((n, idx) => {
          ctx.beginPath();
          ctx.strokeStyle = idx % 2 === 0 ? `rgba(25, 71, 229, ${alpha})` : `rgba(23, 23, 23, ${alpha * 0.6})`;
          ctx.setLineDash([3, 4]);

          // Mid-point control curve bowed by velocity and pointer
          const midX = (n.x + projectTargetX) * 0.5 + (idx % 2 ? vDeflect : -vDeflect) + ptr.nx * 20;
          const midY = (n.y + projectTargetY) * 0.5 + Math.sin(time + idx) * 12 + ptr.ny * 20;

          ctx.moveTo(n.x, n.y);
          ctx.quadraticCurveTo(midX, midY, projectTargetX, projectTargetY);
          ctx.stroke();

          // Signal pulse packet running along the curve
          const pulseT = (time * 0.6 + idx * 0.2) % 1;
          const px = (1 - pulseT) * (1 - pulseT) * n.x + 2 * (1 - pulseT) * pulseT * midX + pulseT * pulseT * projectTargetX;
          const py = (1 - pulseT) * (1 - pulseT) * n.y + 2 * (1 - pulseT) * pulseT * midY + pulseT * pulseT * projectTargetY;

          ctx.setLineDash([]);
          ctx.fillStyle = idx % 2 === 0 ? 'rgba(25, 71, 229, 0.85)' : 'rgba(23, 23, 23, 0.7)';
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Connection point small crosshair
          ctx.strokeStyle = 'rgba(25, 71, 229, 0.5)';
          ctx.strokeRect(n.x - 2, n.y - 2, 4, 4);
        });
      }

      // ─── 3. Build Structural Grid Lines (Phase D & E: 0.70 → 1.0) ───
      if (t >= 0.7) {
        const eProgress = Math.min(1, Math.max(0, (t - 0.7) / 0.3));
        const alpha = eProgress * 0.22;

        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(23, 23, 23, ${alpha})`;
        ctx.lineWidth = 1;

        // Horizontal baseline crossing the viewport for the BUILD artifact
        const baselineY = projectTargetY + 65;
        ctx.beginPath();
        ctx.moveTo(0, baselineY);
        ctx.lineTo(w, baselineY);
        ctx.stroke();

        // Technical margin vertical guide
        ctx.beginPath();
        ctx.moveTo(projectTargetX - 24, 0);
        ctx.lineTo(projectTargetX - 24, h);
        ctx.stroke();

        // Secondary guide for live waveform
        const rightGuideX = w * 0.68;
        ctx.strokeStyle = `rgba(25, 71, 229, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.moveTo(rightGuideX, baselineY - 40);
        ctx.lineTo(rightGuideX, h * 0.85);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="signal-network-field"
      aria-hidden="true"
    />
  );
}
