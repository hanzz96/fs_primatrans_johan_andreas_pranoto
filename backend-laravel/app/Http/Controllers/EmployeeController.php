<?php
namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with('workShift')->latest()->paginate(10);
        return response()->json($employees);
    }

    public function show($id)
    {
        $employee = Employee::with('workShift')->findOrFail($id);
        return response()->json($employee);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'nullable|string|max:100',
            'date_of_birth'   => 'nullable|date',
            'gender'          => 'nullable|in:male,female,other',
            'nik'             => 'required|string|unique:employees,nik',
            'employee_number' => 'required|string|unique:employees,employee_number',
            'position'        => 'required|string|max:100',
            'work_shift_id'   => 'nullable|exists:work_shifts,id',
        ]);

        $employee = Employee::create($validated);

        return response()->json(['message' => 'Employee created', 'data' => $employee], 201);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'first_name'      => 'sometimes|string|max:100',
            'last_name'       => 'nullable|string|max:100',
            'date_of_birth'   => 'nullable|date',
            'gender'          => 'nullable|in:male,female,other',
            'nik'             => 'sometimes|string|unique:employees,nik,' . $id,
            'employee_number' => 'sometimes|string|unique:employees,employee_number,' . $id,
            'position'        => 'sometimes|string|max:100',
            'work_shift_id'   => 'nullable|exists:work_shifts,id',
        ]);

        $employee->update($validated);

        return response()->json(['message' => 'Employee updated', 'data' => $employee]);
    }

    public function destroy($id)
    {
        Employee::findOrFail($id)->delete();
        return response()->json(['message' => 'Employee deleted']);
    }
}
