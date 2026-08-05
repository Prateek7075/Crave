<?php

namespace Tests\Feature\Http\Requests;

use App\Http\Requests\Api\V1\Customer\StoreCustomerAddressRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

final class StoreCustomerAddressRequestTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Route::post(
            '/testing/customer-addresses',
            function (
                StoreCustomerAddressRequest $request,
            ): JsonResponse {
                return response()->json(
                    $request->validated(),
                );
            },
        );
    }

    public function test_it_validates_and_normalizes_an_address(): void
    {
        $response = $this->postJson(
            '/testing/customer-addresses',
            [
                'label' => '  Home  ',
                'recipient_name' =>
                    '  Prateek Sharma  ',
                'address_line_1' =>
                    '  House 21, Sector 10  ',
                'address_line_2' => '   ',
                'landmark' =>
                    '  Community Centre  ',
                'latitude' => ' 30.7333148 ',
                'longitude' => ' 76.7794179 ',
                'delivery_instructions' =>
                    '  Call at the main gate.  ',
            ],
        );

        $response
            ->assertOk()
            ->assertExactJson([
                'label' => 'Home',
                'recipient_name' =>
                    'Prateek Sharma',
                'address_line_1' =>
                    'House 21, Sector 10',
                'address_line_2' => null,
                'landmark' =>
                    'Community Centre',
                'latitude' =>
                    '30.7333148',
                'longitude' =>
                    '76.7794179',
                'delivery_instructions' =>
                    'Call at the main gate.',
            ]);
    }

    public function test_it_rejects_invalid_address_data(): void
    {
        $response = $this->postJson(
            '/testing/customer-addresses',
            [
                'label' => '   ',
                'recipient_name' => '',
                'address_line_1' => '',
                'address_line_2' => 123,
                'landmark' => 123,
                'latitude' => 91,
                'longitude' => -181,
                'delivery_instructions' =>
                    str_repeat('A', 501),
            ],
        );

        $response
            ->assertUnprocessable()
            ->assertJsonPath(
                'error.code',
                'VALIDATION_ERROR',
            )
            ->assertJsonStructure([
                'error' => [
                    'code',
                    'message',
                    'details' => [
                        'fields' => [
                            'label',
                            'recipient_name',
                            'address_line_1',
                            'address_line_2',
                            'landmark',
                            'latitude',
                            'longitude',
                            'delivery_instructions',
                        ],
                    ],
                ],
                'requestId',
            ]);
    }
}
