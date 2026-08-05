<?php

namespace Tests\Feature\Stores\Auth;

use App\Enums\CustomerOtpSendLimitReason;
use App\Stores\Auth\CustomerOtpSendLimitStore;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

final class CustomerOtpSendLimitStoreTest extends TestCase
{
    private const MOBILE = '+919876543219';

    protected function setUp(): void
    {
        parent::setUp();

        $this->clearLimitKeys();
    }

    protected function tearDown(): void
    {
        $this->clearLimitKeys();

        parent::tearDown();
    }

    public function test_it_allows_the_first_otp_request(): void
    {
        $result = app(
            CustomerOtpSendLimitStore::class,
        )->reserve(self::MOBILE);

        $this->assertTrue($result->allowed);
        $this->assertNull($result->reason);
        $this->assertNull(
            $result->retryAfterSeconds,
        );
    }

    public function test_it_blocks_an_immediate_second_request_during_cooldown(): void
    {
        $store = app(
            CustomerOtpSendLimitStore::class,
        );

        $store->reserve(self::MOBILE);

        $result = $store->reserve(self::MOBILE);

        $this->assertFalse($result->allowed);

        $this->assertSame(
            CustomerOtpSendLimitReason::Cooldown,
            $result->reason,
        );

        $this->assertNotNull(
            $result->retryAfterSeconds,
        );

        $this->assertGreaterThan(0,
            $result->retryAfterSeconds,
        );

        $this->assertLessThanOrEqual(
            CustomerOtpSendLimitStore::COOLDOWN_SECONDS,
            $result->retryAfterSeconds,
        );
    }

    public function test_it_blocks_after_five_requests_in_one_hour(): void
    {
        $store = app(
            CustomerOtpSendLimitStore::class,
        );

        for (
            $attempt = 1;
            $attempt <=
            CustomerOtpSendLimitStore::MAX_SENDS_PER_HOUR;
            $attempt++
        ) {
            $result = $store->reserve(self::MOBILE);

            $this->assertTrue($result->allowed);

            Redis::connection()->del(
                $this->cooldownKey(),
            );
        }

        $result = $store->reserve(self::MOBILE);

        $this->assertFalse($result->allowed);

        $this->assertSame(
            CustomerOtpSendLimitReason::HourlyLimit,
            $result->reason,
        );

        $this->assertNotNull(
            $result->retryAfterSeconds,
        );

        $this->assertGreaterThan(0,
            $result->retryAfterSeconds,
        );

        $this->assertLessThanOrEqual(
            CustomerOtpSendLimitStore::HOURLY_WINDOW_SECONDS,
            $result->retryAfterSeconds,
        );
    }

    public function test_it_repairs_a_missing_hourly_expiry(): void
    {
        Redis::connection()->set(
            $this->hourlyKey(),
            CustomerOtpSendLimitStore::MAX_SENDS_PER_HOUR,
        );

        $result = app(
            CustomerOtpSendLimitStore::class,
        )->reserve(self::MOBILE);

        $this->assertFalse($result->allowed);

        $this->assertSame(
            CustomerOtpSendLimitReason::HourlyLimit,
            $result->reason,
        );

        $ttl = Redis::connection()->ttl(
            $this->hourlyKey(),
        );

        $this->assertGreaterThan(0, $ttl);

        $this->assertLessThanOrEqual(
            CustomerOtpSendLimitStore::HOURLY_WINDOW_SECONDS,
            $ttl,
        );
    }

    private function clearLimitKeys(): void
    {
        Redis::connection()->del(
            $this->cooldownKey(),
            $this->hourlyKey(),
        );
    }

    private function cooldownKey(): string
    {
        return
            'auth:customer:otp:cooldown:'.self::MOBILE;
    }

    private function hourlyKey(): string
    {
        return
            'auth:customer:otp:hourly:'.self::MOBILE;
    }
}
