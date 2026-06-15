-- ThaiPostAd Platform — Full Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Paste → Run

-- CreateTable: User
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Ad
CREATE TABLE IF NOT EXISTS "Ad" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT,
    "price" TEXT,
    "packageType" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "imageUrls" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'active',
    "views" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Payment
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "packageType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "method" TEXT,
    "referenceNumber" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Inquiry
CREATE TABLE IF NOT EXISTS "Inquiry" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "senderName" TEXT,
    "senderEmail" TEXT,
    "senderPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adId" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- Unique & Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key"       ON "User"("email");
CREATE INDEX IF NOT EXISTS "Ad_userId_idx"               ON "Ad"("userId");
CREATE INDEX IF NOT EXISTS "Ad_status_idx"               ON "Ad"("status");
CREATE INDEX IF NOT EXISTS "Ad_category_idx"             ON "Ad"("category");
CREATE INDEX IF NOT EXISTS "Ad_packageType_idx"          ON "Ad"("packageType");
CREATE INDEX IF NOT EXISTS "Ad_expiresAt_idx"            ON "Ad"("expiresAt");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_adId_key"     ON "Payment"("adId");
CREATE INDEX IF NOT EXISTS "Payment_userId_idx"          ON "Payment"("userId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx"          ON "Payment"("status");
CREATE INDEX IF NOT EXISTS "Inquiry_adId_idx"            ON "Inquiry"("adId");
CREATE INDEX IF NOT EXISTS "Inquiry_userId_idx"          ON "Inquiry"("userId");
CREATE INDEX IF NOT EXISTS "Inquiry_status_idx"          ON "Inquiry"("status");

-- Foreign Keys
ALTER TABLE "Ad"      ADD CONSTRAINT "Ad_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_adId_fkey"
    FOREIGN KEY ("adId")  REFERENCES "Ad"("id")   ON DELETE CASCADE  ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_adId_fkey"
    FOREIGN KEY ("adId")  REFERENCES "Ad"("id")   ON DELETE CASCADE  ON UPDATE CASCADE;

ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ── RATINGS & VIEWS MIGRATION ──
-- Run in Supabase Dashboard → SQL Editor → New query

-- 1. Add rating aggregate columns to Ad
ALTER TABLE "Ad"
  ADD COLUMN IF NOT EXISTS "ratingAvg"   FLOAT   NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- 2. Rating table — raterId is a text key (e.g. 'u_123' for users or a UUID for guests)
--    No login required to rate; one rating per raterId per ad
CREATE TABLE IF NOT EXISTS "Rating" (
  "id"        SERIAL       NOT NULL,
  "adId"      INTEGER      NOT NULL,
  "raterId"   TEXT         NOT NULL,
  "value"     INTEGER      NOT NULL CHECK ("value" BETWEEN 1 AND 5),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Rating_adId_raterId_key" ON "Rating"("adId", "raterId");
CREATE INDEX        IF NOT EXISTS "Rating_adId_idx"         ON "Rating"("adId");
ALTER TABLE "Rating"
  ADD CONSTRAINT "Rating_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Atomic view-increment helper (used by /api/ads/[id]/view)
CREATE OR REPLACE FUNCTION increment_ad_views(ad_id INTEGER)
RETURNS INTEGER LANGUAGE SQL AS $$
  UPDATE "Ad" SET "views" = "views" + 1 WHERE "id" = ad_id RETURNING "views";
$$;
