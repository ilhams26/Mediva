import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { getStockReport, getSalesReport } from '../services/reportService';
import { exportInventoryToExcel, exportInventoryToPdf } from '../utils/exportUtils';
import { ArrowDownTrayIcon, PrinterIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Laporan() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // State untuk jenis laporan (Staff default ke 'stok', Admin bisa pilih 'stok' atau 'penjualan')
  const [activeTab, setActiveTab] = useState('stok');

  // Filter tanggal (format YYYY-MM-DD untuk input HTML)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Data & loading state
  const [stockData, setStockData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data laporan dari database
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'stok') {
        const res = await getStockReport({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          per_page: 200,
        });
        setStockData(res.items ?? []);
      } else {
        const res = await getSalesReport({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          per_page: 200,
        });
        setSalesData(res.items ?? []);
      }
    } catch (err) {
      console.error('Gagal mengambil data laporan:', err);
      setError('Gagal memuat data dari database. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Kalkulasi total untuk laporan stok
  const stockSummary = useMemo(() => {
    const totalPemasukan = stockData.reduce((acc, row) => acc + (Number(row.pemasukan) || 0), 0);
    const totalPengeluaran = stockData.reduce((acc, row) => acc + (Number(row.pengeluaran) || 0), 0);
    const totalStokAkhir = stockData.reduce((acc, row) => acc + (Number(row.stok_akhir) || 0), 0);
    return {
      pemasukan: totalPemasukan,
      pengeluaran: totalPengeluaran,
      stokAkhir: totalStokAkhir,
    };
  }, [stockData]);

  // Kalkulasi total untuk laporan penjualan (Admin)
  const salesSummary = useMemo(() => {
    const totalPendapatan = salesData.reduce((acc, row) => acc + (Number(row.total_harga) || 0), 0);
    const totalItems = salesData.reduce(
      (acc, row) => acc + (row.items?.reduce((iAcc, item) => iAcc + (Number(item.qty) || 0), 0) || 0),
      0
    );
    return {
      totalPendapatan,
      totalItems,
      totalTransaksi: salesData.length,
    };
  }, [salesData]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Export ke Excel sesuai mockup Image 2
  const handleExportExcel = () => {
    exportInventoryToExcel({
      data: stockData,
      roleName: user?.role || 'staff',
      fileName: `Laporan_Inventori_Obat_${new Date().toISOString().slice(0, 10)}.xlsx`,
    });
  };

  // Cetak ke PDF sesuai mockup Image 1 dengan Logo Mediva
  const handleExportPdf = () => {
    exportInventoryToPdf({
      data: stockData,
      roleName: user?.role === 'admin' ? 'Admin' : 'Staff',
      fileName: `Laporan_Inventori_Obat_${new Date().toISOString().slice(0, 10)}.pdf`,
    });
  };

  // Judul & Subtitle dinamis sesuai role & tab
  const pageTitle = isAdmin
    ? activeTab === 'stok' ? 'Laporan' : 'Laporan Penjualan'
    : 'Laporan Stok';

  const pageSubtitle = activeTab === 'stok'
    ? 'Laporan pergerakan stok'
    : 'Laporan riwayat transaksi dan penjualan obat';

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        role={user?.role || 'staf'}
      />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Kontainer Utama Sesuai Gambar */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 min-h-[550px] flex flex-col justify-between">
        <div>
          {/* Baris Filter & Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            {/* Tab Pilihan untuk Admin (Staf otomatis hanya Stok) */}
            {isAdmin ? (
              <div className="inline-flex rounded-xl bg-slate-100 p-1 self-start">
                <button
                  type="button"
                  onClick={() => setActiveTab('stok')}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                    activeTab === 'stok'
                      ? 'bg-[#1976D2] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Laporan Stok
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('penjualan')}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                    activeTab === 'penjualan'
                      ? 'bg-[#1976D2] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Laporan Penjualan
                </button>
              </div>
            ) : (
              <div></div>
            )}

            {/* Filter Input Tanggal & Tombol Filter */}
            <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-3 self-end">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-[#1976D2] focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-[#1976D2] focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#1976D2] px-6 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1565C0] active:scale-95"
              >
                Filter
              </button>
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
                  title="Reset Filter"
                >
                  Reset
                </button>
              )}
            </form>
          </div>

          {/* TABEL DATA */}
          <div className="overflow-x-auto rounded-xl">
            {activeTab === 'stok' ? (
              /* TABEL LAPORAN STOK (Persis seperti di gambar) */
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-[#1976D2] text-white">
                    <th className="px-5 py-3.5 font-bold rounded-l-lg w-16 text-center">No</th>
                    <th className="px-5 py-3.5 font-bold">Tanggal</th>
                    <th className="px-5 py-3.5 font-bold">Nama Obat</th>
                    <th className="px-5 py-3.5 font-bold text-center">Pemasukan</th>
                    <th className="px-5 py-3.5 font-bold text-center">Pengeluaran</th>
                    <th className="px-5 py-3.5 font-bold rounded-r-lg text-center">Stok Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Memuat data laporan...
                      </td>
                    </tr>
                  ) : stockData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Tidak ada data pergerakan stok pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    stockData.map((row, idx) => (
                      <tr
                        key={row.id || idx}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-center text-slate-600">{idx + 1}</td>
                        <td className="px-5 py-3.5 text-slate-600">{row.tanggal || '-'}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-800">{row.nama_obat || '-'}</td>
                        <td className="px-5 py-3.5 text-center text-slate-600">{row.pemasukan}</td>
                        <td className="px-5 py-3.5 text-center text-slate-600">{row.pengeluaran}</td>
                        <td className="px-5 py-3.5 text-center font-medium text-slate-800">{row.stok_akhir}</td>
                      </tr>
                    ))
                  )}
                </tbody>

                {/* BARIS TOTAL (Biru persis seperti di gambar) */}
                {!loading && stockData.length > 0 && (
                  <tfoot>
                    <tr className="bg-[#1976D2] text-white font-bold">
                      <td colSpan={3} className="px-5 py-3.5 rounded-l-lg text-center uppercase tracking-wider">
                        TOTAL
                      </td>
                      <td className="px-5 py-3.5 text-center">{stockSummary.pemasukan}</td>
                      <td className="px-5 py-3.5 text-center">{stockSummary.pengeluaran}</td>
                      <td className="px-5 py-3.5 rounded-r-lg text-center">{stockSummary.stokAkhir}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            ) : (
              /* TABEL LAPORAN PENJUALAN (Khusus Admin Tab 2) */
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-[#1976D2] text-white">
                    <th className="px-5 py-3.5 font-bold rounded-l-lg w-16 text-center">No</th>
                    <th className="px-5 py-3.5 font-bold">Tanggal</th>
                    <th className="px-5 py-3.5 font-bold">Kode Transaksi</th>
                    <th className="px-5 py-3.5 font-bold">Pelanggan</th>
                    <th className="px-5 py-3.5 font-bold text-center">Metode</th>
                    <th className="px-5 py-3.5 font-bold rounded-r-lg text-right">Total Transaksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Memuat data transaksi...
                      </td>
                    </tr>
                  ) : salesData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Tidak ada data transaksi pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    salesData.map((row, idx) => (
                      <tr
                        key={row.id || idx}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-center text-slate-600">{idx + 1}</td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-700">{row.order_code || `ORD-#${row.id}`}</td>
                        <td className="px-5 py-3.5 text-slate-800">{row.user?.username || 'POS Kasir'}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 uppercase">
                            {row.metode_pembayaran || '-'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium text-slate-900">
                          Rp {Number(row.total_harga || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {/* BARIS TOTAL PENJUALAN */}
                {!loading && salesData.length > 0 && (
                  <tfoot>
                    <tr className="bg-[#1976D2] text-white font-bold">
                      <td colSpan={3} className="px-5 py-3.5 rounded-l-lg text-center uppercase tracking-wider">
                        TOTAL ({salesSummary.totalTransaksi} Transaksi)
                      </td>
                      <td colSpan={2} className="px-5 py-3.5 text-center">
                        -
                      </td>
                      <td className="px-5 py-3.5 rounded-r-lg text-right">
                        Rp {salesSummary.totalPendapatan.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            )}
          </div>
        </div>

        {/* TOMBOL AKSI EXPORT (Di kanan bawah persis sesuai gambar) */}
        <div className="mt-8 flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={handleExportExcel}
            className="rounded-xl bg-[#1976D2] px-7 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1565C0] active:scale-95 flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export Excel
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="rounded-xl bg-[#E53935] px-7 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#D32F2F] active:scale-95 flex items-center gap-2"
          >
            <PrinterIcon className="h-4 w-4" />
            Cetak PDF
          </button>
        </div>
      </div>
    </div>
  );
}
