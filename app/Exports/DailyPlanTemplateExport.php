<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\FromArray;

class DailyPlanTemplateExport implements WithHeadings, FromArray, WithStyles
{
    // Menyediakan contoh data untuk template
    public function array(): array
    {
        return [
            ['2024-12-01', 'MPI', 'A01', 'PO12345', 42, 1000], // Contoh data baris 1
            ['2024-12-02', 'UNI', 'A02', 'PO67890', 44, 1200], // Contoh data baris 2
        ];
    }

    // Header kolom
    public function headings(): array
    {
        return [
            'Date (YYYY-MM-DD)', // Format tanggal
            'Factory (e.g., MPI, UNI)', // Nama pabrik
            'Assembly Line (e.g., A01, A02)', // Jalur perakitan
            'PO (e.g., PO12345)', // Nomor PO
            'Size (Mix)', // Ukuran sepatu
            'Total PRs', // Total jumlah PRs
        ];
    }

    // Styling template Excel
    public function styles(Worksheet $sheet)
    {
        return [
            // Style untuk header
            1 => ['font' => ['bold' => true, 'size' => 12]],
            // Set lebar kolom agar lebih rapi
            'A' => ['width' => 20],
            'B' => ['width' => 20],
            'C' => ['width' => 20],
            'D' => ['width' => 20],
            'E' => ['width' => 15],
            'F' => ['width' => 15],
        ];
    }
}
