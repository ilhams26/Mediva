<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ObatController extends Controller
{
    public function count(): JsonResponse
    {
        $total = Obat::count();

        return response()->json([
            'status' => 'success',
            'total' => $total
        ], 200);
    }
}
