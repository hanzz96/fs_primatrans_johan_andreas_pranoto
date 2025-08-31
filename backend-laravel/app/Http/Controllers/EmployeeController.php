<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\EmployeeService;
use App\Models\Employee;
use Exception;

class EmployeeController extends Controller
{
    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 100);
        $search = $request->input('search', null);
        $employees = $this->employeeService->getAll($perPage, $search);

        return $this->responsePayload([
            "data" => $employees->items(),
            "pagination" => [
                "current_page" => $employees->currentPage(),
                "per_page" => $employees->perPage(),
                "total" => $employees->total(),
                "last_page" => $employees->lastPage(),
            ]
        ]);
    }

    public function show(Employee $employee)
    {
        return $this->responsePayload([
            "data" => $employee
        ]);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                "first_name" => "required|string",
                "last_name" => "required|string",
                "birth_date" => "required|date",   // changed
                "gender" => "required|string|in:male,female",
                "nik" => "required|string",
                "employee_number" => "required|string",
                "position" => "required|string",
                "work_shift_id" => "nullable|exists:work_shifts,id"
            ]);
            $employee = $this->employeeService->create($data);

            return $this->responsePayload([
                "message" => "Employee created successfully",
                "data" => $employee
            ]);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                "first_name" => "sometimes|string",
                "last_name" => "sometimes|string",
                "birth_date" => "sometimes|date",   // changed
                "gender" => "sometimes|string|in:male,female",
                "nik" => "sometimes|string",
                "employee_number" => "sometimes|string",
                "position" => "sometimes|string",
                "work_shift_id" => "nullable|exists:work_shifts,id"
            ]);
            $updatedEmployee = $this->employeeService->update($id, $data);

            return $this->responsePayload([
                "message" => "Employee updated successfully",
                "data" => $updatedEmployee
            ]);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function destroy(int $employee)
    {
        try {
            $this->employeeService->delete($employee);
            return $this->responseSuccess("Employee deleted successfully");
        } catch (Exception $e) {
            throw $e;
        }
    }
}
