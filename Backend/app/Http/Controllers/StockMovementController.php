<?php

namespace App\Http\Controllers;

use App\Models\PergerakanStok;
use App\Services\StockService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    use ApiResponse;

    public function __construct(private StockService $stockService)
    {
    }

    /**
     * GET /api/stock/movements — Riwayat pergerakan stok (history).
     */
    public function index(Request $request): JsonResponse
    {
        $movements = $this->stockService->getMovements(
            $request->query('obat_id') ? (int) $request->query('obat_id') : null,
            $request->query('tipe'),
            $request->query('per_page') ? (int) $request->query('per_page') : 15
        );

        return $this->success([
            'data' => $movements->map(fn ($m) => [
                'id' => $m->id,
                'obat_id' => $m->obat_id,
                'batch_id' => $m->batch_id,
                'tipe' => $m->tipe,
                'jumlah' => $m->jumlah,
                'sumber' => $m->sumber,
                'referensi_id' => $m->referensi_id,
                'keterangan' => $m->keterangan,
                'created_by' => $m->created_by,
                'created_at' => $m->created_at?->toIso8601String(),
            ]),
            'pagination' => [
                'current_page' => $movements->currentPage(),
                'last_page' => $movements->lastPage(),
                'per_page' => $movements->perPage(),
                'total' => $movements->total(),
            ],
        ], 'Riwayat pergerakan stok berhasil diambil.');
    }
}
