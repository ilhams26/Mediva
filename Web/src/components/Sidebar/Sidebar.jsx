import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Pill, FileText, LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';

const menuItems = [
  { label: 'Beranda', icon: Home, path: '/dashboard' },
  { label: 'Kelola Pengguna', icon: Users, path: '/kelola-pengguna' },
  { label: 'Data Obat', icon: Pill, path: '/data-obat' },
  { label: 'Laporan', icon: FileText, path: '/laporan' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-[#DCEEFF] p-4 text-[#164477] shadow-sm">
      
      <div className="px-3 py-4">
        <img
          src={logo}
          alt="Mediva Logo"
          className="h-auto w-54 object-contain"
  />
      </div>

      {/* Menu */}
      <nav className="mt-4 flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname === '/');
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
             className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                isActive
                  ? 'bg-[#1565C0] text-white shadow-sm'
                  : 'text-[#164477] hover:bg-[#1565C0] hover:text-white'
              }`}
            >
              <span className="flex w-5 justify-center">
                <Icon size={18} />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="space-y-3 border-t border-white/20 pt-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition hover:bg-white/10"
        >
          <span className="flex w-5 justify-center">
            <LogOut size={18} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
