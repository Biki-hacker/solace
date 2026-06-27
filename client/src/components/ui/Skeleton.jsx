/**
 * Skeleton — Loading skeleton placeholder.
 * @param {object} props
 * @param {'text'|'circle'|'rect'|'card'} [props.variant='text']
 * @param {string} [props.width]
 * @param {string} [props.height]
 * @param {string} [props.className]
 */
import { clsx } from 'clsx';

export default function Skeleton({ variant = 'text', width, height, className = '' }) {
  const baseClass = 'animate-pulse bg-white/[0.06] rounded';

  const variants = {
    text: clsx(baseClass, 'h-4 rounded-md', className),
    circle: clsx(baseClass, 'rounded-full', className),
    rect: clsx(baseClass, 'rounded-xl', className),
    card: clsx(baseClass, 'rounded-xl h-32', className),
  };

  return (
    <div
      className={variants[variant]}
      style={{
        width: width || (variant === 'text' ? '100%' : variant === 'circle' ? '48px' : '100%'),
        height: height || (variant === 'text' ? '16px' : variant === 'circle' ? '48px' : undefined),
      }}
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonGroup — Renders multiple skeleton lines
 * @param {object} props
 * @param {number} [props.lines=3]
 * @param {string} [props.className]
 */
export function SkeletonGroup({ lines = 3, className = '' }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}
