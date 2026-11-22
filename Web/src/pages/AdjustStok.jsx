import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { getBatchById, adjustBatch } from '../services/batchService';

export default function AdjustStok() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [batch, setBatch] = useState(null);
    const [jumlahSisa, setJumlahSisa] = useState('0');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBatch = async () => {
            try {
                const data = await getBatchById(id);
                setBatch(data);
                setJumlahSisa(String(data?.jumlah_sisa ?? 0));
            } catch (err) {
                console.error('Gagal memuat batch:', err);
                setError('Gagal memuat data batch.');
            } finally {
                setLoading(false);
            }
        };
        loadBatch();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const nilai = Number(jumlahSisa);
        if (Number.isNaN(nilai) || nilai < 0) {
            setError('Jumlah stok tidak boleh negatif.');
            return;
        }

        setSaving(true);
        try {
            await adjustBatch(id, { jumlah_sisa: nilai });
            navigate('/stok');
        } catch (err) {
            const message = err?.response?.data?.message ?? 'Gagal menyesuaikan stok. Coba lagi.';
            setError(typeof message === 'object' ? JSON.stringify(message) : message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Adjust Stok" subtitle={`Menyesuaikan jumlah stok batch #${id}`} role={user?.role} />

            <div className="rounded-xl bg-white p-6 shadow-sm">
                {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {batch && (
                        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                            <div>Batch: <strong>{batch.batch_number}</strong></div>
                            <div>Obat: <strong>{typeof batch.obat === 'object' ? batch.obat?.nama : batch.obat_nama}</strong></div>
                            <div>Jumlah awal: <strong>{batch.jumlah_awal}</strong></div>
                            <div>Jumlah sisa saat ini: <strong>{batch.jumlah_sisa}</strong></div>
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Jumlah Sisa Baru *</label>
                        <input type="number" min="0" value={jumlahSisa} onChange={(e) => setJumlahSisa(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => navigate('/stok')} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
                        <Button type="submit" loading={saving}>Simpan</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
