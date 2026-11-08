<?php

namespace App\Services;

use App\Models\Resep;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResepService
{
    public function getAllResep($filters = [])
    {
        $query = Resep::with(['user', 'order', 'validator']);

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function getResepById($id)
    {
        return Resep::with(['user', 'order', 'validator'])->findOrFail($id);
    }

    public function createResep(array $data)
    {
        DB::beginTransaction();

        try {
            if (isset($data['order_id'])) {
                Order::findOrFail($data['order_id']);
            }

            $resep = Resep::create([
                'user_id' => $data['user_id'],
                'order_id' => $data['order_id'] ?? null,
                'foto_resep' => $data['foto_resep'],
                'status' => 'pending',
                'validated_by' => null,
                'validated_at' => null,
            ]);

            Log::info('Resep created', ['resep_id' => $resep->id]);

            DB::commit();
            return $resep->load(['user', 'order']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create resep: ' . $e->getMessage());
            throw $e;
        }
    }

    public function validateResep($id, string $status, int $validatedBy)
    {
        DB::beginTransaction();

        try {
            $resep = Resep::findOrFail($id);

            $validStatuses = ['disetujui', 'ditolak'];
            if (!in_array($status, $validStatuses)) {
                throw new \InvalidArgumentException('Status harus disetujui atau ditolak');
            }

            if ($resep->status !== 'pending') {
                throw new \InvalidArgumentException('Resep sudah divalidasi, tidak bisa diubah');
            }

            $resep->status = $status;
            $resep->validated_by = $validatedBy;
            $resep->validated_at = now();
            $resep->save();

            Log::info('Resep validated', [
                'resep_id' => $id,
                'status' => $status,
                'validated_by' => $validatedBy
            ]);

            DB::commit();
            return $resep->load(['user', 'order', 'validator']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to validate resep: ' . $e->getMessage());
            throw $e;
        }
    }
}
