<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WorkShiftController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AttendanceController;

Route::apiResource('work-shifts', WorkShiftController::class);
Route::apiResource('employees', EmployeeController::class);
Route::apiResource('attendances', AttendanceController::class);