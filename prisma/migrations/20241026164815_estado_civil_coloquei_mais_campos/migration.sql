/*
  Warnings:

  - You are about to drop the column `telefone` on the `estadocivil` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `estadocivil` DROP COLUMN `telefone`,
    ADD COLUMN `proficao` VARCHAR(191) NULL,
    ADD COLUMN `trabalho` VARCHAR(191) NULL,
    MODIFY `estadocivil` VARCHAR(191) NOT NULL DEFAULT 'solteiro',
    MODIFY `nome` VARCHAR(191) NULL,
    MODIFY `cpf` VARCHAR(191) NULL;
