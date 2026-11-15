import { Icon } from '@iconify/react';
import './DataTable.css';

export function DataTable({ columns, data, onEdit, onDelete, loading = false }) {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-table-header">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="text-table-header">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="empty-row">
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key} className="text-table-body">
                    {row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="action-cell">
                    {onEdit && (
                      <button 
                        className="action-btn"
                        onClick={() => onEdit(row)}
                        title="Edit"
                      >
                        <Icon icon="ci:note-edit" width={22} height={22} />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="action-btn"
                        onClick={() => onDelete(row)}
                        title="Hapus"
                      >
                        <Icon icon="basil:trash-solid" width={24} height={24} />
                      </button>
                    )}
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
