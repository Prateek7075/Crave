<?php

namespace Tests\Feature\Api\V1\Middleware;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ApiResponseSecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_responses_are_marked_no_store(): void
    {
        $response = $this->getJson('/api/v1/health/live');

        $response
            ->assertOk()
            ->assertHeaderContains('Cache-Control', 'no-store')
            ->assertHeaderContains('Cache-Control', 'no-cache')
            ->assertHeaderContains('Cache-Control', 'must-revalidate')
            ->assertHeaderContains('Cache-Control', 'max-age=0')
            ->assertHeader('Pragma', 'no-cache')
            ->assertHeader('Expires', '0');
    }
}
