<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->date('date_of_birth')->nullable(); // instead of age
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('nik')->unique(); // Nomor Induk Karyawan
            $table->string('employee_number')->unique(); // Nomor Urut Karyawan
            $table->string('position'); // Posisi / Jabatan
            $table->unsignedBigInteger('work_shift_id')->nullable(); // Relasi ke Jam Kerja
            $table->timestamps();

            $table->foreign('work_shift_id')
                ->references('id')->on('work_shifts')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
