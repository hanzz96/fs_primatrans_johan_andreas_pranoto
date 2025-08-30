<?php
// database/seeders/AttendanceSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        // Create 50 random attendance records
        \App\Models\Attendance::factory()->count(50)->create();
    }
}
