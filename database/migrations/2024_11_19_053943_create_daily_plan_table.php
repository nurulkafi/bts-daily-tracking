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
        Schema::create('daily_plan', function (Blueprint $table) {
            $table->id();
            $table->date(column: 'date');
            $table->string(column: 'factory');
            $table->string('assembly_line');
            $table->string(column: 'po');
            $table->float(column: 'size')->default(0);
            $table->integer(column: 'total_prs')->default(0);
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
        Schema::dropIfExists('daily_plan');
    }
};
