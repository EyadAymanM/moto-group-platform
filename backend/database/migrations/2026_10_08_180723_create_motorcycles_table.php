<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('motorcycles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->index();
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();

            // Telemetry & Engineering Specs
            $table->unsignedSmallInteger('engine_cc')->nullable();
            $table->unsignedSmallInteger('horsepower')->nullable();
            $table->unsignedSmallInteger('torque_nm')->nullable();
            $table->unsignedSmallInteger('weight_kg')->nullable();
            $table->unsignedSmallInteger('top_speed_kmh')->nullable();
            $table->decimal('acceleration_0_100', 3, 1)->nullable();
            $table->decimal('fuel_capacity_liters', 4, 1)->nullable();
            $table->unsignedSmallInteger('seat_height_mm')->nullable();

            // Pricing & Commercial Details
            $table->decimal('price_starting_at', 10, 2);
            $table->string('currency', 3)->default('AED');

            // Media Assets
            $table->string('image_url');
            $table->json('gallery_images')->nullable();
            $table->json('color_options')->nullable();

            // Visibility & Curation Flags
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('order_index')->default(0)->index();
            $table->timestamps();

            // Query indexes for catalog filtering
            $table->index(['brand_id', 'is_active']);
            $table->index(['category', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motorcycles');
    }
};
