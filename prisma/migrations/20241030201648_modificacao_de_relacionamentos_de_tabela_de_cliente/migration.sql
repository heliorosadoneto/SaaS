/*
  Warnings:

  - You are about to drop the column `estadoCivilId` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `referenciasComercialId` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `referenciasPessoalId` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `trabalhoId` on the `clientes` table. All the data in the column will be lost.
  - Added the required column `clientesId` to the `EstadoCivil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientesId` to the `ReferenciasComercial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientesId` to the `ReferenciasPessoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientesId` to the `Trabalhos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clientes` DROP FOREIGN KEY `Clientes_estadoCivilId_fkey`;

-- DropForeignKey
ALTER TABLE `clientes` DROP FOREIGN KEY `Clientes_referenciasComercialId_fkey`;

-- DropForeignKey
ALTER TABLE `clientes` DROP FOREIGN KEY `Clientes_referenciasPessoalId_fkey`;

-- DropForeignKey
ALTER TABLE `clientes` DROP FOREIGN KEY `Clientes_trabalhoId_fkey`;

-- AlterTable
ALTER TABLE `clientes` DROP COLUMN `estadoCivilId`,
    DROP COLUMN `referenciasComercialId`,
    DROP COLUMN `referenciasPessoalId`,
    DROP COLUMN `trabalhoId`;

-- AlterTable
ALTER TABLE `estadocivil` ADD COLUMN `clientesId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `referenciascomercial` ADD COLUMN `clientesId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `referenciaspessoal` ADD COLUMN `clientesId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `trabalhos` ADD COLUMN `clientesId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ReferenciasPessoal` ADD CONSTRAINT `ReferenciasPessoal_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferenciasComercial` ADD CONSTRAINT `ReferenciasComercial_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EstadoCivil` ADD CONSTRAINT `EstadoCivil_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabalhos` ADD CONSTRAINT `Trabalhos_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
