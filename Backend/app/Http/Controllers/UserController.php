<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * GET /users - Daftar semua user (admin & staf), support search & pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $users  = $this->userService->getAllUsers($search);

        return $this->success([
            'data'       => UserResource::collection($users),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ], 'Daftar pengguna berhasil diambil.');
    }

    /**
     * POST /users - Buat user baru.
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return $this->created(new UserResource($user), 'Pengguna berhasil dibuat.');
    }

    /**
     * GET /users/{id} - Detail satu user.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);

            return $this->success(new UserResource($user), 'Detail pengguna berhasil diambil.');
        } catch (ModelNotFoundException) {
            return $this->notFound('Pengguna tidak ditemukan.');
        }
    }

    /**
     * PUT /users/{id} - Update data user.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            $user = $this->userService->updateUser($id, $request->validated());

            return $this->success(new UserResource($user), 'Data pengguna berhasil diperbarui.');
        } catch (ModelNotFoundException) {
            return $this->notFound('Pengguna tidak ditemukan.');
        }
    }

    /**
     * DELETE /users/{id} - Hapus user (tidak bisa hapus diri sendiri).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($request->user()->id === $id) {
            return $this->forbidden('Anda tidak dapat menghapus akun Anda sendiri.');
        }

        try {
            $this->userService->deleteUser($id);

            return $this->success(null, 'Pengguna berhasil dihapus.');
        } catch (ModelNotFoundException) {
            return $this->notFound('Pengguna tidak ditemukan.');
        }
    }

    /**
     * PATCH /users/{id}/status - Toggle status is_active.
     */
    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        if ($request->user()->id === $id) {
            return $this->forbidden('Anda tidak dapat mengubah status akun Anda sendiri.');
        }

        try {
            $user = $this->userService->toggleStatus($id);

            $statusText = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

            return $this->success(new UserResource($user), "Pengguna berhasil {$statusText}.");
        } catch (ModelNotFoundException) {
            return $this->notFound('Pengguna tidak ditemukan.');
        }
    }
}
