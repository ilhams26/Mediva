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

    protected $casts = [
        'harga' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function kategori()
    {
        return $this->belongsTo(kategori::class, 'kategori_id');
    }
    public function batches()
    {
        return $this->hasMany(batches::class, 'obat_id');
    }
    public function rekomendasi()
    {
        return $this->belongsTo(rekomendasi::class, 'obat_id');
    }
}
