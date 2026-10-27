<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    use ApiResponse;

    /**
     * Memeriksa kesehatan API dan koneksi database.
     *
     * @return JsonResponse
     */
    public function check(): JsonResponse
    {
        $databaseStatus = 'connected';
        try {
            DB::connection()->getPdo();
        } catch (Throwable $e) {
            $databaseStatus = 'disconnected';
        }

        return $this->successResponse([
            'api'         => 'healthy',
            'database'    => $databaseStatus,
            'timestamp'   => now()->toIso8601String(),
            'version'     => '1.0.0',
            'environment' => config('app.env'),
        ], 'API Mediva berjalan dengan normal.');
    }
}
