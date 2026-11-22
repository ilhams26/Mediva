<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateObatRequest;
use App\Http\Requests\UpdateObatRequest;
use App\Http\Resources\ObatResource;
use App\Services\ObatService;
use App\Traits\ApiResponse;
use App\Models\Obat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ObatController extends Controller
{
    use ApiResponse;

    public function __construct(private ObatService $obatService)
    {
    }

    /**
     * GET /api/obat/count — Total obat (admin only, ada di route group admin).
     */
    public function count(): JsonResponse
    {
        $total = Obat::count();

        return response()->json([
            'status' => 'success',
            'total' => $total
        ], 200);
    }

    /**
     * GET /api/obat — Daftar obat untuk management (staf & admin), support search, filter,
     * dan pagination. Gunakan GET /api/katalog/obats untuk katalog publik (pembeli).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) ($request->query('per_page') ?? 15);

        $obats = $this->obatService->getAllObats(
            $request->query('search') ? (string) $request->query('search') : null,
            $request->query('kategori_id') ? (int) $request->query('kategori_id') : null,
            $request->query('jenis'),
            $request->query('is_active') !== null ? filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN) : null,
            $perPage
        );

        return $this->success([
            'data' => ObatResource::collection($obats),
            'pagination' => [
                'current_page' => $obats->currentPage(),
                'last_page' => $obats->lastPage(),
                'per_page' => $obats->perPage(),
                'total' => $obats->total(),
            ],
        ], 'Daftar obat berhasil diambil.');
    }

    /**
     * GET /api/obat/{id} — Detail obat (management, staf & admin).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $obat = $this->obatService->getObatById($id);

        if (!$obat) {
            return $this->notFound('Obat tidak ditemukan.');
        }

        return $this->success(new ObatResource($obat), 'Detail obat berhasil diambil.');
    }

    /**
     * GET /api/katalog/obats — Katalog publik obat (hanya is_active = true),
     * support search & filter (nama, kategori, jenis).
     */
    public function catalogIndex(Request $request): JsonResponse
    {
        $perPage = (int) ($request->query('per_page') ?? 15);

        $obats = $this->obatService->getCatalog(
            $request->query('search') ? (string) $request->query('search') : null,
            $request->query('kategori_id') ? (int) $request->query('kategori_id') : null,
            $request->query('jenis'),
            $perPage
        );

        return $this->success([
            'data' => ObatResource::collection($obats),
            'pagination' => [
                'current_page' => $obats->currentPage(),
                'last_page' => $obats->lastPage(),
                'per_page' => $obats->perPage(),
                'total' => $obats->total(),
            ],
        ], 'Katalog obat berhasil diambil.');
    }

    /**
     * GET /api/katalog/obats/{id} — Detail obat dari katalog publik.
     */
    public function catalogShow(Request $request, int $id): JsonResponse
    {
        $obat = $this->obatService->getObatById($id);

        if (!$obat || !$obat->is_active) {
            return $this->notFound('Obat tidak ditemukan.');
        }

        return $this->success(new ObatResource($obat), 'Detail obat berhasil diambil.');
    }

    /**
     * POST /api/obat — Buat obat baru (staf only).
     */
    public function store(CreateObatRequest $request): JsonResponse
    {
        $obat = $this->obatService->createObat($request->validated());

        return $this->created(new ObatResource($obat), 'Obat berhasil ditambahkan.');
    }

    /**
     * PUT /api/obat/{id} — Update obat (staf only).
     */
    public function update(UpdateObatRequest $request, int $id): JsonResponse
    {
        $obat = $this->obatService->updateObat($id, $request->validated());

        if (!$obat) {
            return $this->notFound('Obat tidak ditemukan.');
        }

        return $this->success(new ObatResource($obat), 'Obat berhasil diperbarui.');
    }

    /**
     * DELETE /api/obat/{id} — Soft delete obat (is_active = false), BUKAN hard delete (staf only).
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->obatService->deleteObat($id);

        if (!$deleted) {
            return $this->notFound('Obat tidak ditemukan.');
        }

        return $this->success(null, 'Obat berhasil dinonaktifkan.');
    }
}
