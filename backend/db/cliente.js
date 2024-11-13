"use server";

import prisma from "../prisma";
import { verificaSessionEmpresa } from "../verificaSessionEmpresa";
const session = verificaSessionEmpresa();
async function Read(pesquisaNome) {
  if (!(await session).empresa) return false;

  try {
    const clientes = await prisma.clientes.findMany({
      where: {
        empresaId: (await session).empresa,
        OR: [
          {
            nome: {
              contains: pesquisaNome,
            },
          },
          {
            cpf: {
              contains: pesquisaNome,
            },
          },
        ],
      },
      orderBy: {
        criadoEm: 'desc',
      },
      take: 7,
    });
    
    
    return clientes;
  } catch (error) {
    console.error("Erro ao criar Estoque:", error);
    throw error;
  }
}


export default Read;
