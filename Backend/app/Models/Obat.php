<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Obat extends Model
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
        'stok_minimum' => 'integer',
    ];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    public function batches()
    {
        return $this->hasMany(Batch::class, 'obat_id');
    }

    public function embedding()
    {
        return $this->hasOne(ObatEmbedding::class, 'obat_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'obat_id');
    }

    public function pergerakanStoks()
    {
        return $this->hasMany(PergerakanStok::class, 'obat_id');
    }

    public function interaksiPenggunas()
    {
        return $this->hasMany(InteraksiPengguna::class, 'obat_id');
    }

    public function getStokTotalAttribute(): int
    {
        return (int) $this->batches()->where('expired_date', '>=', now()->toDateString())->sum('jumlah_sisa');
    }
}
