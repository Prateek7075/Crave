<?php

namespace Tests\Feature\Api\V1\Health;

use Tests\TestCase;

class LiveHealthCheckTest extends TestCase
{
    public function test_live_health_endpoint_reports_that_the_api_is_running(): void
    {
        $response = $this->getJson('/api/v1/health/live');

        $response
            ->assertOk()
            ->assertExactJson([
                'status' => 'ok',
                'service' => 'crave-api',
            ]);
    }
}
