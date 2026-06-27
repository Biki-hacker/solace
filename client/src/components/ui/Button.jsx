/**
 * Button — Base design system button component.
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loading]
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
import { clsx } from 'clsx';
import LoadingPulse from '../../assets/vectors/LoadingPulse';

const variants = {
  primary: 'bg-lavender-500 hover:bg-lavender-600 text-white',
  secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-pearl border border-white/[0.08]',
  ghost: 'bg-transparent hover:bg-white/[0.06] text-pearl',
  danger: 'bg-transparent hover:bg-rose-mood/10 text-rose-mood',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-[180ms]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-lavender-500 focus-visible:outline-offset-2',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingPulse size={32} />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
