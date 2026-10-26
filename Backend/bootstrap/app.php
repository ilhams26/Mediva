<?php

use App\Http\Middleware\RoleMiddleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function(): void {
            \Illuminate\Support\Facades\RateLimiter::for('login', function (Request $request) {
                // Maks 5 percobaan login per menit per IP
                return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)
                    ->by($request->ip())
                    ->response(fn() => response()->json([
                        'status'  => 'error',
                        'message' => 'Terlalu banyak percobaan login. Coba lagi dalam 1 menit.',
                    ], 429));
            });

            \Illuminate\Support\Facades\RateLimiter::for('otp', function (Request $request) {
                // Maks 3 permintaan OTP per menit per IP
                return \Illuminate\Cache\RateLimiting\Limit::perMinute(3)
                    ->by($request->ip())
                    ->response(fn() => response()->json([
                        'status'  => 'error',
                        'message' => 'Terlalu banyak permintaan OTP. Coba lagi dalam 1 menit.',
                    ], 429));
            });

            \Illuminate\Support\Facades\RateLimiter::for('ai', function (Request $request) {
                // Maks 10 request AI per menit per user (atau per IP jika belum login)
                $key = $request->user()?->id ?? $request->ip();

                return \Illuminate\Cache\RateLimiting\Limit::perMinute(10)
                    ->by($key)
                    ->response(fn() => response()->json([
                        'status'  => 'error',
                        'message' => 'Terlalu banyak permintaan ke AI. Coba lagi dalam 1 menit.',
                    ], 429));
            });
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);


        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function (Request $request, \Throwable $e): bool {
            return $request->is('api/*') || $request->expectsJson();
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Data yang dikirim tidak valid.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        // Render AuthenticationException → 401 JSON
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Tidak terautentikasi. Silakan login terlebih dahulu.',
                ], 401);
            }
        });

        // Render NotFoundHttpException → 404 JSON
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Endpoint atau resource tidak ditemukan.',
                ], 404);
            }
        });

        // Render MethodNotAllowedHttpException → 405 JSON
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'HTTP method tidak diizinkan untuk endpoint ini.',
                ], 405);
            }
        });
    })
    ->create();
