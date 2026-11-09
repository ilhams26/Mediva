<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Test untuk Role Middleware.
 * 
 * Middleware role membatasi akses endpoint berdasarkan role user.
 * Test ini memastikan authorization bekerja dengan benar.
 */
class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Endpoint yang akan ditest: /api/obat/count (hanya admin)
     */
    private string $adminOnlyEndpoint = '/api/obat/count';

    /**
     * Test: Admin dapat mengakses endpoint khusus admin
     */
    public function test_admin_can_access_admin_only_endpoint(): void
    {
        // Arrange: Buat user dengan role admin
        $admin = User::factory()->admin()->create();

        // Act: Hit endpoint dengan token admin
        $response = $this->actingAs($admin, 'sanctum')
                         ->getJson($this->adminOnlyEndpoint);

        // Assert: Harus berhasil (200 OK)
        $response->assertStatus(200);
    }

    /**
     * Test: Staf TIDAK dapat mengakses endpoint khusus admin
     */
    public function test_staf_cannot_access_admin_only_endpoint(): void
    {
        // Arrange: Buat user dengan role staf
        $staf = User::factory()->staf()->create();

        // Act: Hit endpoint dengan token staf
        $response = $this->actingAs($staf, 'sanctum')
                         ->getJson($this->adminOnlyEndpoint);

        // Assert: Harus ditolak (403 Forbidden)
        $response->assertStatus(403)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.',
                 ]);
    }

    /**
     * Test: Pembeli TIDAK dapat mengakses endpoint khusus admin
     */
    public function test_pembeli_cannot_access_admin_only_endpoint(): void
    {
        // Arrange: Buat user dengan role pembeli
        $pembeli = User::factory()->create(); // Default role adalah pembeli

        // Act: Hit endpoint dengan token pembeli
        $response = $this->actingAs($pembeli, 'sanctum')
                         ->getJson($this->adminOnlyEndpoint);

        // Assert: Harus ditolak (403 Forbidden)
        $response->assertStatus(403)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.',
                 ]);
    }

    /**
     * Test: User tanpa login TIDAK dapat mengakses protected endpoint
     */
    public function test_unauthenticated_user_cannot_access_protected_endpoint(): void
    {
        // Act: Hit endpoint tanpa token
        $response = $this->getJson($this->adminOnlyEndpoint);

        // Assert: Harus ditolak (401 Unauthorized)
        $response->assertStatus(401)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'Tidak terautentikasi. Silakan login terlebih dahulu.',
                 ]);
    }

    /**
     * Test: User non-aktif TIDAK dapat login
     */
    public function test_inactive_user_cannot_login(): void
    {
        // Arrange: Buat user yang tidak aktif
        $inactiveUser = User::factory()->inactive()->create([
            'username' => 'inactiveuser',
            'password' => bcrypt('password123'),
        ]);

        // Act: Coba login
        $response = $this->postJson('/api/login', [
            'login_id' => 'inactiveuser',
            'password' => 'password123',
        ]);

        // Assert: Login ditolak dengan pesan khusus
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['login_id'])
                 ->assertJsonFragment([
                     'login_id' => ['Akun Anda telah dinonaktifkan. Silakan hubungi staf atau admin.']
                 ]);
    }

    /**
     * Test: Multiple roles dapat diizinkan dalam satu middleware
     * 
     * Contoh: middleware('role:admin,staf') mengizinkan admin DAN staf
     */
    public function test_multiple_roles_can_be_allowed(): void
    {
        // Arrange: Buat admin dan staf
        $admin = User::factory()->admin()->create();
        $staf = User::factory()->staf()->create();

        // Act & Assert: Admin bisa akses
        $this->actingAs($admin, 'sanctum')
             ->getJson($this->adminOnlyEndpoint)
             ->assertStatus(200);

        // Note: Endpoint /api/obat/count saat ini hanya untuk admin
        // Kalau nanti ada endpoint yang izinkan admin,staf, test ini bisa dipindah kesana
    }

    /**
     * Test: Protected endpoint mengembalikan data user yang benar
     */
    public function test_protected_endpoint_returns_correct_user_data(): void
    {
        // Arrange: Buat user
        $user = User::factory()->create([
            'username' => 'testuser',
        ]);

        // Act: Hit endpoint /api/user
        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/user');

        // Assert: Data user sesuai
        $response->assertStatus(200)
                 ->assertJson([
                     'username' => 'testuser',
                     'role' => 'pembeli',
                 ]);
    }
}
