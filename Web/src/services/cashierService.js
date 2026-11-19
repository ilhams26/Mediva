
import api from "./api";

// Mengambil daftar obat dari backend
export const getMedicines = async (search = "") => {
  const response = await api.get("/obat", {
    params: { search },
  });

  const result = response.data?.data ?? response.data;

  // Mendukung response berbentuk array atau pagination Laravel
  const medicines = Array.isArray(result)
    ? result
    : result?.data ?? [];

  return medicines.map((item) => ({
    ...item,
    id: item.id ?? item.obat_id,
    nama: item.nama ?? item.name,
    harga: Number(item.harga ?? item.price ?? 0),
    stok: Number(
      item.stok ?? item.stok_total ?? item.stock ?? 0
    ),
  }));
};

// Menyimpan transaksi Kasir
export const createCashierTransaction = async (payload) => {
  const response = await api.post(
    "/cashier/transactions",
    payload
  );

  return (
    response.data?.data ??
    response.data?.transaction ??
    response.data
  );
};

// Mengambil daftar transaksi Kasir
export const getCashierTransactions = async () => {
  const response = await api.get("/cashier/transactions");

  return response.data?.data ?? response.data;
};

// Mengambil detail transaksi
export const getCashierTransactionDetail = async (id) => {
  const response = await api.get(
    `/cashier/transactions/${id}`
  );

  return response.data?.data ?? response.data;
};
