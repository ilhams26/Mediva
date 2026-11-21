<?php

use App\Console\Commands\ReleaseExpiredStockReservationsCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Master Part 3 F — Proses reservasi kedaluwarsa.
// Scli: schedule aman (idempotent), interval 30 menit (cara disetujui; aman dijalankan berulang).
Schedule::command(ReleaseExpiredStockReservationsCommand::class)->everyTenMinutes();
