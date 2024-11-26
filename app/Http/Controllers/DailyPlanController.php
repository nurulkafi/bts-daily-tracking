<?php

namespace App\Http\Controllers;

use App\Models\DailyPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $dailyPlanData = DailyPlan::orderBy('assembly_line')->get();
        // return Inertia::render('DailyPlan');
        return Inertia::render('DailyPlan', ['dailyPlanData' => $dailyPlanData]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('DailyPlan/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'items' => 'required|array|min:1', // Harus berupa array dengan minimal 1 item
            'items.*.date' => 'required|date',
            'items.*.factory' => 'required|string|max:255',
            'items.*.assembly_line' => 'required|string|max:255',
            'items.*.po' => 'required|string|max:255',
            'items.*.size' => 'required|integer|min:0',
            'items.*.total_prs' => 'required|integer|min:0',
        ]);

        // Simpan data
        $dailyPlans = [];
        foreach ($validated['items'] as $item) {
            $dailyPlans[] = DailyPlan::create($item);
        }

        // Response
        return response()->json([
            'message' => 'Data saved successfully!',
            'data' => $dailyPlans,
        ], 201);
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
