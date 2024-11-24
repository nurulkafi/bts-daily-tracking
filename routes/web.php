<?php

use App\Http\Controllers\DailyActualOutputController;
use App\Http\Controllers\DailyPlanController;
use App\Http\Controllers\DashboardController;
use App\Models\DailyPlan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/', function () {
    return redirect('/dashboard');
});
// Route::get('/dashboard', function () {
//     return Inertia::render('Home');
// });

Route::get('/daily-plan', [DailyPlanController::class, 'index']);
Route::get('/daily-plan/create', [DailyPlanController::class, 'create']);

Route::get('/daily-actual-output', [DailyActualOutputController::class, 'index']);
Route::get('/daily-actual-output/create', [DailyActualOutputController::class, 'create']);

Route::get('/dashboard',[DashboardController::class,'index']);
