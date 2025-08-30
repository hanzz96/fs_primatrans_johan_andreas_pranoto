<?php
namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = Attendance::with('employee')->latest()->paginate(10);
        return response()->json($attendances);
    }

    public function show($id)
    {
        $attendance = Attendance::with('employee')->findOrFail($id);
        return response()->json($attendance);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date'        => 'required|date',
            'check_in'    => 'nullable|date_format:H:i',
            'check_out'   => 'nullable|date_format:H:i|after:check_in',
            'status'      => 'in:present,absent,leave,sick',
            'note'        => 'nullable|string',
        ]);

        $attendance = Attendance::create($validated);

        return response()->json(['message' => 'Attendance created', 'data' => $attendance], 201);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'sometimes|exists:employees,id',
            'date'        => 'sometimes|date',
            'check_in'    => 'nullable|date_format:H:i',
            'check_out'   => 'nullable|date_format:H:i|after:check_in',
            'status'      => 'in:present,absent,leave,sick',
            'note'        => 'nullable|string',
        ]);

        $attendance->update($validated);

        return response()->json(['message' => 'Attendance updated', 'data' => $attendance]);
    }

    public function destroy($id)
    {
        Attendance::findOrFail($id)->delete();
        return response()->json(['message' => 'Attendance deleted']);
    }
}
