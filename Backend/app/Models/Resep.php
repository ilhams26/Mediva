<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resep extends Model
{
    protected $table = 'resep';

    protected $fillable = [
        'user_id',
        'orders_id',
        'foto_resep',
        'status',
        'validated_by',
        'validated_at',
    ];

    protected $casts = [
        'validated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'orders_id');
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}
