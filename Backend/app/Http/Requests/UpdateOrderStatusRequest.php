<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Status kanonis (Part 2 C2): tidak ada 'pending'.
        // Transisi valid (OrderService::validateStatusTransition):
        //   diproses -> siap_diambil | dibatalkan
        //   siap_diambil -> selesai | dibatalkan
        return [
            'status' => ['required', 'in:diproses,siap_diambil,selesai,dibatalkan'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status harus diisi.',
            'status.in' => 'Status tidak valid.',
        ];
    }
}
