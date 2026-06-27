/**
 * Toggle — Styled toggle switch (no native checkbox).
 * @param {object} props
 * @param {boolean} props.checked
 * @param {Function} props.onChange
 * @param {string} [props.label]
 * @param {string} [props.description]
 * @param {string} [props.id]
 * @param {string} [props.className]
 */
import { clsx } from 'clsx';

export default function Toggle({
  checked,
  onChange,
  label,
  description,
  id,
  className = '',
}) {
  const toggleId = id || `toggle-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={clsx('flex items-center justify-between gap-4', className)}>
      <div className="flex-1">
        {label && (
          <label htmlFor={toggleId} className="text-sm font-medium text-pearl cursor-pointer">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-pearl/40 mt-0.5">{description}</p>
        )}
      </div>
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 cursor-pointer',
          checked ? 'bg-lavender-500' : 'bg-white/[0.1]'
        )}
      >
        <span
          className={clsx(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-[22px]' : 'translate-x-[2px]',
            'mt-[2px]'
          )}
        />
      </button>
    </div>
  );
}
