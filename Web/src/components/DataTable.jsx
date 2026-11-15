import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export function DataTable({ columns, data, onEdit, onDelete, loading = false }) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-mediva-primary">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-bold text-white first:rounded-tl-[8px] last:rounded-tr-[8px]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-xs text-mediva-muted">
                Loading...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead className="bg-mediva-primary">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-bold text-white first:rounded-tl-[8px] last:rounded-tr-[8px]">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-3 text-left text-xs font-bold text-white last:rounded-tr-[8px]">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="py-8 text-center text-xs text-mediva-muted">
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="border-b border-mediva-border/30 hover:bg-mediva-page/50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4 text-xs text-mediva-muted">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button 
                          className="text-mediva-muted transition-colors hover:text-mediva-primary"
                          onClick={() => onEdit(row)}
                          title="Edit"
                          aria-label="Edit"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className="text-mediva-muted transition-colors hover:text-red-600"
                          onClick={() => onDelete(row)}
                          title="Hapus"
                          aria-label="Hapus"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
