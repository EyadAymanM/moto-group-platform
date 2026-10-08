<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CmsSettingController;
use App\Http\Controllers\MotorcycleController;
use App\Http\Controllers\TestRideRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Showroom Endpoints (No Auth Required)
|--------------------------------------------------------------------------
*/
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{slug}', [BrandController::class, 'show']);

Route::get('/motorcycles', [MotorcycleController::class, 'index']);
Route::get('/motorcycles/{slug}', [MotorcycleController::class, 'show']);

Route::post('/test-rides', [TestRideRequestController::class, 'store']);

Route::get('/cms/settings', [CmsSettingController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Authentication Routes (Sanctum SPA Session)
|--------------------------------------------------------------------------
*/
Route::middleware('web')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->name('login');
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/auth/user', [AuthController::class, 'me']);
    Route::get('/user', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | Protected CMS Endpoints (Admin & Brand-Scoped Moderator)
    |--------------------------------------------------------------------------
    */
    Route::get('/admin/motorcycles', [MotorcycleController::class, 'adminIndex']);
    Route::post('/admin/motorcycles', [MotorcycleController::class, 'store']);
    Route::put('/admin/motorcycles/{motorcycle}', [MotorcycleController::class, 'update']);
    Route::delete('/admin/motorcycles/{motorcycle}', [MotorcycleController::class, 'destroy']);

    Route::get('/admin/test-rides', [TestRideRequestController::class, 'index']);
    Route::patch('/admin/test-rides/{testRideRequest}/status', [TestRideRequestController::class, 'updateStatus']);

    Route::put('/admin/cms/settings/{key}', [CmsSettingController::class, 'update']);
});
