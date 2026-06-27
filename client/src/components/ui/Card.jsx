/**
 * Card — Glass card design system component.
 * @param {object} props
 * @param {boolean} [props.hoverable]
 * @param {boolean} [props.padding]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 * @param {object} [props.style]
 */
import { clsx } from 'clsx';

export default function Card({
  hoverable = true,
  padding = true,
  className = '',
  children,
  style,
  ...props
}) {
  return (
    <div
      className={clsx(
        'glass-card',
        hoverable && 'hover:bg-white/[0.07] transition-all duration-[180ms]',
        padding && 'p-5',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
