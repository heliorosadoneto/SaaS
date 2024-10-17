import prisma from "@/backend/prisma";

import { verificaSessionEmpresa } from "@/backend/verificaSessionEmpresa";
import multer from "multer";
import { storage } from "@/multerConfig";

// Função para processar o upload de arquivos
const upload = multer({ storage }).array("files", 4); // Aceita até 4 arquivos com o campo "files"

export async function POST(req) {
  const session = await verificaSessionEmpresa();

  if (!session.empresa) return false;
  try {
    const formData = await req.formData();
    const data = {};

    // Iterar sobre os pares chave-valor do FormData
    formData.forEach((value, key) => {
      if (value instanceof File) {
        // Processar arquivos se necessário
        console.log("Arquivo recebido:", key, value.name);
      } else {
        data[key] = value;
      }
    });

    const existeCPF = await prisma.clientes.findUnique({
      where: {
        cpf: data.cpf,
        empresaId: session.empresa,
      },
    });

    if (existeCPF) {
      await new Promise((resolve, reject) => {
        upload(req, null, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }

    console.log(existeCPF);

    // console.log("Dados recebidos:", data);

    // Retornar uma resposta de sucesso
    return new Response(
      JSON.stringify({ message: "Dados recebidos com sucesso!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Erro ao processar o FormData:", error);
    return new Response("Erro ao processar os dados", {
      status: 500,
    });
  }
}
