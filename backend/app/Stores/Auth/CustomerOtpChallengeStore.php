<?php

namespace App\Stores\Auth;

use App\Data\Auth\CustomerOtpChallenge;
use App\Enums\CustomerOtpPurpose;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use RuntimeException;

final class CustomerOtpChallengeStore{

    public const int TTL_SECONDS = 300;

    public const int MAX_FAILED_ATTEMPTS = 5;

    private const string KEY_PREFIX = 'auth:customer:otp:challenge:';

    public function createLogin(string $mobile) : CustomerOtpChallenge{
        return $this->create(
            purpose: CustomerOtpPurpose::Login,
            mobile: $mobile,
            fullName: null,
        );
    }

    public function createRegistration(string $mobile, string $fullName) : CustomerOtpChallenge{
        return $this->create(
            purpose: CustomerOtpPurpose::Registration,
            mobile: $mobile,
            fullName: $fullName,
        );
    }

    public function find(string $challengeId, ): ?CustomerOtpChallenge{
        $storedData = Redis::connection()->hGetAll($this->key($challengeId));

        if(!is_array($storedData) || $storedData === []){
            return null;
        }

        $challenge = $this->hydrate(
            challengeID: $challengeId,
            storedData: $storedData,
        );

        if($challenge === null){
            $this->delete($challengeId);
        }

        return $challenge;
    }

    public function consume(string $challengeId) : ?CustomerOtpChallenge{
        $result = Redis::eval(
            <<<'LUA'
            if redis.call('EXISTS', KEYS[1]) == 0 then
                return {}
            end

            local stored_data =
                redis.call('HGETALL', KEYS[1])

            redis.call('DEL', KEYS[1])

            return stored_data
        LUA,
            1,
            $this->key($challengeId),
        );

        if(!is_array($result) || $result === []){
            return null;
        }

        if(count($result) % 2 !== 0){
            throw new RuntimeException('Redis returned malformed OTP challenge data.',);
        }

        $storedData = [];

        for($index = 0 ; $index < count($result); $index+=2){
            $field = $result[$index];

            $value = $result[$index+1];

            if(!is_string($field) || !is_string($value)){
                throw new RuntimeException('Invalid OTP challenge data.',);
            }

            $storedData[$field] = $value;
        }

        return $this->hydrate(
            challengeID: $challengeId,
            storedData: $storedData,
        );
    }

    public function delete(string $challengeId) : void{
        Redis::connection()->del($this->key($challengeId));
    }

    public function recordFailedAttempt(string $challengeId) : ?int{
        $result = Redis::eval(
            <<<'LUA'
            if redis.call('EXISTS', KEYS[1]) == 0 then
                return -1
            end

            local failed_attempts_value =
                redis.call(
                    'HGET',
                    KEYS[1],
                    'failed_attempts'
                )

            local failed_attempts =
                tonumber(failed_attempts_value)

            local maximum_attempts =
                tonumber(ARGV[1])

            if failed_attempts == nil
                or failed_attempts < 0
                or failed_attempts >= maximum_attempts then
                redis.call('DEL', KEYS[1])

                return -1
            end

            local new_failed_attempts =
                redis.call(
                    'HINCRBY',
                    KEYS[1],
                    'failed_attempts',
                    1
                )

            if new_failed_attempts >= maximum_attempts then
                redis.call('DEL', KEYS[1])
            end

            return new_failed_attempts
        LUA,
            1,
            $this->key($challengeId),
            self::MAX_FAILED_ATTEMPTS,
        );

        if(!is_int($result) && is_numeric($result)){
            throw new RuntimeException('Redis returned an invalid failed OTP attempt result.');
        }

        $failedAttempts = (int)$result;

        if($failedAttempts === -1){
            return null;
        }

        if($failedAttempts < 1 || $failedAttempts > self::MAX_FAILED_ATTEMPTS){
            throw new RuntimeException('Redis returned an invalid failed OTP attempt count.');
        }

        return $failedAttempts;
    }

    public function create(CustomerOtpPurpose $purpose, string $mobile, ?string $fullName) : CustomerOtpChallenge
    {
        $challengeID = Str::uuid()->toString();

        $challenge = new CustomerOtpChallenge(
            id: $challengeID,
            purpose: $purpose,
            mobile: $mobile,
            fullName: $fullName,
            failedAttempts: 0,
        );

        $storedData = [
            'purpose' => $purpose->value,
            'mobile' => $mobile,
            'failed_attempts' => '0',
        ];

        if ($fullName !== null) {
            $storedData['full_name'] = $fullName;
        }

        $key = $this->key($challengeID);


        Redis::transaction(function ($redis) use ($key, $storedData): void {
            $redis->hMSet($key, $storedData);

            $redis->expire($key, self::TTL_SECONDS);
        });

        return $challenge;
    }


    private function hydrate(string $challengeID, array $storedData) : ?CustomerOtpChallenge{
        $purposeValue = $storedData['purpose'] ?? null;
        $mobile = $storedData['mobile'] ?? null;
        $failedAttemptsValue = $storedData['failed_attempts'] ?? null;

        if(!is_string($purposeValue) || !is_string($mobile) || !is_string($failedAttemptsValue)){
            return null;
        }

        $purpose = CustomerOtpPurpose::tryFrom($purposeValue);

        if($purpose === null){
            return null;
        }

        if(preg_match('/^\+91[6-9][0-9]{9}$/', $mobile) !== 1){
            return null;
        }

        if(!ctype_digit($failedAttemptsValue)){
            return null;
        }

        $failedAttempts = (int) $failedAttemptsValue;

        if($failedAttempts < 0 || $failedAttempts > self::MAX_FAILED_ATTEMPTS){
            return null;
        }

        $fullName = null;

        if($purpose === CustomerOtpPurpose::Registration){
            $storedFullName = $storedData['full_name'] ?? null;

            if(!is_string($storedFullName) || trim($storedFullName) === ''){
                return null;
            }
            $fullName = $storedFullName;
        }

        return new CustomerOtpChallenge(
            id: $challengeID,
            purpose: $purpose,
            mobile: $mobile,
            fullName: $fullName,
            failedAttempts: $failedAttempts,
        );
    }

    public function key(string $challengeID): string{
        return self::KEY_PREFIX . $challengeID;
    }


}
