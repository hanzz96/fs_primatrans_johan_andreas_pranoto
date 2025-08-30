<?php

namespace App\Services;

use App\Models\WorkShift;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use Exception;

class WorkShiftService
{
    protected $lockTtl = 5; // seconds

    public function create(array $data)
    {
        $lockKey = "workshift_lock:" . md5($data['name'] ?? '');

        if (!Redis::setnx($lockKey, 1)) {
            throw new Exception("WorkShift creation is locked. Try again later.");
        }
        Redis::expire($lockKey, $this->lockTtl);

        try {
            // prevent duplicate by name + type
            $exists = WorkShift::where('name', $data['name'])
                ->where('type', $data['type'])
                ->exists();

            if ($exists) {
                throw new Exception("WorkShift with same name and type already exists.");
            }

            return DB::transaction(fn () => WorkShift::create($data));
        } finally {
            Redis::del($lockKey);
        }
    }

    public function update(WorkShift $workShift, array $data)
    {
        $lockKey = "workshift_update_lock:{$workShift->id}";
        if (!Redis::setnx($lockKey, 1)) {
            throw new Exception("WorkShift update is locked. Try again later.");
        }
        Redis::expire($lockKey, $this->lockTtl);

        try {
            $exists = WorkShift::where('name', $data['name'] ?? $workShift->name)
                ->where('type', $data['type'] ?? $workShift->type)
                ->where('id', '!=', $workShift->id)
                ->exists();

            if ($exists) {
                throw new Exception("Another WorkShift with same name and type already exists.");
            }

            $workShift->update($data);
            return $workShift;
        } finally {
            Redis::del($lockKey);
        }
    }

    public function delete(WorkShift $workShift)
    {
        $workShift->delete();
    }
}
