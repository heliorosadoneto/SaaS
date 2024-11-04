/*
  Warnings:

  - Added the required column `estadoCivilId` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nascimento` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenciasComercialId` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenciasPessoalId` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salario` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trabalhoId` to the `Clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clientes` ADD COLUMN `estadoCivilId` INTEGER NOT NULL,
    ADD COLUMN `nascimento` VARCHAR(191) NOT NULL,
    ADD COLUMN `referenciasComercialId` INTEGER NOT NULL,
    ADD COLUMN `referenciasPessoalId` INTEGER NOT NULL,
    ADD COLUMN `salario` DOUBLE NOT NULL,
    ADD COLUMN `trabalhoId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ReferenciasPessoal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `empresasId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReferenciasComercial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `empresasId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadoCivil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estadocivil` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `empresasId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trabalhos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proficao` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_trabalhoId_fkey` FOREIGN KEY (`trabalhoId`) REFERENCES `Trabalhos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_estadoCivilId_fkey` FOREIGN KEY (`estadoCivilId`) REFERENCES `EstadoCivil`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_referenciasPessoalId_fkey` FOREIGN KEY (`referenciasPessoalId`) REFERENCES `ReferenciasPessoal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_referenciasComercialId_fkey` FOREIGN KEY (`referenciasComercialId`) REFERENCES `ReferenciasComercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferenciasPessoal` ADD CONSTRAINT `ReferenciasPessoal_empresasId_fkey` FOREIGN KEY (`empresasId`) REFERENCES `Empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferenciasComercial` ADD CONSTRAINT `ReferenciasComercial_empresasId_fkey` FOREIGN KEY (`empresasId`) REFERENCES `Empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EstadoCivil` ADD CONSTRAINT `EstadoCivil_empresasId_fkey` FOREIGN KEY (`empresasId`) REFERENCES `Empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabalhos` ADD CONSTRAINT `Trabalhos_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
