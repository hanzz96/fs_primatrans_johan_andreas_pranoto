<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use App\Services\WorkShiftService;

class WorkShiftController extends Controller
{
    protected $workShiftService;

    public function __construct(WorkShiftService $workShiftService)
    {
        $this->workShiftService = $workShiftService;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $workShifts = $this->workShiftService->getAll($perPage);
    
        return $this->responsePayload([
            "data" => $workShifts->items(),
            "pagination" => [
                "current_page" => $workShifts->currentPage(),
                "per_page" => $workShifts->perPage(),
                "total" => $workShifts->total(),
                "last_page" => $workShifts->lastPage(),
            ]
        ]);
    }
    
    public function store(Request $request)
    {
        $workShift = $this->workShiftService->create($request->all());

        return $this->responsePayload([
            "message" => "Work shift created successfully",
            "data" => $workShift
        ]);
    }

    public function show($id)
    {
        $workShift = $this->workShiftService->findById($id);
        if (!$workShift) {
            return response()->json(["code" => 404, "message" => "Work shift not found"], 404);
        }

        return $this->responsePayload([
            "data" => $workShift
        ]);
    }

    public function update(Request $request, $id)
    {
        $updated = $this->workShiftService->update($id, $request->all());

        if (!$updated) {
            return response()->json(["code" => 404, "message" => "Work shift not found"], 404);
        }

        return $this->responsePayload([
            "message" => "Work shift updated successfully",
            "data" => $updated
        ]);
    }

    public function destroy($id)
    {
        $deleted = $this->workShiftService->delete($id);

        if (!$deleted) {
            return response()->json(["code" => 404, "message" => "Work shift not found"], 404);
        }

        return $this->responseSuccess("Work shift deleted successfully");
    }
}
