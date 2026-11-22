<?php

namespace App\Console\Commands;

use App\Services\StockReservationService;
use Illuminate\Console\Command;

/**
 * Master Part 3 F: Proses reservasi yang kedaluwarsa
 * (status 'reserved' dengan expires_at < now -> 'expired').
 *
 * Idempotent: hanya transaksi dari status 'reserved'.
 */
class ReleaseExpiredStockReservationsCommand extends Command
{
    protected $signature = 'mediva:release-expired-reservations';

    protected $description = 'Release expired stock reservations (Master Part 3 F)';

    public function handle(StockReservationService $stockReservation): int
    {
        $released = $stockReservation->releaseExpiredReservations();
        $this->info("Released {$released} expired reservation(s).");

        return self::SUCCESS;
    }
}
