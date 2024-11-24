<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyPlan extends Model
{
    //
    protected $table = 'daily_plan';
    protected $fillable = [
        'date',
        'factory',
        'assembly_line',
        'po',
        'size',
        'total_prs',
    ];
}
