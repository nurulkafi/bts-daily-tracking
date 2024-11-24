<?php

namespace App\Http\Controllers;

use App\Models\DailyPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // GET MONTH AND YEAR (month year (november 2023))
        $monthYear = request('month_year');
        if (empty($monthYear)) {
            $monthYear = date('F Y');
        }

        //
        $query = DB::table('daily_plan')
        ->leftJoin('daily_actual_output', 'daily_plan.id', '=', 'daily_actual_output.daily_plan_id')
        ->selectRaw("
            daily_plan.assembly_line,
            SUM(daily_plan.total_prs) AS total_prs_plan,
            SUM(daily_actual_output.total_prs) AS total_prs_output,
            SUM(LEAST(daily_plan.total_prs, daily_actual_output.total_prs)) AS total_mix_prs,
            ROUND(SUM(LEAST(daily_plan.total_prs, daily_actual_output.total_prs))::NUMERIC / NULLIF(SUM(daily_actual_output.total_prs), 0) * 100, 0) AS mix_percentage,
            ROUND(SUM(daily_actual_output.total_prs)::NUMERIC / NULLIF(SUM(daily_plan.total_prs), 0) * 100, 0) AS volume,
            ROUND(
                (SUM(LEAST(daily_plan.total_prs, daily_actual_output.total_prs))::NUMERIC / NULLIF(SUM(daily_actual_output.total_prs), 0)) *
                (SUM(daily_actual_output.total_prs)::NUMERIC / NULLIF(SUM(daily_plan.total_prs), 0)) * 100, 0
            ) AS bts
        ")
        // Filter by month and year
        ->whereMonth('daily_plan.date', '=', date('m', strtotime($monthYear)))
        ->whereYear('daily_plan.date', '=', date('Y', strtotime($monthYear)))
        ->groupBy('daily_plan.assembly_line')
        ->orderBy('daily_plan.assembly_line')
        ->get();
    // Optional: Urutkan berdasarkan assembly_line

        return Inertia::render('Dashboard', ['data' => $query, 'monthYear' => $monthYear]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
