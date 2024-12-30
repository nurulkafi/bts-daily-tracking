<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class DailyActualExport implements FromCollection, WithHeadings, WithStyles, WithEvents
{
    private $data;

    // Constructor untuk menerima data dari controller
    public function __construct(Collection $data)
    {
        $this->data = $data;
    }

    // Data yang akan diexport ke Excel
    public function collection()
    {
        return $this->data;
    }

    // Header untuk file Excel
    public function headings(): array
    {
        return [
            'id',
            'Date',
            'Assembly Line',
            'PO',
            'Size',
            'Total PRs',
            'Total Prs_Output',
        ];
    }

    // Menambahkan gaya pada header
    public function styles(Worksheet $sheet)
    {
        return [
            // Mengatur gaya untuk header
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['argb' => Color::COLOR_WHITE],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => [
                        'argb' => 'FF4F81BD', // Ganti dengan warna yang diinginkan
                    ],
                ],
            ],
        ];
    }

    // Menambahkan event untuk mengatur border dan lebar kolom
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // Mengatur border untuk seluruh data
                $event->sheet->getStyle('A1:G' . (count($this->data) + 1))->applyFromArray([
                    'borders' => [
                        'outline' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['argb' => Color::COLOR_BLACK],
                        ],
                        'inside' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['argb' => Color::COLOR_BLACK],
                        ],
                    ],
                ]);

                // Menyesuaikan lebar kolom
                $event->sheet->getColumnDimension('A')->setWidth(5); // ID
                $event->sheet->getColumnDimension('B')->setWidth(15); // Date
                $event->sheet->getColumnDimension('C')->setWidth(20); // Assembky
                $event->sheet->getColumnDimension('D')->setWidth(15); // PO
                $event->sheet->getColumnDimension('E')->setWidth(15); // SIZE
                $event->sheet->getColumnDimension('F')->setWidth(15); // Plan out
                $event->sheet->getColumnDimension('G')->setWidth(15); // actual Output
            },
        ];
    }
}
