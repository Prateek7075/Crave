<?php

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
        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger(
                'customer_profile_id',
            );
            $table
                ->foreign('customer_profile_id')
                ->references('id')
                ->on('customer_profiles')
                ->cascadeOnDelete();
            $table->string('label',40);
            $table->string('recipient_name',120);
            $table->string('address_line_1',255);
            $table->string('address_line_2',255)->nullable();
            $table->string('landmark',160)->nullable();
            $table->decimal('latitude',10,7);
            $table->decimal('longitude',10,7);
            $table->string('delivery_instructions',500)->nullable();
            $table->timestamps();
            $table->index(['customer_profile_id']);
        });

        DB::statement(<<<'SQL'
            ALTER TABLE customer_addresses
            ADD CONSTRAINT customer_addresses_label_not_blank_check
            CHECK (btrim(label) <> '')
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE customer_addresses
            ADD CONSTRAINT customer_addresses_recipient_name_not_blank_check
            CHECK (btrim(recipient_name) <> '')
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE customer_addresses
            ADD CONSTRAINT customer_addresses_line_1_not_blank_check
            CHECK (btrim(address_line_1) <> '')
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE customer_addresses
            ADD CONSTRAINT customer_addresses_latitude_range_check
            CHECK (
                latitude >= -90
                AND latitude <= 90
            )
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE customer_addresses
            ADD CONSTRAINT customer_addresses_longitude_range_check
            CHECK (
                longitude >= -180
                AND longitude <= 180
            )
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_addresses');
    }
};
