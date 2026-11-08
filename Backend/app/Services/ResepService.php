<?php

namespace App\Services;

use App\Models\Resep;
use App\Models\Obat;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResepService
{
    public function getAllResep($filters = [])
    {
        $query = Resep::with(['user', 'obat']);

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
        return Resep::with(['user', 'obat'])->findOrFail($id);
    }

    public function createResep(array $data)
    {
        DB::beginTransaction();

        try {
            $obat = Obat::findOrFail($data['obat_id']);

            $resep = Resep::create([
                'user_id' => $data['user_id'],
                'obat_id' => $data['obat_id'],
                'deskripsi_keluhan' => $data['deskripsi_keluhan'],
                'foto_resep' => $data['foto_resep'] ?? null,
                'catatan_apoteker' => null,
                'status' => 'pending',
            ]);

            Log::info('Resep created', ['resep_id' => $resep->id]);

            DB::commit();
            return $resep->load(['user', 'obat']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create resep: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateResepStatus($id, string $status, ?string $catatanApoteker = null)
    {
        DB::beginTransaction();

        try {
            $resep = Resep::findOrFail($id);

            $validStatuses = ['pending', 'disetujui', 'ditolak'];
            if (!in_array($status, $validStatuses)) {
                throw new \InvalidArgumentException('Status tidak valid');
            }

            if ($resep->status === 'disetujui' || $resep->status === 'ditolak') {
                throw new \InvalidArgumentException('Resep sudah diproses, tidak bisa diubah');
            }

            $resep->status = $status;
            
            if ($catatanApoteker) {
                $resep->catatan_apoteker = $catatanApoteker;
            }

            $resep->save();

            Log::info('Resep status updated', [
                'resep_id' => $id,
                'old_status' => $resep->getOriginal('status'),
                'new_status' => $status
            ]);

            DB::commit();
            return $resep->load(['user', 'obat']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update resep status: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteResep($id)
    {
        $resep = Resep::findOrFail($id);

        if ($resep->status !== 'pending') {
            throw new \InvalidArgumentException('Hanya resep dengan status pending yang bisa dihapus');
        }

        $resep->delete();
        Log::info('Resep deleted', ['resep_id' => $id]);

        return true;
    }
}
