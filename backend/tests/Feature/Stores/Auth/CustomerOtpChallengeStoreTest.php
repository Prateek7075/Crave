<?php

namespace Tests\Feature\Stores\Auth;

use App\Enums\CustomerOtpPurpose;
use App\Stores\Auth\CustomerOtpChallengeStore;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Tests\TestCase;

final class CustomerOtpChallengeStoreTest extends TestCase
{
    /**
     * @var list<string>
     */
    private array $challengeIds = [];

    private CustomerOtpChallengeStore $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = app(
            CustomerOtpChallengeStore::class,
        );
    }

    protected function tearDown(): void
    {
        foreach ($this->challengeIds as $challengeId) {
            $this->store->delete($challengeId);
        }

        parent::tearDown();
    }

    public function test_it_creates_and_loads_a_login_challenge(): void
    {
        $created = $this->store->createLogin(
            '+919876543210',
        );

        $this->challengeIds[] = $created->id;

        $this->assertTrue(
            Str::isUuid($created->id),
        );

        $this->assertSame(
            CustomerOtpPurpose::Login,
            $created->purpose,
        );

        $this->assertNull($created->fullName);
        $this->assertSame(0, $created->failedAttempts);

        $loaded = $this->store->find($created->id);

        $this->assertNotNull($loaded);
        $this->assertSame($created->id, $loaded->id);
        $this->assertSame($created->mobile, $loaded->mobile);
        $this->assertSame($created->purpose, $loaded->purpose);

        $ttl = Redis::connection()->ttl(
            'auth:customer:otp:challenge:'.$created->id,
        );

        $this->assertGreaterThan(0, $ttl);

        $this->assertLessThanOrEqual(
            CustomerOtpChallengeStore::TTL_SECONDS,
            $ttl,
        );
    }

    public function test_it_creates_and_loads_a_registration_challenge(): void
    {
        $created = $this->store->createRegistration(
            mobile: '+919876543210',
            fullName: 'Prateek Sharma',
        );

        $this->challengeIds[] = $created->id;

        $loaded = $this->store->find($created->id);

        $this->assertNotNull($loaded);

        $this->assertSame(
            CustomerOtpPurpose::Registration, $loaded->purpose,
        );

        $this->assertSame(
            'Prateek Sharma',
            $loaded->fullName,
        );
    }

    public function test_it_returns_null_when_the_challenge_does_not_exist(): void
    {
        $this->assertNull(
            $this->store->find(
                Str::uuid()->toString(),
            ),
        );
    }

    public function test_it_deletes_a_challenge(): void
    {
        $created = $this->store->createLogin(
            '+919876543210',
        );

        $this->store->delete($created->id);

        $this->assertNull(
            $this->store->find($created->id),
        );
    }

    public function test_it_deletes_malformed_challenge_data(): void
    {
        $challengeId = Str::uuid()->toString();

        $this->challengeIds[] = $challengeId;

        $key =
            'auth:customer:otp:challenge:'.$challengeId;

        Redis::connection()->hMSet($key, [
            'purpose' => 'INVALID_PURPOSE',
            'mobile' => '+919876543210',
            'failed_attempts' => '0',
        ]);

        $this->assertNull(
            $this->store->find($challengeId),
        );

        $this->assertSame(
            0,
            Redis::connection()->exists($key),
        );
    }
}
