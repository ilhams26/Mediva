<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\Obat;
use App\Models\PergerakanStok;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * StockService — domain stock & batch (Fase 4).
 *
 * - getBatches: daftar batch (dengan filter obat & search).
 * - createBatch: membuat batch baru (jumlah_awal → jumlah_sisa).
 * - adjustBatch: adjust jumlah_sisa (qty adjustment) dengan validasi >= 0.
 * - lowStockCheck: daftar obat yang stoknya <= stok_minimum (low stock alert).
 *
 * Catatan: alokasi FEFO saat confirm pembayaran kini ada di StockReservationService.
 */
class StockService
{
    public function getBatches(?int $obatId, ?string $search, int $perPage = 15): LengthAwarePaginator
    {
        $query = Batch::query()->with('obat');

        if (!is_null($obatId)) {
            $query->where('obat_id', $obatId);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('batch_number', 'like', '%' . $search . '%')
                    ->orWhereHas('obat', fn ($obat) => $obat->where('nama', 'like', '%' . $search . '%'));
            });
        }

        return $query->orderBy('expired_date', 'asc')->paginate($perPage);
    }

    public function createBatch(array $data): Batch
    {
        return Batch::create([
            'obat_id' => $data['obat_id'],
            'batch_number' => $data['batch_number'],
            'expired_date' => $data['expired_date'],
            'jumlah_awal' => $data['jumlah_awal'],
            'jumlah_sisa' => $data['jumlah_awal'],
        ]);
    }

    public function adjustBatch(int $id, int $jumlahSisa): ?Batch
    {
        $batch = Batch::find($id);

        if (!$batch) {
            return null;
        }

        if ($jumlahSisa < 0) {
            throw new \InvalidArgumentException('Jumlah stok tidak boleh negatif.');
        }

        $batch->update(['jumlah_sisa' => $jumlahSisa]);

        return $batch->fresh();
    }

    public function getBatchById(int $id): ?Batch
    {
        return Batch::with('obat')->find($id);
    }

    /**
     * Low stock alert: obat yang stok tersedia (jumlah_sisa non-expired) <= stok_minimum.
     *
     * @return \Illuminate\Support\Collection<int, \App\Models\Obat>
     */
    public function lowStockAlerts(): \Illuminate\Support\Collection
    {
        return Obat::where('is_active', true)
            ->whereRaw('COALESCE((SELECT SUM(b.jumlah_sisa) FROM batches b WHERE b.obat_id = obats.id AND b.expired_date >= CURRENT_DATE), 0) <= obats.stok_minimum')
            ->with('kategori')
            ->get();
    }

    /**
     * Riwayat pergerakan stok (pergerakan_stok).
     */
    public function getMovements(?int $obatId, ?string $tipe, int $perPage = 15)
    {
        $query = PergerakanStok::query();

        if (!is_null($obatId)) {
            $query->where('obat_id', $obatId);
        }

        if (!is_null($tipe)) {
            $query->where('tipe', $tipe);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
