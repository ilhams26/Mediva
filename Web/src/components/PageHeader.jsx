import { Icon } from '@iconify/react';
import './PageHeader.css';

export function PageHeader({ title, subtitle, role = 'staf' }) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="page-header">
      <div className="header-left">
        <h1 className="text-page-title">{title}</h1>
        {subtitle && <p className="text-page-subtitle">{subtitle}</p>}
      </div>
      <div className="header-right">
        <span className="header-date">{today}</span>
        <div className="header-user">
          <span className="text-role-label">{role.toUpperCase()}</span>
          <Icon icon="iconamoon:profile-circle-bold" width={42} height={42} style={{ color: 'var(--color-primary)' }} />
        </div>
      </div>
    </div>
  );
}
