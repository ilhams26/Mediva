import { CalendarDaysIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export function PageHeader({ title, subtitle, role = 'staf' }) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-mediva-text">{title}</h1>
        {subtitle && <p className="mt-1 text-base text-mediva-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-mediva-muted">
          <CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />
          <span>{today}</span>
        </div>
        <div className="rounded-[5px] bg-mediva-chip px-3 py-1 text-xs font-bold uppercase text-mediva-primary">
          {role}
        </div>
        <UserCircleIcon className="h-10 w-10 text-mediva-muted" aria-hidden="true" />
      </div>
    </div>
  );
}
