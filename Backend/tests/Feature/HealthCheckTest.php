<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Test untuk endpoint Health Check.
 * 
 * Health check digunakan untuk monitoring status API dan database.
 * Endpoint ini harus bisa diakses tanpa authentication.
 */
class HealthCheckTest extends TestCase
{
    /**
     * Test: Health check endpoint dapat diakses tanpa authentication
     */
    public function test_health_check_endpoint_is_accessible(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
    }

    /**
     * Test: Health check mengembalikan struktur response yang benar
     */
    public function test_health_check_returns_correct_structure(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'data' => [
                         'app',
                         'env',
                         'version',
                         'server',
                         'database',
                         'time',
                         'timezone',
                     ]
                 ]);
    }

    /**
     * Test: Health check mengembalikan status success ketika database OK
     */
    public function test_health_check_returns_success_when_database_ok(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'data' => [
                         'server' => 'ok',
                         'database' => 'ok',
                     ]
                 ]);
    }

    /**
     * Test: Health check mengembalikan data aplikasi yang benar
     */
    public function test_health_check_returns_correct_app_data(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'app' => config('app.name'),
                         'version' => '1.0.0',
                     ]
                 ]);
    }

    /**
     * Test: Health check timestamp dalam format ISO 8601
     */
    public function test_health_check_timestamp_is_valid_iso8601(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
        
        $data = $response->json('data');
        
        // Cek format timestamp ISO 8601
        $this->assertMatchesRegularExpression(
            '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/',
            $data['time']
        );
    }
}
