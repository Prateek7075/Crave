<?php

namespace App\Stores\Auth;

use App\Data\Auth\CustomerOtpSendLimitResult;
use App\Enums\CustomerOtpSendLimitReason;
use Illuminate\Support\Facades\Redis;
use RuntimeException;


final class CustomerOtpSendLimitStore{

    public const COOLDOWN_SECONDS = 30;

    public const HOURLY_WINDOW_SECONDS = 3600;

    public const MAX_SENDS_PER_HOUR = 5;

    private const COOLDOWN_KEY_PREFIX =  'auth:customer:otp:cooldown:';

    private const HOURLY_KEY_PREFIX =  'auth:customer:otp:hourly:';

    private const RESULT_ALLOWED = 1;

    private const RESULT_BLOCKED = 0;

    private const RESULT_COOLDOWN  = 1;

    private const REASON_HOURLY_LIMIT = 2;


    public function reserve(string $mobile,): CustomerOtpSendLimitResult{
        $result = Redis::eval(
            <<<'LUA'
                local cooldown_ttl =
                    redis.call('TTL', KEYS[1])

                if cooldown_ttl > 0 then
                    return {
                        0,
                        1,
                        cooldown_ttl
                    }
                end

                local hourly_count_value =
                    redis.call('GET', KEYS[2])

                local hourly_count =
                    tonumber(hourly_count_value or '0')

                local hourly_ttl =
                    redis.call('TTL', KEYS[2])

                local hourly_limit =
                    tonumber(ARGV[3])

                if hourly_count >= hourly_limit then
                    if hourly_ttl < 1 then
                        redis.call(
                            'EXPIRE',
                            KEYS[2],
                            ARGV[2]
                        )

                        hourly_ttl =
                            tonumber(ARGV[2])
                    end

                    return {
                        0,
                        2,
                        hourly_ttl
                    }
                end

                redis.call(
                    'SET',
                    KEYS[1],
                    '1',
                    'EX',
                    ARGV[1]
                )

                local new_hourly_count =
                    redis.call('INCR', KEYS[2])

                if new_hourly_count == 1
                    or hourly_ttl < 1 then
                    redis.call(
                        'EXPIRE',
                        KEYS[2],
                        ARGV[2]
                    )
                end

                return {
                    1,
                    0,
                    0
                }
            LUA,
            2,
            $this->cooldownKey($mobile),
            $this->hourlyKey($mobile),
            self::COOLDOWN_SECONDS,
            self::HOURLY_WINDOW_SECONDS,
            self::MAX_SENDS_PER_HOUR,
        );

        return $this->mapResult($result);
    }

    private function mapResult(mixed $result): CustomerOtpSendLimitResult{
        if(!is_array($result) || count($result) !== 3) {
            throw new RuntimeException("Redis returned an invalid otp send limit result");
        }

        $allowed = (int) $result[0];

        if($allowed === self::RESULT_ALLOWED){
            return CustomerOtpSendLimitResult::allowed();
        }

        if($allowed !== self::RESULT_BLOCKED){
            throw new RuntimeException('Redis returned an unknown OTP send limit status.',);
        }

        $reasonCode =(int) $result[1];

        $retryAfterSeconds = max(1, (int) $result[2]);

        $reason = match($reasonCode) {
            self::RESULT_COOLDOWN => CustomerOtpSendLimitReason::Cooldown,

            self::REASON_HOURLY_LIMIT => CustomerOtpSendLimitReason::HourlyLimit,

            default => throw new RuntimeException('Redis returned an unknown OTP send limit reason.',),
        };

        return CustomerOtpSendLimitResult::blocked($reason, $retryAfterSeconds);

    }

    private function cooldownKey(string $mobile): string {
        return self::COOLDOWN_KEY_PREFIX . $mobile;
    }


    private function hourlyKey(string $mobile): string {
        return self::HOURLY_KEY_PREFIX . $mobile;
    }


}
