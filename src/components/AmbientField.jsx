import { useEffect, useRef } from 'react';
import './AmbientField.css';

/**
 * AmbientField — fixed background canvas drawing animated signal bands.
 * Dynamically evolves during PRESENCE → BUILD:
 * - Modulates wave amplitude and frequency with scroll velocity
 * - In destabilization, bands bow toward moving orbital geometry
 * - Transits into dense, technical signal lines as BUILD emerges
 */
export default function AmbientField({
  stateIndex = 0,
  globalProgress = 0,
  presenceToBuildProgress = 0,
  velocity = 0,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    stateIndex,
    globalProgress,
    presenceToBuildProgress,
    velocity,
  });
  const tRef = useRef(0);
  const rafRef = useRef(null);

  // Keep state ref in sync without re-running the animation loop
  useEffect(() => {
    stateRef.current = {
      stateIndex,
      globalProgress,
      presenceToBuildProgress,
      velocity,
    };
  }, [stateIndex, globalProgress, presenceToBuildProgress, velocity]);

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

    function draw() {
      tRef.current += 0.005;
      const t = tRef.current;
      const {
        stateIndex: si,
        globalProgress: gp,
        presenceToBuildProgress: transP,
        velocity: vel,
      } = stateRef.current;

      ctx.clearRect(0, 0, w, h);

      // Scroll velocity adds energetic harmonic ripple
      const vRipple = Math.max(-15, Math.min(15, vel * 12));

      // Number of bands increases as we cross into BUILD
      const bandCount = transP > 0.5 ? 6 : si === 1 ? 6 : si === 2 ? 3 : 4;
      const baseAlpha = si === 4 ? 0.05 : 0.12;

      for (let band = 0; band < bandCount; band++) {
        const yBase = h * (0.16 + band * (0.74 / bandCount));

        // In destabilization (0.15 → 0.65), bands get more agitated
        const transAgitation = transP >= 0.15 && transP <= 0.85
          ? Math.sin(((transP - 0.15) / 0.7) * Math.PI) * 12
          : 0;

        const amp1 = 13 + transAgitation + Math.abs(vRipple) * 0.8;
        const amp2 = 6 + transAgitation * 0.5;
        const speed1 = 1.1 + band * 0.22 + (transP > 0.3 ? 0.5 : 0);
        const speed2 = 0.7 + band * 0.14;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          // Subtle gravitational pull toward center during fracture
          const distToCenter = 1 - Math.abs(x - w * 0.5) / (w * 0.5);
          const centerPull = transAgitation * distToCenter * (band % 2 ? 8 : -8);

          const n =
            Math.sin(x * 0.008 + t * speed1) * amp1 +
            Math.sin(x * 0.019 - t * speed2) * amp2 +
            Math.sin(x * 0.041 + t * 1.9) * 3 +
            centerPull;

          const y = yBase + n;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Color coding
        let color = band % 2 ? '#1947e5' : '#171717';
        if (transP > 0.6) color = band % 3 === 0 ? '#1947e5' : '#171717';
        if (si === 2) color = '#1947e5';
        if (si === 4) color = '#171717';

        const alpha = baseAlpha * (1 - gp * 0.25) * (1 + (transAgitation / 12) * 0.5);
        ctx.strokeStyle = color;
        ctx.globalAlpha = Math.max(0.04, Math.min(0.3, alpha));
        ctx.lineWidth = band === 2 || (transP > 0.5 && band === 4) ? 1.5 : 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-field" aria-hidden="true" />;
}
