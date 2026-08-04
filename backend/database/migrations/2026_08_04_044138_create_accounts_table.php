<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\AccountStatus;
use App\Enums\AccountRole;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) : void {
            $table->id();
            $table->enum('role', AccountRole::cases());
            $table->enum('status', AccountStatus::cases(),)->default(AccountStatus::Active->value);
            $table->string('mobile',13)->nullable()->unique();
            $table->string('email',254)->nullable();
            $table->string('password_hash')->nullable();
            $table->timestamps();
        });

        DB::statement(<<<'SQL'
            CREATE UNIQUE INDEX accounts_email_lowe_unique ON accounts (LOWER(email)) WHERE email IS NOT NULL
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE accounts ADD CONSTRAINT accounts_contact_required_check CHECK (mobile IS NOT NULL or email IS NOT NULL)
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE accounts ADD CONSTRAINT account_mobile_format_check CHECK (mobile IS NULL OR mobile ~ '^[+]91[6-9][0-9]{9}$')
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
