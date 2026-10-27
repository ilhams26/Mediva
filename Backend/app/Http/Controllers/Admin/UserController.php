<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCreateUserRequest;
use App\Http\Requests\AdminUpdateUserRequest;
use App\Services\UserService;
use App\Traits\ApiResponse;
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
     * Menampilkan daftar pengguna (admin, staf, pembeli).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'role', 'is_active']);
        $perPage = (int) $request->input('per_page', 15);

        $users = $this->userService->listUsers($filters, $perPage);

        return $this->successResponse($users, 'Daftar pengguna berhasil diambil.');
    }

    /**
     * Menambahkan pengguna baru.
     */
    public function store(AdminCreateUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return $this->successResponse($user, 'Pengguna berhasil ditambahkan.', 201);
    }

    /**
     * Menampilkan detail seorang pengguna.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        return $this->successResponse($user, 'Data pengguna berhasil diambil.');
    }

    /**
     * Memperbarui data pengguna.
     */
    public function update(AdminUpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        $updatedUser = $this->userService->updateUser($user, $request->validated());

        return $this->successResponse($updatedUser, 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Mengaktifkan atau menonaktifkan pengguna.
     */
    public function toggleActive(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        $toggledUser = $this->userService->toggleActiveStatus($user);

        $statusText = $toggledUser->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return $this->successResponse($toggledUser, "Pengguna berhasil {$statusText}.");
    }

    /**
     * Menghapus pengguna.
     */
    public function destroy(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        $this->userService->deleteUser($user);

        return $this->successResponse(null, 'Pengguna berhasil dihapus.');
    }
}
