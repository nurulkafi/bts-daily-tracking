<?php

use App\Http\Controllers\DailyActualOutputController;
use App\Http\Controllers\DailyPlanController;
use App\Models\DailyActualOutput;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Exports\DailyPlanTemplateExport;
use Maatwebsite\Excel\Facades\Excel;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');




Route::middleware([
    HandleCors::class,
])->group(function () {
    Route::post('/daily-plans', [DailyPlanController::class, 'store']);
    Route::delete('/daily-plans/{id}', [DailyPlanController::class, 'destroy']);
    Route::post('/daily-actual-outputs', [DailyActualOutputController::class, 'store']);
    Route::get('/daily-plan/template', function () {
        return Excel::download(new DailyPlanTemplateExport, 'daily_plan_template.xlsx');
    });
    Route::post('/import-daily-plan', [DailyPlanController::class, 'importExcel']);

});
