<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama Jam Kerja
            $table->enum('type', ['shift', 'fulltime']); // Jenis Jam Kerja
            $table->time('start_time'); // Jam Mulai Kerja
            $table->time('end_time');   // Jam Selesai Kerja
            $table->text('description')->nullable(); // Keterangan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_shifts');
    }
};
