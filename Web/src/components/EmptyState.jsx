import { Icon } from '@iconify/react';
import './EmptyState.css';

export function EmptyState({ message, icon = 'hugeicons:medicine-02' }) {
  return (
    <div className="empty-state">
      <Icon icon={icon} width={48} height={48} style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }} />
      <p className="text-table-body">{message}</p>
    </div>
  );
}
