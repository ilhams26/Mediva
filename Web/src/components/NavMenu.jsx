import { Link, useLocation } from 'react-router-dom';

/**
 * Tentukan apakah item navigasi sedang aktif, termasuk untuk sub-route operasional.
 */
function isNavItemActive(pathname, itemTo) {
  if (itemTo === '/') {
    return pathname === '/';
  }

  if (itemTo === '/obat') {
    if (pathname === '/obat/data') return false;
    return pathname === '/obat' || pathname.startsWith('/obat/') || pathname === '/kategori';
  }

  return pathname === itemTo || pathname.startsWith(`${itemTo}/`);
}

export function NavMenu({ items, onItemClick }) {
  const location = useLocation();

  return (
    <nav className="flex-1 space-y-1.5 overflow-y-auto p-4" aria-label="Navigasi utama">
      {items.map((item) => {
        const isActive = isNavItemActive(location.pathname, item.to);
        const IconComponent = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-mediva-md px-4 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mediva-primary ${
              isActive
                ? 'bg-mediva-primary text-white shadow-sm'
                : 'text-mediva-sidebar-text hover:bg-mediva-primary/10'
            }`}
          >
            <IconComponent className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
