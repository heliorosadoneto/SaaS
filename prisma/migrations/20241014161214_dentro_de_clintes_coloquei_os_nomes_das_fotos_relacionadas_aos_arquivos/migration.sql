/*
  Warnings:

  - Added the required column `fotoCPF` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fotoCliente` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fotoComprovanteEndereco` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fotoIdentidade` to the `Clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clientes` ADD COLUMN `fotoCPF` VARCHAR(191) NOT NULL,
    ADD COLUMN `fotoCliente` VARCHAR(191) NOT NULL,
    ADD COLUMN `fotoComprovanteEndereco` VARCHAR(191) NOT NULL,
    ADD COLUMN `fotoIdentidade` VARCHAR(191) NOT NULL;
