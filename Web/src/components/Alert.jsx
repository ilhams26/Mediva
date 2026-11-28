import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const variantStyles = {
  error: {
    container: 'border-red-200 bg-mediva-danger-bg/80 text-mediva-danger-text',
    icon: ExclamationCircleIcon,
  },
  warning: {
    container: 'border-amber-200 bg-mediva-warning-bg/80 text-mediva-warning-text',
    icon: ExclamationTriangleIcon,
  },
  success: {
    container: 'border-emerald-200 bg-mediva-success-bg/80 text-mediva-success-text',
    icon: CheckCircleIcon,
  },
  info: {
    container: 'border-mediva-border-soft bg-mediva-info-bg/70 text-mediva-info-text',
    icon: InformationCircleIcon,
  },
};

export function Alert({
  variant = 'error',
  title,
  children,
  onDismiss,
  className = '',
}) {
  const style = variantStyles[variant] || variantStyles.info;
  const Icon = style.icon;

  return (
    <div
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-mediva-md border px-4 py-3 text-xs sm:text-sm ${style.container} ${className}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-0.5 leading-relaxed' : 'leading-relaxed'}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup pemberitahuan"
          className="rounded-mediva-xs p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
