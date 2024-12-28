<?php

namespace App\Http\Controllers;

use App\Exports\DailyPlanExport;
use App\Exports\DailyActualExport;
use App\Models\DailyActualOutput;
use App\Models\DailyPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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
            ->orderBy('daily_plan.date', 'asc')
            ->orderBy('daily_plan.po', 'asc')
            ->orderBy('daily_plan.size', 'asc')
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
        $monthYear = request('month');

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

        // GET MONTH AND YEAR (month year (november 2023))
        if (!empty($monthYear)) {
            $monthYear = date('F Y');
            // Filter by month and year
            $query->whereMonth('daily_plan.date', '=', date('m', strtotime($monthYear)));
            $query->whereYear('daily_plan.date', '=', date('Y', strtotime($monthYear)));
        }



        // Execute the query and get the results
        $data = $query->orderBy('daily_plan.date', 'asc')
        ->orderBy('daily_plan.po', 'asc')
        ->orderBy('daily_plan.size', 'asc')->get();

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
    public function download_excel(Request $request)
    {
        // Filter dari request
        $assemblyLineFilter = $request->input('assembly_line');
        $dateFilter = $request->input('date');
        $poFilter = $request->input('po');
        $monthYear = $request->input('month');

        // Mulai query
        $query = DailyPlan::leftJoin('daily_actual_output', 'daily_plan.id', '=', 'daily_actual_output.daily_plan_id')
            ->select(
                'daily_plan.*',
                'daily_actual_output.total_prs as total_prs_output'
            );

        // Terapkan filter berdasarkan input parameter
        if (!empty($assemblyLineFilter)) {
            $query->where('daily_plan.assembly_line', $assemblyLineFilter);
        }

        if (!empty($dateFilter)) {
            $query->whereDate('daily_plan.date', $dateFilter);
        }

        if (!empty($poFilter)) {
            $query->where('daily_plan.po', $poFilter);
        }

        if (!empty($monthYear)) {
            // Parse month and year
            $month = date('m', strtotime($monthYear));
            $year = date('Y', strtotime($monthYear));
            $query->whereMonth('daily_plan.date', '=', $month);
            $query->whereYear('daily_plan.date', '=', $year);
        }

        // Eksekusi query dan ambil hasil
        $data = $query->orderBy('daily_plan.date', 'asc')->orderBy('daily_plan.po')->orderBy('daily_plan.size')->get();

        // Hitung data untuk assembly line
        $assemblyLineData = $this->calculateAssemblyLineData($assemblyLineFilter, $data);

        // Lakukan proses download Excel di sini
        // Misalnya, menggunakan Laravel Excel atau library lain

        // Contoh: return response dengan data Excel
        $datas = [];
        foreach ($data as $item) {
            $datas[] = [
                'date' => $item->date,
                'assembly_line' => $item->assembly_line,
                'po' => $item->po,
                'size' => $item->size,
                'total_prs' => $item->total_prs,
                'total_prs_output' => $item->total_prs_output,
                'total_mix_prs' => $assemblyLineData['totalMixPrs'], // Mengambil dari hasil perhitungan
                'mix_percentage' => $assemblyLineData['mixPercentage'], // Mengambil dari hasil perhitungan
                'volume' => $assemblyLineData['volume'], // Mengambil dari hasil perhitungan
                'bts' => $assemblyLineData['bts'], // Mengambil dari hasil perhitungan
            ];
        }
        return Excel::download(new DailyPlanExport(collect($datas)), 'daily_plan_export.xlsx');
    }

    private function calculateAssemblyLineData($assemblyLine, $filteredData)
    {
        // Filter data berdasarkan assembly line
        $lineData = $filteredData->filter(function ($item) use ($assemblyLine) {
            return $item->assembly_line === $assemblyLine;
        });

        // Inisialisasi variabel untuk total
        $totalMixPrs = 0;
        $totalPrs = 0;
        $totalPrsOutput = 0;

        // Hitung totalMixPrs, totalPrs, dan totalPrsOutput
        foreach ($lineData as $curr) {
            $totalMixPrs += $this->calculateMixMatching($curr->total_prs, $curr->total_prs_output);
            $totalPrs += $curr->total_prs;
            $totalPrsOutput += $curr->total_prs_output;
        }

        // Hitung persentase mix dan volume
        $mixPercentage = ($totalMixPrs && $totalPrsOutput) ? ($totalPrsOutput / $totalMixPrs) * 100 : 0;
        $volume = $totalPrs ? ($totalPrsOutput / $totalPrs) * 100 : 0;
        $bts = ($mixPercentage / 100) * ($volume / 100) * 100;

        // Kembalikan hasil dalam bentuk array
        return [
            'totalMixPrs' => $totalMixPrs,
            'mixPercentage' => $mixPercentage,
            'volume' => $volume,
            'bts' => $bts,
        ];
    }

    // Contoh fungsi calculateMixMatching
    private function calculateMixMatching($totalPrs, $totalPrsOutput)
    {
        // Implementasi logika untuk menghitung mix matching
        return $totalPrsOutput; // Ganti dengan logika yang sesuai
    }

    /**
     * Fungsi untuk menghitung data berdasarkan assembly_line
     */

     public function download_actual(Request $request)
     {
         // Filter dari request
         $assemblyLineFilter = $request->input('assembly_line');
         $dateFilter = $request->input('date');
         $poFilter = $request->input('po');
         $monthYear = $request->input('month');

         // Mulai query
         $query = DailyPlan::leftJoin('daily_actual_output', 'daily_plan.id', '=', 'daily_actual_output.daily_plan_id')
             ->select(
                 'daily_plan.*',
                 'daily_actual_output.total_prs as total_prs_output'
             );

         // Terapkan filter berdasarkan input parameter
         if (!empty($assemblyLineFilter)) {
             $query->where('daily_plan.assembly_line', $assemblyLineFilter);
         }

         if (!empty($dateFilter)) {
             $query->whereDate('daily_plan.date', $dateFilter);
         }

         if (!empty($poFilter)) {
             $query->where('daily_plan.po', $poFilter);
         }

         if (!empty($monthYear)) {
             // Parse month and year
             $month = date('m', strtotime($monthYear));
             $year = date('Y', strtotime($monthYear));
             $query->whereMonth('daily_plan.date', '=', $month);
             $query->whereYear('daily_plan.date', '=', $year);
         }

         // Eksekusi query dan ambil hasil
         $data = $query->orderBy('daily_plan.date', 'asc')->orderBy('daily_plan.po')->orderBy('daily_plan.size')->get();

         // Hitung data untuk assembly line
         $assemblyLineData = $this->calculateAssemblyLineData($assemblyLineFilter, $data);

         // Lakukan proses download Excel di sini
         // Misalnya, menggunakan Laravel Excel atau library lain

         // Contoh: return response dengan data Excel
         $datas = [];
         foreach ($data as $item) {
             $datas[] = [
                'id' => $item->id,
                 'date' => $item->date,
                 'assembly_line' => $item->assembly_line,
                 'po' => $item->po,
                 'size' => $item->size,
                 'total_prs' => $item->total_prs,
                 'total_prs_output' => $item->total_prs_output,
             ];
         }
         return Excel::download(new DailyActualExport(collect($datas)), 'daily_actual_export.xlsx');
     }

     public function importExcel(Request $request)
     {
         $request->validate([
             'file' => 'required|mimes:xlsx,xls,csv|max:2048',
         ]);

         // Ambil file dari request
         $path = $request->file('file')->getRealPath();
         $data = Excel::toArray([], $path);

         // Ambil data dari sheet pertama
         $sheetData = $data[0] ?? [];

         // Hapus header (baris pertama)
         array_shift($sheetData);

         // Ambil hanya kolom Actual Output
         $total_prs_output = array_map(function ($row) {
             return isset($row[5]) ? (int) $row[5] : null; // Kolom Actual Output
         }, $sheetData);

         // Format data ke bentuk JSON
         return response()->json([
             'total_prs_output' => $total_prs_output,
         ]);
     }
}

