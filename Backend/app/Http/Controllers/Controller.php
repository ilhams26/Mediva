<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;

/**
 * Base Controller untuk semua controller di Mediva.
 * Menggunakan ApiResponse trait agar semua respons JSON seragam.
 */
abstract class Controller
{
    use ApiResponse;
}
