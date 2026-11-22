import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { getMovements } from '../services/batchService';

const columns = [
    { key: 'created_at', label: 'Waktu' },
    { key: 'tipe', label: 'Tipe' },
    { key: 'jumlah', label: 'Jumlah', render: (value) => Number(value ?? 0) },
    { key: 'sumber', label: 'Sumber' },
    { key: 'keterangan', label: 'Keterangan' },
    { key: 'obat_nama', label: 'Obat' },
];

export default function RiwayatStok() {
    const { user } = useAuth();

    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadMovements = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await getMovements({});
            setMovements(result.items ?? []);
        } catch (err) {
            console.error('Gagal memuat riwayat stok:', err);
            setError('Gagal memuat riwayat pergerakan stok.');
            setMovements([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMovements();
    }, [loadMovements]);

    return (
        <div className="space-y-6">
            <PageHeader title="Riwayat Stok" subtitle="Riwayat pergerakan stok (keluar/masuk)" role={user?.role} />

            {error && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
                    ⚠️ {error}
                </div>
            )}

            <DataTable columns={columns} data={movements} loading={loading} />

            {!loading && movements.length === 0 && (
                <div className="rounded-xl bg-white p-8 text-center text-sm text-mediva-muted">
                    Tidak ada riwayat pergerakan stok.
                </div>
            )}
        </div>
    );
}
