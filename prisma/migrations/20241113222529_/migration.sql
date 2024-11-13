/*
  Warnings:

  - Made the column `clientesId` on table `avalistas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `empresasId` on table `avalistas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `avalistas` DROP FOREIGN KEY `Avalistas_clientesId_fkey`;

-- DropForeignKey
ALTER TABLE `avalistas` DROP FOREIGN KEY `Avalistas_empresasId_fkey`;

-- AlterTable
ALTER TABLE `avalistas` MODIFY `clientesId` INTEGER NOT NULL,
    MODIFY `empresasId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Avalistas` ADD CONSTRAINT `Avalistas_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avalistas` ADD CONSTRAINT `Avalistas_empresasId_fkey` FOREIGN KEY (`empresasId`) REFERENCES `Empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
