import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { getObats, deleteObat } from '../services/medicineService';

const stockStatus = (obat) => {
  const stok = Number(obat?.stok ?? 0);
  const minimum = Number(obat?.stok_minimum ?? 0);

  if (stok <= minimum) {
    return stok > 0 ? 'Menipis' : 'Habis';
  }

  return 'Aman';
};

const columns = [
  { key: 'nama', label: 'Nama Obat' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'harga', label: 'Harga', render: (value) => Number(value ?? 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
  { key: 'stok', label: 'Stok', render: (value) => Number(value ?? 0) },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
];

export function KelolaObat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStaf = user?.role === 'staf';

  const [obats, setObats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const loadObats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getObats({ search, page, per_page: 15 });
      setObats(result.items ?? []);
      setPagination(result.pagination ?? null);
    } catch (err) {
      console.error('Gagal memuat obat:', err);
      setError('Gagal memuat data obat. Pastikan server backend berjalan.');
      setObats([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadObats();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadObats]);

  const handleDelete = async (obat) => {
    try {
      await deleteObat(obat.id);
      await loadObats();
    } catch (err) {
      console.error('Gagal menonaktifkan obat:', err);
      setError('Gagal memperbarui status obat.');
    }
  };

  const handleEdit = (obat) => {
    navigate(`/obat/edit/${obat.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isStaf ? 'Kelola Obat' : 'Data Obat'}
        subtitle="Manajemen data obat di sistem"
        role={user?.role}
      />

      {error && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Telusuri nama obat"
          className="min-w-[200px] flex-1"
        />
        {isStaf && (
          <Button onClick={() => navigate('/obat/tambah')}>
            Tambah Obat
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={obats}
        loading={loading}
        onEdit={isStaf ? handleEdit : null}
        onDelete={isStaf ? handleDelete : null}
      />

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Sebelumnya
          </Button>
          <span className="text-xs text-mediva-muted">
            Halaman {page} dari {pagination.last_page}
          </span>
          <Button variant="secondary" disabled={page >= pagination.last_page} onClick={() => setPage((p) => p + 1)}>
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  );
}
