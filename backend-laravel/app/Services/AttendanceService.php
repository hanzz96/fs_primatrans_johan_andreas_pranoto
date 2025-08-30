<?php
namespace App\Services;

use App\Models\Attendance;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class AttendanceService
{
    public function getAll($perPage = 10)
    {
        try {
            return Attendance::with('employee')->paginate($perPage);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function create(array $data): Attendance
    {
        try {
            $lockKey = "attendance_lock:{$data['employee_id']}:{$data['attendance_date']}";
            $lock = Cache::lock($lockKey, 5);

            if ($lock->get()) {
                try {
                    // Cek duplicate (employee + date)
                    $exists = Attendance::where('employee_id', $data['employee_id'])
                        ->where('attendance_date', $data['attendance_date'])
                        ->exists();

                    if ($exists) {
                        throw ValidationException::withMessages([
                            'duplicate' => ['Attendance already exists for this employee on that date.'],
                        ]);
                    }

                    return Attendance::create([
                        'employee_id'     => $data['employee_id'],
                        'attendance_date' => $data['attendance_date'],
                        'check_in'        => $data['check_in'] ?? null,
                        'check_out'       => $data['check_out'] ?? null,
                    ]);
                } finally {
                    $lock->release();
                }
            }

            throw ValidationException::withMessages([
                'concurrency' => ['Another attendance creation is in progress, please try again.'],
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function update(int $id, array $data): Attendance
    {
        try {
            $attendance = Attendance::find($id);
            if(!$attendance) {
                throw new Exception("Attendance not found!");
            }
            $employeeId = $data['employee_id'] ?? $attendance->employee_id;
            $date       = $data['attendance_date'] ?? $attendance->attendance_date;

            $lockKey = "attendance_lock:{$employeeId}:{$date}";
            $lock = Cache::lock($lockKey, 5);

            if ($lock->get()) {
                try {
                    $exists = Attendance::where('employee_id', $employeeId)
                        ->where('attendance_date', $date)
                        ->where('id', '!=', $attendance->id)
                        ->exists();

                    if ($exists) {
                        throw ValidationException::withMessages([
                            'duplicate' => ['Attendance already exists for this employee on that date.'],
                        ]);
                    }

                    $attendance->update([
                        'employee_id'     => $employeeId,
                        'attendance_date' => $date,
                        'check_in'        => $data['check_in'] ?? $attendance->check_in,
                        'check_out'       => $data['check_out'] ?? $attendance->check_out,
                    ]);

                    return $attendance;
                } finally {
                    $lock->release();
                }
            }

            throw ValidationException::withMessages([
                'concurrency' => ['Another attendance update is in progress, please try again.'],
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function delete(int $id): bool
    {
        try {
            $attendance = Attendance::find($id);
            if(!$attendance) {
                throw new Exception('Attendance not found');
            }
            return $attendance->delete();
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
