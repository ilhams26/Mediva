<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class interaksi_pengguna extends Model
{
    protected $table = 'interaksi_pengguna';

    protected $fillable = [
        'user_id',
        'obat_id',
        'event_type'
    ];

    public function user()
    {
        return $this->belongsTo(user::class, 'user_id');
    }

    public function obat()
    {
        return $this->belongsTo(obat::class, 'obat_id');
    }
}
