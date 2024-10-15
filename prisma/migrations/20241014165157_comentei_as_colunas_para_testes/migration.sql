/*
  Warnings:

  - You are about to drop the column `fotoCPF` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `fotoCliente` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `fotoComprovanteEndereco` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `fotoIdentidade` on the `clientes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clientes` DROP COLUMN `fotoCPF`,
    DROP COLUMN `fotoCliente`,
    DROP COLUMN `fotoComprovanteEndereco`,
    DROP COLUMN `fotoIdentidade`;
