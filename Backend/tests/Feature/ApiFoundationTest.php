<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ApiFoundationTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Uji endpoint /api/health mengembalikan 200 dengan format JSON standar.
     */
    public function test_health_endpoint_returns_success(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'api',
                    'database',
                    'timestamp',
                    'version',
                    'environment',
                ],
            ])
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'api' => 'healthy',
                ],
            ]);
    }

    /**
     * Uji rute tidak dikenal mengembalikan JSON 404 tanpa stack trace HTML.
     */
    public function test_undefined_route_returns_json_404(): void
    {
        $response = $this->getJson('/api/non-existent-endpoint');

        $response->assertStatus(404)
            ->assertJson([
                'status'  => 'error',
                'message' => 'Resource tidak ditemukan.',
            ]);
    }

    /**
     * Uji akses rute terproteksi tanpa token mengembalikan JSON 401 standar.
     */
    public function test_unauthenticated_request_returns_json_401(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401)
            ->assertJson([
                'status'  => 'error',
                'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
            ]);
    }

    /**
     * Uji kegagalan validasi mengembalikan JSON 422 terstruktur.
     */
    public function test_validation_failure_returns_json_422(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'status',
                'message',
                'errors' => [
                    'username',
                    'no_hp',
                    'password',
                ],
            ])
            ->assertJson([
                'status' => 'error',
            ]);
    }

    /**
     * Uji RoleMiddleware menolak role yang tidak diizinkan dengan JSON 403.
     */
    public function test_role_middleware_blocks_forbidden_role(): void
    {
        $pembeli = User::factory()->create([
            'role'      => 'pembeli',
            'is_active' => true,
        ]);

        // Simulasikan endpoint yang hanya untuk admin
        \Illuminate\Support\Facades\Route::get('/api/test-admin-only', function () {
            return response()->json(['status' => 'success']);
        })->middleware(['auth:sanctum', 'role:admin']);

        $response = $this->actingAs($pembeli, 'sanctum')->getJson('/api/test-admin-only');

        $response->assertStatus(403)
            ->assertJson([
                'status'  => 'error',
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.',
            ]);
    }

    /**
     * Uji RoleMiddleware menolak user yang dinonaktifkan dengan JSON 403.
     */
    public function test_role_middleware_blocks_inactive_user(): void
    {
        $inactiveAdmin = User::factory()->create([
            'role'      => 'admin',
            'is_active' => false,
        ]);

        \Illuminate\Support\Facades\Route::get('/api/test-admin-status', function () {
            return response()->json(['status' => 'success']);
        })->middleware(['auth:sanctum', 'role:admin']);

        $response = $this->actingAs($inactiveAdmin, 'sanctum')->getJson('/api/test-admin-status');

        $response->assertStatus(403)
            ->assertJson([
                'status'  => 'error',
                'message' => 'Akun Anda telah dinonaktifkan. Silakan hubungi admin.',
            ]);
    }

    /**
     * Uji RoleMiddleware mengizinkan role yang sesuai.
     */
    public function test_role_middleware_allows_authorized_role(): void
    {
        $admin = User::factory()->create([
            'role'      => 'admin',
            'is_active' => true,
        ]);

        \Illuminate\Support\Facades\Route::get('/api/test-admin-pass', function () {
            return response()->json([
                'status'  => 'success',
                'message' => 'Berhasil masuk.',
            ]);
        })->middleware(['auth:sanctum', 'role:admin']);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/test-admin-pass');

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Berhasil masuk.',
            ]);
    }
}
