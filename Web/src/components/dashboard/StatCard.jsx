function StatCard({ title, value, icon }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/45 p-6 shadow-[0_20px_50px_rgba(30,80,120,0.12)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(30,80,120,0.18)]">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-300/20 blur-2xl transition-all duration-500 group-hover:bg-sky-300/35" />

      <div className="relative flex items-center gap-5">

        {/* 3D Icon */}
        <div className="relative">

          {/* Shadow bawah icon */}
          <div className="absolute inset-x-2 bottom-0 h-3 rounded-full bg-blue-500/20 blur-md" />

          {/* Icon container */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/70 bg-gradient-to-br from-white/80 via-sky-100/70 to-blue-200/70 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),0_12px_25px_rgba(37,99,235,0.20)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2">

            {/* Highlight */}
            <div className="absolute left-2 top-2 h-3 w-6 rounded-full bg-white/70 blur-[2px]" />

            <div className="relative text-blue-600 drop-shadow-[0_4px_4px_rgba(37,99,235,0.25)]">
              {icon}
            </div>

          </div>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>
        </div>

      </div>

      {/* Bottom highlight */}
      <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

    </div>
  )
}

export default StatCard