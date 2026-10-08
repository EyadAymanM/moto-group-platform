<?php

namespace App\Policies;

use App\Models\TestRideRequest;
use App\Models\User;

class TestRideRequestPolicy
{
    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function view(User $user, TestRideRequest $lead): bool
    {
        return $lead->brand_id === $user->brand_id;
    }

    public function update(User $user, TestRideRequest $lead): bool
    {
        return $lead->brand_id === $user->brand_id;
    }

    public function delete(User $user, TestRideRequest $lead): bool
    {
        return $user->isAdmin();
    }
}
