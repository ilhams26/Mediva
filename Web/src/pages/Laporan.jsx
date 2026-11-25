import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { getStockReport, getAdminSalesReport } from '../services/reportService';
import { exportInventoryToExcel, exportInventoryToPdf } from '../utils/exportUtils';
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';

export default function Laporan() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Filter tanggal (format YYYY-MM-DD)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Data & loading state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data dari database
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (isAdmin) {
        // Role Admin: Laporan Penjualan Obat (No, Tanggal, Nama Obat, Jumlah, Pemasukan, Stok Real)
        const res = await getAdminSalesReport({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          per_page: 200,
        });
        setData(res.items ?? []);
      } else {
        // Role Staff: Laporan Stok / Pergerakan Stok (No, Tanggal, Nama Obat, Pemasukan, Pengeluaran, Stok Akhir)
        const res = await getStockReport({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          per_page: 200,
        });
        setData(res.items ?? []);
      }
    } catch (err) {
      console.error('Gagal mengambil data laporan:', err);
      setError('Gagal memuat data dari database. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Kalkulasi total untuk Staff
  const staffSummary = useMemo(() => {
    if (isAdmin) return { pemasukan: 0, pengeluaran: 0, stokAkhir: 0 };
    return {
      pemasukan: data.reduce((acc, row) => acc + (Number(row.pemasukan) || 0), 0),
      pengeluaran: data.reduce((acc, row) => acc + (Number(row.pengeluaran) || 0), 0),
      stokAkhir: data.reduce((acc, row) => acc + (Number(row.stok_akhir) || 0), 0),
    };
  }, [isAdmin, data]);

  // Kalkulasi total untuk Admin
  const adminSummary = useMemo(() => {
    if (!isAdmin) return { totalPenjualan: 0, totalJumlah: 0 };
    return {
      totalPenjualan: data.reduce((acc, row) => acc + (Number(row.pemasukan) || 0), 0),
      totalJumlah: data.reduce((acc, row) => acc + (Number(row.jumlah) || 0), 0),
    };
  }, [isAdmin, data]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Export ke Excel
  const handleExportExcel = () => {
    exportInventoryToExcel({
      data,
      roleName: user?.role || 'staff',
      fileName: isAdmin
        ? `Laporan_Penjualan_Admin_${new Date().toISOString().slice(0, 10)}.xlsx`
        : `Laporan_Stok_Staff_${new Date().toISOString().slice(0, 10)}.xlsx`,
    });
  };

  // Cetak ke PDF
  const handleExportPdf = () => {
    exportInventoryToPdf({
      data,
      roleName: isAdmin ? 'Admin' : 'Staff',
      fileName: isAdmin
        ? `Laporan_Penjualan_Admin_${new Date().toISOString().slice(0, 10)}.pdf`
        : `Laporan_Stok_Staff_${new Date().toISOString().slice(0, 10)}.pdf`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <PageHeader
        title={isAdmin ? 'Laporan' : 'Laporan Stok'}
        subtitle="Laporan pergerakan stok"
        role={user?.role || 'staf'}
      />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Kontainer Utama */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 min-h-[550px] flex flex-col justify-between">
        <div>
          {/* Baris Filter Tanggal di kanan atas */}
          <div className="flex justify-end mb-6">
            <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-[#1976D2] focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            {isAdmin ? (
              /* TABEL LAPORAN ADMIN (Persis sesuai gambar: No, Tanggal, Nama Obat, Jumlah, Pemasukan, Stok Real) */
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-[#1976D2] text-white">
                    <th className="px-5 py-3.5 font-bold rounded-l-lg w-16 text-center">No</th>
                    <th className="px-5 py-3.5 font-bold text-center">Tanggal</th>
                    <th className="px-5 py-3.5 font-bold text-center">Nama Obat</th>
                    <th className="px-5 py-3.5 font-bold text-center">Jumlah</th>
                    <th className="px-5 py-3.5 font-bold text-center">Pemasukan</th>
                    <th className="px-5 py-3.5 font-bold rounded-r-lg text-center">Stok Real</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Memuat data laporan penjualan...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Tidak ada data penjualan pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    data.map((row, idx) => (
                      <tr
                        key={row.id || idx}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-center text-slate-600">{idx + 1}</td>
                        <td className="px-5 py-3.5 text-center text-slate-700">{row.tanggal || '-'}</td>
                        <td className="px-5 py-3.5 text-center font-medium text-slate-800">{row.nama_obat || '-'}</td>
                        <td className="px-5 py-3.5 text-center text-slate-700">{row.jumlah}</td>
                        <td className="px-5 py-3.5 text-center font-semibold text-emerald-600">
                          {Number(row.pemasukan || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="px-5 py-3.5 text-center font-medium text-slate-800">{row.stok_real}</td>
                      </tr>
                    ))
                  )}
                </tbody>

                {/* BARIS TOTAL PENJUALAN (Persis seperti di gambar baru) */}
                {!loading && data.length > 0 && (
                  <tfoot>
                    <tr className="bg-[#DCEBFD] text-slate-900 border-t border-blue-200">
                      <td colSpan={5} className="px-5 py-3.5 rounded-l-lg text-center font-bold tracking-wider">
                        TOTAL PENJUALAN
                      </td>
                      <td className="px-5 py-3.5 rounded-r-lg text-center font-bold text-emerald-600 text-sm border-l border-blue-300">
                        {adminSummary.totalPenjualan.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            ) : (
              /* TABEL LAPORAN STAFF (Persis sesuai gambar 1: No, Tanggal, Nama Obat, Pemasukan, Pengeluaran, Stok Akhir) */
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
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Tidak ada data pergerakan stok pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    data.map((row, idx) => (
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

                {/* BARIS TOTAL (Biru persis seperti di gambar 1) */}
                {!loading && data.length > 0 && (
                  <tfoot>
                    <tr className="bg-[#1976D2] text-white font-bold">
                      <td colSpan={3} className="px-5 py-3.5 rounded-l-lg text-center uppercase tracking-wider">
                        TOTAL
                      </td>
                      <td className="px-5 py-3.5 text-center">{staffSummary.pemasukan}</td>
                      <td className="px-5 py-3.5 text-center">{staffSummary.pengeluaran}</td>
                      <td className="px-5 py-3.5 rounded-r-lg text-center">{staffSummary.stokAkhir}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            )}
          </div>
        </div>

        {/* TOMBOL AKSI EXPORT */}
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
