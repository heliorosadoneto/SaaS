import { mkdir, writeFile } from "fs/promises";

export async function createUpload(files, clienteId, empresaId) {
  // Processar o FormData
  const dataFiles = [];
  const data = {};
  files.forEach((value, key) => {
    if (value instanceof File) {
        dataFiles.push({ key, file: value });
    } else {
    try {
            data[key] = JSON.parse(value);
        } catch {
            data[key] = value;
        }
    }
  });

  const timestamp = Date.now();
  const fileName = `imagem_${clienteId}_${timestamp}_${index}`;
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "documentos",
    `empresa_${empresaId}`,
    `usuario_${clienteId}`,
  );
  // Create directories if they don't exist
  await mkdir(uploadDir, { recursive: true });

 

  // Save file to disk
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  await prisma.documentos.create({
    data: {
      documento: fileName,
      clientesId: clienteId,
      empresaId: session.empresa,
    },
  });
  return `/uploads/documentos/empresa_${empresaId}/usuario_${clienteId}/${fileName}`;
}
