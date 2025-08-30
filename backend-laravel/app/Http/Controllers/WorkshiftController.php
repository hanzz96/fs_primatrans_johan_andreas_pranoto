<?php

namespace App\Http\Controllers;

use App\Models\WorkShift;
use App\Services\WorkShiftService;
use Illuminate\Http\Request;
use Exception;

class WorkShiftController extends Controller
{
    protected $service;

    public function __construct(WorkShiftService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json(WorkShift::all());
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name'        => 'required|string',
                'type'        => 'required|in:shift,fulltime',
                'start_time'  => 'required|date_format:H:i',
                'end_time'    => 'required|date_format:H:i',
                'description' => 'nullable|string',
            ]);

            $shift = $this->service->create($data);

            return response()->json($shift, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show(WorkShift $workShift)
    {
        return response()->json($workShift);
    }

    public function update(Request $request, WorkShift $workShift)
    {
        try {
            $data = $request->all();
            $updated = $this->service->update($workShift, $data);

            return response()->json($updated);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function destroy(WorkShift $workShift)
    {
        $this->service->delete($workShift);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
