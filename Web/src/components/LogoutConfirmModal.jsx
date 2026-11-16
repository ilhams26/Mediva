import { ArrowRightOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function LogoutConfirmModal({ isOpen, onClose, onConfirm, loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-inner">
            <ArrowRightOnRectangleIcon className="h-7 w-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Konfirmasi Logout
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Apakah Anda yakin ingin keluar dari sistem Mediva? Sesi aktif Anda akan diakhiri.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-500/20 hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? 'Keluar...' : 'Ya, Keluar'}
          </button>
        </div>
      </div>
    </div>
  );
}
