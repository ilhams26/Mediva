<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);

        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Validasi gagal.',
                        'errors'  => $e->errors(),
                    ], 422);
                }

                if ($e instanceof AuthenticationException) {
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
                        'errors'  => null,
                    ], 401);
                }

                if ($e instanceof AuthorizationException || $e instanceof AccessDeniedHttpException) {
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Akses ditolak. Anda tidak memiliki izin.',
                        'errors'  => null,
                    ], 403);
                }

                if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Resource tidak ditemukan.',
                        'errors'  => null,
                    ], 404);
                }

                if ($e instanceof MethodNotAllowedHttpException) {
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Metode HTTP tidak diizinkan.',
                        'errors'  => null,
                    ], 405);
                }

                if ($e instanceof ThrottleRequestsException) {
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
                        'errors'  => null,
                    ], 429);
                }

                if ($e instanceof HttpExceptionInterface) {
                    return response()->json([
                        'status'  => 'error',
                        'message' => $e->getMessage() ?: 'Terjadi kesalahan HTTP.',
                        'errors'  => null,
                    ], $e->getStatusCode());
                }

                $isDebug = config('app.debug');

                return response()->json([
                    'status'  => 'error',
                    'message' => $isDebug ? $e->getMessage() : 'Terjadi kesalahan pada server.',
                    'errors'  => $isDebug ? [
                        'exception' => get_class($e),
                        'file'      => $e->getFile(),
                        'line'      => $e->getLine(),
                    ] : null,
                ], 500);
            }
        });
    })->create();
