<?php

namespace Tests\Unit\Services\Health;

use App\Services\Health\ReadinessCheckService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class ReadinessCheckServiceTest extends TestCase
{
    public function test_it_reports_ready_when_database_and_redis_are_available(): void
    {
        DB::shouldReceive('select')
            ->once()
            ->with('select 1')
            ->andReturn([(object) ['result' => 1]]);

        $redisConnection = Mockery::mock();

        $redisConnection
            ->shouldReceive('ping')
            ->once()
            ->andReturn(true);

        Redis::shouldReceive('connection')
            ->once()
            ->andReturn($redisConnection);

        $result = app(ReadinessCheckService::class)->check();

        $this->assertSame([
            'ready' => true,
            'checks' => [
                'database' => 'ok',
                'redis' => 'ok',
            ],
        ], $result);
    }

    public function test_it_reports_not_ready_when_database_is_unavailable(): void
    {
        DB::shouldReceive('select')
            ->once()
            ->with('select 1')
            ->andThrow(new RuntimeException('Database unavailable'));

        $redisConnection = Mockery::mock();

        $redisConnection
            ->shouldReceive('ping')
            ->once()
            ->andReturn(true);

        Redis::shouldReceive('connection')
            ->once()
            ->andReturn($redisConnection);

        $result = app(ReadinessCheckService::class)->check();

        $this->assertSame([
            'ready' => false,
            'checks' => [
                'database' => 'unavailable',
                'redis' => 'ok',
            ],
        ], $result);
    }

    public function test_it_reports_not_ready_when_redis_is_unavailable(): void
    {
        DB::shouldReceive('select')
            ->once()
            ->with('select 1')
            ->andReturn([(object) ['result' => 1]]);

        Redis::shouldReceive('connection')
            ->once()
            ->andThrow(new RuntimeException('Redis unavailable'));

        $result = app(ReadinessCheckService::class)->check();

        $this->assertSame([
            'ready' => false,
            'checks' => [
                'database' => 'ok',
                'redis' => 'unavailable',
            ],
        ], $result);
    }
}
