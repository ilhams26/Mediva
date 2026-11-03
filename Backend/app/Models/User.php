<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'no_hp',
        'role',
        'otp',
        'jenis_kelamin',
        'tanggal_lahir',
        'password',
        'otp_verified_at',
        'otp_expired_at',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'otp',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'password' => 'hashed',
            'otp_verified_at' => 'datetime',
            'otp_expired_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function reseps()
    {
        return $this->hasMany(Resep::class, 'user_id');
    }

    public function notifikasis()
    {
        return $this->hasMany(Notifikasi::class, 'user_id');
    }

    public function interaksiPenggunas()
    {
        return $this->hasMany(InteraksiPengguna::class, 'user_id');
    }

    public function resepDivalidasi()
    {
        return $this->hasMany(Resep::class, 'validated_by');
    }

    public function pergerakanStoks()
    {
        return $this->hasMany(PergerakanStok::class, 'created_by');
    }
}
