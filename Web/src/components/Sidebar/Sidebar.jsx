
const menuItems = [
  { label: 'Beranda', icon: '⌂' },
  { label: 'Kelola Obat', icon: '◉' },
  { label: 'Kelola Stok', icon: '↔' },
  { label: 'Laporan', icon: '▣' },
  { label: 'Kasir', icon: '▤' },
  { label: 'Pesanan', icon: '🛒' },
]

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-gradient-to-b from-blue-600 to-blue-700 p-4 text-white shadow-xl">
      {/* Logo */}
      <div className="px-3 py-4">
        <h1 className="text-xl font-bold">
          Mediva
        </h1>

        <p className="text-[9px] text-blue-100">
          Smart Medicine Platform
        </p>
      </div>

      {/* Menu */}
      <nav className="mt-4 flex-1 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
              index === 0
                ? 'bg-white/20 shadow-sm'
                : 'hover:bg-white/10'
            }`}
          >
            <span className="flex w-5 justify-center text-base">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="space-y-3 border-t border-white/20 pt-4">

        <div className="px-3">
          <p className="text-sm font-medium">
            Staff
          </p>

          <p className="text-[10px] text-blue-100">
            Staff - Online
          </p>
        </div>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition hover:bg-white/10">
          <span>↪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar