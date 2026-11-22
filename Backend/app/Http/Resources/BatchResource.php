<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'obat' => $this->obat
                ? ['id' => $this->obat->id, 'nama' => $this->obat->nama]
                : null,
            'batch_number' => $this->batch_number,
            'expired_date' => $this->expired_date?->toDateString(),
            'jumlah_awal' => $this->jumlah_awal,
            'jumlah_sisa' => $this->jumlah_sisa,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
