<<<<<<< HEAD
﻿<?php
=======
<?php
>>>>>>> 6a1b0f81105332dab859c5537fad784881a7f8d6

namespace App\Http\Controllers;

use App\Services\ResepService;
use App\Http\Requests\CreateResepRequest;
use App\Http\Requests\ValidateResepRequest;
use App\Http\Resources\ResepResource;
use Illuminate\Http\Request;

class ResepController extends Controller
{
    protected $resepService;

    public function __construct(ResepService $resepService)
    {
        $this->resepService = $resepService;
    }

    public function index(Request $request)
    {
        try {
<<<<<<< HEAD
            $user = $request->user();
            $filters = [];

            // Pembeli hanya bisa lihat resep miliknya
            if ($user->role === 'pembeli') {
                $filters['user_id'] = $user->id;
            } else {
                // Admin/Staf bisa filter by user_id atau lihat semua
                $filters = $request->only(['user_id', 'status']);
            }

=======
            $filters = $request->only(['user_id', 'status']);
>>>>>>> 6a1b0f81105332dab859c5537fad784881a7f8d6
            $reseps = $this->resepService->getAllResep($filters);

            return ResepResource::collection($reseps);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data resep',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(CreateResepRequest $request)
    {
        try {
<<<<<<< HEAD
            $user = $request->user();
            $data = $request->validated();

            // Force user_id ke user yang login (tidak bisa atas nama orang lain)
            $data['user_id'] = $user->id;

            $resep = $this->resepService->createResep($data);
=======
            $resep = $this->resepService->createResep($request->validated());
>>>>>>> 6a1b0f81105332dab859c5537fad784881a7f8d6

            return (new ResepResource($resep))
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat resep',
                'error' => $e->getMessage()
            ], 500);
        }
    }

<<<<<<< HEAD
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            $resep = $this->resepService->getResepById($id);

            // Pembeli hanya bisa lihat resep miliknya
            if ($user->role === 'pembeli' && $resep->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses ke resep ini'
                ], 403);
            }

=======
    public function show($id)
    {
        try {
            $resep = $this->resepService->getResepById($id);
>>>>>>> 6a1b0f81105332dab859c5537fad784881a7f8d6
            return new ResepResource($resep);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Resep tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail resep',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function validate(ValidateResepRequest $request, $id)
    {
        try {
            $resep = $this->resepService->validateResep(
                $id,
                $request->validated()['status'],
                $request->user()->id
            );

            return new ResepResource($resep);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Resep tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memvalidasi resep',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
