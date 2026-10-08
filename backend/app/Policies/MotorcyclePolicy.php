<?php

namespace App\Policies;

use App\Models\Motorcycle;
use App\Models\User;

class MotorcyclePolicy
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

    public function view(User $user, Motorcycle $motorcycle): bool
    {
        return $motorcycle->brand_id === $user->brand_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function update(User $user, Motorcycle $motorcycle): bool
    {
        return $motorcycle->brand_id === $user->brand_id;
    }

    public function delete(User $user, Motorcycle $motorcycle): bool
    {
        return $motorcycle->brand_id === $user->brand_id;
    }
}
