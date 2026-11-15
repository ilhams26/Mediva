import './StatusBadge.css';

const statusConfig = {
  'Aman': { bg: 'var(--color-success-bg)', text: 'var(--color-success-text)' },
  'Menipis': { bg: 'var(--color-warning-bg)', text: 'var(--color-warning-text)' },
  'Habis': { bg: 'var(--color-danger-bg)', text: 'var(--color-danger-text)' },
  'Kedaluwarsa': { bg: 'var(--color-danger-bg)', text: 'var(--color-danger-text)' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || { bg: 'var(--color-success-bg)', text: 'var(--color-success-text)' };
  
  return (
    <span 
      className="status-badge text-badge"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {status}
    </span>
  );
}
