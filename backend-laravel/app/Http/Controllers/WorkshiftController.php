<?php

namespace App\Http\Controllers;

use App\Models\WorkShift;
use Illuminate\Http\Request;

class WorkShiftController extends Controller
{
    public function index()
    {
        $shifts = WorkShift::latest()->paginate(10);
        return response()->json($shifts);
    }

    public function show($id)
    {
        $shift = WorkShift::findOrFail($id);
        return response()->json($shift);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'type'        => 'required|in:shift,fulltime',
            'start_time'  => 'required|date_format:H:i',
            'end_time'    => 'required|date_format:H:i|after:start_time',
            'description' => 'nullable|string',
        ]);

        $shift = WorkShift::create($validated);

        return response()->json(['message' => 'Work shift created', 'data' => $shift], 201);
    }

    public function update(Request $request, $id)
    {
        $shift = WorkShift::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:100',
            'type'        => 'sometimes|in:shift,fulltime',
            'start_time'  => 'sometimes|date_format:H:i',
            'end_time'    => 'sometimes|date_format:H:i|after:start_time',
            'description' => 'nullable|string',
        ]);

        $shift->update($validated);

        return response()->json(['message' => 'Work shift updated', 'data' => $shift]);
    }

    public function destroy($id)
    {
        WorkShift::findOrFail($id)->delete();
        return response()->json(['message' => 'Work shift deleted']);
    }
}
