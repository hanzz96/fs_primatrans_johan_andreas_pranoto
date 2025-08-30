<?php
// database/seeders/AttendanceSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            WorkShiftSeeder::class,
            EmployeeSeeder::class,
            AttendanceSeeder::class,
        ]);
    }
}
