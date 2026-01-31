-- CreateEnum
CREATE TYPE "Colegio" AS ENUM ('I LIMA', 'II AREQUIPA', 'III LIMA-CALLAO', 'IV TRUJILLO', 'V PIURA', 'VI CUSCO');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'RETIRADO');

-- CreateEnum
CREATE TYPE "Habilitado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateTable
CREATE TABLE "agremiados" (
    "id" SERIAL NOT NULL,
    "cop" VARCHAR(20) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "colegio" "Colegio" NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "habilitado" "Habilitado" NOT NULL DEFAULT 'ACTIVO',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agremiados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agremiados_cop_key" ON "agremiados"("cop");

-- CreateIndex
CREATE INDEX "idx_cop" ON "agremiados"("cop");

-- CreateIndex
CREATE INDEX "idx_nombre_completo" ON "agremiados"("nombres", "apellidos");

-- CreateIndex
CREATE INDEX "idx_colegio" ON "agremiados"("colegio");
