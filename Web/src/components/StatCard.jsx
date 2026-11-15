import { Icon } from '@iconify/react';
import './StatCard.css';

export function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-chip">
        <Icon icon={icon} width={24} height={24} style={{ color: 'var(--color-primary)' }} />
      </div>
      <div className="stat-content">
        <div className="text-stat-label">{label}</div>
        <div className="stat-value text-stat-value">{value}</div>
      </div>
    </div>
  );
}
