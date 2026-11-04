<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;

/**
 * 
 * Menggunakan ApiResponse trait agar semua respons JSON seragam.
 */
abstract class Controller
{
    use ApiResponse;
}
