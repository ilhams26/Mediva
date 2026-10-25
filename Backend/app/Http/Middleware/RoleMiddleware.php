<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware untuk membatasi akses endpoint berdasarkan role user.
 *
 * Penggunaan di route:
 *   ->middleware('role:admin')           — hanya admin
 *   ->middleware('role:admin,staf')      — admin atau staf
 *   ->middleware('role:pembeli')         — hanya pembeli
 *
 * Middleware ini harus digunakan SETELAH middleware 'auth:sanctum'
 * agar $request->user() sudah terisi.
 */
class RoleMiddleware
{
    /**
     * Proses request masuk.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @param  string   ...$roles  Satu atau lebih role yang diizinkan
     * @return Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Jika user belum login sama sekali (seharusnya sudah ditangani auth:sanctum,
        // tapi sebagai pengaman tambahan)
        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Tidak terautentikasi.',
            ], 401);
        }

        // Cek apakah role user ada di daftar role yang diizinkan
        if (!in_array($user->role, $roles, strict: true)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.',
            ], 403);
        }

        return $next($request);
    }
}
