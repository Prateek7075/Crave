<?php

namespace App\Services\Auth;

use App\Data\Auth\CustomerOtpChallenge;
use App\Data\Auth\CustomerVerificationResult;
use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Enums\CustomerOtpPurpose;
use App\Exceptions\ApiException;
use App\Models\Account;
use App\Queries\Auth\FindAccountByMobile;
use App\Stores\Auth\CustomerOtpChallengeStore;
use App\Support\Auth\DevelopmentOtpCode;
use Illuminate\Support\Facades\DB;
use RuntimeException;

final class CustomerVerifyCodeService
{
    public function __construct(private readonly CustomerOtpChallengeStore $challengeStore, private readonly FindAccountByMobile $findAccountByMobile,) {}

    public function handle(string $challengeId, string $code,): CustomerVerificationResult {
        $challenge = $this->challengeStore->find($challengeId,);

        if ($challenge === null) {
            throw $this->challengeExpiredException();
        }

        if (! $this->codeMatches($code)) {
            $this->handleInvalidCode($challengeId,);
        }

        $consumedChallenge = $this->challengeStore->consume($challengeId,);

        if ($consumedChallenge === null) {
            throw $this->challengeExpiredException();
        }

        return $this->resolveCustomer($consumedChallenge,);
    }

    private function codeMatches(string $submittedCode,): bool {
        return hash_equals(DevelopmentOtpCode::value(), $submittedCode,);
    }

    private function handleInvalidCode(string $challengeId,): never {
        $failedAttempts = $this->challengeStore->recordFailedAttempt($challengeId,);

        if ($failedAttempts === null) {
            throw $this->challengeExpiredException();
        }

        if ($failedAttempts >= CustomerOtpChallengeStore::MAX_FAILED_ATTEMPTS) {
            throw new ApiException(
                errorCode: 'OTP_ATTEMPTS_EXCEEDED',
                message: 'Too many incorrect verification attempts. Request a new code.',
                statusCode: 429,
            );
        }

        throw new ApiException(
            errorCode: 'OTP_CODE_INVALID',
            message: 'The verification code is incorrect.',
            statusCode: 422,
            details: [
                'remainingAttempts' =>
                    CustomerOtpChallengeStore::MAX_FAILED_ATTEMPTS
                    - $failedAttempts,
            ],
        );
    }

    private function resolveCustomer(CustomerOtpChallenge $challenge,): CustomerVerificationResult {
        if ($challenge->purpose === CustomerOtpPurpose::Login) {
            return $this->resolveLoginCustomer($challenge,);
        }

        if ($challenge->purpose === CustomerOtpPurpose::Registration) {
            return $this->resolveRegistrationCustomer($challenge,);
        }

        throw new RuntimeException('Unknown customer OTP challenge purpose.',);
    }

    private function resolveLoginCustomer(CustomerOtpChallenge $challenge,): CustomerVerificationResult {
        $account = ($this->findAccountByMobile)($challenge->mobile,);

        if ($account === null) {
            throw $this->challengeExpiredException();
        }

        $this->assertCustomerCanAuthenticate($account,);

        return new CustomerVerificationResult(
            account: $account,
            registeredNow: false,
        );
    }

    private function resolveRegistrationCustomer(CustomerOtpChallenge $challenge,): CustomerVerificationResult {
        if ($challenge->fullName === null) {
            throw new RuntimeException('Registration challenge does not contain a customer name.',);
        }

        return DB::transaction(function () use ($challenge,): CustomerVerificationResult {
                $account = Account::query()
                    ->firstOrCreate(
                        [
                            'mobile' =>
                                $challenge->mobile,
                        ],
                        [
                            'role' =>
                                AccountRole::Customer,
                            'status' =>
                                AccountStatus::Active,
                        ],
                    );

                $this->assertCustomerCanAuthenticate($account,);

                if ($account->wasRecentlyCreated) {
                    $account->customerProfile()->create([
                        'full_name' => $challenge->fullName,
                    ]);
                }

                return new CustomerVerificationResult(
                    account: $account,
                    registeredNow:
                    $account->wasRecentlyCreated,
                );
            },
        );
    }

    private function assertCustomerCanAuthenticate(Account $account,): void {
        if ($account->role !== AccountRole::Customer) {
            throw new ApiException(
                errorCode: 'ACCOUNT_ROLE_CONFLICT',
                message:
                'This mobile number is registered for a different account type',
                statusCode: 409,
            );
        }

        if ($account->status !== AccountStatus::Active) {
            throw new ApiException(
                errorCode: 'ACCOUNT_NOT_ACTIVE',
                message:
                'This account is currently unavailable',
                statusCode: 403,
            );
        }
    }

    private function challengeExpiredException(): ApiException {
        return new ApiException(
            errorCode: 'OTP_CHALLENGE_EXPIRED',
            message: 'This verification challenge has expired or is no longer available.',
            statusCode: 410,
        );
    }
}
