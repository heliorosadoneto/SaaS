"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usuario as buscarUsuarioAPI } from "@/backend/db/db";
import { preVenda } from "@/backend/db/preVenda";
import InputPesquisaCliente from "@/components/inputPesquisaCliente";
import InputEstoque from "@/components/inputPesquisaProduto";
import { ROUTES } from "@/routes/routes";
import { FaTrash, FaCheck, FaTimes, FaShoppingCart } from "react-icons/fa";
import Loading from "@/components/loading";

export default function Venda() {
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [parcelasCredito, setParcelasCredito] = useState(1);
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valorPago, setValorPago] = useState(0);
  const [valorPagoExibido, setValorPagoExibido] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const buscarUsuario = async () => {
      setIsLoading(true);
      try {
        const resposta = await buscarUsuarioAPI();
        setUsuario(resposta);
      } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
      } finally {
        setIsLoading(false);
      }
    };
    buscarUsuario();
  }, []);

  const handlerClienteSelecionado = useCallback((cliente) => {
    setClienteSelecionado(cliente[0]);
  }, []);

  const handleProdutosSelecionados = useCallback((produtoOuProdutos) => {
    setProdutosSelecionados((prevProdutos) => {
      const novosProdutos = Array.isArray(produtoOuProdutos)
        ? [...prevProdutos, ...produtoOuProdutos]
        : [...prevProdutos, produtoOuProdutos];

      const novoValorTotal = novosProdutos.reduce(
        (total, produto) => total + parseFloat(produto.valor),
        0,
      );
      setValorTotal(novoValorTotal);

      return novosProdutos;
    });
  }, []);

  const removerProduto = useCallback((index) => {
    setProdutosSelecionados((prevProdutos) => {
      const novosProdutos = prevProdutos.filter((_, i) => i !== index);
      const novoValorTotal = novosProdutos.reduce(
        (total, produto) => total + parseFloat(produto.valor),
        0,
      );
      setValorTotal(novoValorTotal);
      return novosProdutos;
    });
  }, []);

  const abrirModalPagamento = () => {
    if (clienteSelecionado && produtosSelecionados.length > 0) {
      setMostrarModal(true);
    } else {
      toast.error("Selecione um cliente e pelo menos um produto");
    }
  };

  const handleChangePago = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const floatValue = parseFloat(value) / 100;
    setValorPago(floatValue);
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(floatValue);
    setValorPagoExibido(formattedValue);

    if (floatValue > 0) {
      setParcelasCredito(1);
    } else {
      setParcelasCredito(1);
    }
  };

  const fecharModalPagamento = () => {
    setMostrarModal(false);
  };

  const handleFormaPagamentoChange = (e) => {
    setFormaPagamento(e.target.value);
  };

  const handleParcelasCreditoChange = (e) => {
    setParcelasCredito(Number(e.target.value));
  };

  const finalizarVenda = async () => {
    if (!valorTotal && !formaPagamento) {
      toast.error("Selecione uma forma de pagamento");
      return null;
    }
    try {
      const dadosVenda = {
        produtos: produtosSelecionados,
        total: valorTotal,
        pagamento: {
          forma: formaPagamento.toUpperCase(),
          parcelas: parcelasCredito,
        },
        cliente: clienteSelecionado,
        endereco: endereco,
        observacao: observacao,
        valorPago: valorPago,
        dataEntrega: dataEntrega || new Date().toLocaleDateString("pt-BR"),
      };
      await preVenda(dadosVenda);
      toast.success("Venda realizada com sucesso");
      router.push(ROUTES.LISTA_PREVENDA);

      setClienteSelecionado(null);
      setProdutosSelecionados([]);
      setValorTotal(0);
      setFormaPagamento("");
      setParcelasCredito(1);
      setEndereco("");
      setObservacao("");
      fecharModalPagamento();
    } catch (error) {
      toast.error("Erro ao realizar a venda, confira os campos");
    }
  };

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  }
  return (
    <div className="flex h-[calc(100vh-40px)] bg-gray-900 text-white">
      
      <div className="flex w-[40%] flex-col items-center justify-center rounded-lg bg-gray-800 p-6 shadow-xl">
        <InputPesquisaCliente onClienteSelect={handlerClienteSelecionado} />
        <InputEstoque onProdutosSelecionados={handleProdutosSelecionados} />

        <label htmlFor="endereco" className="mt-4 text-blue-300">
          Endereço
        </label>
        <input
          type="text"
          placeholder="Endereço..."
          name="endereco"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          autoComplete={`new-${Math.random()}`}
          className="m-1 w-full rounded-lg border-2 border-gray-700 bg-gray-700 p-2 text-white transition duration-300 focus:border-blue-500 focus:outline-none"
        />

        <label htmlFor="data" className="mt-4 text-blue-300">
          DATA DE ENTREGA
        </label>
        <input
          className="m-1 w-full rounded-lg border-2 border-gray-700 bg-gray-700 p-2 text-white transition duration-300 focus:border-blue-500 focus:outline-none"
          type="date"
          name="dataDeEntrega"
          min={new Date().toISOString().split("T")[0]}
          defaultValue={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDataEntrega(e.target.value)}
        />

        <label htmlFor="observacao" className="mt-4 text-blue-300">
          Observação:
        </label>
        <textarea
          id="observacao"
          placeholder="Observação..."
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className="m-1 w-full rounded-lg border-2 border-gray-700 bg-gray-700 p-2 text-white transition duration-300 focus:border-blue-500 focus:outline-none"
          rows={3}
        />
      </div>

      <div className="flex w-[60%] flex-col p-6">
        <div className="flex h-[100px] flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold text-blue-400">Produtos</h1>
          <ToastContainer autoClose={2000} position="top-center" />
          {clienteSelecionado ? (
            <div className="mb-4 w-full max-w-md rounded-lg border border-blue-500 bg-gray-800 p-3 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-blue-300">
                  Cliente:{" "}
                  <span className="text-white">{clienteSelecionado.nome}</span>
                </h3>
                <button
                  onClick={() => setClienteSelecionado(null)}
                  className="rounded bg-red-600 px-3 py-1 font-bold text-white transition duration-300 ease-in-out hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 p-3 text-center">
              <h1 className="text-xl font-bold text-gray-400">
                Nenhum cliente selecionado
              </h1>
            </div>
          )}
        </div>

        <h2 className="mb-4 text-2xl font-bold text-blue-400">
          Produtos selecionados
        </h2>
        <div className="mb-4 flex-grow overflow-auto">
          {produtosSelecionados.length > 0 ? (
            <ul className="space-y-2">
              {produtosSelecionados.map((produto, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4 text-white shadow-md transition duration-300 ease-in-out hover:bg-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-blue-300">
                      {produto.produto}
                    </span>
                    <div className="mt-1 flex space-x-4 text-sm">
                      <span className="text-green-400">
                        Valor: R$ {parseFloat(produto.valor).toFixed(2)}
                      </span>
                      <span className="text-blue-400">
                        Código: {produto.codigo}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removerProduto(index)}
                    className="flex items-center rounded-full bg-red-600 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-red-700"
                  >
                    <FaTrash className="mr-2" />
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-lg border border-gray-700">
              <p className="text-gray-400">Nenhum produto selecionado</p>
            </div>
          )}
        </div>

        {produtosSelecionados.length > 0 && (
          <div className="mt-auto">
            <h1 className="mb-4 text-2xl font-bold text-green-400">
              Valor Total: R$ {valorTotal.toFixed(2)}
            </h1>
            <button
              onClick={abrirModalPagamento}
              className="flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700"
            >
              <FaShoppingCart className="mr-2" />
              Forma de pagamento
            </button>
          </div>
        )}

        {mostrarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg border border-blue-500 bg-gray-800 p-6 shadow-xl">
              <h2 className="mb-6 text-center text-2xl font-bold text-blue-400">
                Formas de Pagamento
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    Valor Total:
                  </span>
                  <p className="text-xl font-bold text-green-400">
                    R$ {valorTotal.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="valorPago"
                    className="mb-1 block text-sm font-medium text-gray-300"
                  >
                    Valor a Pagar:
                  </label>
                  <input
                    type="text"
                    name="valorPago"
                    id="valorPago"
                    value={valorPagoExibido}
                    onChange={handleChangePago}
                    className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <p className="mb-2 text-lg font-semibold text-white">
                    Forma de Pagamento:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {["dinheiro", "pix", "carne", "debito", "credito"].map(
                      (tipo) => (
                        <label key={tipo} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="formaPagamento"
                            value={tipo}
                            checked={formaPagamento === tipo}
                            onChange={handleFormaPagamentoChange}
                            className="form-radio text-blue-600"
                          />
                          <span className="ml-2 capitalize text-white">
                            {tipo}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>
                {formaPagamento === "credito" && (
                  <div className="rounded-lg bg-gray-700 p-4">
                    <h3 className="mb-2 text-lg font-semibold text-blue-300">
                      Opções de Parcelamento
                    </h3>
                    <select
                      value={parcelasCredito}
                      onChange={handleParcelasCreditoChange}
                      className="w-full rounded border border-gray-500 bg-gray-600 p-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                        (parcela) => {
                          let valorParcela =
                            valorPago > 0
                              ? valorPago / parcela
                              : valorTotal / parcela;
                          return (
                            <option key={parcela} value={parcela}>
                              {parcela}x de R$ {valorParcela.toFixed(2)}
                            </option>
                          );
                        },
                      )}
                    </select>
                  </div>
                )}
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={fecharModalPagamento}
                    className="flex items-center rounded-full bg-red-600 px-6 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-red-700"
                  >
                    <FaTimes className="mr-2" />
                    Fechar
                  </button>
                  <button
                    onClick={finalizarVenda}
                    className="flex items-center rounded-full bg-green-600 px-6 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-green-700"
                  >
                    <FaCheck className="mr-2" />
                    Finalizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
