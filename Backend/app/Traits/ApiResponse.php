<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Trait ApiResponse
 *
 * Menyediakan format respons JSON yang seragam untuk seluruh controller.
 * Semua endpoint wajib menggunakan trait ini agar konsistensi format terjaga.
 */
trait ApiResponse
{
    /**
     * Respons sukses standar.
     *
     * @param  mixed        $data    Data payload yang dikembalikan ke klien
     * @param  string       $message Pesan sukses yang dapat dibaca manusia
     * @param  int          $code    HTTP status code (default 200)
     * @return JsonResponse
     */
    protected function success(mixed $data = null, string $message = 'Berhasil.', int $code = 200): JsonResponse
    {
        $response = [
            'status'  => 'success',
            'message' => $message,
        ];

        if (!is_null($data)) {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    /**
     * Respons untuk resource yang baru dibuat (201 Created).
     *
     * @param  mixed        $data    Data resource yang dibuat
     * @param  string       $message Pesan sukses
     * @return JsonResponse
     */
    protected function created(mixed $data = null, string $message = 'Data berhasil dibuat.'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    /**
     * Respons error generik.
     *
     * @param  string       $message Pesan error yang dapat dibaca manusia
     * @param  int          $code    HTTP status code
     * @param  mixed        $errors  Detail error (mis. dari validasi)
     * @return JsonResponse
     */
    protected function error(string $message = 'Terjadi kesalahan.', int $code = 400, mixed $errors = null): JsonResponse
    {
        $response = [
            'status'  => 'error',
            'message' => $message,
        ];

        if (!is_null($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Respons 401 Unauthorized — tidak terautentikasi.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function unauthorized(string $message = 'Tidak terautentikasi.'): JsonResponse
    {
        return $this->error($message, 401);
    }

    /**
     * Respons 403 Forbidden — terautentikasi tapi tidak punya hak akses.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function forbidden(string $message = 'Akses ditolak. Anda tidak memiliki izin untuk aksi ini.'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     * Respons 404 Not Found.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function notFound(string $message = 'Data tidak ditemukan.'): JsonResponse
    {
        return $this->error($message, 404);
    }

    /**
     * Respons 422 Unprocessable Entity — validasi gagal.
     *
     * @param  mixed  $errors  Array berisi detail field yang gagal validasi
     * @param  string $message
     * @return JsonResponse
     */
    protected function validationFailed(mixed $errors, string $message = 'Data yang dikirim tidak valid.'): JsonResponse
    {
        return $this->error($message, 422, $errors);
    }
}
