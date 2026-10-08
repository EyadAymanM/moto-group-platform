<?php

namespace App\Http\Controllers;

use App\Models\CmsSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsSettingController extends Controller
{
    /**
     * Public endpoint: Retrieve all homepage settings & visibility flags.
     */
    public function index(): JsonResponse
    {
        $settings = CmsSetting::all()->pluck('value', 'key');

        return response()->json($settings);
    }

    /**
     * Admin-only endpoint: Update setting value.
     */
    public function update(Request $request, string $key): JsonResponse
    {
        $user = $request->user();

        if (! $user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Only administrators can update global CMS settings.'], 403);
        }

        $validated = $request->validate([
            'value' => ['required'],
        ]);

        $setting = CmsSetting::where('key', $key)->firstOrFail();
        $setting->update(['value' => $validated['value']]);

        return response()->json([
            'message' => 'Setting updated successfully.',
            'setting' => $setting,
        ]);
    }
}
