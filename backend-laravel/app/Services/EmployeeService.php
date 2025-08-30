<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use Exception;

class EmployeeService
{
    protected $lockTtl = 5;

    public function getAll($perPage = 10, $search)
    {
        $query = Employee::select('employees.*', 'work_shifts.name as work_shift_name', DB::raw("concat(employees.first_name, ' ' , employees.last_name) as full_name"))
            ->leftJoin('work_shifts', 'employees.work_shift_id', '=', 'work_shifts.id')
            ->orderBy('employees.id', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('employees.first_name', 'like', "%{$search}%")
                    ->orWhere('employees.last_name', 'like', "%{$search}%");
            });
        }


        $employees = $query->paginate($perPage);
        return $employees;
    }

    public function create(array $data)
    {
        $lockKey = "employee_lock:" . md5($data['nik'] ?? '');
        try {
    
            if (!Redis::setnx($lockKey, 1)) {
                throw new Exception("Employee creation is locked. Try again later.");
            }
            Redis::expire($lockKey, $this->lockTtl);
    
            $exists = Employee::where('nik', $data['nik'])
                ->orWhere('employee_number', $data['employee_number'])
                ->exists();

            if ($exists) {
                throw new Exception("Employee with same NIK or employee number already exists.");
            }

            return DB::transaction(fn() => Employee::create($data));
        } catch (\Exception $e) {
            throw $e;
        } finally {
            Redis::del($lockKey);
        }
    }

    public function update(int $id, array $data)
    {
        try {
            $employee = Employee::find($id);
            if (!$employee) {
                throw new Exception('Employee not found');
            }
            $lockKey = "employee_update_lock:{$employee->id}";
            if (!Redis::setnx($lockKey, 1)) {
                throw new Exception("Employee update is locked. Try again later.");
            }
            Redis::expire($lockKey, $this->lockTtl);

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
        } catch (\Exception $e) {
            throw $e;
        } finally {
            if($lockKey) {
                Redis::del($lockKey);
            }
        }
    }

    public function delete(int $employee)
    {
        try{
            $findEmployee = Employee::find($employee);
            if ($findEmployee) {
                return $findEmployee->delete();
            }
            return false;
        }
        catch(Exception $e) {
            throw $e;
        }
    }
}
