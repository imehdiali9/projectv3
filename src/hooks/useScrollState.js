import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useScrollState — tracks which of the 5 states is currently active
 * based on scroll position, returns interpolated progress within
 * each state (0→1), overall page progress, scroll velocity with natural decay,
 * and dedicated PRESENCE→BUILD transition progress (0→1).
 *
 * @param {number} totalStates  number of states (default 5)
 */
export function useScrollState(totalStates = 5) {
  const [state, setState] = useState({
    stateIndex: 0,                // 0–4 which state is active
    localProgress: 0,             // 0→1 within current state
    globalProgress: 0,            // 0→1 across entire page
    rawState: 0,                  // 0.0 → 5.0 continuous float
    presenceToBuildProgress: 0,   // 0.0 (pure PRESENCE) → 1.0 (locked into BUILD)
    velocity: 0,                  // normalized scroll velocity (-1 → 1) with smooth decay
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(0);
  const lastScrollTime = useRef(0);
  const velocityRef = useRef(0);

  const handleScroll = useCallback(() => {
    const now = performance.now();
    const dt = lastTime.current > 0 ? Math.max(1, now - lastTime.current) : 16;
    const dy = window.scrollY - lastScrollY.current;
    
    // Normalized velocity: ~ -1.0 to 1.0
    const rawV = dy / dt;
    const normV = Math.max(-1.5, Math.min(1.5, rawV / 2.5));
    velocityRef.current = normV;
    lastScrollY.current = window.scrollY;
    lastTime.current = now;
    lastScrollTime.current = now;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const p = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    const rawState = p * totalStates;
    const stateIndex = Math.min(totalStates - 1, Math.floor(rawState));
    const localProgress = rawState - stateIndex;
    const presenceToBuildProgress = Math.min(1, Math.max(0, rawState));

    setState({
      stateIndex,
      localProgress,
      globalProgress: p,
      rawState,
      presenceToBuildProgress,
      velocity: velocityRef.current,
    });
  }, [totalStates]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial

    // Smoothly decay velocity to 0 when user stops scrolling
    let animId;
    const decay = () => {
      const now = performance.now();
      if (now - lastScrollTime.current > 40 && Math.abs(velocityRef.current) > 0.005) {
        velocityRef.current *= 0.88;
        if (Math.abs(velocityRef.current) < 0.005) {
          velocityRef.current = 0;
        }
        setState((prev) => ({
          ...prev,
          velocity: velocityRef.current,
        }));
      }
      animId = requestAnimationFrame(decay);
    };

    animId = requestAnimationFrame(decay);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [handleScroll]);

  return state;
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
