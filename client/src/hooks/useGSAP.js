/**
 * useGSAP hook — GSAP animation setup and cleanup.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Run a GSAP animation with automatic cleanup
 * @param {Function} animationFn - Function receiving (gsap, scope) and returning a timeline/tween
 * @param {Array} deps - Dependencies for re-running the animation
 */
export const useGSAP = (animationFn, deps = []) => {
  const scope = useRef(null);

  useEffect(() => {
    if (!scope.current) return;

    const ctx = gsap.context(() => {
      animationFn(gsap, scope.current);
    }, scope);

    return () => ctx.revert();
  }, deps);

  return scope;
};
