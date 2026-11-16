import { Link, useLocation } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { NAV } from '../config/nav';
import logo from '../assets/logo.png';

export function Sidebar({ onLogoutClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = NAV[user?.role] || NAV.staf;

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      logout();
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-mediva-sidebar lg:flex">
      <div className="flex h-24 items-center justify-center border-b border-mediva-border/20 px-6">
        <img src={logo} alt="Mediva Logo" className="h-12 w-auto max-w-[200px] object-contain" />
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                isActive
                  ? 'bg-mediva-primary text-white shadow-sm'
                  : 'text-mediva-sidebar-text hover:bg-mediva-primary/10'
              }`}
            >
              <IconComponent className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-mediva-border/20 p-4">
        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-3 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold text-mediva-sidebar-text transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
