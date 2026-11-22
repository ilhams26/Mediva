import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { getObats } from '../services/medicineService';

const columns = [
  { key: 'nama', label: 'Nama Obat' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'harga', label: 'Harga', render: (value) => Number(value ?? 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
  { key: 'stok', label: 'Stok', render: (value) => Number(value ?? 0) },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
];

export default function DataObat() {
  const { user } = useAuth();

  const [obats, setObats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadObats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getObats({ search, per_page: 50 });
      setObats(result.items ?? []);
    } catch (err) {
      console.error('Gagal memuat obat:', err);
      setError('Gagal memuat data obat. Pastikan server backend berjalan.');
      setObats([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadObats();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadObats]);

  return (
    <div className="space-y-6">
      <PageHeader title="Data Obat" subtitle="Daftar obat (read-only untuk admin)" role={user?.role} />

      {error && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Telusuri nama obat" className="min-w-[200px] flex-1" />
      </div>

      <DataTable columns={columns} data={obats} loading={loading} />

      {!loading && obats.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center text-sm text-mediva-muted">
          Tidak ada data obat.
        </div>
      )}
    </div>
  );
}
