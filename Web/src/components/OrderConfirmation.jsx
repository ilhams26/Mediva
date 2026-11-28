
import { CheckCircle2 } from "lucide-react";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function OrderConfirmation({
  success,
  onClose,
}) {
  if (!success) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123665]/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-xl">
        <CheckCircle2
          size={52}
          className="mx-auto mb-3 text-green-500"
        />

        <h2 className="text-xl font-bold text-[#123665]">
          Transaksi Berhasil!
        </h2>

        <p className="mt-1 text-sm text-[#6482a8]">
          Transaksi berhasil disimpan.
        </p>

        <div className="my-5 space-y-3 rounded-xl bg-[#f1f8ff] p-4 text-left text-sm">
          <div className="flex justify-between gap-3">
            <span>Kode Transaksi</span>
            <strong>{success.code}</strong>
          </div>

          <div className="flex justify-between">
            <span>Total</span>
            <strong>{formatRupiah(success.total)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Uang Diterima</span>
            <strong>{formatRupiah(success.received)}</strong>
          </div>

          <div className="flex justify-between border-t border-[#d8eafa] pt-3">
            <span>Kembalian</span>
            <strong className="text-green-600">
              {formatRupiah(success.change)}
            </strong>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#42a5f5] py-3 text-sm font-semibold text-white hover:bg-[#1976d2]"
        >
          Transaksi Berikutnya
        </button>
      </div>
    </div>
  );
}
