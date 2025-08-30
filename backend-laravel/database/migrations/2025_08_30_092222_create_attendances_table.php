<?php

// database/migrations/xxxx_xx_xx_create_attendances_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id'); 
            $table->date('date'); 
            $table->time('check_in')->nullable(); 
            $table->time('check_out')->nullable(); 
            $table->text('note')->nullable(); 
            $table->timestamps();
        
            $table->foreign('employee_id')
                  ->references('id')->on('employees')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
