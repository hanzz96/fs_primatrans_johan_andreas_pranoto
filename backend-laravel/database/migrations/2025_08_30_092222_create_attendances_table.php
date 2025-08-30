<?php

// database/migrations/xxxx_xx_xx_create_attendances_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('shift_id');
            
            // tanggal dasar shift (bukan check_out)
            $table->date('shift_date');
            
            $table->dateTime('check_in')->nullable();
            $table->dateTime('check_out')->nullable();
            
            $table->string('status', 20)->nullable(); // ontime, late, early_leave, dll
            
            $table->timestamps();

            // foreign keys
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('shift_id')->references('id')->on('work_shifts')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
