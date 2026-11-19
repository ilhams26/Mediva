
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, } from "lucide-react";
import { getCart, updateCartQuantity, removeFromCart, getCartTotal, } from "../services/cartService";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/PageHeader";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = getCartTotal(cart);

  const handleQuantity = (id, quantity) => {
    const updated = updateCartQuantity(id, quantity);
    setCart(updated);
  };

  const handleRemove = (id) => {
    const updated = removeFromCart(id);
    setCart(updated);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kasir Offline"
        subtitle="Periksa kembali obat yang dibeli."
        role={user?.role}
      />
      <div className="mx-auto max-w-6xl">

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-mediva-border bg-white px-5 py-16 text-center shadow-mediva-panel">
            <ShoppingBag
              size={60}
              className="mx-auto mb-4 text-mediva-accent"
            />

            <h2 className="text-lg font-bold text-mediva-text">
              Keranjang Masih Kosong
            </h2>

            <p className="mt-2 text-sm text-mediva-muted">
              Belum ada obat yang ditambahkan ke keranjang.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-xl bg-mediva-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-mediva-primary"
            >
              Kembali ke Katalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Product List */}
            <div className="space-y-4 lg:col-span-2">

              <div className="rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                <div className="mb-5 flex items-center gap-2">
                  <ShoppingCart
                    size={21}
                    className="text-mediva-primary"
                  />

                  <h2 className="font-bold text-mediva-text">
                    Daftar Obat ({cart.length})
                  </h2>
                </div>

                <div className="divide-y divide-mediva-border-soft">
                  {cart.map((item) => (
                    <div
                      key={item.obat_id}
                      className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                    >
                      {/* Product Image */}
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-mediva-chip">
                        {item.foto ? (
                          <img
                            src={item.foto}
                            alt={item.nama}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ShoppingBag
                            size={30}
                            className="text-mediva-accent"
                          />
                        )}
                      </div>

                      {/* Product Information */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-mediva-text">
                          {item.nama}
                        </h3>

                        <p className="mt-1 text-xs capitalize text-mediva-muted">
                          {item.jenis}
                        </p>

                        <p className="mt-2 font-semibold text-green-600">
                          {formatRupiah(item.harga)}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <div className="flex items-center rounded-lg border border-mediva-border">
                          <button
                            onClick={() =>
                              handleQuantity(
                                item.obat_id,
                                item.qty - 1
                              )
                            }
                            disabled={item.qty <= 1}
                            className="p-2 text-mediva-primary disabled:opacity-30"
                            aria-label="Kurangi jumlah"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-8 text-center text-sm font-semibold text-mediva-text">
                            {item.qty}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantity(
                                item.obat_id,
                                item.qty + 1
                              )
                            }
                            className="p-2 text-mediva-primary"
                            aria-label="Tambah jumlah"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.obat_id)}
                          className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={15} />
                          Hapus
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right sm:w-32">
                        <p className="text-xs text-mediva-muted">
                          Subtotal
                        </p>

                        <p className="mt-1 font-bold text-mediva-text">
                          {formatRupiah(item.harga * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-6 rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                <h2 className="mb-5 text-lg font-bold text-mediva-text">
                  Ringkasan Belanja
                </h2>

                <div className="space-y-3 border-b border-mediva-border-soft pb-5 text-sm">
                  <div className="flex justify-between text-mediva-muted">
                    <span>Total Produk</span>
                    <span>
                      {cart.reduce((sum, item) => sum + item.qty, 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-mediva-muted">
                    <span>Subtotal</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-5 font-bold text-mediva-text">
                  <span>Total</span>
                  <span className="text-mediva-primary">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full rounded-xl bg-mediva-accent py-3.5 text-sm font-semibold text-white transition hover:bg-mediva-primary"
                >
                  Lanjut ke Checkout
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="mt-3 w-full rounded-xl border border-mediva-border py-3 text-sm font-semibold text-mediva-primary transition hover:bg-mediva-chip"
                >
                  Lanjut Belanja
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
