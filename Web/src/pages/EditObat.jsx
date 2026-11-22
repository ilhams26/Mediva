import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { getKategoris } from '../services/kategoriService';
import { getObatById, updateObat } from '../services/medicineService';

export default function EditObat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nama: '',
    kategori_id: '',
    harga: '',
    jenis: 'biasa',
    stok_minimum: '0',
    deskripsi: '',
    foto: '',
    is_active: true,
  });
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [obat, kategoriList] = await Promise.all([getObatById(id), getKategoris()]);
        setKategoris(kategoriList);
        setForm({
          nama: obat?.nama ?? '',
          kategori_id: obat?.kategori?.id ? String(obat.kategori.id) : '',
          harga: obat?.harga ? String(obat.harga) : '',
          jenis: obat?.jenis ?? 'biasa',
          stok_minimum: obat?.stok_minimum ? String(obat.stok_minimum) : '0',
          deskripsi: obat?.deskripsi ?? '',
          foto: obat?.foto ?? '',
          is_active: obat?.is_active ?? true,
        });
      } catch (err) {
        console.error('Gagal memuat obat:', err);
        setError('Gagal memuat data obat.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nama.trim()) {
      setError('Nama obat wajib diisi.');
      return;
    }
    const harga = Number(form.harga);
    if (!harga || harga <= 0) {
      setError('Harga wajib diisi dan harus lebih dari 0.');
      return;
    }

    setSaving(true);
    try {
      await updateObat(id, {
        nama: form.nama.trim(),
        kategori_id: form.kategori_id ? Number(form.kategori_id) : undefined,
        harga,
        jenis: form.jenis,
        stok_minimum: Number(form.stok_minimum || 0),
        deskripsi: form.deskripsi || null,
        foto: form.foto || null,
        is_active: form.is_active,
      });
      navigate('/obat');
    } catch (err) {
      const message = err?.response?.data?.message ?? 'Gagal memperbarui obat. Coba lagi.';
      setError(typeof message === 'object' ? JSON.stringify(message) : message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Obat" subtitle={`Mengubah data obat #${id}`} role={user?.role} />

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nama Obat *</label>
            <input type="text" name="nama" value={form.nama} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Kategori</label>
            <select name="kategori_id" value={form.kategori_id} onChange={handleChange} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">Tanpa kategori</option>
              {kategoris.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Harga (IDR) *</label>
            <input type="number" name="harga" min="0" step="0.01" value={form.harga} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
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
            <input type="number" name="stok_minimum" min="0" value={form.stok_minimum} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status Aktif</label>
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
              Aktifkan obat
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Deskripsi</label>
            <textarea name="deskripsi" rows="3" value={form.deskripsi} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/obat')} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Batal
            </button>
            <Button type="submit" loading={saving}>
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
