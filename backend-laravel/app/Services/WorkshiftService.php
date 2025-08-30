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

            return DB::transaction(fn() => WorkShift::create([
                'name'       => $data['name'],
                'type'       => $data['type'],
                'descriptoin' => $data['description'],
            ]));
        } finally {
            Redis::del($lockKey);
        }
    }

    public function update($id, array $data)
    {
        try {
            $lockKey = "workshift_update_lock:{$id}";
            if (!Redis::setnx($lockKey, 1)) {
                throw ValidationException::withMessages([
                    'concurrency' => ['WorkShift update is locked. Try again later.'],
                ]);
            }
            $workShift = Workshift::find($id);
            Redis::expire($lockKey, $this->lockTtl);

            $workShift->update($data);
            return $workShift;
        } finally {
            Redis::del($lockKey);
        }
    }

    public function delete($id)
    {
        $workShift = WorkShift::find($id);
        if($workShift) {
            return $workShift->delete();
        }

        return false;

    }
}
