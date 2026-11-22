import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { getBatches } from '../services/batchService';

const columns = [
  { key: 'batch_number', label: 'Batch' },
  { key: 'obat', label: 'Obat', render: (value) => (typeof value === 'object' ? value?.nama : value) },
  { key: 'expired_date', label: 'Tanggal Kedaluwarsa' },
  { key: 'jumlah_awal', label: 'Jumlah Awal', render: (value) => Number(value ?? 0) },
  { key: 'jumlah_sisa', label: 'Jumlah Sisa', render: (value) => Number(value ?? 0) },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
];

export default function KelolaStok() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadBatches = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getBatches({ search });
      setBatches(result.items ?? []);
    } catch (err) {
      console.error('Gagal memuat batch:', err);
      setError('Gagal memuat data stok.');
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBatches();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadBatches]);

  const handleAdjust = (batch) => {
    navigate(`/stok/adjust/${batch.id}`);
  };

  const stockStatus = (batch) => {
    const sisa = Number(batch?.jumlah_sisa ?? 0);
    if (sisa <= 0) return 'Habis';
    if (sisa <= Number(batch?.jumlah_awal ?? 0) / 2) return 'Menipis';
    return 'Aman';
  };

  const enriched = batches.map((b) => ({ ...b, status: stockStatus(b) }));

  return (
    <div className="space-y-6">
      <PageHeader title="Kelola Stok" subtitle="Manajemen batch stok obat" role={user?.role} />

      {error && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Telusuri batch" className="min-w-[200px] flex-1" />
        <Button onClick={() => navigate('/stok/tambah')}>Tambah Batch</Button>
      </div>

      <DataTable
        columns={columns}
        data={enriched}
        loading={loading}
        onEdit={handleAdjust}
      />

      {!loading && enriched.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center text-sm text-mediva-muted">
          Tidak ada data batch.
        </div>
      )}
    </div>
  );
}
