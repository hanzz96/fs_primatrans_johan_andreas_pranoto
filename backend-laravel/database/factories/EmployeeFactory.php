<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Employee;
use App\Models\WorkShift;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'birth_date' => $this->faker->date('Y-m-d', '2000-01-01'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'nik' => $this->faker->unique()->numerify('##########'),
            'employee_number' => $this->faker->unique()->numerify('EMP###'),
            'position' => $this->faker->jobTitle(),
            'work_shift_id' => WorkShift::inRandomOrder()->first()->id ?? null,
        ];
    }
}
