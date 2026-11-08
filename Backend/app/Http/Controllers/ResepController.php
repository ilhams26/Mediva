<?php

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
            $filters = $request->only(['user_id', 'status']);
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
            $resep = $this->resepService->createResep($request->validated());

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

    public function show($id)
    {
        try {
            $resep = $this->resepService->getResepById($id);
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
