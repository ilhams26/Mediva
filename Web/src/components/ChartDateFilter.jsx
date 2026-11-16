import { useState } from 'react';
import {
  CalendarDaysIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export function ChartDateFilter({ onFilter, onReset }) {
  const formatDateString = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = new Date();
  const defaultEndDate = formatDateString(today);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  const defaultStartDate = formatDateString(sevenDaysAgo);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleApplyFilter = () => {
    setIsFiltered(true);
    if (onFilter) {
      onFilter(startDate, endDate);
    }
  };

  const handleReset = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setIsFiltered(false);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Input Dari */}
      <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/50 px-2.5 py-1 text-xs shadow-sm focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
        <CalendarDaysIcon className="h-3.5 w-3.5 text-blue-500 shrink-0" />
        <span className="text-[11px] font-semibold text-slate-500">Dari:</span>
        <input
          type="date"
          value={startDate}
          max={endDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-transparent text-xs font-semibold text-slate-700 outline-none"
        />
      </div>

      <span className="text-xs font-semibold text-slate-400">—</span>

      {/* Input Sampai */}
      <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/50 px-2.5 py-1 text-xs shadow-sm focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
        <CalendarDaysIcon className="h-3.5 w-3.5 text-blue-500 shrink-0" />
        <span className="text-[11px] font-semibold text-slate-500">Sampai:</span>
        <input
          type="date"
          value={endDate}
          min={startDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-transparent text-xs font-semibold text-slate-700 outline-none"
        />
      </div>

      {/* Filter Button */}
      <button
        type="button"
        onClick={handleApplyFilter}
        className="flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
      >
        <FunnelIcon className="h-3.5 w-3.5" />
        <span>Filter</span>
      </button>

      {/* Reset Button (Muncul jika sudah klik filter) */}
      {isFiltered && (
        <button
          type="button"
          onClick={handleReset}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          title="Reset ke rentang default"
        >
          <ArrowPathIcon className="h-3.5 w-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
