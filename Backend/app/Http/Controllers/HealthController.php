<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Controller untuk endpoint kesehatan API.
 * Digunakan untuk memastikan server, database, dan konfigurasi dasar berjalan normal.
 */
class HealthController extends Controller
{
    /**
     * Cek status kesehatan API secara menyeluruh.
     * Mengembalikan status server, koneksi database, versi aplikasi, dan timestamp saat ini.
     *
     * @return JsonResponse
     */
    public function check(): JsonResponse
    {
        $dbStatus = 'ok';
        $dbError  = null;

        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $dbStatus = 'error';
            $dbError  = app()->isProduction() ? 'Koneksi database gagal.' : $e->getMessage();
        }

        $allOk = $dbStatus === 'ok';

        return $this->success(
            data: [
                'app'      => config('app.name'),
                'env'      => config('app.env'),
                'version'  => '1.0.0',
                'server'   => 'ok',
                'database' => $dbStatus,
                'db_error' => $dbError,
                'time'     => now()->toIso8601String(),
                'timezone' => config('app.timezone'),
            ],
            message: $allOk ? 'API berjalan normal.' : 'API berjalan, tapi ada masalah.',
            code: $allOk ? 200 : 503,
        );
    }
}
