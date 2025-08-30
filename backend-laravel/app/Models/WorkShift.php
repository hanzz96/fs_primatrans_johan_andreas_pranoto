<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class WorkShift extends Model
{
    protected $fillable = [
        'name',
        'type',          // shift / full time
        'description',
        'start_time',
        'end_time',
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}