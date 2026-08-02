-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTORBIKE', 'SCOOTER', 'BICYCLE');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "role" "AccountRole" NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "mobile" VARCHAR(20),
    "email" VARCHAR(320),
    "password_hash" TEXT,
    "mobile_verified_at" TIMESTAMPTZ(3),
    "email_verified_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "profile_image_id" VARCHAR(255),
    "profile_image_url" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_owner_profiles" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "onboarding_status" "OnboardingStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "restaurant_owner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_partner_profiles" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "onboarding_status" "OnboardingStatus" NOT NULL DEFAULT 'DRAFT',
    "vehicle_type" "VehicleType",
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "delivery_partner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_sessions" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "user_agent" TEXT,
    "ip_address" VARCHAR(64),
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "last_used_at" TIMESTAMPTZ(3),
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "refresh_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_mobile_key" ON "accounts"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE INDEX "accounts_role_status_idx" ON "accounts"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_account_id_key" ON "customer_profiles"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_owner_profiles_account_id_key" ON "restaurant_owner_profiles"("account_id");

-- CreateIndex
CREATE INDEX "restaurant_owner_profiles_onboarding_status_idx" ON "restaurant_owner_profiles"("onboarding_status");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_partner_profiles_account_id_key" ON "delivery_partner_profiles"("account_id");

-- CreateIndex
CREATE INDEX "delivery_partner_profiles_onboarding_status_idx" ON "delivery_partner_profiles"("onboarding_status");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_sessions_account_id_key" ON "refresh_sessions"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_sessions_token_hash_key" ON "refresh_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_sessions_expires_at_idx" ON "refresh_sessions"("expires_at");

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_owner_profiles" ADD CONSTRAINT "restaurant_owner_profiles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_partner_profiles" ADD CONSTRAINT "delivery_partner_profiles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
