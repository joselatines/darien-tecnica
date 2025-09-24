-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reserva" (
    "id" TEXT NOT NULL,
    "espacioId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "public"."Cliente"("email");

-- CreateIndex
CREATE INDEX "Reserva_espacioId_reservationDate_idx" ON "public"."Reserva"("espacioId", "reservationDate");

-- CreateIndex
CREATE INDEX "Reserva_clienteId_reservationDate_idx" ON "public"."Reserva"("clienteId", "reservationDate");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_espacioId_reservationDate_startTime_key" ON "public"."Reserva"("espacioId", "reservationDate", "startTime");

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_espacioId_fkey" FOREIGN KEY ("espacioId") REFERENCES "public"."Espacio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
