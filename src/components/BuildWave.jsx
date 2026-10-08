import { useEffect, useRef } from 'react';
import './BuildWave.css';

/**
 * BuildWave — animated waveform canvas inside the BUILD state.
 * Shows a "live build activity" oscilloscope-style trace.
 */
export default function BuildWave() {
  const canvasRef = useRef(null);
  const valueRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    function draw() {
      t += 0.032;
      ctx.clearRect(0, 0, w, h);

      // Main signal
      ctx.beginPath();
      ctx.strokeStyle = '#f3f1eb';
      ctx.lineWidth = 1.4;
      for (let x = 0; x <= w; x += 3) {
        const a = Math.sin(x * 0.031 + t) * 18;
        const b = Math.sin(x * 0.083 - t * 1.3) * 8;
        const c = Math.sin(x * 0.18 + t * 2.1) * 3;
        const y = h / 2 + a + b + c;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Faint echo
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(243,241,235,0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += 5) {
        const a = Math.sin(x * 0.025 + t * 0.7 + 0.5) * 14;
        const b = Math.sin(x * 0.06 - t * 1.1) * 6;
        const y = h / 2 + a + b;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Update value readout
      if (valueRef.current) {
        const val = (68 + Math.sin(t * 0.9) * 12.4).toFixed(1);
        valueRef.current.textContent = `${val}%`;
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="build-wave-wrap" aria-hidden="true">
      <div className="build-wave-head mono">
        <span>BUILD ACTIVITY / LIVE TRACE</span>
        <span ref={valueRef}>78.4%</span>
      </div>
      <canvas ref={canvasRef} className="build-wave-canvas" />
    </div>
  );
}
