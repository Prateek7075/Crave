<?php

namespace App\Services\Auth;

use App\Data\Auth\CustomerOtpChallenge;
use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Enums\CustomerOtpSendLimitReason;
use App\Exceptions\ApiException;
use App\Models\Account;
use App\Queries\Auth\FindAccountByMobile;
use App\Stores\Auth\CustomerOtpChallengeStore;
use App\Stores\Auth\CustomerOtpSendLimitStore;
use App\Support\Auth\DevelopmentOtpCode;
use RuntimeException;


final class CustomerRequestCodeService{

    public function __construct(private readonly FindAccountByMobile $findAccountByMobile, private readonly CustomerOtpSendLimitStore $otpSendLimitStore, private readonly CustomerOtpChallengeStore $otpChallengeStore){}

    /**
     * @return array{nextStep: 'ENTER_REGISTRATION_DETAILS'}|array{
     *     nextStep: 'VERIFY_CODE',
     *     challengeId: string,
     *     expiresInSeconds: int,
     *     resendAfterSeconds: int,
     *     developmentCode?: string
     * }
     */

    public function handle(string $mobile, ?string $fullName): array {
        $account = ($this->findAccountByMobile)($mobile);

        if($account !== null){
            $this->assertCustomerCanLogin($account);

            $this->reserveOtpSend($mobile);

            $challenge  = $this->otpChallengeStore->createLogin($mobile);

            return $this->verificationResponse($challenge);
        }

        if($fullName === null){
            return[
                'nextStep' => 'ENTER_REGISTRATION_DETAILS',
            ];
        }

        $this->reserveOtpSend($mobile);

        $challenge = $this->otpChallengeStore->createRegistration($mobile, $fullName);

        return $this->verificationResponse($challenge);
    }

    private function assertCustomerCanLogin(Account $account): void{
        if($account->role !== AccountRole::Customer){
            throw new ApiException(
                errorCode: 'ACCOUNT_ROLE_CONFLICT',
                message: 'This mobile number is registered for a different account type',
                statusCode: 409,
            );
        }

        if ($account->status !== AccountStatus::Active) {
            throw new ApiException(
                errorCode: 'ACCOUNT_NOT_ACTIVE',
                message: 'This account is currently unavailable',
                statusCode: 403,
            );
        }

    }

    private function reserveOtpSend(string $mobile): void{

        $result = $this->otpSendLimitStore->reserve($mobile);

        if($result->allowed){
            return;
        }

        if($result->reason === null || $result->retryAfterSeconds === null){
            throw new RuntimeException('Blocked OTP limit result is incomplete');
        }

        if($result->reason === CustomerOtpSendLimitReason::Cooldown){
            throw new ApiException(
                errorCode: 'OTP_COOLDOWN',
                message: 'Please wait before requesting another code.',
                statusCode: 429,
                details: ['retryAfterSeconds' => $result->retryAfterSeconds,
                ],
            );
        }

        if($result->reason === CustomerOtpSendLimitReason::HourlyLimit){
            throw new ApiException(
                errorCode: 'OTP_LIMIT_EXCEEDED',
                message: 'Too many verification codes have been requested. Please try again later.',
                statusCode: 429,
                details: ['retryAfterSeconds' => $result->retryAfterSeconds,
                ],
            );
        }

        throw new RuntimeException('Unknown OTP send limit reason');
    }

    /**
     * @return array{
     *     nextStep: 'VERIFY_CODE',
     *     challengeId: string,
     *     expiresInSeconds: int,
     *     resendAfterSeconds: int,
     *     developmentCode?: string
     * }
     */
    private function verificationResponse(CustomerOtpChallenge $challenge,): array{

        $response = [
            'nextStep' => 'VERIFY_CODE',
            'challengeId' => $challenge->id,
            'expiresInSeconds' => CustomerOtpChallengeStore::TTL_SECONDS,
            'resendAfterSeconds' => CustomerOtpSendLimitStore::COOLDOWN_SECONDS,
        ];

        if(! app()->environment('production')){
            $response['developmentCode'] = DevelopmentOtpCode::value();
        }

        return $response;
    }
}
