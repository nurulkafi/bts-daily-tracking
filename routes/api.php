<?php

use App\Http\Controllers\DailyActualOutputController;
use App\Http\Controllers\DailyPlanController;
use App\Models\DailyActualOutput;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');




Route::middleware([
    HandleCors::class,
])->group(function () {
    Route::post('/daily-plans', [DailyPlanController::class, 'store']);
    Route::delete('/daily-plans/{id}', [DailyPlanController::class, 'destroy']);
    Route::post('/daily-actual-outputs', [DailyActualOutputController::class, 'store']);
});
