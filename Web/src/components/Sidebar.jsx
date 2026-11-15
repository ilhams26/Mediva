import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV } from '../config/nav';
import './Sidebar.css';

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = NAV[user?.role] || NAV.staf;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="text-brand">Mediva</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon icon={item.icon} width={20} height={20} />
              <span className="text-sidebar-item">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button className="sidebar-logout" onClick={logout} style={{ opacity: 0.85 }}>
        <Icon icon="fluent:arrow-enter-16-filled" width={20} height={20} />
        <span className="text-sidebar-item">Logout</span>
      </button>
    </aside>
  );
}
