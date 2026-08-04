<?php

namespace App\Services\Health;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Throwable;

final class ReadinessCheckService
{
    /**
     * @return array{
     *     ready: bool,
     *     checks: array{
     *         database: 'ok'|'unavailable',
     *         redis: 'ok'|'unavailable'
     *     }
     * }
     */
    public function check(): array
    {
        $databaseStatus = $this->checkDatabase();
        $redisStatus = $this->checkRedis();

        return [
            'ready' => $databaseStatus === 'ok'
                && $redisStatus === 'ok',

            'checks' => [
                'database' => $databaseStatus,
                'redis' => $redisStatus,
            ],
        ];
    }

    private function checkDatabase(): string
    {
        try {
            DB::select('select 1');

            return 'ok';
        } catch (Throwable) {
            return 'unavailable';
        }
    }

    private function checkRedis(): string
    {
        try {
            Redis::connection()->ping();

            return 'ok';
        } catch (Throwable) {
            return 'unavailable';
        }
    }
}
