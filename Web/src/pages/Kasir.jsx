import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/PageHeader";
import api from "../services/api";

import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
  clearCart,
} from "../services/cartService";

import {
  createCashierTransaction,
  buildCashierPayload,
} from "../services/cashierService";

import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import OrderConfirmation from "../components/OrderConfirmation";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const normalizeMedicine = (item) => ({
  ...item,
  id: item.id ?? item.obat_id,
  nama: item.nama ?? item.name ?? "Obat tanpa nama",
  harga: Number(item.harga ?? item.price ?? 0),
  stok: Number(
    item.stok ?? item.stok_total ?? item.stock ?? 0
  ),
  jenis:
    item.jenis ??
    item.kategori ??
    item.category ??
    "Obat",
  foto: item.foto ?? item.image ?? null,
});

export default function Kasir() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState(() => getCart());

  const [search, setSearch] = useState("");
  const [amountReceived, setAmountReceived] = useState("");

  const [loadingMedicines, setLoadingMedicines] =
    useState(true);

  const [loadingPayment, setLoadingPayment] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // Mengambil data obat dari backend
  useEffect(() => {
    let active = true;

    const loadMedicines = async () => {
      try {
        setLoadingMedicines(true);

        const response = await api.get("/obat", {
          params: { search },
        });

        const raw = response.data?.data ?? response.data;

        const rows = Array.isArray(raw)
          ? raw
          : raw?.data ?? [];

        if (active) {
          setMedicines(rows.map(normalizeMedicine));
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Katalog obat belum dapat dimuat. Pastikan endpoint daftar obat tersedia."
          );
        }
      } finally {
        if (active) {
          setLoadingMedicines(false);
        }
      }
    };

    loadMedicines();

    return () => {
      active = false;
    };
  }, [search]);

  // Pencarian obat
  const filteredMedicines = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return medicines;

    return medicines.filter((medicine) =>
      medicine.nama.toLowerCase().includes(keyword)
    );
  }, [medicines, search]);

  // Perhitungan transaksi
  const total = useMemo(
    () => getCartTotal(cart),
    [cart]
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const received = Number(amountReceived) || 0;

  const change = Math.max(0, received - total);

  const paymentEnough =
    total > 0 && received >= total;

  const refreshCart = () => {
    setCart(getCart());
  };

  // Menambahkan obat ke keranjang
  const handleAddMedicine = (medicine) => {
    setError("");

    try {
      if (!medicine.id) {
        throw new Error("ID obat tidak ditemukan.");
      }

      if (medicine.stok < 1) {
        throw new Error("Stok obat sedang kosong.");
      }

      addToCart(medicine, 1);

      refreshCart();
    } catch (err) {
      setError(
        err.message ||
          "Obat gagal ditambahkan ke keranjang."
      );
    }
  };

  // Mengubah jumlah obat
  const handleQuantity = (id, qty) => {
    const item = cart.find(
      (row) => String(row.obat_id) === String(id)
    );

    if (!item || qty < 1) return;

    if (qty > Number(item.stok)) {
      setError(
        "Jumlah obat melebihi stok yang tersedia."
      );
      return;
    }

    updateCartQuantity(id, qty);

    refreshCart();
    setError("");
  };

  // Menghapus obat dari keranjang
  const handleRemove = (id) => {
    removeFromCart(id);

    refreshCart();
  };

  // Proses pembayaran
  const handlePayment = async (event) => {
    event.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError(
        "Keranjang masih kosong. Pilih obat terlebih dahulu."
      );
      return;
    }

    if (!amountReceived || received <= 0) {
      setError(
        "Masukkan nominal uang yang diterima."
      );
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
        Number(item.qty) < 1 ||
        Number(item.qty) > Number(item.stok)
    );

    if (invalidItem) {
      setError(
        "Periksa kembali jumlah dan stok obat di keranjang."
      );
      return;
    }

    try {
      setLoadingPayment(true);

      const payload = buildCashierPayload(cart, received);

      const data = await createCashierTransaction(payload);

      setSuccess({
        code:
          data?.order_code ??
          data?.transaction_code ??
          data?.kode_transaksi ??
          data?.id ??
          "-",

          total: Number(
            data?.total_harga ?? data?.total ?? total
          ),

          received: Number(data?.uang_diterima ?? received),

          change: Number(
            data?.kembalian ?? data?.change ?? change
          ),
      });

      clearCart();

      setCart([]);
      setAmountReceived("");
    } catch (err) {
      const validationErrors =
        err.response?.data?.errors;

      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setError(
        firstValidationError ||
          err.response?.data?.message ||
          "Transaksi gagal disimpan. Periksa kembali koneksi dan endpoint kasir."
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full text-mediva-text">
      <PageHeader
        title="Kasir Offline"
        subtitle="Penjualan langsung di Apotik"
        role={user?.role}
      />

      {/* PESAN ERROR */}
      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span className="flex-1">{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Tutup pesan"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_348px]">

        {/* KATALOG OBAT */}
        <section className="min-h-[643px] rounded-[22px] border-2 border-[#66baff] bg-white p-5 sm:p-[21px]">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

            <h2 className="text-lg font-semibold text-[#123665]">
              Katalog Obat
            </h2>

            {/* PENCARIAN */}
            <div className="relative w-full sm:w-40">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6793c4]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Cari nama obat..."
                className="h-9 w-full rounded-xl border border-[#66baff] bg-white pl-8 pr-3 text-[11px] text-[#123665] outline-none placeholder:text-[#7b9bc2] focus:ring-2 focus:ring-[#66baff]/30"
              />
            </div>
          </div>

          {/* DAFTAR OBAT */}
          {loadingMedicines ? (
            <div className="py-16 text-center text-sm text-[#6482a8]">
              Memuat katalog obat...
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6482a8]">
              {medicines.length === 0
                ? "Belum ada data obat yang dapat ditampilkan."
                : "Obat tidak ditemukan."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">

              {filteredMedicines.map((medicine) => (
                <button
                  type="button"
                  key={medicine.id}
                  onClick={() =>
                    handleAddMedicine(medicine)
                  }
                  disabled={medicine.stok < 1}
                  className="group min-h-[139px] rounded-[15px] border border-[#66baff] bg-white p-[15px] text-left transition hover:border-[#238fe8] hover:bg-[#f7fbff] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {medicine.foto ? (
                    <img
                      src={medicine.foto}
                      alt={medicine.nama}
                      className="mb-3 h-9 w-9 rounded-[10px] object-cover"
                    />
                  ) : (
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#e4f3ff] text-[#238fe8]">
                      <Plus size={19} />
                    </span>
                  )}

                  <span className="block truncate text-[13px] font-semibold text-[#123665]">
                    {medicine.nama}
                  </span>

                  <span className="mt-1 block text-[13px] font-medium text-[#25ad4b]">
                    {formatRupiah(medicine.harga)}
                  </span>

                  <span className="mt-1 block text-[10px] text-[#7893b4]">
                    Stok: {medicine.stok}
                  </span>
                </button>
              ))}

            </div>
          )}
        </section>

        {/* KERANJANG DAN PEMBAYARAN */}
        <form
          onSubmit={handlePayment}
          className="flex min-h-[643px] flex-col rounded-[22px] border-2 border-[#66baff] bg-white p-5"
        >

          <h2 className="mb-4 text-base font-semibold text-[#123665]">
            Keranjang
          </h2>

          {/* DAFTAR ITEM KERANJANG */}
          <div className="min-h-[280px] flex-1 space-y-3 overflow-y-auto pr-1">

            {cart.length === 0 ? (
              <div className="flex min-h-[270px] items-center justify-center text-xs text-[#6482a8]">
                Keranjang Kosong
              </div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.obat_id}
                  item={item}
                  onQuantityChange={handleQuantity}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>

          <CartSummary
            cart={cart}
            total={total}
            received={received}
            onReceivedChange={setAmountReceived}
            onPayment={handlePayment}
            isProcessing={loadingPayment}
            isPaymentValid={paymentEnough}
          />
        </form>
      </div>

      <OrderConfirmation success={success} onClose={() => setSuccess(null)}/> 

    </div>
  );
}
