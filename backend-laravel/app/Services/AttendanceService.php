<?php
namespace App\Services;

use App\Models\Attendance;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class AttendanceService
{
    public function create(array $data): Attendance
    {
        $lockKey = "attendance_lock:{$data['employee_id']}:{$data['shift_id']}:{$data['shift_date']}";

        // try to acquire lock for 5 seconds
        $lock = Cache::lock($lockKey, 5);

        if ($lock->get()) {
            try {
                // Check duplicate inside lock
                $exists = Attendance::where('employee_id', $data['employee_id'])
                    ->where('shift_id', $data['shift_id'])
                    ->where('shift_date', $data['shift_date'])
                    ->exists();

                if ($exists) {
                    throw ValidationException::withMessages([
                        'duplicate' => ['Attendance already exists for this employee, shift, and date.'],
                    ]);
                }

                return Attendance::create($data);
            } finally {
                // always release the lock
                $lock->release();
            }
        }

        // If unable to acquire lock → concurrency issue
        throw ValidationException::withMessages([
            'concurrency' => ['Another attendance creation is in progress, please try again.'],
        ]);
    }

    public function update(Attendance $attendance, array $data): Attendance
    {
        $employeeId = $data['employee_id'] ?? $attendance->employee_id;
        $shiftId    = $data['shift_id'] ?? $attendance->shift_id;
        $shiftDate  = $data['shift_date'] ?? $attendance->shift_date;
        $lockKey = "attendance_lock:{$employeeId}:{$shiftId}:{$shiftDate}";

        $lock = Cache::lock($lockKey, 5);

        if ($lock->get()) {
            try {
                $exists = Attendance::where('employee_id', $data['employee_id'] ?? $attendance->employee_id)
                    ->where('shift_id', $data['shift_id'] ?? $attendance->shift_id)
                    ->where('shift_date', $data['shift_date'] ?? $attendance->shift_date)
                    ->where('id', '!=', $attendance->id)
                    ->exists();

                if ($exists) {
                    throw ValidationException::withMessages([
                        'duplicate' => ['Attendance already exists for this employee, shift, and date.'],
                    ]);
                }

                $attendance->update($data);
                return $attendance;
            } finally {
                $lock->release();
            }
        }

        throw ValidationException::withMessages([
            'concurrency' => ['Another attendance update is in progress, please try again.'],
        ]);
    }

    public function delete(Attendance $attendance): bool
    {
        return $attendance->delete();
    }
}
