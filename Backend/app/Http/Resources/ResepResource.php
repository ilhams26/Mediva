<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ResepResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'nama' => $this->user->nama,
                'email' => $this->user->email,
            ],
            'obat' => [
                'id' => $this->obat->id,
                'nama' => $this->obat->nama,
                'kategori' => $this->obat->kategori,
            ],
            'deskripsi_keluhan' => $this->deskripsi_keluhan,
            'foto_resep' => $this->foto_resep,
            'catatan_apoteker' => $this->catatan_apoteker,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
