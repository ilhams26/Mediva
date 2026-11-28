import { useEffect, useId } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  hideCloseButton = false,
}) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && closeOnBackdrop && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnBackdrop]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className="fixed inset-0 bg-mediva-text/45 backdrop-blur-[2px] transition-opacity"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-mediva-lg border border-mediva-border-soft bg-mediva-surface shadow-mediva-modal ${sizeClasses[size] || sizeClasses.md}`}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between gap-4 border-b border-mediva-border-soft px-6 py-4">
            <div className="min-w-0">
              {title && (
                <h3 id={titleId} className="text-base font-semibold text-mediva-text">
                  {title}
                </h3>
              )}
              {subtitle && <p className="mt-0.5 text-xs text-mediva-muted">{subtitle}</p>}
            </div>
            {!hideCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup dialog"
                className="rounded-mediva-sm p-1.5 text-mediva-muted transition-colors hover:bg-mediva-page hover:text-mediva-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mediva-primary"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-mediva-border-soft bg-mediva-page/30 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
