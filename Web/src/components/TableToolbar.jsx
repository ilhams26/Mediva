export function TableToolbar({ left, right, children, className = '' }) {
  if (children) {
    return (
      <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">{left}</div>
      {right && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{right}</div>}
    </div>
  );
}
