<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
                'errors'  => null,
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (!$user->is_active) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Akun Anda telah dinonaktifkan. Silakan hubungi admin.',
                'errors'  => null,
            ], Response::HTTP_FORBIDDEN);
        }

        if (!empty($roles) && !in_array($user->role, $roles, true)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.',
                'errors'  => null,
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
