<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'user' => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'no_hp' => $this->user->no_hp,
            ],
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'obat' => [
                        'id' => $item->obat->id,
                        'nama' => $item->obat->nama,
                        'jenis' => $item->obat->jenis,
                    ],
                    'qty' => $item->qty,
                    'harga' => $item->harga,
                    'subtotal' => $item->subtotal,
                ];
            }),
            'total_harga' => $this->total_harga,
            'metode_pembayaran' => $this->metode_pembayaran,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'resep_id' => $this->resep_id,
            'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
