
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
} from "../services/cartService";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = getCartTotal(cart);

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.qty),
    0
  );

  const handleQuantity = (id, quantity) => {
    try {
      const updated = updateCartQuantity(id, quantity);
      setCart(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = (id) => {
    setCart(removeFromCart(id));
  };

  return (
    <div className="min-h-screen bg-mediva-page p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/kasir")}
          className="mb-5 flex items-center gap-2 text-sm text-mediva-primary"
        >
          <ArrowLeft size={18} />
          Kembali ke Kasir
        </button>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-mediva-text">
            Keranjang Transaksi
          </h1>

          <p className="mt-1 text-sm text-mediva-muted">
            Periksa obat dan jumlah pembelian pelanggan.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-mediva-border bg-white p-10 text-center">
            <ShoppingCart
              size={42}
              className="mx-auto mb-3 text-mediva-muted"
            />

            <h2 className="font-semibold text-mediva-text">
              Keranjang masih kosong
            </h2>

            <p className="mt-1 text-sm text-mediva-muted">
              Pilih obat terlebih dahulu untuk memulai transaksi.
            </p>

            <button
              onClick={() => navigate("/kasir")}
              className="mt-5 rounded-lg bg-mediva-primary px-5 py-2.5 text-white"
            >
              Pilih Obat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.obat_id}
                  className="rounded-xl border border-mediva-border bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-mediva-text">
                        {item.nama}
                      </h3>

                      <p className="mt-1 text-sm text-mediva-muted">
                        {formatRupiah(item.harga)} / item
                      </p>

                      <p className="text-xs text-mediva-muted">
                        Stok: {item.stok}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleQuantity(
                            item.obat_id,
                            item.qty - 1
                          )
                        }
                        disabled={item.qty <= 1}
                        className="rounded-lg border p-2 disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-6 text-center font-semibold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantity(
                            item.obat_id,
                            item.qty + 1
                          )
                        }
                        disabled={item.qty >= item.stok}
                        className="rounded-lg border p-2 disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() => handleRemove(item.obat_id)}
                        className="ml-2 text-red-500"
                        aria-label={`Hapus ${item.nama}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between border-t pt-3">
                    <span className="text-sm text-mediva-muted">
                      Subtotal
                    </span>

                    <span className="font-semibold text-mediva-primary">
                      {formatRupiah(item.harga * item.qty)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-xl border border-mediva-border bg-white p-5">
              <h2 className="mb-5 font-semibold text-mediva-text">
                Ringkasan Transaksi
              </h2>

              <div className="flex justify-between text-sm">
                <span className="text-mediva-muted">
                  Total item
                </span>

                <span>{totalItems} item</span>
              </div>

              <div className="my-4 border-t" />

              <div className="flex justify-between">
                <span className="font-medium">
                  Total Pembayaran
                </span>

                <span className="font-bold text-mediva-primary">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-lg bg-mediva-primary px-4 py-3 font-semibold text-white"
              >
                Lanjut Pembayaran
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
