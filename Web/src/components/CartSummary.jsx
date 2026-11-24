const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function CartSummary({
  cart,
  total,
  received,
  onReceivedChange,
  onPayment,
  isProcessing = false,
}) {
  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const change = Number(received || 0) - Number(total || 0);
  const isPaymentValid = Number(received || 0) >= Number(total || 0);

  return (
    <div className="space-y-4 border-t border-[#e7f1fa] pt-4">
      {/* Jumlah item */}
      <div className="flex justify-between text-xs text-[#6482a8]">
        <span>Total Item</span>
        <span className="font-semibold text-[#123665]">
          {totalItems} item
        </span>
      </div>

      {/* Total pembayaran */}
      <div className="flex justify-between">
        <span className="text-sm font-semibold text-[#123665]">
          Total Pembayaran
        </span>
        <span className="text-sm font-bold text-[#123665]">
          {formatRupiah(total)}
        </span>
      </div>

      {/* Uang diterima */}
      <div>
        <label
          htmlFor="cash-received"
          className="mb-2 block text-xs font-medium text-[#6482a8]"
        >
          Uang Diterima
        </label>

        <input
          id="cash-received"
          type="number"
          min="0"
          value={received}
          onChange={(e) => onReceivedChange(e.target.value)}
          placeholder="Masukkan nominal uang"
          className="w-full rounded-lg border border-[#b9dcf8] px-3 py-2.5 text-sm outline-none focus:border-[#42a5f5]"
        />
      </div>

      {/* Kembalian */}
      <div className="flex justify-between rounded-lg bg-[#edf7ff] p-3">
        <span className="text-xs font-medium text-[#6482a8]">
          Kembalian
        </span>
        <span className="text-sm font-bold text-[#176bc1]">
          {formatRupiah(Math.max(0, change))}
        </span>
      </div>

      {/* Tombol pembayaran */}
      <button
        type="submit"
        disabled={
          cart.length === 0 ||
          !isPaymentValid ||
          isProcessing
        }
        className="w-full rounded-lg bg-[#176bc1] py-3 text-sm font-semibold text-white transition hover:bg-[#123665] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? "Memproses..." : "Selesaikan Pembayaran"}
      </button>
    </div>
  );
}
