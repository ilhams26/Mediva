import { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { NAV } from '../config/nav';

export function AppShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = NAV[user?.role] || NAV.staf;

  return (
    <div className="min-h-screen bg-mediva-page font-sans">
      <Sidebar />
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-mediva-border/50 bg-white/95 px-4 backdrop-blur lg:hidden">
        <button onClick={() => setMobileMenuOpen(true)} className="text-mediva-text" aria-label="Open menu">
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="text-lg font-bold text-mediva-primary">Mediva</div>
        <UserCircleIcon className="h-8 w-8 text-mediva-muted" aria-hidden="true" />
      </header>
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-mediva-sidebar lg:hidden">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="text-lg font-bold text-mediva-primary">Mediva</div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-mediva-text" aria-label="Close menu">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                const IconComponent = item.icon;
                return (
                  <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold transition-colors ${isActive ? 'bg-mediva-primary text-white' : 'text-mediva-sidebar-text hover:bg-mediva-primary/10'}`}>
                    <IconComponent className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-mediva-border/20 p-4">
              <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="flex w-full items-center gap-3 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold text-mediva-sidebar-text hover:bg-red-50 hover:text-red-600 transition-colors">
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
      <main className="min-w-0 p-6 sm:p-8 lg:pl-[280px] lg:pt-8">
        {children}
      </main>
    </div>
  );
}
