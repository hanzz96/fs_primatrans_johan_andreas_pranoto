<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\Request;
use Exception;

class EmployeeController extends Controller
{
    protected $service;

    public function __construct(EmployeeService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json(Employee::with('workShift')->get());
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'first_name'      => 'required|string',
                'last_name'       => 'nullable|string',
                'date_of_birth'   => 'nullable|date',
                'gender'          => 'nullable|in:male,female,other',
                'nik'             => 'required|string|unique:employees,nik',
                'employee_number' => 'required|string|unique:employees,employee_number',
                'position'        => 'required|string',
                'work_shift_id'   => 'nullable|exists:work_shifts,id',
            ]);

            $employee = $this->service->create($data);

            return response()->json($employee, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show(Employee $employee)
    {
        return response()->json($employee->load('workShift'));
    }

    public function update(Request $request, Employee $employee)
    {
        try {
            $data = $request->all();
            $updated = $this->service->update($employee, $data);

            return response()->json($updated);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function destroy(Employee $employee)
    {
        $this->service->delete($employee);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
