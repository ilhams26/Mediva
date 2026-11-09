<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Ambil semua user (admin + staf saja), support search by username, paginate 10.
     */
    public function getAllUsers(?string $search = null): LengthAwarePaginator
    {
        return User::query()
            ->whereIn('role', ['admin', 'staf'])
            ->when($search, fn($q) => $q->where('username', 'like', "%{$search}%"))
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    /**
     * Ambil satu user berdasarkan ID.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getUserById(int $id): User
    {
        return User::findOrFail($id);
    }

    /**
     * Buat user baru. Kode user di-generate otomatis: USR-001, USR-002, dst.
     */
    public function createUser(array $data): User
    {
        $user = new User();
        $user->fill([
            'username'      => $data['username'],
            'no_hp'         => $data['no_hp'],
            'password'      => $data['password'],
            'role'          => $data['role'],
            'jenis_kelamin' => $data['jenis_kelamin'] ?? null,
            'tanggal_lahir' => $data['tanggal_lahir'] ?? null,
            'is_active'     => true,
        ]);
        $user->save();

        return $user;
    }

    /**
     * Update data user berdasarkan ID.
     */
    public function updateUser(int $id, array $data): User
    {
        $user = $this->getUserById($id);

        $fillable = [
            'username'      => $data['username'],
            'no_hp'         => $data['no_hp'],
            'role'          => $data['role'],
            'jenis_kelamin' => $data['jenis_kelamin'] ?? null,
            'tanggal_lahir' => $data['tanggal_lahir'] ?? null,
        ];

        // Password hanya di-update jika disertakan
        if (!empty($data['password'])) {
            $fillable['password'] = $data['password'];
        }

        $user->fill($fillable);
        $user->save();

        return $user;
    }

    /**
     * Hapus user berdasarkan ID.
     */
    public function deleteUser(int $id): void
    {
        $user = $this->getUserById($id);
        $user->delete();
    }

    /**
     * Toggle status is_active user.
     */
    public function toggleStatus(int $id): User
    {
        $user = $this->getUserById($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return $user;
    }
}
