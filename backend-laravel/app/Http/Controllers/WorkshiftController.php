<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
        try {
            $perPage = $request->get('per_page', 100);
            $search = $request->input('search', null);
            $workShifts = $this->workShiftService->getAll($perPage, $search);
        
            return $this->responsePayload([
                "data" => $workShifts->items(),
                "pagination" => [
                    "current_page" => $workShifts->currentPage(),
                    "per_page" => $workShifts->perPage(),
                    "total" => $workShifts->total(),
                    "last_page" => $workShifts->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function store(Request $request)
    {
        try {
            $workShift = $this->workShiftService->create($request->all());

            return $this->responsePayload([
                "message" => "Work shift created successfully",
                "data" => $workShift
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function show($id)
    {
        try {
            $workShift = $this->workShiftService->findById($id);
            if (!$workShift) {
                return response()->json(["code" => 404, "message" => "Work shift not found"], 404);
            }

            return $this->responsePayload([
                "data" => $workShift
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $updated = $this->workShiftService->update($id, $request->all());

            if (!$updated) {
                return response()->json(["code" => 404, "message" => "Work shift not found"], 404);
            }

            return $this->responsePayload([
                "message" => "Work shift updated successfully",
                "data" => $updated
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function destroy($id)
    {
        try {
            $deleted = $this->workShiftService->delete($id);

            if (!$deleted) {
                return response()->json(["code" => 404, "message" => "Work shift not found"], 404);
            }

            return $this->responseSuccess("Work shift deleted successfully");
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
