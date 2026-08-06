<?php

namespace Tests\Feature\Http\Requests;

use App\Http\Requests\Api\V1\Restaurant\UpdateRestaurantRequest;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

final class UpdateRestaurantRequestTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Route::put(
            '/test/update-restaurant-request',
            function (UpdateRestaurantRequest $request) {
                return response()->json(
                    $request->validated(),
                );
            },
        );
    }

    public function test_it_validates_restaurant_update_data(): void
    {
        $response = $this->putJson(
            '/test/update-restaurant-request',
            [
                'name' => 'Crave',
                'description' => 'Best burgers',
                'phone' => '9876543210',
                'email' => 'owner@test.com',
                'logo_url' => 'https://example.com/logo.png',
                'banner_url' => 'https://example.com/banner.png',
            ],
        );

        $response
            ->assertOk()
            ->assertJsonPath('name', 'Crave')
            ->assertJsonPath('description', 'Best burgers');
    }

    public function test_it_rejects_invalid_data(): void
    {
        $response = $this->putJson(
            '/test/update-restaurant-request',
            [
                'email' => 'invalid',
                'logo_url' => 'abc',
                'banner_url' => 'xyz',
            ],
        );

        $response->dump();
        $response
            ->assertUnprocessable()
            ->assertJsonPath(
                'error.details.fields.email.0',
                'The email field must be a valid email address.'
            )
            ->assertJsonPath(
                'error.details.fields.logo_url.0',
                'The logo url field must be a valid URL.'
            )
            ->assertJsonPath(
                'error.details.fields.banner_url.0',
                'The banner url field must be a valid URL.'
            );
    }
}
