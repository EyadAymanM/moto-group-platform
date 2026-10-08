<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    /**
     * List all active brands with motorcycle counts.
     */
    public function index(): JsonResponse
    {
        $brands = Brand::active()
            ->ordered()
            ->withCount(['motorcycles' => fn ($q) => $q->active()])
            ->get();

        return response()->json($brands);
    }

    /**
     * Get single brand details with active models.
     */
    public function show(string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)
            ->active()
            ->with(['motorcycles' => fn ($q) => $q->active()->orderBy('order_index')])
            ->firstOrFail();

        return response()->json($brand);
    }
}
