<?php

namespace App\Http\Controllers;

use App\Http\Requests\Motorcycle\StoreMotorcycleRequest;
use App\Http\Requests\Motorcycle\UpdateMotorcycleRequest;
use App\Models\Motorcycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class MotorcycleController extends Controller
{
    /**
     * Public catalog listing with segment & brand filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Motorcycle::with('brand')
            ->active();

        if ($request->filled('brand_slug')) {
            $query->whereHas('brand', fn ($q) => $q->where('slug', $request->string('brand_slug')));
        } elseif ($request->filled('brand_id')) {
            $query->where('brand_id', $request->integer('brand_id'));
        }

        if ($request->filled('category')) {
            $query->category($request->string('category'));
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->filled('search')) {
            $searchTerm = '%'.$request->string('search').'%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                    ->orWhere('tagline', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm);
            });
        }

        $motorcycles = $query->orderBy('order_index')
            ->orderBy('price_starting_at', 'desc')
            ->get();

        return response()->json($motorcycles);
    }

    /**
     * Public single motorcycle telemetry view.
     */
    public function show(string $slug): JsonResponse
    {
        $motorcycle = Motorcycle::with('brand')
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        return response()->json($motorcycle);
    }

    /**
     * CMS Listing: Admins see all, Moderators see only assigned brand models.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $user = $request->user();
        Gate::authorize('viewAny', Motorcycle::class);

        $query = Motorcycle::with('brand');

        if ($user->isModerator()) {
            $query->where('brand_id', $user->brand_id);
        } elseif ($request->filled('brand_id')) {
            $query->where('brand_id', $request->integer('brand_id'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        $motorcycles = $query->orderBy('order_index')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($motorcycles);
    }

    /**
     * CMS Store: Create motorcycle record.
     */
    public function store(StoreMotorcycleRequest $request): JsonResponse
    {
        $user = $request->user();
        Gate::authorize('create', Motorcycle::class);

        $data = $request->validated();

        if ($user->isModerator()) {
            $data['brand_id'] = $user->brand_id;
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']).'-'.Str::random(4);
        }

        $motorcycle = Motorcycle::create($data)->load('brand');

        return response()->json([
            'message' => 'Motorcycle created successfully.',
            'motorcycle' => $motorcycle,
        ], 201);
    }

    /**
     * CMS Update: Modify motorcycle specifications.
     */
    public function update(UpdateMotorcycleRequest $request, Motorcycle $motorcycle): JsonResponse
    {
        Gate::authorize('update', $motorcycle);

        $data = $request->validated();

        if (! empty($data['name']) && empty($data['slug']) && $motorcycle->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']).'-'.Str::random(4);
        }

        $motorcycle->update($data);

        return response()->json([
            'message' => 'Motorcycle updated successfully.',
            'motorcycle' => $motorcycle->load('brand'),
        ]);
    }

    /**
     * CMS Destroy: Remove motorcycle record.
     */
    public function destroy(Motorcycle $motorcycle): JsonResponse
    {
        Gate::authorize('delete', $motorcycle);

        $motorcycle->delete();

        return response()->json([
            'message' => 'Motorcycle deleted successfully.',
        ]);
    }
}
