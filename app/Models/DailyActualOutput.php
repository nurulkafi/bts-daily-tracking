<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyActualOutput extends Model
{
    //
    protected $table = 'daily_actual_output';
    protected $fillable = [
        'daily_plan_id',
        'total_prs',
    ];
}
