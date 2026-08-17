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
        Schema::table('restaurants', function (Blueprint $table) {
            // Contact
            $table->string('contact_number', 13)->nullable();
            $table->string('contact_email', 255)->nullable();

            // Address
            $table->string('address_line_1', 255)->nullable();
            $table->string('address_line_2', 255)->nullable();
            $table->string('landmark', 160)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('pincode', 6)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Legal
            $table->string('fssai_license_number', 14)->nullable();
            $table->string('gstin', 15)->nullable();
        });

        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_latitude_range_check
            CHECK (
                latitude IS NULL OR (latitude >= -90 AND latitude <= 90)
            )
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_longitude_range_check
            CHECK (
                longitude IS NULL OR (longitude >= -180 AND longitude <= 180)
            )
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_pincode_format_check
            CHECK (
                pincode IS NULL OR pincode ~ '^[0-9]{6}$'
            )
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE restaurants
            ADD CONSTRAINT restaurants_fssai_format_check
            CHECK (
                fssai_license_number IS NULL OR fssai_license_number ~ '^[0-9]{14}$'
            )
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn([
                'contact_number',
                'contact_email',
                'address_line_1',
                'address_line_2',
                'landmark',
                'city',
                'state',
                'pincode',
                'latitude',
                'longitude',
                'fssai_license_number',
                'gstin',
            ]);
        });
    }
};
