export function StatCard({ label, value, icon: IconComponent }) {
  return (
    <div 
      className="flex flex-col gap-3 rounded-[16px] border-2 border-mediva-border bg-white p-6 shadow-mediva-stat"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-mediva-chip">
        <IconComponent className="h-6 w-6 text-mediva-primary" aria-hidden="true" />
      </div>
      <div>
        <div className="mt-1 text-xs text-mediva-muted">{label}</div>
        <div className="text-[22px] font-bold text-mediva-text">{value}</div>
      </div>
    </div>
  );
}
