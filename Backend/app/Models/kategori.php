<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class kategori extends Model
{
    protected $table = 'kategoris';
    protected $fillable = [
        'nama'
    ];
    public function obat()
    {
        return $this->hasMany(obat::class, 'kategori_id');
    }
}
