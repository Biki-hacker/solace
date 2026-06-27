/**
 * Badge — Small status/category indicator.
 * @param {object} props
 * @param {'lavender'|'sage'|'amber'|'rose'|'neutral'} [props.variant='lavender']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 * @param {object} [props.style]
 */
import { clsx } from 'clsx';

const variantStyles = {
  lavender: 'bg-lavender-500/15 text-lavender-300 border-lavender-500/20',
  sage: 'bg-sage-400/15 text-sage-300 border-sage-400/20',
  amber: 'bg-amber-wellness/15 text-amber-wellness border-amber-wellness/20',
  rose: 'bg-rose-mood/15 text-rose-mood border-rose-mood/20',
  neutral: 'bg-white/[0.06] text-pearl/60 border-white/[0.08]',
};

export default function Badge({ variant = 'lavender', className = '', children, style }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
