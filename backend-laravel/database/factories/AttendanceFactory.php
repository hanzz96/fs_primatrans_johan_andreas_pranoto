<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Attendance;
use App\Models\Employee;

class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition()
    {
        $checkIn = $this->faker->time('H:i:s', '09:00');
        $checkOut = $this->faker->time('H:i:s', '18:00');

        return [
            'employee_id' => Employee::inRandomOrder()->first()->id,
            'attendance_date' => $this->faker->date(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
        ];
    }
}
