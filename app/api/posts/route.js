import prisma from "@/backend/prisma";
import { verificaSessionEmpresa } from "@/backend/verificaSessionEmpresa";
import { storage } from "@/utils/firebaseCofig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export async function POST(req) {
  const session = await verificaSessionEmpresa();

  if (!session?.empresa) {
    return new Response("Empresa não encontrada", { status: 403 });
  }

  try {
    const formData = await req.formData();
    const data = {};
    const files = [];
    let clienteId;

    // Processar o FormData
    formData.forEach((value, key) => {
      if (value instanceof File) {
        files.push({ key, file: value });
      } else {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });

    // Verificar se o cliente já existe pelo CPF e empresa
    let cliente = await prisma.clientes.findFirst({
      where: { cpf: data.cpf.toString(), empresaId: session.empresa },
    });

    // Criar cliente se não existir
    if (!cliente) {
      cliente = await prisma.clientes.create({
        data: {
          nome: data.nome,
          email: data.email,
          nascimento: data.nascimento,
          identidade: data.identidade.toString(),
          salario: data.salario,
          cpf: data.cpf.toString(),
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          telefone: data.telefone.toString(),
          empresaId: session.empresa,
        },
      });
    }
    clienteId = cliente.id;

    // Criar dados de trabalho
    await prisma.trabalhos.create({
      data: {
        proficao: data.trabalhos.proficao,
        cargo: data.trabalhos.cargo,
        endereco: data.trabalhos.endereco,
        telefone: data.trabalhos.telefone,
        empresaId: session.empresa,
        clientesId: clienteId,
      },
    });

    // Criar dados de estado civil
    await prisma.estadoCivil.create({
      data: {
        estadocivil: data.estadocivil.EC,
        nome: data.estadocivil.nome || null,
        proficao: data.estadocivil.proficao || null,
        trabalho: data.estadocivil.trabalho || null,
        Empresas: { connect: { id: session.empresa } },
        Clientes: { connect: { id: clienteId } },
      },
    });

    // Criar referências pessoais e comerciais em paralelo
    const personalRefs = data.referenciaPessoal.map((element) =>
      prisma.referenciasPessoal.create({
        data: {
          nome: element.nome,
          telefone: element.telefone,
          empresasId: session.empresa,
          clientesId: clienteId,
        },
      }),
    );
    const commercialRefs = data.referenciaComercial.map((element) =>
      prisma.referenciasComercial.create({
        data: {
          nome: element.nome,
          telefone: element.telefone,
          empresasId: session.empresa,
          clientesId: clienteId,
        },
      }),
    );

    await Promise.all([...personalRefs, ...commercialRefs]);

    // Upload de arquivos para o Firebase
    const uploadPromises = files.map((file, index) => {
      const timestamp = Date.now();
      const fileName = `imagem_${clienteId}_${timestamp}_${index}`;
      const storageRef = ref(
        storage,
        `uploads/documentos/empresas/empresaId_${session.empresa}/usuarioId_${clienteId}/${fileName}`,
      );

      const createDocument = prisma.documentos.create({
        data: {
          documento: fileName,
          clientesId: clienteId,
          empresaId: session.empresa,
        },
      });

      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file.file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload ${file.file.name} está ${progress}% concluído`);
          },
          (error) =>
            reject(new Error(`Erro no upload do arquivo: ${error.message}`)),
          async () => {
            try {
              await createDocument;
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(
                new Error(`Erro ao salvar URL do download: ${error.message}`),
              );
            }
          },
        );
      });
    });

    const downloadURLs = await Promise.all(uploadPromises);

    return new Response(
      JSON.stringify({ message: "Uploads concluídos!", urls: downloadURLs }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Erro ao processar dados:", error.message);
    return new Response(`Erro ao processar os dados: ${error.message}`, {
      status: 500,
    });
  }
}
