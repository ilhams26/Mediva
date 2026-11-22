<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/katalog/kategoris — Daftar kategori (katalog publik).
     */
    public function index(): JsonResponse
    {
        $kategoris = Kategori::orderBy('nama')->get(['id', 'nama']);

        return $this->success(
            $kategoris->map(fn ($k) => ['id' => $k->id, 'nama' => $k->nama]),
            'Daftar kategori berhasil diambil.'
        );
    }

    /**
     * POST /api/kategoris — Buat kategori baru (staf only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:kategoris,nama',
        ]);

        Kategori::create(['nama' => $validated['nama']]);

        return $this->success(null, 'Kategori berhasil ditambahkan.');
    }

    /**
     * PUT /api/kategoris/{id} — Update kategori (staf only).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $kategori = Kategori::find($id);

        if (!$kategori) {
            return $this->notFound('Kategori tidak ditemukan.');
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:kategoris,nama,' . $id,
        ]);

        $kategori->update(['nama' => $validated['nama']]);

        return $this->success(null, 'Kategori berhasil diperbarui.');
    }

    /**
     * DELETE /api/kategoris/{id} — Hapus kategori (staf only).
     */
    public function destroy(int $id): JsonResponse
    {
        $kategori = Kategori::find($id);

        if (!$kategori) {
            return $this->notFound('Kategori tidak ditemukan.');
        }

        $kategori->delete();

        return $this->success(null, 'Kategori berhasil dihapus.');
    }
}
