<?php

namespace App\Services;

use App\Models\WorkShift;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WorkShiftService
{
    protected $lockTtl = 5; // seconds

    public function getAll($perPage = 10)
    {
        return WorkShift::paginate($perPage);
    }

    public function create(array $data)
    {
        $lockKey = "workshift_lock:" . md5($data['name'] ?? '');

        if (!Redis::setnx($lockKey, 1)) {
            throw ValidationException::withMessages([
                'concurrency' => ['WorkShift creation is locked. Try again later.'],
            ]);
        }
        Redis::expire($lockKey, $this->lockTtl);

        try {
            // prevent duplicate by name + type
            $exists = WorkShift::where('name', $data['name'])
                ->where('type', $data['type'])
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'duplicate' => ['WorkShift with same name and type already exists.'],
                ]);
            }

            return DB::transaction(fn () => WorkShift::create([
                'name'       => $data['name'],
                'type'       => $data['type'],
                'start_time' => $data['start_time'],
                'end_time'   => $data['end_time'],
            ]));
        } finally {
            Redis::del($lockKey);
        }
    }

    public function update(WorkShift $workShift, array $data)
    {
        $lockKey = "workshift_update_lock:{$workShift->id}";

        if (!Redis::setnx($lockKey, 1)) {
            throw ValidationException::withMessages([
                'concurrency' => ['WorkShift update is locked. Try again later.'],
            ]);
        }
        Redis::expire($lockKey, $this->lockTtl);

        try {
            $exists = WorkShift::where('name', $data['name'] ?? $workShift->name)
                ->where('type', $data['type'] ?? $workShift->type)
                ->where('id', '!=', $workShift->id)
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'duplicate' => ['Another WorkShift with same name and type already exists.'],
                ]);
            }

            $workShift->update([
                'name'       => $data['name']       ?? $workShift->name,
                'type'       => $data['type']       ?? $workShift->type,
                'start_time' => $data['start_time'] ?? $workShift->start_time,
                'end_time'   => $data['end_time']   ?? $workShift->end_time,
            ]);

            return $workShift;
        } finally {
            Redis::del($lockKey);
        }
    }

    public function delete(WorkShift $workShift)
    {
        return $workShift->delete();
    }
}
