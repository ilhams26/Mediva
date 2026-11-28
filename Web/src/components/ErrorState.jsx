import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

export function ErrorState({
  title = 'Gagal memuat data',
  message = 'Terjadi kendala saat menghubungi server. Silakan coba beberapa saat lagi.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-mediva-md bg-mediva-danger-bg text-mediva-danger-text">
        <ExclamationTriangleIcon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-mediva-text">{title}</h3>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-mediva-muted">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}
    </div>
  );
}
