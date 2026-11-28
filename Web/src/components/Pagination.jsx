import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

export function Pagination({
  currentPage = 1,
  lastPage = 1,
  total,
  perPage,
  onPageChange,
}) {
  if (!lastPage || lastPage <= 1) return null;

  const startItem = total ? (currentPage - 1) * (perPage || 15) + 1 : null;
  const endItem = total ? Math.min(currentPage * (perPage || 15), total) : null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-mediva-border-soft pt-4">
      <p className="text-xs text-mediva-muted">
        {total
          ? `Menampilkan ${startItem}–${endItem} dari ${total} data`
          : `Halaman ${currentPage} dari ${lastPage}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          <span>Sebelumnya</span>
        </Button>
        <span className="px-2 text-xs font-semibold text-mediva-text">
          {currentPage} / {lastPage}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
        >
          <span>Berikutnya</span>
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
