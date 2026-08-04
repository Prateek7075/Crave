<?php

namespace Tests\Feature\Api\V1\Middleware;

use App\Http\Middleware\AssignRequestId;
use Illuminate\Support\Str;
use Tests\TestCase;

class AssignRequestIdTest extends TestCase
{
    public function test_it_generates_a_request_id_when_the_header_is_missing(): void
    {
        $response = $this->getJson(
            '/api/v1/health/live',
        );

        $response->assertOk();

        $requestId = $response->headers->get(
            AssignRequestId::HEADER_NAME,
        );

        $this->assertIsString($requestId);
        $this->assertTrue(Str::isUuid($requestId));
    }

    public function test_it_preserves_and_trims_a_valid_incoming_request_id(): void
    {
        $response = $this
            ->withHeader(
                AssignRequestId::HEADER_NAME,
                '  frontend-request-123  ',
            )
            ->getJson('/api/v1/health/live');

        $response
            ->assertOk()
            ->assertHeader(
                AssignRequestId::HEADER_NAME,
                'frontend-request-123',
            );
    }

    public function test_it_replaces_an_incoming_request_id_that_is_too_long(): void
    {
        $invalidRequestId = str_repeat('a', 101);

        $response = $this
            ->withHeader(
                AssignRequestId::HEADER_NAME,
                $invalidRequestId,
            )
            ->getJson('/api/v1/health/live');

        $response->assertOk();

        $requestId = $response->headers->get(
            AssignRequestId::HEADER_NAME,
        );

        $this->assertIsString($requestId);

        $this->assertNotSame(
            $invalidRequestId,
            $requestId,
        );

        $this->assertTrue(
            Str::isUuid($requestId),
        );
    }
}
