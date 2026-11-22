<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBatchRequest;
use App\Http\Requests\AdjustBatchRequest;
use App\Http\Resources\BatchResource;
use App\Services\StockService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    use ApiResponse;

    public function __construct(private StockService $stockService)
    {
    }

    /**
     * GET /api/batches — Daftar batch (management stock), support filter obat & search.
     */
    public function index(Request $request): JsonResponse
    {
        $batches = $this->stockService->getBatches(
            $request->query('obat_id') ? (int) $request->query('obat_id') : null,
            $request->query('search') ? (string) $request->query('search') : null,
            (int) ($request->query('per_page') ?? 15)
        );

        return $this->success([
            'data' => BatchResource::collection($batches),
            'pagination' => [
                'current_page' => $batches->currentPage(),
                'last_page' => $batches->lastPage(),
                'per_page' => $batches->perPage(),
                'total' => $batches->total(),
            ],
        ], 'Daftar batch berhasil diambil.');
    }

    /**
     * GET /api/batches/{id} — Detail batch (management stock).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $batch = $this->stockService->getBatchById($id);

        if (!$batch) {
            return $this->notFound('Batch tidak ditemukan.');
        }

        return $this->success(new BatchResource($batch), 'Detail batch berhasil diambil.');
    }

    /**
     * POST /api/batches — Buat batch baru (staf).
     */
    public function store(CreateBatchRequest $request): JsonResponse
    {
        $batch = $this->stockService->createBatch($request->validated());

        return $this->created(new BatchResource($batch), 'Batch berhasil ditambahkan.');
    }

    /**
     * PUT /api/batches/{id}/adjust — Adjust jumlah_sisa batch (qty adjustment, staf).
     */
    public function adjust(AdjustBatchRequest $request, int $id): JsonResponse
    {
        $batch = $this->stockService->adjustBatch($id, (int) $request->validated('jumlah_sisa'));

        if (!$batch) {
            return $this->notFound('Batch tidak ditemukan.');
        }

        return $this->success(new BatchResource($batch), 'Jumlah stok batch berhasil diubah.');
    }
}
