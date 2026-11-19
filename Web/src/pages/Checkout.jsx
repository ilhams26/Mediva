
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, CreditCard, Banknote, CheckCircle2, AlertCircle, } from "lucide-react";
import api from "../services/api";
import { getCart, getCartTotal, clearCart } from "../services/cartService";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [resepId, setResepId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    const savedCart = getCart();
    setCart(savedCart);

    if (savedCart.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [navigate]);

  const subtotal = getCartTotal(cart);

  const requiresPrescription = cart.some(
    (item) => item.jenis?.toLowerCase() === "keras"
  );

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Keranjang belanja masih kosong.");
      return;
    }

    if (requiresPrescription && !resepId.trim()) {
      setError(
        "Pesanan mengandung obat keras. Masukkan ID resep yang sudah disetujui staf."
      );
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        obat_id: Number(item.obat_id),
        qty: Number(item.qty),
      })),
      metode_pembayaran: paymentMethod,
      ...(requiresPrescription
        ? { resep_id: Number(resepId) }
        : {}),
    };

    try {
      setLoading(true);

      const response = await api.post("/orders", payload);

      const orderData =
        response.data?.data ?? response.data?.order ?? response.data;

      setSuccessOrder(orderData);
      clearCart();
      setCart([]);
    } catch (err) {
      const validationErrors = err.response?.data?.errors;

      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setError(
        firstValidationError ||
          err.response?.data?.message ||
          "Checkout gagal. Silakan periksa kembali pesanan kamu."
      );
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mediva-page p-5">
        <div className="w-full max-w-md rounded-2xl border border-mediva-border bg-white p-8 text-center shadow-mediva-panel">
          <CheckCircle2
            size={64}
            className="mx-auto mb-5 text-green-500"
          />

          <h1 className="text-2xl font-bold text-mediva-text">
            Pesanan Berhasil Dibuat!
          </h1>

          <p className="mt-3 text-sm text-mediva-muted">
            Pesanan kamu berhasil dikirim dan sedang diproses oleh sistem.
          </p>

          <div className="my-6 rounded-xl bg-mediva-chip p-4 text-left">
            <p className="text-xs text-mediva-muted">
              Kode Pesanan
            </p>

            <p className="mt-1 font-bold text-mediva-primary">
              {successOrder.order_code || "-"}
            </p>

            <p className="mt-4 text-xs text-mediva-muted">
              Total Pembayaran
            </p>

            <p className="mt-1 text-lg font-bold text-mediva-text">
              {formatRupiah(
                Number(successOrder.total_harga ?? subtotal)
              )}
            </p>
          </div>

          {paymentMethod === "midtrans" && (
            <p className="mb-4 text-xs text-mediva-muted">
              Pesanan menggunakan Midtrans. Proses pembayaran
              memerlukan integrasi payment gateway lanjutan.
            </p>
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full rounded-xl bg-mediva-accent py-3 font-semibold text-white hover:bg-mediva-primary"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mediva-page p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-7">
          <button
            onClick={() => navigate("/cart")}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-mediva-primary hover:underline"
          >
            <ArrowLeft size={18} />
            Kembali ke Keranjang
          </button>

          <h1 className="text-2xl font-bold text-mediva-text sm:text-3xl">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-mediva-muted">
            Periksa pesanan dan pilih metode pembayaran.
          </p>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">

              {/* Order Review */}
              <section className="rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                <div className="mb-5 flex items-center gap-2">
                  <ShoppingBag
                    size={21}
                    className="text-mediva-primary"
                  />

                  <h2 className="font-bold text-mediva-text">
                    Review Pesanan
                  </h2>
                </div>

                <div className="divide-y divide-mediva-border-soft">
                  {cart.map((item) => (
                    <div
                      key={item.obat_id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-mediva-chip">
                          {item.foto ? (
                            <img
                              src={item.foto}
                              alt={item.nama}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <ShoppingBag
                              size={24}
                              className="text-mediva-accent"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-mediva-text">
                            {item.nama}
                          </h3>

                          <p className="mt-1 text-xs text-mediva-muted">
                            {item.qty} x {formatRupiah(item.harga)}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-mediva-text">
                        {formatRupiah(item.harga * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Prescription */}
              {requiresPrescription && (
                <section className="rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle
                      size={20}
                      className="text-orange-500"
                    />

                    <h2 className="font-bold text-mediva-text">
                      Validasi Resep
                    </h2>
                  </div>

                  <p className="mb-4 text-sm text-mediva-muted">
                    Keranjang mengandung obat keras. Masukkan ID
                    resep yang sebelumnya sudah diunggah dan
                    disetujui oleh staf.
                  </p>

                  <label className="mb-2 block text-sm font-medium text-mediva-text">
                    ID Resep
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={resepId}
                    onChange={(e) => setResepId(e.target.value)}
                    placeholder="Masukkan ID resep"
                    required
                    className="w-full rounded-xl border border-mediva-border px-4 py-3 text-sm outline-none focus:border-mediva-primary focus:ring-2 focus:ring-mediva-primary/10"
                  />

                  <p className="mt-2 text-xs text-mediva-muted">
                    Resep harus berstatus disetujui sebelum checkout.
                  </p>
                </section>
              )}

              {/* Payment Method */}
              <section className="rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                <div className="mb-5 flex items-center gap-2">
                  <CreditCard
                    size={21}
                    className="text-mediva-primary"
                  />

                  <h2 className="font-bold text-mediva-text">
                    Metode Pembayaran
                  </h2>
                </div>

                <div className="space-y-3">

                  {/* Cash */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      paymentMethod === "cash"
                        ? "border-mediva-primary bg-mediva-chip"
                        : "border-mediva-border hover:bg-mediva-page"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="h-4 w-4 accent-mediva-primary"
                    />

                    <Banknote
                      size={26}
                      className="text-mediva-primary"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-mediva-text">
                        Tunai (Cash)
                      </p>

                      <p className="mt-1 text-xs text-mediva-muted">
                        Pembayaran dilakukan saat pengambilan obat di apotek.
                      </p>
                    </div>
                  </label>

                  {/* Midtrans */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      paymentMethod === "midtrans"
                        ? "border-mediva-primary bg-mediva-chip"
                        : "border-mediva-border hover:bg-mediva-page"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="midtrans"
                      checked={paymentMethod === "midtrans"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="h-4 w-4 accent-mediva-primary"
                    />

                    <CreditCard
                      size={26}
                      className="text-mediva-primary"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-mediva-text">
                        Midtrans
                      </p>

                      <p className="mt-1 text-xs text-mediva-muted">
                        Pembayaran online melalui Midtrans Sandbox.
                      </p>
                    </div>
                  </label>

                </div>
              </section>
            </div>

            {/* Summary */}
            <div>
              <section className="sticky top-6 rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                <h2 className="mb-5 text-lg font-bold text-mediva-text">
                  Ringkasan Pembayaran
                </h2>

                <div className="space-y-3 border-b border-mediva-border-soft pb-5 text-sm">
                  <div className="flex justify-between text-mediva-muted">
                    <span>Total Produk</span>
                    <span>
                      {cart.reduce(
                        (sum, item) => sum + item.qty,
                        0
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-mediva-muted">
                    <span>Subtotal</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-5 font-bold text-mediva-text">
                  <span>Total Pembayaran</span>

                  <span className="text-mediva-primary">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full rounded-xl bg-mediva-accent py-3.5 text-sm font-semibold text-white transition hover:bg-mediva-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Memproses..." : "Buat Pesanan"}
                </button>

                <p className="mt-3 text-center text-xs text-mediva-muted">
                  Pastikan seluruh informasi pesanan sudah benar.
                </p>
              </section>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
