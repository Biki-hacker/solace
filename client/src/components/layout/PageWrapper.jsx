/**
 * PageWrapper — Consistent page padding and entrance transitions.
 * @param {object} props
 * @param {string} [props.title] - Page title for the header
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.narrow] - Narrow content width (max-w-4xl)
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageWrapper({ title, children, className = '', narrow = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: 24,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ${narrow ? 'max-w-4xl mx-auto' : ''} ${className}`}
    >
      {title && (
        <h1 className="text-2xl sm:text-3xl font-bold text-pearl mb-6 tracking-tight">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
