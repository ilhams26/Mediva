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
            'order' => $this->order ? [
                'id' => $this->order->id,
                'order_code' => $this->order->order_code,
                'total' => $this->order->total,
            ] : null,
            'foto_resep' => $this->foto_resep,
            'status' => $this->status,
            'validator' => $this->validator ? [
                'id' => $this->validator->id,
                'nama' => $this->validator->nama,
            ] : null,
            'validated_at' => $this->validated_at ? $this->validated_at->format('Y-m-d H:i:s') : null,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}

