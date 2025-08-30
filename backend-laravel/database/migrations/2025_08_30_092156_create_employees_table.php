<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->date('birth_date'); 
            $table->enum('gender', ['male', 'female']);
            $table->string('nik')->unique(); // Nomor Induk Karyawan
            $table->string('employee_number')->unique(); // Nomor Urut Karyawan
            $table->string('position'); // Posisi pekerjaan
            $table->unsignedBigInteger('work_shift_id')->nullable(); // Relasi ke jam kerja
            $table->timestamps();

            $table->foreign('work_shift_id')->references('id')->on('work_shifts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
