"use server";

import prisma from "../prisma";
import { verificaSessionEmpresa } from "../verificaSessionEmpresa";
// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { storage } from "@/multerConfig";

const upload = multer({ storage: storage });

async function CadastroCliente(dados) {
  console.log("Dados recebidos:", dados);

  const session = await verificaSessionEmpresa();
  if (!session) {
    console.error("Sessão não encontrada.");
    return false;
  }

  try {
    const cpf = dados.get("cpf").toString();
    const nome = dados.get("nome");
    const endereco = dados.get("endereco");
    const identidade = dados.get("identidade");
    const estado = dados.get("estado");
    const cidade = dados.get("cidade");
    const telefone = dados.get("telefone");
    const email = dados.get("email");

    const existingClient = await prisma.clientes.findUnique({
      where: { cpf },
    });

    if (existingClient) {
      console.log("CPF já existe.");
      return false;
    }

    const newClient = await prisma.clientes.create({
      data: {
        nome,
        endereco,
        cpf,
        identidade,
        estado,
        cidade,
        telefone,
        email,
        empresaId: session.empresa,
      },
    });

     new Promise((resolve, reject) => {
      upload.fields([
        { name: 'fotoCliente' },
        { name: 'fotoComprovanteEndereco' },
        { name: 'fotoIdentidade' },
        { name: 'fotoCPF' },
      ])(dados, {}, (error) => { // Passa 'dados' aqui
        if (error) {
          console.error("Erro no upload:", error);
          return reject(error);
        }
        resolve(dados.files); // Aqui, você deve usar 'dados.files' se os arquivos estiverem disponíveis
      });
    });

    return true;
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return false;
  }
}

export default CadastroCliente;
