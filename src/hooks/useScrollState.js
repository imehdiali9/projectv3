import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useScrollState — tracks which of the 5 states is currently active
 * based on scroll position, and returns interpolated progress within
 * each state (0→1) for smooth transition use.
 *
 * @param {number} totalStates  number of states (default 5)
 * @param {number} chaptersPerState  scroll chapters per state
 */
export function useScrollState(totalStates = 5) {
  const [state, setState] = useState({
    stateIndex: 0,       // 0–4 which state is active
    localProgress: 0,    // 0→1 within current state
    globalProgress: 0,   // 0→1 across entire page
    velocity: 0,         // approximate scroll velocity
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());
  const velocityRef = useRef(0);

  const handleScroll = useCallback(() => {
    const now = performance.now();
    const dt = now - lastTime.current;
    const dy = window.scrollY - lastScrollY.current;
    velocityRef.current = dt > 0 ? dy / dt : 0;
    lastScrollY.current = window.scrollY;
    lastTime.current = now;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const p = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    const rawState = p * totalStates;
    const stateIndex = Math.min(totalStates - 1, Math.floor(rawState));
    const localProgress = rawState - stateIndex;

    setState({
      stateIndex,
      localProgress,
      globalProgress: p,
      velocity: velocityRef.current,
    });
  }, [totalStates]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return state;
}

/**
 * usePointer — tracks normalised pointer position (-0.5 → 0.5)
 * relative to the centre of the viewport.
 */
export function usePointer() {
  const [pointer, setPointer] = useState({ nx: 0, ny: 0, x: 0, y: 0 });
  const smoothRef = useRef({ nx: 0, ny: 0 });
  const rafRef = useRef(null);
  const targetRef = useRef({ nx: 0, ny: 0 });

  useEffect(() => {
    const onMove = (e) => {
      targetRef.current = {
        nx: (e.clientX / window.innerWidth) - 0.5,
        ny: (e.clientY / window.innerHeight) - 0.5,
        x: e.clientX,
        y: e.clientY,
      };
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      smoothRef.current.nx = lerp(smoothRef.current.nx, targetRef.current.nx, 0.07);
      smoothRef.current.ny = lerp(smoothRef.current.ny, targetRef.current.ny, 0.07);
      setPointer({
        nx: smoothRef.current.nx,
        ny: smoothRef.current.ny,
        x: targetRef.current.x,
        y: targetRef.current.y,
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return pointer;
}

/**
 * useIntersection — simple IntersectionObserver hook
 */
export function useIntersection(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
}
