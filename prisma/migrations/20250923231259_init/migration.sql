/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Reserva" DROP CONSTRAINT "Reserva_clienteId_fkey";

-- DropTable
DROP TABLE "public"."Cliente";
