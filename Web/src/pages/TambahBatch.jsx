import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { getObats } from '../services/medicineService';
import { createBatch } from '../services/batchService';

export default function TambahBatch() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [obats, setObats] = useState([]);
    const [form, setForm] = useState({ obat_id: '', batch_number: '', expired_date: '', jumlah_awal: '1' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadObats = async () => {
            try {
                const result = await getObats({ per_page: 100 });
                setObats(result.items ?? []);
            } catch (err) {
                console.error('Gagal memuat obat:', err);
            }
        };
        loadObats();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.obat_id) { setError('Obat wajib dipilih.'); return; }
        if (!form.batch_number?.trim()) { setError('Nomor batch wajib diisi.'); return; }
        if (!form.expired_date) { setError('Tanggal kedaluwarsa wajib diisi.'); return; }
        const jumlahAwal = Number(form.jumlah_awal);
        if (!jumlahAwal || jumlahAwal <= 0) { setError('Jumlah awal harus minimal 1.'); return; }

        setLoading(true);
        try {
            await createBatch({
                obat_id: Number(form.obat_id),
                batch_number: form.batch_number.trim(),
                expired_date: form.expired_date,
                jumlah_awal: jumlahAwal,
            });
            navigate('/stok');
        } catch (err) {
            const message = err?.response?.data?.message ?? 'Gagal menyimpan batch. Coba lagi.';
            setError(typeof message === 'object' ? JSON.stringify(message) : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Tambah Batch" subtitle="Menambah stok batch baru" role={user?.role} />

            <div className="rounded-xl bg-white p-6 shadow-sm">
                {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Obat *</label>
                        <select name="obat_id" value={form.obat_id} onChange={handleChange} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                            <option value="">Pilih obat</option>
                            {obats.map((o) => (
                                <option key={o.id} value={o.id}>{o.nama}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Nomor Batch *</label>
                        <input type="text" name="batch_number" value={form.batch_number} onChange={handleChange} placeholder="Contoh: BATCH-001" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal Kedaluwarsa *</label>
                        <input type="date" name="expired_date" value={form.expired_date} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Jumlah Awal *</label>
                        <input type="number" name="jumlah_awal" min="1" value={form.jumlah_awal} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3">
                        <button type="button" onClick={() => navigate('/stok')} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
                        <Button type="submit" loading={loading}>Simpan</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
