import prisma from "@/backend/prisma";
import { verificaSessionEmpresa } from "@/backend/verificaSessionEmpresa";
import { storage } from "@/utils/firebaseCofig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export async function POST(req) {
  const session = await verificaSessionEmpresa();

  if (!session.empresa) {
    return new Response("Empresa não encontrada", { status: 403 });
  }

  try {
    const formData = await req.formData();
    const data = {};
    const files = [];

    // Iterar sobre os pares chave-valor do FormData
    formData.forEach((value, key) => {
      if (value instanceof File) {
        files.push({ key, file: value });
      } else {
        data[key] = value;
      }
    });

    // Verificar se o cliente já existe pelo CPF e empresa

    let existClinte = await prisma.clientes.findUnique({
      where: {
        cpf: data.cpf,
        empresaId: session.empresa,
      },
    });

    // Se o cliente não existir, cria um novo
    if (!existClinte) {
      await prisma.clientes.create({
        data: {
          nome: data.nome,
          email: data.email,
          identidade: data.identidade,
          cpf: data.cpf,
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          telefone: data.telefone,
          empresaId: session.empresa,
        },
      });
    }

    const cliente = await prisma.clientes.findFirst({
      where: {
        empresaId: session.empresa,
        cpf: data.cpf,
      },
    });
    const clienteId = cliente.id;
    console.log("Este é o id do cliente:", clienteId);

    // Criar um array para armazenar as promessas de upload
    const uploadPromises = files.map((file, index) => {
      const timestamp = Date.now(); // Timestamp para garantir unicidade
      const fileName = `imagem_${clienteId}_${timestamp}_${index}`; // Ex: "imagem_123_1631291212345_0"

      // Criar a promessa para inserir o documento no banco
      const createDocumentPromise = prisma.documentos.create({
        data: {
          documento: fileName,
          clientesId: clienteId,
          empresaId: session.empresa,
        },
      });

      const storageRef = ref(
        storage,
        `uploads/documentos/empresas/${session.empresa}/${clienteId}/${fileName}`,
      );

      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file.file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(
              `Upload do arquivo ${file.file.name} está ${progress}% concluído`,
            );
          },
          (error) => {
            reject(error);
          },
          async () => {
            // Espera a criação do documento ser concluída antes de obter o download URL
            await createDocumentPromise;
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          },
        );
      });
    });

    // Aguarde todos os uploads serem concluídos
    const downloadURLs = await Promise.all(uploadPromises);

    // Retornar uma resposta de sucesso com os URLs dos uploads
    return new Response(
      JSON.stringify({
        message: "Uploads concluídos!",
        urls: downloadURLs,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Erro ao processar o FormData:", error);
    return new Response("Erro ao processar os dados", { status: 500 });
  }
}
