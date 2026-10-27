<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;

class UserService
{
    /**
     * Mengambil daftar pengguna dengan filter dan paginasi.
     *
     * @param  array  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function listUsers(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('username', 'ilike', "%{$search}%")
                  ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Membuat pengguna baru (oleh admin).
     *
     * @param  array  $data
     * @return User
     */
    public function createUser(array $data): User
    {
        $user = new User();
        $user->fill(Arr::except($data, ['password']));
        $user->password = $data['password'];
        $user->is_active = $data['is_active'] ?? true;
        $user->save();

        return $user;
    }

    /**
     * Mengambil data detail pengguna berdasarkan ID.
     *
     * @param  int  $id
     * @return User
     */
    public function getUserById(int $id): User
    {
        return User::findOrFail($id);
    }

    /**
     * Memperbarui data pengguna.
     *
     * @param  User  $user
     * @param  array  $data
     * @return User
     */
    public function updateUser(User $user, array $data): User
    {
        $attributes = Arr::except($data, ['password']);
        $user->fill($attributes);

        if (!empty($data['password'])) {
            $user->password = $data['password'];
        }

        $user->save();

        return $user;
    }

    /**
     * Mengubah status aktif / nonaktif pengguna.
     *
     * @param  User  $user
     * @return User
     */
    public function toggleActiveStatus(User $user): User
    {
        $user->is_active = !$user->is_active;
        $user->save();

        // Jika dinonaktifkan, cabut semua token aktif agar langsung logout
        if (!$user->is_active) {
            $user->tokens()->delete();
        }

        return $user;
    }

    /**
     * Menghapus pengguna.
     *
     * @param  User  $user
     * @return void
     */
    public function deleteUser(User $user): void
    {
        $user->tokens()->delete();
        $user->delete();
    }
}
