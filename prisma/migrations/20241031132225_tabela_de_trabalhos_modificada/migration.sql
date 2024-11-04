/*
  Warnings:

  - You are about to drop the column `cpf` on the `estadocivil` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `estadocivil` DROP COLUMN `cpf`;

-- AlterTable
ALTER TABLE `trabalhos` ADD COLUMN `cargo` VARCHAR(191) NULL,
    MODIFY `proficao` VARCHAR(191) NULL,
    MODIFY `endereco` VARCHAR(191) NULL,
    MODIFY `telefone` VARCHAR(191) NULL;
