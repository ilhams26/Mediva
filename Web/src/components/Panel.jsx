import './Panel.css';

export function Panel({ title, children, className = '' }) {
  return (
    <div className={`panel ${className}`}>
      {title && <div className="panel-title text-panel-title">{title}</div>}
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
}
