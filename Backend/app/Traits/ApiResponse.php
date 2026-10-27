<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Mengembalikan response JSON sukses dengan format terstandarisasi.
     *
     * @param  mixed  $data
     * @param  string  $message
     * @param  int  $code
     * @return JsonResponse
     */
    public function successResponse($data = null, string $message = 'Sukses', int $code = 200): JsonResponse
    {
        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    /**
     * Mengembalikan response JSON error dengan format terstandarisasi.
     *
     * @param  string  $message
     * @param  int  $code
     * @param  mixed  $errors
     * @return JsonResponse
     */
    public function errorResponse(string $message = 'Terjadi kesalahan', int $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'errors'  => $errors,
        ], $code);
    }
}
