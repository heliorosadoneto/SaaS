-- CreateTable
CREATE TABLE `Avalistas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientesId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Avalistas` ADD CONSTRAINT `Avalistas_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
