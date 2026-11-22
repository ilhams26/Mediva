<?php

namespace App\Services;

use App\Models\Obat;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ObatService
{
    /**
     * Daftar obat (management): support search, filter kategori/jenis/is_active,
     * dan pagination. Mengikuti aturan bisnis: JANGAN gunakan SoftDeletes,
     * gunakan is_active = false untuk menonaktifkan obat.
     */
    public function getAllObats(
        ?string $search,
        ?int $kategoriId,
        ?string $jenis,
        ?bool $isActive,
        int $perPage = 15
    ): LengthAwarePaginator {
        $query = Obat::query()->with('kategori');

        if (!is_null($isActive)) {
            $query->where('is_active', $isActive);
        }

        if (!is_null($kategoriId)) {
            $query->where('kategori_id', $kategoriId);
        }

        if (!is_null($jenis)) {
            $query->where('jenis', $jenis);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', '%' . $search . '%')
                    ->orWhere('deskripsi', 'like', '%' . $search . '%');
            });
        }

        return $query->orderBy('nama')->paginate($perPage);
    }

    /**
     * Katalog publik (mobile/web pembeli): hanya obat aktif.
     */
    public function getCatalog(?string $search, ?int $kategoriId, ?string $jenis, int $perPage = 15): LengthAwarePaginator
    {
        return $this->getAllObats($search, $kategoriId, $jenis, true, $perPage);
    }

    public function getObatById(int $id): ?Obat
    {
        return Obat::with('kategori')->find($id);
    }

    public function createObat(array $data): Obat
    {
        return Obat::create([
            'kategori_id' => $data['kategori_id'],
            'nama' => $data['nama'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'harga' => $data['harga'],
            'jenis' => $data['jenis'] ?? 'biasa',
            'stok_minimum' => $data['stok_minimum'] ?? 0,
            'foto' => $data['foto'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function updateObat(int $id, array $data): ?Obat
    {
        $obat = Obat::with('kategori')->find($id);

        if (!$obat) {
            return null;
        }

        $obat->fill([
            'kategori_id' => $data['kategori_id'] ?? $obat->kategori_id,
            'nama' => $data['nama'] ?? $obat->nama,
            'deskripsi' => array_key_exists('deskripsi', $data) ? $data['deskripsi'] : $obat->deskripsi,
            'harga' => $data['harga'] ?? $obat->harga,
            'jenis' => $data['jenis'] ?? $obat->jenis,
            'stok_minimum' => $data['stok_minimum'] ?? $obat->stok_minimum,
            'foto' => array_key_exists('foto', $data) ? $data['foto'] : $obat->foto,
            'is_active' => array_key_exists('is_active', $data) ? (bool) $data['is_active'] : $obat->is_active,
        ]);

        $obat->save();

        return $obat->fresh('kategori');
    }

    /**
     * Hapus obat = soft delete (is_active = false), BUKAN hard delete.
     */
    public function deleteObat(int $id): bool
    {
        $obat = Obat::find($id);

        if (!$obat) {
            return false;
        }

        $obat->update(['is_active' => false]);

        return true;
    }
}
