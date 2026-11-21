<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.obat_id' => ['required', 'integer', 'exists:obats,id'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'metode_pembayaran' => ['required', 'in:cash,midtrans'],
            'resep_id' => ['nullable', 'integer', 'exists:resep,id'],
            'order_source' => ['nullable', 'in:mobile,pos'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Order harus memiliki minimal 1 item.',
            'items.*.obat_id.exists' => 'Obat tidak ditemukan.',
            'items.*.qty.min' => 'Quantity minimal 1.',
            'metode_pembayaran.in' => 'Metode pembayaran harus cash atau midtrans.',
            'order_source.in' => 'Order source tidak valid (mobile|pos).',
        ];
    }
}
