<?php

namespace Database\Seeders;

use App\Models\Motorcycle;
use App\Models\TestRideRequest;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TestRideRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $panigale = Motorcycle::where('slug', 'ducati-panigale-v4-s')->first();
        $gs = Motorcycle::where('slug', 'bmw-r-1300-gs-adventure')->first();
        $gts = Motorcycle::where('slug', 'vespa-gts-super-300-tech')->first();
        $fatboy = Motorcycle::where('slug', 'harley-davidson-fat-boy-114')->first();

        $leads = [
            [
                'brand_id' => $panigale?->brand_id,
                'motorcycle_id' => $panigale?->id,
                'customer_name' => 'Tariq Al-Mansoor',
                'email' => 'tariq.mansoor@example.com',
                'phone' => '+971 50 123 4567',
                'preferred_city' => 'Dubai',
                'preferred_date' => Carbon::now()->addDays(2)->toDateString(),
                'experience_level' => 'Expert',
                'notes' => 'Interested in track pack options and finance plan. Previous owner of Panigale V2.',
                'status' => 'pending',
                'admin_notes' => null,
            ],
            [
                'brand_id' => $gs?->brand_id,
                'motorcycle_id' => $gs?->id,
                'customer_name' => 'Faisal Al-Otaibi',
                'email' => 'faisal.otaibi@example.com',
                'phone' => '+966 55 987 6543',
                'preferred_city' => 'Riyadh',
                'preferred_date' => Carbon::now()->addDays(4)->toDateString(),
                'experience_level' => 'Intermediate',
                'notes' => 'Looking for adventure panniers setup for winter desert touring.',
                'status' => 'confirmed',
                'admin_notes' => 'Booking slot confirmed for 4:00 PM at Riyadh Al Malqa showroom.',
            ],
            [
                'brand_id' => $gts?->brand_id,
                'motorcycle_id' => $gts?->id,
                'customer_name' => 'Nour Al-Kuwari',
                'email' => 'nour.kuwari@example.com',
                'phone' => '+974 33 456 7890',
                'preferred_city' => 'Doha',
                'preferred_date' => Carbon::now()->subDays(1)->toDateString(),
                'experience_level' => 'Beginner',
                'notes' => 'Commuting across Pearl Qatar. Inquiring about Grigio Ottanio stock availability.',
                'status' => 'completed',
                'admin_notes' => 'Test ride completed successfully. Client received official quotation.',
            ],
            [
                'brand_id' => $fatboy?->brand_id,
                'motorcycle_id' => $fatboy?->id,
                'customer_name' => 'Rashid Al-Nuaimi',
                'email' => 'rashid.nuaimi@example.com',
                'phone' => '+971 52 789 0123',
                'preferred_city' => 'Dubai',
                'preferred_date' => Carbon::now()->addDays(5)->toDateString(),
                'experience_level' => 'Expert',
                'notes' => 'Wants to test ride the 114 engine on Sheikh Zayed Road showroom strip.',
                'status' => 'pending',
                'admin_notes' => null,
            ],
        ];

        foreach ($leads as $lead) {
            if (! empty($lead['brand_id'])) {
                TestRideRequest::create($lead);
            }
        }
    }
}
