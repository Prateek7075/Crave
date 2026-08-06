<?php

use App\Enums\RestaurantOperatingStatus;
use App\Enums\RestaurantVerificationStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('owner_account_id');
            $table->foreign('owner_account_id')->references('id')->on('accounts')->restrictOnDelete();
            $table->string('name','120');
            $table->string('slug', '120')->unique();
            $table->string('description', 1000)->nullable();
            $table->string('verification_status', 30)->default(RestaurantVerificationStatus::Draft->value);
            $table->string('operating_status', 30)->default(RestaurantOperatingStatus::Closed->value);
            $table->timestampTz('submitted_at')->nullable();
            $table->timestampTz('approved_at')->nullable();
            $table->timestampTz('rejected_at')->nullable();
            $table->timestampTz('suspended_at')->nullable();
            $table->timestampsTz();
            $table->unique('owner_account_id',);
            $table->index(['verification_status', 'operating_status',]);
        });
        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_name_not_blank_check
            CHECK (btrim(name) <> '')
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_slug_not_blank_check
            CHECK (btrim(slug) <> '')
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_verification_status_check
            CHECK (
                verification_status IN (
                    'DRAFT',
                    'PENDING_REVIEW',
                    'APPROVED',
                    'REJECTED',
                    'SUSPENDED'
                )
            )
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_operating_status_check
            CHECK (
                operating_status IN (
                    'CLOSED',
                    'OPEN'
                )
            )
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_open_only_when_approved_check
            CHECK (
                operating_status = 'CLOSED'
                OR verification_status = 'APPROVED'
            )
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
