import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { getKategoris, createKategori, updateKategori, deleteKategori } from '../services/kategoriService';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nama', label: 'Nama Kategori' },
];

export default function KelolaKategori() {
  const { user } = useAuth();
  const isStaf = user?.role === 'staf';

  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingKategori, setEditingKategori] = useState(null);
  const [form, setForm] = useState({ nama: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingKategoriId, setDeletingKategoriId] = useState(null);

  const loadKategoris = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getKategoris();
      setKategoris(data ?? []);
    } catch (err) {
      console.error('Gagal memuat kategori:', err);
      setError('Gagal memuat data kategori.');
      setKategoris([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKategoris();
  }, [loadKategoris]);

  const openCreateModal = () => {
    setEditingKategori(null);
    setForm({ nama: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (kategori) => {
    setEditingKategori(kategori);
    setForm({ nama: kategori.nama ?? '' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingKategori(null);
    setForm({ nama: '' });
    setFormError('');
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.nama?.trim()) {
      setFormError('Nama kategori wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingKategori) {
        await updateKategori(editingKategori.id, { nama: form.nama.trim() });
      } else {
        await createKategori({ nama: form.nama.trim() });
      }
      closeModal();
      loadKategoris();
    } catch (err) {
      const message = err?.response?.data?.message ?? 'Gagal menyimpan kategori. Coba lagi.';
      setFormError(typeof message === 'object' ? JSON.stringify(message) : message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingKategoriId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deletingKategoriId) return;
    try {
      await deleteKategori(deletingKategoriId);
      setShowDeleteConfirm(false);
      setDeletingKategoriId(null);
      loadKategoris();
    } catch (err) {
      console.error('Gagal menghapus kategori:', err);
      setShowDeleteConfirm(false);
    }
  };

  const filteredData = (kategoris ?? []).filter(
    (item) =>
      !search ||
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      String(item.id).includes(search)
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Kelola Kategori" subtitle="Manajemen kategori obat" role={user?.role} />

      {error && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Telusuri kategori" className="min-w-[200px] flex-1" />
        {isStaf && (
          <Button onClick={openCreateModal}>Tambah Kategori</Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        onEdit={isStaf ? openEditModal : null}
        onDelete={isStaf ? confirmDelete : null}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-base font-semibold text-gray-800">{editingKategori ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
              <button type="button" onClick={closeModal} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {formError && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{formError}</div>}

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Nama Kategori *</label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleFormChange}
                  placeholder="Contoh: Analgesik"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
                <Button type="submit" loading={submitting}>Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-center text-base font-semibold text-gray-800">Hapus Kategori</h3>
            <p className="mb-6 text-center text-sm text-gray-500">Yakin ingin menghapus kategori ini?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setShowDeleteConfirm(false); setDeletingKategoriId(null); }} className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
