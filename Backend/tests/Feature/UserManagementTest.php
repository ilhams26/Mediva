<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    // ─── Helper ───────────────────────────────────────────────────────────────

    private function makeAdmin(array $overrides = []): User
    {
        return User::factory()->create(array_merge([
            'role'      => 'admin',
            'is_active' => true,
        ], $overrides));
    }

    private function makeStaf(array $overrides = []): User
    {
        return User::factory()->create(array_merge([
            'role'      => 'staf',
            'is_active' => true,
        ], $overrides));
    }

    // ─── Tests ────────────────────────────────────────────────────────────────

    /**
     * 1. Admin dapat melihat daftar pengguna.
     */
    public function test_admin_can_list_users(): void
    {
        $admin = $this->makeAdmin();
        // Buat beberapa user staf untuk memastikan data ada
        User::factory()->count(3)->create(['role' => 'staf']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'data',
                    'pagination' => [
                        'current_page',
                        'last_page',
                        'per_page',
                        'total',
                    ],
                ],
            ])
            ->assertJson(['status' => 'success']);
    }

    /**
     * 2. Staf tidak bisa mengakses manajemen pengguna (403).
     */
    public function test_staff_cannot_access_user_management(): void
    {
        $staf = $this->makeStaf();

        $response = $this->actingAs($staf, 'sanctum')
            ->getJson('/api/users');

        $response->assertStatus(403);
    }

    /**
     * 3. Admin dapat membuat pengguna baru.
     */
    public function test_admin_can_create_user(): void
    {
        $admin = $this->makeAdmin();

        $payload = [
            'username'              => 'staf_baru',
            'no_hp'                 => '081234567890',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'role'                  => 'staf',
            'jenis_kelamin'         => 'L',
            'tanggal_lahir'         => '1995-06-15',
        ];

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/users', $payload);

        $response->assertStatus(201)
            ->assertJson(['status' => 'success'])
            ->assertJsonPath('data.username', 'staf_baru')
            ->assertJsonPath('data.role', 'Staf');

        $this->assertDatabaseHas('users', ['username' => 'staf_baru', 'role' => 'staf']);
    }

    /**
     * 4. Admin dapat memperbarui data pengguna.
     */
    public function test_admin_can_update_user(): void
    {
        $admin  = $this->makeAdmin();
        $target = $this->makeStaf(['username' => 'staf_lama']);

        $payload = [
            'username' => 'staf_diupdate',
            'no_hp'    => '082345678901',
            'role'     => 'staf',
        ];

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/users/{$target->id}", $payload);

        $response->assertStatus(200)
            ->assertJson(['status' => 'success'])
            ->assertJsonPath('data.username', 'staf_diupdate');

        $this->assertDatabaseHas('users', ['id' => $target->id, 'username' => 'staf_diupdate']);
    }

    /**
     * 5. Admin dapat menghapus pengguna.
     */
    public function test_admin_can_delete_user(): void
    {
        $admin  = $this->makeAdmin();
        $target = $this->makeStaf();

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/users/{$target->id}");

        $response->assertStatus(200)
            ->assertJson(['status' => 'success']);

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    /**
     * 6. Admin dapat toggle status is_active pengguna.
     */
    public function test_admin_can_toggle_user_status(): void
    {
        $admin  = $this->makeAdmin();
        $target = $this->makeStaf(['is_active' => true]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/users/{$target->id}/status");

        $response->assertStatus(200)
            ->assertJson(['status' => 'success']);

        // Status harus berubah menjadi false
        $this->assertDatabaseHas('users', ['id' => $target->id, 'is_active' => false]);
    }
}
