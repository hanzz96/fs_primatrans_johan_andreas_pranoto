<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WorkShift;

class WorkShiftSeeder extends Seeder
{
    public function run()
    {
        WorkShift::create([
            'name' => 'Morning Shift',
            'type' => 'shift',
            'description' => 'Shift from 08:00 to 16:00',
        ]);

        WorkShift::create([
            'name' => 'Evening Shift',
            'type' => 'shift',
            'description' => 'Shift from 16:00 to 00:00',
        ]);

        WorkShift::create([
            'name' => 'Fulltime',
            'type' => 'fulltime',
            'description' => 'Fulltime employee',
        ]);
    }
}
