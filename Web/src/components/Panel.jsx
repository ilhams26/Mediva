export function Panel({ title, action, children, className = '' }) {
  return (
    <div className={`rounded-[20px] border-2 border-mediva-border bg-white p-6 shadow-mediva-panel ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && <div className="text-base font-semibold text-mediva-text">{title}</div>}
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
