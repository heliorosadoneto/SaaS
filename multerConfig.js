import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { verificaSessionEmpresa } from "./backend/verificaSessionEmpresa";
import { usuario } from "./backend/db/db"; // Presume-se que você tenha funções para verificar/criar usuários e empresas
import prisma from "./backend/prisma";
import getCliente from "./backend/db/cliente";

// Função para verificar ou criar diretórios de upload
async function verificarOuCriarDiretorio(uploadDir) {
  try {
    await fs.access(uploadDir);
  } catch (err) {
    // Se o diretório não existir, ele será criado
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

// Função para verificar a empresa e o usuário e criar diretórios apropriados
async function configurarDiretorioDeUpload() {
  const empresaId = await verificaSessionEmpresa();
  const userId = await usuario();

  console.log(
    "Esssa primeira verificação se existe user ou empresa",
    empresaId.empresa,
    userId.id,
  );
  if (!empresaId.empresa && !userId.id) {
    throw new Error("Empresa não encontrada.");
  }

  // Caminho para o diretório de upload específico
  const uploadDir = path.join(
    __dirname,
    "uploads",
    "documentos",
    empresaId.empresa,
    userId.id,
  );

  // Verificar e criar o diretório
  await verificarOuCriarDiretorio(uploadDir);

  return uploadDir;
}

// Configuração do storage para o multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Configurar o diretório de upload
      const uploadDir = await configurarDiretorioDeUpload();
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
    cadastrarDocumentos(filename);
  },
});

async function cadastrarDocumentos(filename) {
  const session = await verificaSessionEmpresa();
  const cliente = await getCliente();
  await prisma.documentos.createMany({
    where: {
      document: filename,
      empresaId: session.empresa,
      clienteId: cliente.id,
    },
  });
}

export { storage };
