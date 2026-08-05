<?php

namespace Tests\Feature\Stores\Auth;

use App\Enums\CustomerOtpPurpose;
use App\Stores\Auth\CustomerOtpChallengeStore;
use Tests\TestCase;

final class CustomerOtpChallengeConsumeStoreTest extends TestCase
{
    private const MOBILE = '+919876543216';

    private CustomerOtpChallengeStore $store;

    /**
     * @var list<string>
     */
    private array $challengeIds = [];

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

    public function test_it_consumes_a_login_challenge(): void
    {
        $created = $this->store->createLogin(
            self::MOBILE,
        );

        $this->challengeIds[] = $created->id;

        $consumed = $this->store->consume(
            $created->id,
        );

        $this->assertNotNull($consumed);

        $this->assertSame(
            $created->id,
            $consumed->id,
        );

        $this->assertSame(
            CustomerOtpPurpose::Login,
            $consumed->purpose,
        );

        $this->assertSame(
            self::MOBILE,
            $consumed->mobile,
        );

        $this->assertNull(
            $this->store->find($created->id),
        );
    }

    public function test_it_consumes_a_registration_challenge_with_the_name(): void
    {
        $created =
            $this->store->createRegistration(
                mobile: self::MOBILE,
                fullName: 'Prateek Sharma',
            );

        $this->challengeIds[] = $created->id;

        $consumed = $this->store->consume(
            $created->id,
        );

        $this->assertNotNull($consumed);

        $this->assertSame(
            CustomerOtpPurpose::Registration,
            $consumed->purpose,
        );

        $this->assertSame(
            'Prateek Sharma',
            $consumed->fullName,
        );
    }

    public function test_it_allows_a_challenge_to_be_consumed_only_once(): void
    {
        $created = $this->store->createLogin(
            self::MOBILE,
        );

        $this->challengeIds[] = $created->id;

        $firstConsumption = $this->store->consume(
            $created->id,
        );

        $secondConsumption = $this->store->consume(
            $created->id,
        );

        $this->assertNotNull($firstConsumption);
        $this->assertNull($secondConsumption);
    }

    public function test_it_returns_null_for_a_missing_challenge(): void
    {
        $consumed = $this->store->consume(
            '550e8400-e29b-41d4-a716-446655440000',
        );

        $this->assertNull($consumed);
    }
}
