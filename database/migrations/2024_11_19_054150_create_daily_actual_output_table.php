<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_actual_output', function (Blueprint $table) {
            $table->id();
            $table->bigInteger(column: 'daily_plan_id');
            $table->integer(column: 'total_prs')->default(0);
            // $table->float(column: 'mix_matching')->default(0);
            // $table->float(column: 'total_mix_prs')->default(0);
            // $table->float(column: 'mix_percentage')->default(0);
            // $table->float(column: 'total_mix_percentage')->default(0);
            // $table->float(column: 'total_mix_prs_percentage')->default(0);
            $table->integer(column: 'created_by')->nullable();
            $table->integer(column: 'updated_by')->nullable();
            $table->integer(column: 'deleted_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_actual_output');
    }
};
