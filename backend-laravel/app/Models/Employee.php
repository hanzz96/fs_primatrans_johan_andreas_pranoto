<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'first_name','last_name','date_of_birth','gender',
        'nik','employee_number','position','work_shift_id'
    ];

    protected $casts = [
        'birth_date' => 'date:Y-m-d',
    ];

    public function workShift()
    {
        return $this->belongsTo(WorkShift::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    // helper to calculate age
    public function getAgeAttribute()
    {
        return $this->date_of_birth
            ? \Carbon\Carbon::parse($this->date_of_birth)->age
            : null;
    }
}
