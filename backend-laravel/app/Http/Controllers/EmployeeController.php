<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use App\Services\EmployeeService;

class EmployeeController extends Controller
{
    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10); // default 10 if not provided
        $employees = $this->employeeService->getAll($perPage);
    
        return $this->responsePayload([
            "data" => $employees->items(),
            "pagination" => [
                "current_page" => $employees->currentPage(),
                "per_page" => $employees->perPage(),
                "total" => $employees->total(),
                "last_page" => $employees->lastPage(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $employee = $this->employeeService->create($request->all());

        return $this->responsePayload([
            "message" => "Employee created successfully",
            "data" => $employee
        ]);
    }

    public function show($id)
    {
        $employee = $this->employeeService->findById($id);
        if (!$employee) {
            return response()->json(["code" => 404, "message" => "Employee not found"], 404);
        }

        return $this->responsePayload([
            "data" => $employee
        ]);
    }

    public function update(Request $request, $id)
    {
        $updated = $this->employeeService->update($id, $request->all());

        if (!$updated) {
            return response()->json(["code" => 404, "message" => "Employee not found"], 404);
        }

        return $this->responsePayload([
            "message" => "Employee updated successfully",
            "data" => $updated
        ]);
    }

    public function destroy($id)
    {
        $deleted = $this->employeeService->delete($id);

        if (!$deleted) {
            return response()->json(["code" => 404, "message" => "Employee not found"], 404);
        }

        return $this->responseSuccess("Employee deleted successfully");
    }
}
