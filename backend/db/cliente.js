"use server";

import prisma from "../prisma";
import { verificaSessionEmpresa } from "../verificaSessionEmpresa";

const session = verificaSessionEmpresa();
async function getCliente() {
  const cliente = await prisma.clientes.findMany({
    where: {
      empresaId: (await session).empresa,
    },
  });

  return cliente;
}

export default getCliente;
