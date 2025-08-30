<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use Exception;

class EmployeeService
{
    protected $lockTtl = 5;

    public function getAll($perPage = 10)
    {
        return Employee::paginate($perPage);
    }
    
    public function create(array $data)
    {
        $lockKey = "employee_lock:" . md5($data['nik'] ?? '');

        if (!Redis::setnx($lockKey, 1)) {
            throw new Exception("Employee creation is locked. Try again later.");
        }
        Redis::expire($lockKey, $this->lockTtl);

        try {
            $exists = Employee::where('nik', $data['nik'])
                ->orWhere('employee_number', $data['employee_number'])
                ->exists();

            if ($exists) {
                throw new Exception("Employee with same NIK or employee number already exists.");
            }

            return DB::transaction(fn () => Employee::create($data));
        } finally {
            Redis::del($lockKey);
        }
    }

    public function update(Employee $employee, array $data)
    {
        $lockKey = "employee_update_lock:{$employee->id}";
        if (!Redis::setnx($lockKey, 1)) {
            throw new Exception("Employee update is locked. Try again later.");
        }
        Redis::expire($lockKey, $this->lockTtl);

        try {
            $exists = Employee::where(function ($q) use ($data, $employee) {
                    if (isset($data['nik'])) {
                        $q->where('nik', $data['nik']);
                    }
                    if (isset($data['employee_number'])) {
                        $q->orWhere('employee_number', $data['employee_number']);
                    }
                })
                ->where('id', '!=', $employee->id)
                ->exists();

            if ($exists) {
                throw new Exception("Another Employee with same NIK or employee number already exists.");
            }

            $employee->update($data);
            return $employee;
        } finally {
            Redis::del($lockKey);
        }
    }

    public function delete(Employee $employee)
    {
        $employee->delete();
    }
}
