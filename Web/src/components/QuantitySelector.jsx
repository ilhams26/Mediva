import { Plus, Minus } from "lucide-react";

export default function QuantitySelector({
  quantity,
  maxStock,
  onChange,
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        className="rounded-md border border-[#b9dcf8] p-1 text-[#176bc1] disabled:opacity-40"
        aria-label="Kurangi jumlah"
      >
        <Minus size={12} />
      </button>

      <span className="min-w-5 text-center text-xs font-semibold">
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= maxStock}
        className="rounded-md border border-[#b9dcf8] p-1 text-[#176bc1] disabled:opacity-40"
        aria-label="Tambah jumlah"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
