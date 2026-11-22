<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kategori' => $this->kategori
                ? ['id' => $this->kategori->id, 'nama' => $this->kategori->nama]
                : null,
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'harga' => $this->harga,
            'jenis' => $this->jenis,
            'stok_minimum' => $this->stok_minimum,
            'foto' => $this->foto,
            'is_active' => (bool) $this->is_active,
            'stok_total' => $this->stok_total ?? 0,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
