<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $table = 'notifikasis';

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'tipe',
        'reference_id',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'reference_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
