<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $roleLabels = [
            'admin'   => 'Admin',
            'staf'    => 'Staf',
            'pembeli' => 'Pembeli',
        ];

        return [
            'kode'          => 'USR-' . str_pad($this->id, 3, '0', STR_PAD_LEFT),
            'id'            => $this->id,
            'nama_pengguna' => $this->username,
            'username'      => $this->username,
            'no_hp'         => $this->no_hp,
            'role'          => $roleLabels[$this->role] ?? $this->role,
            'jenis_kelamin' => $this->jenis_kelamin,
            'is_active'     => $this->is_active,
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}
