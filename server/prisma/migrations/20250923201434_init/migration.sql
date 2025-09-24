-- CreateTable
CREATE TABLE "public"."Espacio" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Espacio_pkey" PRIMARY KEY ("id")
);
