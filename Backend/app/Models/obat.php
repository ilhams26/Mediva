<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class obat extends Model
{
    protected $table = 'obats';
    protected $fillable = [
        'kategori_id',
        'nama',
        'deskripsi',
        'harga',
        'jenis',
        'stok_minimum',
        'foto',
        'is_active',
    ];
}
