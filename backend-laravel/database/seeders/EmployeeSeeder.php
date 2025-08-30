<?php
// database/seeders/EmployeeSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        // Create 20 employees
        Employee::factory()->count(20)->create();
    }
}
