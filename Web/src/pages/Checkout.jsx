
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Banknote,
  CheckCircle2,
  Receipt,
} from "lucide-react";

import {
  getCart,
  getCartTotal,
  clearCart,
} from "../services/cartService";

import {
  createCashierTransaction,
} from "../services/cashierService";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successTransaction, setSuccessTransaction] =
    useState(null);

  useEffect(() => {
    const savedCart = getCart();
    setCart(savedCart);

    if (savedCart.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [navigate]);

  const total = useMemo(
    () => getCartTotal(cart),
    [cart]
  );

  const received = Number(amountReceived) || 0;
  const change = Math.max(0, received - total);

  const isPaymentEnough =
    received >= total && total > 0;

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const handleAmountChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      setAmountReceived(value);
      setError("");
    }
  };

  const handleQuickAmount = (value) => {
    setAmountReceived(String(value));
    setError("");
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Keranjang transaksi masih kosong.");
      return;
    }

    if (!amountReceived || received <= 0) {
      setError("Masukkan nominal uang yang diterima.");
      return;
    }

    if (received < total) {
      setError(
        "Uang yang diterima belum mencukupi total pembayaran."
      );
      return;
    }

    const invalidItem = cart.some(
      (item) =>
        !item.obat_id ||
        !Number.isInteger(Number(item.qty)) ||
        Number(item.qty) < 1 ||
        Number(item.qty) > Number(item.stok)
    );

    if (invalidItem) {
      setError(
        "Data obat atau jumlah pembelian tidak valid. Periksa kembali keranjang."
      );
      return;
    }

    // Kontrak payload yang perlu disepakati dengan backend.
    const payload = {
      items: cart.map((item) => ({
        obat_id: Number(item.obat_id),
        qty: Number(item.qty),
      })),
      uang_diterima: received,
    };

    try {
      setLoading(true);

      const transactionData =
        await createCashierTransaction(payload);

      setSuccessTransaction({
        ...transactionData,
        total: Number(
          transactionData.total_harga ??
          transactionData.total ??
          total
        ),
        amount_received: Number(
          transactionData.uang_diterima ?? received
        ),
        change: Number(
          transactionData.kembalian ?? change
        ),
      });

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
          "Transaksi gagal disimpan. Periksa koneksi dan endpoint backend."
      );
    } finally {
      setLoading(false);
    }
  };

  if (successTransaction) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mediva-page p-5">
        <div className="w-full max-w-md rounded-2xl border border-mediva-border bg-white p-8 text-center shadow-mediva-panel">
          <CheckCircle2
            size={64}
            className="mx-auto mb-5 text-green-500"
          />

          <h1 className="text-2xl font-bold text-mediva-text">
            Transaksi Berhasil!
          </h1>

          <p className="mt-2 text-sm text-mediva-muted">
            Transaksi pelanggan berhasil disimpan.
          </p>

          <div className="my-6 rounded-xl bg-mediva-chip p-4 text-left">
            <div className="mb-4 flex items-center gap-2">
              <Receipt
                size={20}
                className="text-mediva-primary"
              />

              <p className="font-semibold text-mediva-text">
                Detail Pembayaran
              </p>
            </div>

            <p className="text-xs text-mediva-muted">
              Kode Transaksi
            </p>

            <p className="mt-1 font-bold text-mediva-primary">
              {successTransaction.kode_transaksi ||
                successTransaction.transaction_code ||
                successTransaction.id ||
                "-"}
            </p>

            <div className="my-4 border-t border-mediva-border" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-mediva-muted">
                  Total Pembayaran
                </span>

                <span className="font-semibold">
                  {formatRupiah(successTransaction.total)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-mediva-muted">
                  Uang Diterima
                </span>

                <span>
                  {formatRupiah(
                    successTransaction.amount_received
                  )}
                </span>
              </div>

              <div className="flex justify-between border-t border-mediva-border pt-3">
                <span className="font-semibold text-mediva-text">
                  Uang Kembalian
                </span>

                <span className="font-bold text-green-600">
                  {formatRupiah(successTransaction.change)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/kasir")}
            className="w-full rounded-xl bg-mediva-accent py-3 font-semibold text-white transition hover:bg-mediva-primary"
          >
            Kembali ke Kasir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mediva-page p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-mediva-primary hover:underline"
          >
            <ArrowLeft size={18} />
            Kembali ke Keranjang
          </button>

          <h1 className="text-2xl font-bold text-mediva-text sm:text-3xl">
            Pembayaran Kasir
          </h1>

          <p className="mt-1 text-sm text-mediva-muted">
            Masukkan nominal uang yang diterima dari pelanggan.
          </p>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                <div className="mb-5 flex items-center gap-2">
                  <ShoppingBag
                    size={21}
                    className="text-mediva-primary"
                  />

                  <h2 className="font-bold text-mediva-text">
                    Ringkasan Transaksi
                  </h2>
                </div>

                <div className="divide-y divide-mediva-border-soft">
                  {cart.map((item) => (
                    <div
                      key={item.obat_id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-mediva-text">
                          {item.nama}
                        </h3>

                        <p className="mt-1 text-xs text-mediva-muted">
                          {item.qty} x {formatRupiah(item.harga)}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-mediva-text">
                        {formatRupiah(
                          Number(item.harga) *
                          Number(item.qty)
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                <div className="mb-5 flex items-center gap-2">
                  <Banknote
                    size={22}
                    className="text-mediva-primary"
                  />

                  <h2 className="font-bold text-mediva-text">
                    Pembayaran Tunai
                  </h2>
                </div>

                <label className="mb-2 block text-sm font-medium text-mediva-text">
                  Uang Diterima
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={amountReceived}
                  onChange={handleAmountChange}
                  placeholder="Masukkan nominal uang"
                  className="w-full rounded-xl border border-mediva-border px-4 py-3 text-sm outline-none focus:border-mediva-primary"
                />

                <div className="mt-4">
                  <p className="mb-2 text-xs text-mediva-muted">
                    Nominal cepat
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[50000, 100000, 200000, 500000].map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            handleQuickAmount(value)
                          }
                          className="rounded-lg border border-mediva-border px-3 py-2 text-xs font-medium hover:bg-mediva-chip"
                        >
                          {formatRupiah(value)}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleQuickAmount(total)
                      }
                      className="rounded-lg border border-mediva-primary px-3 py-2 text-xs font-medium text-mediva-primary hover:bg-mediva-chip"
                    >
                      Uang Pas
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-mediva-chip p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-mediva-muted">
                      Uang Diterima
                    </span>

                    <span className="font-medium">
                      {formatRupiah(received)}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between">
                    <span className="font-semibold">
                      Kembalian
                    </span>

                    <span className="text-lg font-bold text-green-600">
                      {formatRupiah(change)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <div>
              <section className="sticky top-6 rounded-2xl border border-mediva-border bg-white p-5 shadow-mediva-panel">
                <h2 className="mb-5 text-lg font-bold text-mediva-text">
                  Ringkasan Pembayaran
                </h2>

                <div className="space-y-3 border-b border-mediva-border-soft pb-5 text-sm">
                  <div className="flex justify-between text-mediva-muted">
                    <span>Total Item</span>
                    <span>{totalItems} item</span>
                  </div>

                  <div className="flex justify-between text-mediva-muted">
                    <span>Metode Pembayaran</span>
                    <span>Tunai</span>
                  </div>
                </div>

                <div className="flex justify-between py-5 font-bold text-mediva-text">
                  <span>Total Pembayaran</span>

                  <span className="text-mediva-primary">
                    {formatRupiah(total)}
                  </span>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isPaymentEnough || loading}
                  className="w-full rounded-xl bg-mediva-primary py-3 font-semibold text-white transition hover:bg-mediva-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Menyimpan Transaksi..."
                    : "Simpan Transaksi"}
                </button>

                <p className="mt-3 text-center text-xs text-mediva-muted">
                  {isPaymentEnough
                    ? "Pembayaran sudah mencukupi."
                    : "Masukkan uang yang mencukupi total pembayaran."}
                </p>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
