<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'obat_id' => ['required', 'integer', 'exists:obats,id'],
            'batch_number' => ['required', 'string', 'max:255'],
            'expired_date' => ['required', 'date'],
            'jumlah_awal' => ['required', 'integer', 'min:1'],
        ];
    }
}
