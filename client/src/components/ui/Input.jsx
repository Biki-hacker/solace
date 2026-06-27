/**
 * Input — Base design system input component.
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.hint]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.className]
 */
import { clsx } from 'clsx';
import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, icon, className = '', id, ...props },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-pearl/70 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pearl/30">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl',
            'px-4 py-2.5 text-sm text-pearl placeholder-white/30',
            'transition-all duration-[180ms]',
            'focus:outline-none focus:border-lavender-500/50 focus:ring-1 focus:ring-lavender-500/30',
            'hover:border-white/[0.12]',
            icon && 'pl-10',
            error && 'border-rose-mood/50 focus:border-rose-mood/50 focus:ring-rose-mood/30',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-mood" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-pearl/30">{hint}</p>
      )}
    </div>
  );
});

export default Input;
