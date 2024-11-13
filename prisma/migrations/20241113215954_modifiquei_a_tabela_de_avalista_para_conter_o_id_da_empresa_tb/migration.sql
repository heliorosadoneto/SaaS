-- DropForeignKey
ALTER TABLE `avalistas` DROP FOREIGN KEY `Avalistas_clientesId_fkey`;

-- AlterTable
ALTER TABLE `avalistas` ADD COLUMN `empresasId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Avalistas` ADD CONSTRAINT `Avalistas_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avalistas` ADD CONSTRAINT `Avalistas_empresasId_fkey` FOREIGN KEY (`empresasId`) REFERENCES `Empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
