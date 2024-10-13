"use server";

import prisma from "../prisma";
import { verificaSessionEmpresa } from "../verificaSessionEmpresa";
import { usuario } from "./db";

async function preVenda(dadosVendas) {
  const idCodigo = Math.floor(100000000 + Math.random() * 900000000).toString();
  const session = await usuario();

  try {
    // Verifica se produtos existe e é um array
    if (
      !Array.isArray(dadosVendas.produtos) ||
      dadosVendas.produtos.length === 0
    ) {
      throw new Error("Dados de produtos inválidos.");
    }

    // Itera sobre cada produto e cria uma pre-venda para cada um
    const preVendasCriadas = await Promise.all(
      dadosVendas.produtos.map(async (produto) => {
        return await prisma.preVendas.create({
          data: {
            preVendaId: idCodigo,
            produtoId: produto.id,
            produto: produto.produto,
            valor: produto.valor,
            unidade: produto.unidade,
            codigo: produto.codigo,
            endereco: dadosVendas.endereco || "Nenhum Endereço",
            observacao: dadosVendas.observacao || "Nenhuma Observação",
            valorPago: dadosVendas.valorPago,
            dataEntrega: dadosVendas.dataEntrega,
            formaPagamento: dadosVendas.pagamento.forma,
            parcelasCredito: dadosVendas.pagamento.parcelas,
            vendedorId: session[0].id,
            empresaId: session[0].empresaId,
            clienteId: dadosVendas.cliente.id,
          },
        });
      })
    );

    return preVendasCriadas; // Retorna todas as pre-vendas criadas
  } catch (error) {
    console.error("Erro ao criar pre-venda:", error);
    throw error;
  }
}

async function getPreVendaCodigo(idnumber) {
  const session = verificaSessionEmpresa();
  if (!session) return null;
  try {
    const preVendas = await prisma.preVendas.findMany({
      where: {
        empresaId: (await session).empresa,
        preVendaId: idnumber.toString(),
      },
      include: {
        cliente: true,
        vendedor: true,
      },
    });
    return preVendas;
  } catch (error) {
    console.error("Erro ao buscar pre-vendas:", error);
    throw error;
  }
}
async function getPreVenda() {
  const session = verificaSessionEmpresa();
  if (!session) return null;
  try {
    const preVendas = await prisma.preVendas.findMany({
      where: {
        empresaId: (await session).empresa,
      },
      include: {
        cliente: true,
        vendedor: true,
      },
    });
    return preVendas;
  } catch (error) {
    console.error("Erro ao buscar pre-vendas:", error);
    throw error;
  }
}
async function excluirPreVenda(preVendaId) {
  const session = verificaSessionEmpresa();
  if (!session) return null;

  try {
    // Verifica se há uma pre-venda associada com o preVendaId e empresaId
    const preVenda = await prisma.preVendas.findFirst({
      where: {
        preVendaId: preVendaId,
        empresaId: session.empresaId,
      },
    });

    if (!preVenda) {
      // Se não houver pre-venda, retorna uma mensagem apropriada
      console.error("Nenhuma pre-venda encontrada para este ID e empresa.");
      return false;
    }

    // Exclui a pre-venda encontrada
    await prisma.preVendas.delete({
      where: {
        id: preVenda.id, // Usa a chave primária para excluir
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao excluir pre-venda:", error);
    throw error;
  }
}

async function AcaoAnalise(analise, id) {
  const session = verificaSessionEmpresa();
  if (!session) return null;
  try {
    await prisma.preVendas.updateMany({
      where: {
        empresaId: session.empresaId,
        preVendaId: id.toString(),
      },
      data: {
        analise: analise, // Corrigido para usar a chave 'data'
      },
    });
    return true;
  } catch (error) {
    console.error("Erro ao buscar pre-vendas:", error);
    throw error;
  }
}

async function getProdutoClienteId(id) {
  const session = verificaSessionEmpresa();
  if (!session) return null;
  try {
    // Busca todos os registros correspondentes ao clienteId e empresaId
    const produtosCliente = await prisma.preVendas.findUnique({
      where: {
        parcelasCredito: 6,
      },
    });

    return produtosCliente;
  } catch (error) {
    console.error("Erro ao buscar Produto do Cliente:", error);
    throw error;
  }
}

async function atualizarPreVenda(dados) {
  console.log(dados)
  const session = verificaSessionEmpresa();
  if (!session) return null;
  try {
    await prisma.preVendas.updateMany({
      where: {
        empresaId: session.empresaId,
        preVendaId: dados.id.toString(), // Usando dados.id
      },
      data: {
        valorPago: dados.valorPago, // Atualizando valorPago
        dataEntrega: dados.dataEntrega, // Atualizando dataEntrega
        observacaoAnalise: dados.observacaoAnalise, // Atualizando observacao
        observacao: dados.observacao,
        // ... outros campos que você deseja atualizar
      },
    });
    return true;
  } catch (error) {
    console.error("Erro ao buscar pre-vendas:", error);
    throw error;
  }
}

export {
  preVenda,
  getPreVenda,
  excluirPreVenda,
  AcaoAnalise,
  getProdutoClienteId,
  getPreVendaCodigo,
  atualizarPreVenda,
};
