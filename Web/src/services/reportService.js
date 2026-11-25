import api from "./api";

/**
 * Mengambil Laporan Pergerakan Stok langsung dari Database via API (untuk Staff)
 * params: { start_date, end_date, obat_id, tipe, per_page }
 */
export const getStockReport = async (params = {}) => {
  const response = await api.get("/stock/movements", { params });
  const body = response.data;

  let rows = [];
  let summary = null;
  let pagination = null;

  if (Array.isArray(body)) {
    rows = body;
  } else if (Array.isArray(body?.data)) {
    rows = body.data;
  } else if (body?.data && Array.isArray(body.data?.data)) {
    rows = body.data.data;
    summary = body.data.summary;
    pagination = body.data.pagination;
  } else if (body?.data && typeof body.data === "object") {
    rows = Object.values(body.data).filter(
      (item) => typeof item === "object" && item !== null && (item.nama_obat || item.obat_id)
    );
  }

  return {
    items: rows,
    summary: summary ?? {
      total_pemasukan: rows.reduce((acc, curr) => acc + (Number(curr.pemasukan) || 0), 0),
      total_pengeluaran: rows.reduce((acc, curr) => acc + (Number(curr.pengeluaran) || 0), 0),
      total_stok_akhir: rows.reduce((acc, curr) => acc + (Number(curr.stok_akhir) || 0), 0),
    },
    pagination,
  };
};

/**
 * Mengambil Laporan Penjualan Obat langsung dari Database (untuk Admin)
 * params: { start_date, end_date, per_page }
 * Menghasilkan: No, Tanggal, Nama Obat, Jumlah, Pemasukan, Stok Real
 */
export const getAdminSalesReport = async (params = {}) => {
  const response = await api.get("/stock/sales-report", { params });
  const body = response.data;

  let rows = [];
  let summary = null;
  let pagination = null;

  if (Array.isArray(body)) {
    rows = body;
  } else if (Array.isArray(body?.data)) {
    rows = body.data;
  } else if (body?.data && Array.isArray(body.data?.data)) {
    rows = body.data.data;
    summary = body.data.summary;
    pagination = body.data.pagination;
  }

  return {
    items: rows,
    summary: summary ?? {
      total_penjualan: rows.reduce((acc, curr) => acc + (Number(curr.pemasukan) || 0), 0),
      total_jumlah: rows.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0),
    },
    pagination,
  };
};
