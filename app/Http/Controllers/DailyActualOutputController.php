<?php

namespace App\Http\Controllers;

use App\Models\DailyActualOutput;
use App\Models\DailyPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyActualOutputController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $data = DailyPlan::leftJoin('daily_actual_output', 'daily_plan.id', '=', 'daily_actual_output.daily_plan_id')
            ->select('daily_plan.*', 'daily_actual_output.total_prs as total_prs_output')
            ->orderBy('daily_plan.assembly_line')
            ->orderBy('daily_plan.date','asc')
            ->orderBy('daily_plan.created_at')
            ->get();

        return Inertia::render('DailyActualOutput', ['data' => $data]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $assemblyLineFilter = request('assembly_line');
        $dateFilter = request('date');
        $poFilter = request('po');

        // Start the query
        $query = DailyPlan::leftJoin('daily_actual_output', 'daily_plan.id', '=', 'daily_actual_output.daily_plan_id')
            ->select(
                'daily_plan.*',
                'daily_actual_output.total_prs as total_prs_output',
            );

        // Apply filters based on the input parameters
        if (!empty($assemblyLineFilter)) {
            $query->where('daily_plan.assembly_line', $assemblyLineFilter);
        }

        if (!empty($dateFilter)) {
            $query->whereDate('daily_plan.date', $dateFilter);
        }

        if (!empty($poFilter)) {
            $query->where('daily_plan.po', $poFilter);
        }

        // Execute the query and get the results
        $data = $query->orderBy('daily_plan.created_at')->get();

        return Inertia::render('DailyActualOutput/Create', ['data' => $data]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'items' => 'required|array|min:1', // Harus berupa array dengan minimal 1 item
            'items.*.total_prs' => 'required|integer|min:0',
            'items.*.daily_plan_id' => 'required|integer|min:0',
        ]);

        // Simpan atau update data
        $dailyPlans = [];
        foreach ($validated['items'] as $item) {
            // Cek apakah data sudah ada
            $existingEntry = DailyActualOutput::where('daily_plan_id', $item['daily_plan_id'])->first();

            if ($existingEntry) {
                // Jika data sudah ada, update
                $existingEntry->update($item);
                $dailyPlans[] = $existingEntry; // Tambahkan data yang sudah diupdate
            } else {
                // Jika data belum ada, buat baru
                $dailyPlans[] = DailyActualOutput::create($item);
            }
        }

        // Response
        return response()->json([
            'message' => 'Data saved or updated successfully!',
            'data' => $dailyPlans,
        ], 200); // Menggunakan status 200 karena bisa jadi update
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
