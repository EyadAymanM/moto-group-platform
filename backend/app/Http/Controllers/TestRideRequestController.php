<?php

namespace App\Http\Controllers;

use App\Http\Requests\TestRide\StoreTestRideRequest;
use App\Http\Requests\TestRide\UpdateTestRideStatusRequest;
use App\Models\TestRideRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TestRideRequestController extends Controller
{
    /**
     * Public endpoint: Customer submits test ride booking.
     */
    public function store(StoreTestRideRequest $request): JsonResponse
    {
        $lead = TestRideRequest::create($request->validated());

        return response()->json([
            'message' => 'Thank you. Your VIP test ride concierge booking request has been received.',
            'booking_id' => $lead->id,
        ], 201);
    }

    /**
     * CMS listing: Scoped to assigned brand for moderators.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        Gate::authorize('viewAny', TestRideRequest::class);

        $query = TestRideRequest::with(['brand', 'motorcycle']);

        if ($user->isModerator()) {
            $query->where('brand_id', $user->brand_id);
        } elseif ($request->filled('brand_id')) {
            $query->where('brand_id', $request->integer('brand_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('city')) {
            $query->where('preferred_city', $request->string('city'));
        }

        $leads = $query->orderBy('created_at', 'desc')->get();

        return response()->json($leads);
    }

    /**
     * CMS status update: Update status & internal notes.
     */
    public function updateStatus(UpdateTestRideStatusRequest $request, TestRideRequest $testRideRequest): JsonResponse
    {
        Gate::authorize('update', $testRideRequest);

        $testRideRequest->update($request->validated());

        return response()->json([
            'message' => 'Test ride request updated successfully.',
            'lead' => $testRideRequest->load(['brand', 'motorcycle']),
        ]);
    }
}
