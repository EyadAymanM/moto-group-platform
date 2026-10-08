<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Group Administrator (Full access across all brands & CMS settings)
        User::updateOrCreate(
            ['email' => 'admin@motogroup.com'],
            [
                'name' => 'Group Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'brand_id' => null,
            ]
        );

        // 2. Brand-Specific Moderators (Scoped data entry and test ride viewing)
        $brandMap = [
            'ducati' => [
                'name' => 'Ducati Brand Lead',
                'email' => 'moderator.ducati@motogroup.com',
            ],
            'bmw-motorrad' => [
                'name' => 'BMW Motorrad Lead',
                'email' => 'moderator.bmw@motogroup.com',
            ],
            'vespa' => [
                'name' => 'Vespa Brand Lead',
                'email' => 'moderator.vespa@motogroup.com',
            ],
            'harley-davidson' => [
                'name' => 'Harley-Davidson Lead',
                'email' => 'moderator.harley@motogroup.com',
            ],
        ];

        foreach ($brandMap as $slug => $userData) {
            $brand = Brand::where('slug', $slug)->first();

            if ($brand) {
                User::updateOrCreate(
                    ['email' => $userData['email']],
                    [
                        'name' => $userData['name'],
                        'password' => Hash::make('password'),
                        'role' => 'moderator',
                        'brand_id' => $brand->id,
                    ]
                );
            }
        }
    }
}
