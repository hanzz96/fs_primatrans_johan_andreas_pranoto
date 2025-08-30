<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WorkShiftController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AttendanceController;

Route::middleware('api')->group(function () {
    // Work Shifts
    Route::get('/workshifts', [WorkShiftController::class, 'index']);
    Route::post('/workshifts', [WorkShiftController::class, 'store']);
    Route::get('/workshifts/{id}', [WorkShiftController::class, 'show']);
    Route::put('/workshifts/{id}', [WorkShiftController::class, 'update']);
    Route::delete('/workshifts/{id}', [WorkShiftController::class, 'destroy']);

    // Employees
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);

    // Attendances
    Route::get('/attendances', [AttendanceController::class, 'index']);
    Route::post('/attendances', [AttendanceController::class, 'store']);
    Route::get('/attendances/{id}', [AttendanceController::class, 'show']);
    Route::put('/attendances/{id}', [AttendanceController::class, 'update']);
    Route::delete('/attendances/{id}', [AttendanceController::class, 'destroy']);
});