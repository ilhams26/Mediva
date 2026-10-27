<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Uji admin dapat melihat daftar pengguna.
     */
    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Daftar pengguna berhasil diambil.',
            ])
            ->assertJsonStructure([
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'username',
                            'no_hp',
                            'role',
                            'is_active',
                        ],
                    ],
                    'current_page',
                    'total',
                ],
            ]);
    }

    /**
     * Uji admin dapat menambahkan user baru (misalnya staf).
     */
    public function test_admin_can_create_staff_user(): void
    {
        $admin = User::factory()->admin()->create();

        $payload = [
            'username'      => 'stafbaru_' . time(),
            'no_hp'         => '0821' . rand(10000000, 99999999),
            'password'      => 'stafpassword123',
            'role'          => 'staf',
            'jenis_kelamin' => 'P',
            'tanggal_lahir' => '1995-05-15',
            'is_active'     => true,
        ];

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/users', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Pengguna berhasil ditambahkan.',
            ])
            ->assertJsonPath('data.username', $payload['username'])
            ->assertJsonPath('data.role', 'staf');

        $this->assertDatabaseHas('users', [
            'username' => $payload['username'],
            'role'     => 'staf',
        ]);
    }

    /**
     * Uji admin dapat melihat detail pengguna.
     */
    public function test_admin_can_view_user_detail(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/admin/users/{$target->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data'   => [
                    'id'       => $target->id,
                    'username' => $target->username,
                ],
            ]);
    }

    /**
     * Uji admin dapat memperbarui informasi pengguna.
     */
    public function test_admin_can_update_user(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create(['role' => 'pembeli']);

        $updatedUsername = 'userupdated_' . time();

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/users/{$target->id}", [
            'username' => $updatedUsername,
            'role'     => 'staf', // Promosikan ke staf
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Data pengguna berhasil diperbarui.',
            ])
            ->assertJsonPath('data.username', $updatedUsername)
            ->assertJsonPath('data.role', 'staf');

        $this->assertEquals('staf', $target->fresh()->role);
    }

    /**
     * Uji admin dapat mengubah status aktif/nonaktif pengguna.
     */
    public function test_admin_can_toggle_user_active_status(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create(['is_active' => true]);

        // Nonaktifkan
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/users/{$target->id}/toggle-active");

        $response->assertStatus(200)
            ->assertJsonPath('data.is_active', false);

        $this->assertFalse($target->fresh()->is_active);

        // Aktifkan kembali
        $response2 = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/admin/users/{$target->id}/toggle-active");

        $response2->assertStatus(200)
            ->assertJsonPath('data.is_active', true);

        $this->assertTrue($target->fresh()->is_active);
    }

    /**
     * Uji admin dapat menghapus pengguna.
     */
    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/users/{$target->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Pengguna berhasil dihapus.',
            ]);

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    /**
     * Uji staf dan pembeli ditolak saat mengakses endpoint manajemen user (403).
     */
    public function test_non_admin_cannot_access_user_management(): void
    {
        $staf = User::factory()->staf()->create();
        $pembeli = User::factory()->create(['role' => 'pembeli']);

        // Staf mencoba akses daftar user
        $responseStaff = $this->actingAs($staf, 'sanctum')->getJson('/api/admin/users');
        $responseStaff->assertStatus(403)
            ->assertJson([
                'status'  => 'error',
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.',
            ]);

        // Pembeli mencoba akses daftar user
        $responsePembeli = $this->actingAs($pembeli, 'sanctum')->getJson('/api/admin/users');
        $responsePembeli->assertStatus(403)
            ->assertJson([
                'status'  => 'error',
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.',
            ]);
    }
}
