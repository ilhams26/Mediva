import { Plus, Minus, Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}) {
  const subtotal = Number(item.harga) * Number(item.qty);

  return (
    <div className="border-b border-[#e7f1fa] pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-[#123665]">
            {item.nama}
          </p>

          <p className="mt-1 text-[11px] text-[#6b87a9]">
            {formatRupiah(item.harga)} / item
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.obat_id)}
          className="text-red-500 hover:text-red-700"
          aria-label={`Hapus ${item.nama}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <QuantitySelector
            quantity={item.qty}
            maxStock={item.stok}
            onChange={(newQuantity) => onQuantityChange(item.obat_id, newQuantity)}
        />
        <span className="text-xs font-semibold text-[#123665]">
          {formatRupiah(subtotal)}
        </span>
      </div>
    </div>
  );
}
