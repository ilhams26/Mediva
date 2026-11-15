export function Panel({ title, children, className = '' }) {
  return (
    <div className={`rounded-[20px] border-2 border-mediva-border bg-white p-6 shadow-mediva-panel ${className}`}>
      {title && <div className="mb-4 text-base font-semibold text-mediva-text">{title}</div>}
      {children}
    </div>
  );
}
