'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usuario as buscarUsuarioAPI } from '@/backend/db/db'
import { preVenda } from '@/backend/db/preVenda'
import InputPesquisaCliente from '@/components/inputPesquisaCliente'
import InputEstoque from '@/components/inputPesquisaProduto'
import { ROUTES } from '@/routes/routes'
import { FaTrash, FaCheck, FaTimes, FaShoppingCart } from 'react-icons/fa'

export default function Venda() {
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [produtosSelecionados, setProdutosSelecionados] = useState([])
  const [valorTotal, setValorTotal] = useState(0)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState('')
  const [parcelasCredito, setParcelasCredito] = useState(1)
  const [endereco, setEndereco] = useState('')
  const [observacao, setObservacao] = useState('')
  const [valorPago, setValorPago] = useState(0)
  const [valorPagoExibido, setValorPagoExibido] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [usuario, setUsuario] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const resposta = await buscarUsuarioAPI()
        setUsuario(resposta)
      } catch (erro) {
        console.error('Erro ao buscar usuário:', erro)
      }
    }
    buscarUsuario()
  }, [])

  const handlerClienteSelecionado = useCallback((cliente) => {
    setClienteSelecionado(cliente[0])
  }, [])

  const handleProdutosSelecionados = useCallback((produtoOuProdutos) => {
    setProdutosSelecionados((prevProdutos) => {
      const novosProdutos = Array.isArray(produtoOuProdutos)
        ? [...prevProdutos, ...produtoOuProdutos]
        : [...prevProdutos, produtoOuProdutos]

      const novoValorTotal = novosProdutos.reduce(
        (total, produto) => total + parseFloat(produto.valor),
        0
      )
      setValorTotal(novoValorTotal)

      return novosProdutos
    })
  }, [])

  const removerProduto = useCallback((index) => {
    setProdutosSelecionados((prevProdutos) => {
      const novosProdutos = prevProdutos.filter((_, i) => i !== index)
      const novoValorTotal = novosProdutos.reduce(
        (total, produto) => total + parseFloat(produto.valor),
        0
      )
      setValorTotal(novoValorTotal)
      return novosProdutos
    })
  }, [])

  const abrirModalPagamento = () => {
    if (clienteSelecionado && produtosSelecionados.length > 0) {
      setMostrarModal(true)
    } else {
      toast.error('Selecione um cliente e pelo menos um produto')
    }
  }

  const handleChangePago = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    const floatValue = parseFloat(value) / 100
    setValorPago(floatValue)
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(floatValue)
    setValorPagoExibido(formattedValue)

    if (floatValue > 0) {
      setParcelasCredito(1)
    } else {
      setParcelasCredito(1)
    }
  }

  const fecharModalPagamento = () => {
    setMostrarModal(false)
  }

  const handleFormaPagamentoChange = (e) => {
    setFormaPagamento(e.target.value)
  }

  const handleParcelasCreditoChange = (e) => {
    setParcelasCredito(Number(e.target.value))
  }

  const finalizarVenda = async () => {
    if (!valorTotal && !formaPagamento) {
      toast.error('Selecione uma forma de pagamento')
      return null
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
        dataEntrega: dataEntrega || new Date().toLocaleDateString('pt-BR'),
      }
      await preVenda(dadosVenda)
      toast.success('Venda realizada com sucesso')
      router.push(ROUTES.LISTA_PREVENDA)

      setClienteSelecionado(null)
      setProdutosSelecionados([])
      setValorTotal(0)
      setFormaPagamento('')
      setParcelasCredito(1)
      setEndereco('')
      setObservacao('')
      fecharModalPagamento()
    } catch (error) {
      toast.error('Erro ao realizar a venda, confira os campos')
    }
  }

  return (
    <div className="flex h-[calc(100vh-40px)] bg-gray-900 text-white">
      <div className="w-[40%] flex flex-col justify-center items-center p-6 bg-gray-800 rounded-lg shadow-xl">
        <InputPesquisaCliente onClienteSelect={handlerClienteSelecionado} />
        <InputEstoque onProdutosSelecionados={handleProdutosSelecionados} />
        
        <label htmlFor="endereco" className="mt-4 text-blue-300">Endereço</label>
        <input
          type="text"
          placeholder="Endereço..."
          name="endereco"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          autoComplete={`new-${Math.random()}`}
          className="p-2 m-1 w-full border-2 border-gray-700 rounded-lg bg-gray-700 text-white focus:border-blue-500 focus:outline-none transition duration-300"
        />
        
        <label htmlFor="data" className="mt-4 text-blue-300">DATA DE ENTREGA</label>
        <input
          className="p-2 m-1 w-full border-2 border-gray-700 rounded-lg bg-gray-700 text-white focus:border-blue-500 focus:outline-none transition duration-300"
          type="date"
          name="dataDeEntrega"
          min={new Date().toISOString().split('T')[0]}
          defaultValue={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDataEntrega(e.target.value)}
        />
        
        <label htmlFor="observacao" className="mt-4 text-blue-300">Observação:</label>
        <textarea
          id="observacao"
          placeholder="Observação..."
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className="p-2 m-1 w-full border-2 border-gray-700 rounded-lg bg-gray-700 text-white focus:border-blue-500 focus:outline-none transition duration-300"
          rows={3}
        />
      </div>
      
      <div className="flex flex-col w-[60%] p-6">
        <div className="h-[100px] flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4 text-blue-400">Produtos</h1>
          <ToastContainer autoClose={2000} position="top-center" />
          {clienteSelecionado ? (
            <div className="bg-gray-800 rounded-lg shadow-md p-3 mb-4 w-full max-w-md border border-blue-500">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-blue-300">
                  Cliente: <span className="text-white">{clienteSelecionado.nome}</span>
                </h3>
                <button
                  onClick={() => setClienteSelecionado(null)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-300 ease-in-out"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg w-full max-w-md text-center p-3 border border-gray-700">
              <h1 className="text-xl font-bold text-gray-400">Nenhum cliente selecionado</h1>
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Produtos selecionados</h2>
        <div className="flex-grow overflow-auto mb-4">
          {produtosSelecionados.length > 0 ? (
            <ul className="space-y-2">
              {produtosSelecionados.map((produto, index) => (
                <li
                  key={index}
                  className="bg-gray-800 text-white rounded-lg shadow-md p-4 flex justify-between items-center hover:bg-gray-700 transition duration-300 ease-in-out border border-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg text-blue-300">{produto.produto}</span>
                    <div className="flex space-x-4 text-sm mt-1">
                      <span className="text-green-400">Valor: R$ {parseFloat(produto.valor).toFixed(2)}</span>
                      <span className="text-blue-400">Código: {produto.codigo}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removerProduto(index)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
                  >
                    <FaTrash className="mr-2" />
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-[300px] border border-gray-700 rounded-lg flex justify-center items-center">
              <p className="text-gray-400">Nenhum produto selecionado</p>
            </div>
          )}
        </div>
        
        {produtosSelecionados.length > 0 && (
          <div className="mt-auto">
            <h1 className="text-2xl font-bold mb-4 text-green-400">Valor Total: R$ {valorTotal.toFixed(2)}</h1>
            <button
              onClick={abrirModalPagamento}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center w-full"
            >
              <FaShoppingCart className="mr-2" />
              Forma de pagamento
            </button>
          </div>
        )}
        
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 w-full max-w-2xl p-6 rounded-lg shadow-xl border border-blue-500">
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Formas de Pagamento</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Valor Total:</span>
                  <p className="text-xl font-bold text-green-400">R$ {valorTotal.toFixed(2)}</p>
                </div>
                <div>
                  <label htmlFor="valorPago" className="block text-sm font-medium text-gray-300 mb-1">Valor a Pagar:</label>
                  <input
                    type="text"
                    name="valorPago"
                    id="valorPago"
                    value={valorPagoExibido}
                    onChange={handleChangePago}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-white mb-2">Forma de Pagamento:</p>
                  <div className="flex flex-wrap gap-4">
                    {['dinheiro', 'pix', 'carne', 'debito', 'credito'].map((tipo) => (
                      <label key={tipo} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="formaPagamento"
                          value={tipo}
                          checked={formaPagamento === tipo}
                          onChange={handleFormaPagamentoChange}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-white capitalize">{tipo}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formaPagamento === 'credito' && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-blue-300">Opções de Parcelamento</h3>
                    <select
                      value={parcelasCredito}
                      onChange={handleParcelasCreditoChange}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white  focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((parcela) => {
                        let valorParcela = valorPago > 0 ? valorPago / parcela : valorTotal / parcela
                        return (
                          <option key={parcela} value={parcela}>
                            {parcela}x de R$ {valorParcela.toFixed(2)}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                )}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={fecharModalPagamento}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out flex items-center"
                  >
                    <FaTimes className="mr-2" />
                    Fechar
                  </button>
                  <button
                    onClick={finalizarVenda}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out flex items-center"
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
  )
}