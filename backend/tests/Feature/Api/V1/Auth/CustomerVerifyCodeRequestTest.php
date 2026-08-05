<?php

namespace Tests\Feature\Api\V1\Auth;

use App\Http\Requests\Api\V1\Auth\CustomerVerifyCodeRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

final class CustomerVerifyCodeRequestTest extends TestCase
{
    private const string CHALLENGE_ID =
        '550e8400-e29b-41d4-a716-446655440000';

    protected function setUp(): void
    {
        parent::setUp();

        Route::post(
            '/api/v1/testing/customer-verify-code',
            function (
                CustomerVerifyCodeRequest $request,
            ): JsonResponse {
                return response()->json(
                    $request->validated(),
                );
            },
        );
    }

    public function test_it_accepts_and_trims_valid_verification_input(): void
    {
        $response = $this->postJson(
            '/api/v1/testing/customer-verify-code',
            [
                'challengeId' =>
                    '  '.self::CHALLENGE_ID.'  ',

                'code' => '  1234  ',
            ],
        );

        $response
            ->assertOk()
            ->assertExactJson([
                'challengeId' =>
                    self::CHALLENGE_ID,
                'code' => '1234',
            ]);
    }

    public function test_it_rejects_missing_verification_input(): void
    {
        $response = $this->postJson(
            '/api/v1/testing/customer-verify-code',
            [],
        );

        $response
            ->assertStatus(422)
            ->assertJsonPath(
                'error.details.fields.challengeId.0',
                'Challenge ID is required.',
            )
            ->assertJsonPath(
                'error.details.fields.code.0',
                'Verification code is required.',
            );
    }

    public function test_it_rejects_an_invalid_challenge_id(): void
    {
        $response = $this->postJson(
            '/api/v1/testing/customer-verify-code',
            [
                'challengeId' => 'not-a-uuid',
                'code' => '1234',
            ],
        );

        $response
            ->assertStatus(422)
            ->assertJsonPath(
                'error.details.fields.challengeId.0',
                'Challenge ID must be a valid UUID.',
            );
    }

    public function test_it_rejects_a_code_that_is_not_exactly_four_digits(): void
    {
        $response = $this->postJson(
            '/api/v1/testing/customer-verify-code',
            [
                'challengeId' =>
                    self::CHALLENGE_ID,

                'code' => '123',
            ],
        );

        $response
            ->assertStatus(422)
            ->assertJsonPath(
                'error.details.fields.code.0',
                'Verification code must contain exactly 4 digits.',
            );
    }

    public function test_it_rejects_a_numeric_code_value(): void
    {

        $response = $this->postJson(
            '/api/v1/testing/customer-verify-code',
            [
                'challengeId' => self::CHALLENGE_ID,
                'code' => 1234,
            ],
        );

        dump($response->json());

        $response
            ->assertStatus(422)
            ->assertJsonPath(
                'error.details.fields.code.0',
                'Verification code must be a string.',
            );
    }
}
