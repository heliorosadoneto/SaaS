"use server";

import prisma from "../prisma";
import { verificaSessionEmpresa } from "../verificaSessionEmpresa";
const session = verificaSessionEmpresa();
async function Create(dados) {
  if (!(await session).empresa) return false;

  try {
    await prisma.clientes.createMany({
      data: {
        dados,
        empresaId: (await session).empresa,
      },
    });
  } catch (error) {}
}

export default Create;
