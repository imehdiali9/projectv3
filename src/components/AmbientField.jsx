import { useEffect, useRef } from 'react';
import './AmbientField.css';

/**
 * AmbientField — fixed background canvas drawing animated signal bands.
 * The character of the bands changes with scroll state.
 */
export default function AmbientField({ stateIndex = 0, globalProgress = 0 }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ stateIndex, globalProgress });
  const tRef = useRef(0);
  const rafRef = useRef(null);

  // Keep state ref in sync without re-running the animation loop
  useEffect(() => {
    stateRef.current = { stateIndex, globalProgress };
  }, [stateIndex, globalProgress]);

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
      tRef.current += 0.004;
      const t = tRef.current;
      const { stateIndex: si, globalProgress: gp } = stateRef.current;

      ctx.clearRect(0, 0, w, h);

      // State-driven band character
      const bandCount = si === 1 ? 6 : si === 2 ? 3 : 4;
      const baseAlpha = si === 4 ? 0.05 : 0.11;

      for (let band = 0; band < bandCount; band++) {
        const yBase = h * (0.18 + band * (0.72 / bandCount));

        // In BROADCAST state, bands get more energetic
        const amp1 = si === 2 ? 20 : 13;
        const amp2 = si === 2 ? 10 : 6;
        const speed1 = 1.1 + band * 0.22 + (si === 1 ? 0.4 : 0);
        const speed2 = 0.7 + band * 0.14;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const n =
            Math.sin(x * 0.008 + t * speed1) * amp1 +
            Math.sin(x * 0.019 - t * speed2) * amp2 +
            Math.sin(x * 0.041 + t * 1.9) * 3;
          const y = yBase + n;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // PRESENCE: dark and blue alternating
        // BUILD: more blue bands
        // BROADCAST: purely blue
        // EVOLVE: fading
        // REACH: almost gone
        let color = band % 2 ? '#1947e5' : '#171717';
        if (si === 2) color = '#1947e5';
        if (si === 4) color = '#171717';

        const alpha = baseAlpha * (1 - gp * 0.3);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = band === 2 ? 1.5 : 0.8;
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
