import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { getKategoris } from '../services/kategoriService';
import { createObat } from '../services/medicineService';

const EMPTY_FORM = {
  nama: '',
  kategori_id: '',
  harga: '',
  jenis: 'biasa',
  stok_minimum: '0',
  deskripsi: '',
  foto: '',
};

export default function TambahObat() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadKategoris = async () => {
      try {
        const data = await getKategoris();
        setKategoris(data);
      } catch (err) {
        console.error('Gagal memuat kategori:', err);
      }
    };
    loadKategoris();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nama.trim()) {
      setError('Nama obat wajib diisi.');
      return;
    }
    if (!form.kategori_id) {
      setError('Kategori wajib dipilih.');
      return;
    }
    const harga = Number(form.harga);
    if (!harga || harga <= 0) {
      setError('Harga wajib diisi dan harus lebih dari 0.');
      return;
    }

    setLoading(true);
    try {
      await createObat({
        kategori_id: Number(form.kategori_id),
        nama: form.nama.trim(),
        deskripsi: form.deskripsi || null,
        harga,
        jenis: form.jenis,
        stok_minimum: Number(form.stok_minimum || 0),
        foto: form.foto || null,
        is_active: true,
      });
      navigate('/obat');
    } catch (err) {
      const message = err?.response?.data?.message ?? 'Gagal menyimpan obat. Coba lagi.';
      setError(typeof message === 'object' ? JSON.stringify(message) : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Obat" subtitle="Tambah data obat baru" role={user?.role} />

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nama Obat *</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Paracetamol 500mg"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Kategori *</label>
            <select
              name="kategori_id"
              value={form.kategori_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Pilih kategori</option>
              {kategoris.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Harga (IDR) *</label>
            <input
              type="number"
              name="harga"
              min="0"
              step="0.01"
              value={form.harga}
              onChange={handleChange}
              placeholder="50000"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Jenis</label>
            <select name="jenis" value={form.jenis} onChange={handleChange} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="biasa">Biasa</option>
              <option value="keras">Keras</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Stok Minimum</label>
            <input
              type="number"
              name="stok_minimum"
              min="0"
              value={form.stok_minimum}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/obat')}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>
            <Button type="submit" loading={loading}>
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
