<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Api\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Services\AttendanceService;

class AttendanceController extends Controller
{
    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function index(Request $request)
{
    $perPage = $request->get('per_page', 10);
    $attendances = $this->attendanceService->getAll($perPage);

    return $this->responsePayload([
        "data" => $attendances->items(),
        "pagination" => [
            "current_page" => $attendances->currentPage(),
            "per_page" => $attendances->perPage(),
            "total" => $attendances->total(),
            "last_page" => $attendances->lastPage(),
        ]
        ]);
    }

    public function show($id)
    {
        $attendance = Attendance::with(['employee', 'shift'])->findOrFail($id);
        return response()->json($attendance);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'shift_id'    => 'required|exists:shifts,id',
            'shift_date'  => 'required|date',
            'check_in'    => 'nullable|date',
            'check_out'   => 'nullable|date|after:check_in',
            'status'      => 'nullable|string|max:20',
        ]);

        $attendance = $this->attendanceService->create($validated);

        return response()->json([
            'message' => 'Attendance created successfully',
            'data'    => $attendance
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'sometimes|exists:employees,id',
            'shift_id'    => 'sometimes|exists:shifts,id',
            'shift_date'  => 'sometimes|date',
            'check_in'    => 'nullable|date',
            'check_out'   => 'nullable|date|after:check_in',
            'status'      => 'nullable|string|max:20',
        ]);

        $attendance = $this->attendanceService->update($attendance, $validated);

        return response()->json([
            'message' => 'Attendance updated successfully',
            'data'    => $attendance
        ]);
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $this->attendanceService->delete($attendance);

        return response()->json(['message' => 'Attendance deleted successfully']);
    }
}
