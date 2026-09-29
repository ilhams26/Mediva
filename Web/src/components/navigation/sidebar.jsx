function Sidebar() {
  return (
    <aside
      className="
        fixed left-0 top-0
        h-screen w-64
        overflow-hidden
        rounded-r-3xl
        p-5
        text-white
        shadow-xl
        bg-[radial-gradient(circle_at_30%_0%,#8acddd_0%,transparent_45%),linear-gradient(180deg,#73c1d3_0%,#4faabd_45%,#3592a8_100%)]
      "
    >
      <div className="relative">
        <div className="flex items-center gap-3">
  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
    💊
  </div>

  <div>
    <h1 className="text-2xl font-bold tracking-wide">
      Mediva
    </h1>

    <p className="text-sm text-white/75">
      Pharmacy System
    </p>
  </div>
</div>
      </div>
    </aside>
  )
}

export default Sidebar