<?php

namespace Database\Seeders;

use App\Models\CmsSetting;
use Illuminate\Database\Seeder;

class CmsSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'homepage_hero_headline',
                'group' => 'hero',
                'value' => [
                    'prefix' => 'PRECISION ENGINEERING',
                    'highlight' => 'DESERT SOVEREIGNTY',
                    'subhead' => 'Official authorized distributor of the world’s most prestigious motorcycle marques across the Middle East.',
                ],
                'description' => 'Homepage hero titles and introductory copy',
            ],
            [
                'key' => 'section_visibility',
                'group' => 'visibility',
                'value' => [
                    'brand_marques_bar' => true,
                    'featured_telemetry_showcase' => true,
                    'catalog_filter_grid' => true,
                    'test_ride_concierge_drawer' => true,
                    'regional_showrooms_map' => true,
                    'vip_financing_section' => true,
                ],
                'description' => 'Toggle visibility of individual public homepage components',
            ],
            [
                'key' => 'regional_dealerships',
                'group' => 'dealerships',
                'value' => [
                    [
                        'city' => 'Dubai',
                        'country' => 'United Arab Emirates',
                        'address' => 'Sheikh Zayed Road, Exit 43, Al Quoz 1',
                        'phone' => '+971 4 388 9000',
                        'whatsapp' => '+971 50 123 4567',
                        'status' => 'Open Today 09:00 - 20:00',
                    ],
                    [
                        'city' => 'Riyadh',
                        'country' => 'Kingdom of Saudi Arabia',
                        'address' => 'King Fahd Road, Al Malqa District',
                        'phone' => '+966 11 450 8800',
                        'whatsapp' => '+966 55 987 6543',
                        'status' => 'Open Today 10:00 - 22:00',
                    ],
                    [
                        'city' => 'Doha',
                        'country' => 'State of Qatar',
                        'address' => 'Porto Arabia, Tower 22, The Pearl-Qatar',
                        'phone' => '+974 44 888 123',
                        'whatsapp' => '+974 33 456 7890',
                        'status' => 'Open Today 09:30 - 21:00',
                    ],
                ],
                'description' => 'Authorized flagship showroom directory and contact details',
            ],
        ];

        foreach ($settings as $setting) {
            CmsSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
