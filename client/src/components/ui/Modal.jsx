/**
 * Modal — Overlay modal with backdrop, close button, and keyboard handling.
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} [props.title]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.fullScreen]
 */
import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  fullScreen = false,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={clsx(
          'relative z-10',
          fullScreen
            ? 'w-full h-full'
            : 'glass-card max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto',
          fullScreen ? 'bg-navy-900' : '',
          className
        )}
      >
        {/* Header */}
        {(title || !fullScreen) && (
          <div className={clsx(
            'flex items-center justify-between',
            fullScreen ? 'p-6' : 'p-5 pb-0'
          )}>
            {title && (
              <h2 className="text-lg font-semibold text-pearl">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors ml-auto"
              aria-label="Close modal"
            >
              <X size={20} className="text-pearl/50" />
            </button>
          </div>
        )}

        {fullScreen && !title && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-pearl/50" />
          </button>
        )}

        <div className={fullScreen ? 'h-full' : 'p-5'}>
          {children}
        </div>
      </div>
    </div>
  );
}
