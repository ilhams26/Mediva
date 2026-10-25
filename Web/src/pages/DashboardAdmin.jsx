import { useState, useEffect } from 'react';
import { getMedicineCount } from '../services/medicineService';

export default function DashboardAdmin() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      const total = await getMedicineCount();
      setCount(total);
    } catch (error) {
      console.error("Gagal mengambil data obat dari server:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Operasional Mediva</h1>
        <p className="text-slate-500 mt-1">Ringkasan status dan statistik apotek</p>
      </header>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Obat Terdaftar</p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
              {loading ? (
                <span className="text-sm text-slate-400 font-normal">Memuat...</span>
              ) : (
                count
              )}
            </h2>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xl font-bold">
            💊
          </div>
        </div>
      </div>
    </div>
  );
}