<?php

use App\Models\Brand;
use App\Models\Motorcycle;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('public can view active brands and motorcycles', function () {
    $response = $this->getJson('/api/brands');
    $response->assertOk()
        ->assertJsonStructure([
            '*' => ['id', 'name', 'slug', 'origin_country'],
        ]);

    $response = $this->getJson('/api/motorcycles');
    $response->assertOk()
        ->assertJsonStructure([
            '*' => ['id', 'name', 'slug', 'category', 'horsepower', 'price_starting_at', 'brand'],
        ]);
});

test('public can submit a test ride enquiry', function () {
    $brand = Brand::first();
    $motorcycle = Motorcycle::first();

    $response = $this->postJson('/api/test-rides', [
        'brand_id' => $brand->id,
        'motorcycle_id' => $motorcycle->id,
        'customer_name' => 'Automated Test User',
        'email' => 'test.user@example.com',
        'phone' => '+971 50 000 0000',
        'preferred_city' => 'Dubai',
        'preferred_date' => now()->addDays(3)->toDateString(),
        'experience_level' => 'Expert',
        'notes' => 'Looking forward to testing the bike.',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['message', 'booking_id']);
});

test('user can authenticate via login endpoint', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'admin@motogroup.com',
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['message', 'user' => ['id', 'email', 'role']]);
});

test('moderator is forbidden from updating another brand motorcycle', function () {
    $ducatiModerator = User::where('email', 'moderator.ducati@motogroup.com')->first();
    $bmwMotorcycle = Motorcycle::whereHas('brand', fn ($q) => $q->where('slug', 'bmw-motorrad'))->first();

    $this->actingAs($ducatiModerator)
        ->putJson("/api/admin/motorcycles/{$bmwMotorcycle->id}", [
            'name' => 'Hacked BMW Name',
            'category' => 'Performance',
            'price_starting_at' => 99999,
            'image_url' => 'https://example.com/img.jpg',
        ])
        ->assertForbidden();
});

test('moderator can update their own brand motorcycle', function () {
    $ducatiModerator = User::where('email', 'moderator.ducati@motogroup.com')->first();
    $ducatiMotorcycle = Motorcycle::where('brand_id', $ducatiModerator->brand_id)->first();

    $this->actingAs($ducatiModerator)
        ->putJson("/api/admin/motorcycles/{$ducatiMotorcycle->id}", [
            'name' => 'Updated Panigale Name',
            'category' => 'Performance',
            'price_starting_at' => 135000,
            'image_url' => 'https://example.com/img.jpg',
        ])
        ->assertOk()
        ->assertJsonPath('motorcycle.name', 'Updated Panigale Name');
});

test('admin can update any brand motorcycle', function () {
    $admin = User::where('role', 'admin')->first();
    $bmwMotorcycle = Motorcycle::whereHas('brand', fn ($q) => $q->where('slug', 'bmw-motorrad'))->first();

    $this->actingAs($admin)
        ->putJson("/api/admin/motorcycles/{$bmwMotorcycle->id}", [
            'name' => 'Admin Updated BMW Name',
            'category' => 'Adventure & Touring',
            'price_starting_at' => 118000,
            'image_url' => 'https://example.com/img.jpg',
        ])
        ->assertOk()
        ->assertJsonPath('motorcycle.name', 'Admin Updated BMW Name');
});

test('unauthenticated request to protected admin route returns 401 json and not 404', function () {
    $response = $this->get('/api/admin/motorcycles');
    $response->assertStatus(401)
        ->assertJson(['message' => 'Unauthenticated.']);
});

test('authenticated user can retrieve profile via /api/auth/user', function () {
    $admin = User::where('role', 'admin')->first();

    $this->actingAs($admin)
        ->getJson('/api/auth/user')
        ->assertOk()
        ->assertJsonPath('user.email', $admin->email);
});
