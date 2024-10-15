-- CreateTable
CREATE TABLE `Documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documento` VARCHAR(191) NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `clientesId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Documentos` ADD CONSTRAINT `Documentos_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documentos` ADD CONSTRAINT `Documentos_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
