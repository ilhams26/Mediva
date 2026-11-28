export function TableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`skeleton-row-${rowIndex}`} className="border-b border-mediva-border-soft/70 bg-white">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className="px-4 py-4">
              <div
                className={`h-3.5 animate-pulse rounded bg-mediva-border-soft/80 ${
                  colIndex === 0 ? 'w-3/4' : colIndex === columns - 1 ? 'w-1/2' : 'w-2/3'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
