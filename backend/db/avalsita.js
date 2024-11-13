"use server";

import prisma from "../prisma";
import { verificaSessionEmpresa } from "../verificaSessionEmpresa";

async function AdcionarAvalsita(avalsitaId) {
  try {
    const session = verificaSessionEmpresa();
    if (!(await session).empresa) return false;
    await prisma.avalistas.create({
      data: {
        clientesId: avalsitaId,
        empresasId: (await session).empresa,
      },
    });
    console.log("Avalista adicionado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao criar Estoque:", error);
    throw error;
  }
}

export default AdcionarAvalsita;
