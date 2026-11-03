<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     *
     * @param  mixed       
     * @param  string      
     * @param  int    
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
     *
     * @param  mixed      
     * @param  string       
     * @return JsonResponse
     */
    protected function created(mixed $data = null, string $message = 'Data berhasil dibuat.'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    /**
     *
     * @param  string       
     * @param  int          
     * @param  mixed        
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
     *
     * @param  string 
     * @return JsonResponse
     */
    protected function unauthorized(string $message = 'Tidak terautentikasi.'): JsonResponse
    {
        return $this->error($message, 401);
    }

    /**
     *
     * @param  string 
     * @return JsonResponse
     */
    protected function forbidden(string $message = 'Akses ditolak. Anda tidak memiliki izin untuk aksi ini.'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     *
     * @param  string 
     * @return JsonResponse
     */
    protected function notFound(string $message = 'Data tidak ditemukan.'): JsonResponse
    {
        return $this->error($message, 404);
    }

    /**
     *
     * @param  mixed   
     * @param  string 
     * @return JsonResponse
     */
    protected function validationFailed(mixed $errors, string $message = 'Data yang dikirim tidak valid.'): JsonResponse
    {
        return $this->error($message, 422, $errors);
    }
}
