<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Ducati',
                'slug' => 'ducati',
                'tagline' => 'Style, Sophistication and Performance',
                'description' => 'Italian motorcycle manufacturer synonymous with racing glory, cutting-edge telemetry, and world championship performance.',
                'origin_country' => 'Italy',
                'logo_url' => 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1920&q=80',
                'is_active' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'BMW Motorrad',
                'slug' => 'bmw-motorrad',
                'tagline' => 'Make Life a Ride',
                'description' => 'Pinnacle of German engineering excellence, conquering global terrain from desert rally expeditions to superbike circuits.',
                'origin_country' => 'Germany',
                'logo_url' => 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1920&q=80',
                'is_active' => true,
                'order_index' => 2,
            ],
            [
                'name' => 'Vespa',
                'slug' => 'vespa',
                'tagline' => 'Timeless Italian Urban Icon',
                'description' => 'The definitive Italian mobility statement since 1946. Effortless elegance, monocoque steel craftsmanship, and agile urban freedom.',
                'origin_country' => 'Italy',
                'logo_url' => 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=1920&q=80',
                'is_active' => true,
                'order_index' => 3,
            ],
            [
                'name' => 'Harley-Davidson',
                'slug' => 'harley-davidson',
                'tagline' => 'United We Ride',
                'description' => 'Legendary American heritage, rumbling V-Twin power, and unmatched custom attitude built for the open desert highways.',
                'origin_country' => 'United States',
                'logo_url' => 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1920&q=80',
                'is_active' => true,
                'order_index' => 4,
            ],
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(['slug' => $brand['slug']], $brand);
        }
    }
}
