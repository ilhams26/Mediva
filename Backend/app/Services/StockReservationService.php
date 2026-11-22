<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\Order;
use App\Models\PergerakanStok;
use App\Models\StockReservation;
use App\Models\StockReservationItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * StockReservationService — Stok Reservation / Holding (Master Part 3).
 *
 * Konsep Dasar:
 *   available_stock = physical_stock - reserved_stock
 *
 * Lifecycle:
 *   - reserveForOrder(): saat checkout — buat reservation (dengan FEFO per item).
 *     Status 'reserved', expires_at terisi. Tidak mengeluarkan fisik.
 *   - confirmPayment(): saat pembayaran Midtrans verified / cash dipulang
 *     (pickup-pay) — keluarkan fisik dari batch, tandai reservation 'confirmed',
 *     set order.payment_status = 'paid'.
 *   - releaseReservation(): cancel / kedaluwarsa — tandai 'released' (fisik
 *     tidak pernah dialokasikan sebelum confirm).
 *   - releaseExpiredReservations(): Artisan/Scheduler — status 'reserved'
 *     dengan expires_at < now -> 'expired'.
 *
 * Durasi holding (Master Part 3 B):
 *   Midtrans: 15 menit.
 *   Tunai saat pengambilan: 48 jam.
 */
class StockReservationService
{
    /**
     * Durasi holding saat checkout, dalam detik.
     * - Midtrans: 15 menit.
     * - Tunai: 48 jam.
     */
    public const DURASI_MIDTRANS_DETIK = 15 * 60;
    public const DURASI_TUNAI_DETIK = 48 * 3600;

    /**
     * Stok fisik yang tersedia = jumlah_sisa batch aktif (non-expired) MINUS
     * jumlah yang masih di-reserve (status 'reserved').
     *
     * @return int
     */
    public function availableStock(int $obatId): int
    {
        $physical = Batch::where('obat_id', $obatId)
            ->where('expired_date', '>', now())
            ->sum('jumlah_sisa');

        $reserved = StockReservationItem::query()
            ->join('stock_reservations', 'stock_reservation_items.reservation_id', '=', 'stock_reservations.id')
            ->where('stock_reservations.status', 'reserved')
            ->whereIn('stock_reservation_items.batch_id', Batch::where('obat_id', $obatId)->pluck('id'))
            ->sum('stock_reservation_items.jumlah');

        return max(0, (int) $physical - (int) $reserved);
    }

    /**
     * Buat reservation untuk order sekaligus reserve per item (FEFO).
     * Dipanggil saat checkout (sebelum order tercipta) — transaction sekaligus
     * dengan pembuatan order & order_items.
     */
    public function reserveForOrder(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $reservation = StockReservation::create([
                'order_id' => $order->id,
                'status' => 'reserved',
                'expires_at' => now()->addSeconds($this->durasiReservasi($order)),
            ]);

            foreach ($order->items as $item) {
                $this->allocateBatch($reservation, $item->obat_id, $item->qty);
            }
        });
    }

    /**
     * Durasi holding berdasarkan metode pembayaran (Master Part 3 B).
     *
     * @return int detik
     */
    public function durasiReservasi(Order $order): int
    {
        return $order->metode_pembayaran === 'midtrans'
            ? self::DURASI_MIDTRANS_DETIK
            : self::DURASI_TUNAI_DETIK;
    }

    /**
     * Konfirmasi pembayaran: keluarkan fisik dari batch (FEFO) + tandai reservation
     * 'confirmed' + set payment_status order = 'paid'.
     *
     * Dipanggil oleh (Master Part 3 C):
     *  - Midtrans callback (webhook, setelah verify signature)
     *  - Cash: pickup-pay (cekakan staf)
     *
     * Idempotent: hanya berlaku jika reservation status = 'reserved'.
     * Jika sudah di-confirm/expired/released → melempar ValidationException.
     */
    public function confirmPayment(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $reservation = $order->reservation()->lockForUpdate()->first();

            if (!$reservation || $reservation->status !== 'reserved') {
                throw ValidationException::withMessages([
                    'order_id' => ['Status pesanan atau reservasi tidak valid untuk konfirmasi pembayaran.'],
                ]);
            }

            // Keluarkan fisik dari batch yang telah direservasi (FEFO)
            foreach ($reservation->items() as $item) {
                $batch = Batch::where('id', $item->batch_id)->lockForUpdate()->first();
                if (!$batch) {
                    continue; // defensive — FK RESTRICT seharusnya mencegah
                }

                $batch->jumlah_sisa -= $item->jumlah;
                $batch->save();

                PergerakanStok::create([
                    'obat_id' => $batch->obat_id,
                    'batch_id' => $batch->id,
                    'tipe' => 'keluar',
                    'jumlah' => $item->jumlah,
                    'sumber' => 'order_payment_confirmed',
                    'referensi_id' => $order->id,
                    'keterangan' => "Pembayaran konfirmasi order #{$order->id}",
                    'created_by' => $order->created_by,
                ]);
            }

            $reservation->status = 'confirmed';
            $reservation->save();

            $order->payment_status = 'paid';
            $order->paid_at = now();
            $order->save();
        });
    }

    /**
     * Lepaskan reservasi tanpa mengeluarkan fisik.
     * Dipanggil pada: cancel order, atau kedaluwarsa (via releaseExpiredReservations).
     * No-op jika status tidak 'reserved'.
     */
    public function releaseReservation(Order $order): void
    {
        $reservation = $order->reservation()->lockForUpdate()->first();

        if (!$reservation || $reservation->status !== 'reserved') {
            return;
        }

        $reservation->status = 'released';
        $reservation->save();
    }

    /**
     * Proses semua reservasi yang kedaluwarsa.
     * Dipanggil oleh Artisan Command: mediva:release-expired-reservations (scheduler).
     *
     * @return int jumlah reservasi yang berubah menjadi 'expired'
     */
    public function releaseExpiredReservations(): int
    {
        $now = now();

        return DB::transaction(function () use ($now): int {
            $expired = StockReservation::where('status', 'reserved')
                ->whereNotNull('expires_at')
                ->where('expires_at', '<', $now)
                ->lockForUpdate()
                ->get();

            foreach ($expired as $reservation) {
                $reservation->status = 'expired';
                $reservation->save();
            }

            return $expired->count();
        });
    }

    /**
     * Alokasi FEFO ke batch. K Unc the batch (SELECT ... FOR UPDATE), cek
     * tersedia, buat StockReservationItem. Gagal jika tidak cukup (snap).
     *
     * @param StockReservation $reservation
     * @param int $obatId
     * @param int $qty
     * @throws ValidationException
     */
    private function allocateBatch(StockReservation $reservation, int $obatId, int $qty): void
    {
        $batches = Batch::where('obat_id', $obatId)
            ->where('expired_date', '>', now())
            ->where('jumlah_sisa', '>', 0)
            ->orderBy('expired_date', 'asc')
            ->lockForUpdate()
            ->get();

        $physical = $batches->sum('jumlah_sisa');
        $reserved = StockReservationItem::query()
            ->join('stock_reservations', 'stock_reservation_items.reservation_id', '=', 'stock_reservations.id')
            ->where('stock_reservations.status', 'reserved')
            ->whereIn('stock_reservation_items.batch_id', $batches->pluck('id'))
            ->sum('stock_reservation_items.jumlah');

        $available = max(0, (int) $physical - (int) $reserved);

        if ($available < $qty) {
            throw ValidationException::withMessages([
                'items' => ["Stok obat ID {$obatId} tidak mencukupi. Tersedia: {$available}, diminta: {$qty}."],
            ]);
        }

        $remaining = $qty;
        foreach ($batches as $batch) {
            if ($remaining <= 0) {
                break;
            }
            $deduct = min($remaining, $batch->jumlah_sisa);
            StockReservationItem::create([
                'reservation_id' => $reservation->id,
                'batch_id' => $batch->id,
                'jumlah' => $deduct,
            ]);
            $remaining -= $deduct;
        }

        if ($remaining > 0) {
            throw new \RuntimeException("Stok tidak mencukupi untuk obat ID {$obatId}. Kurang: {$remaining}");
        }
    }
}
