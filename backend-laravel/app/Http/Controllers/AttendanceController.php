<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = Attendance::with('employee')->get();
        return response()->json(['data' => $attendances], 200);
    }

    public function show($id)
    {
        $attendance = Attendance::with('employee')->find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Attendance not found'], 404);
        }
        return response()->json(['data' => $attendance], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'check_in'    => 'required|date_format:Y-m-d H:i:s',
            'check_out'   => 'nullable|date_format:Y-m-d H:i:s|after:check_in',
            'date'        => 'required|date',
        ]);

        $attendance = Attendance::create($validated);
        return response()->json(['message' => 'Attendance created successfully', 'data' => $attendance], 201);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Attendance not found'], 404);
        }

        $validated = $request->validate([
            'employee_id' => 'sometimes|required|exists:employees,id',
            'check_in'    => 'sometimes|required|date_format:Y-m-d H:i:s',
            'check_out'   => 'nullable|date_format:Y-m-d H:i:s|after:check_in',
            'date'        => 'sometimes|required|date',
        ]);

        $attendance->update($validated);
        return response()->json(['message' => 'Attendance updated successfully', 'data' => $attendance], 200);
    }

    public function destroy($id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Attendance not found'], 404);
        }

        $attendance->delete();
        return response()->json(['message' => 'Attendance deleted successfully'], 200);
    }
}
