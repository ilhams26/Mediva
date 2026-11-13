function StatCard({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-lg text-sky-600">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-xl font-bold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  )
}

export default StatCard