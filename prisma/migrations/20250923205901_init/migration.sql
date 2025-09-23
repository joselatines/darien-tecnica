/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Espacio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Espacio_name_key" ON "public"."Espacio"("name");
