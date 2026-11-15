import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function SearchInput({ value, onChange, placeholder = 'Telusuri...' }) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mediva-muted" aria-hidden="true" />
      <input
        type="text"
        className="h-[38px] w-full rounded-[5px] border border-mediva-border-soft bg-white pl-9 pr-3 text-[13px] text-mediva-text placeholder:text-mediva-muted focus:border-mediva-primary focus:outline-none focus:ring-2 focus:ring-mediva-primary/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
