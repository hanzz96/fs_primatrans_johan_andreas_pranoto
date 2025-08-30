<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
        try {
            $perPage = $request->get('per_page', 10);
            $search = $request->get('search', null);
            $attendances = $this->attendanceService->getAll($perPage, $search);
            return $this->responsePayload([
                "data" => $attendances->items(),
                "pagination" => [
                    "current_page" => $attendances->currentPage(),
                    "per_page" => $attendances->perPage(),
                    "total" => $attendances->total(),
                    "last_page" => $attendances->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function store(Request $request)
    {
        try {
            $attendance = $this->attendanceService->create($request->all());

            return $this->responsePayload([
                "message" => "Attendance created successfully",
                "data" => $attendance
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function show($id)
    {
        try {
            $attendance = $this->attendanceService->findById($id);
            if (!$attendance) {
                return response()->json(["code" => 404, "message" => "Attendance not found"], 404);
            }

            return $this->responsePayload([
                "data" => $attendance
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $updated = $this->attendanceService->update($id, $request->all());

            if (!$updated) {
                return response()->json(["code" => 404, "message" => "Attendance not found"], 404);
            }

            return $this->responsePayload([
                "message" => "Attendance updated successfully",
                "data" => $updated
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function destroy($id)
    {
        try {
            $deleted = $this->attendanceService->delete($id);

            if (!$deleted) {
                return response()->json(["code" => 404, "message" => "Attendance not found"], 404);
            }

            return $this->responseSuccess("Attendance deleted successfully");
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
