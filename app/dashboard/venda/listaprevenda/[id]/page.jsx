'use client'

import { useState, useEffect } from 'react'
import { AcaoAnalise, getPreVendaCodigo, atualizarPreVenda } from '@/backend/db/preVenda'
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaHistory, FaList, FaRegFile } from 'react-icons/fa'
import { usuario as buscarUsuarioAPI } from '@/backend/db/db'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/routes/routes'
import Link from 'next/link'
import InputPesquisaCliente from '@/components/inputPesquisaCliente'

export default function ProductPage({ params }) {
  const { id } = params
  const idnumber = Number(id)
  const router = useRouter()

  const [cliente, setCliente] = useState(null)
  const [produtos, setProdutos] = useState([])
  const [error, setError] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [observacaoAnalise, setObservacaoAnalise] = useState('')
  const [observacao, setObservacao] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [respostaUsuario, respostaPreVenda] = await Promise.all([
          buscarUsuarioAPI(),
          getPreVendaCodigo(idnumber)
        ])

        setUsuario(respostaUsuario)

        if (Array.isArray(respostaPreVenda) && respostaPreVenda.length > 0) {
          const { cliente, parcelasCredito = 1 } = respostaPreVenda[0]
          const produtosData = respostaPreVenda.map(({
            produto,
            valor,
            valorPago,
            dataEntrega,
            endereco,
            formaPagamento,
            parcelasCredito,
            vendedor,
            observacao,
            observacaoAnalise,
          }) => ({
            produto: produto || 'Produto não disponível',
            valor: valor || 0,
            valorPago: valorPago || 0,
            dataEntrega: dataEntrega || 'Data de entrega não disponível',
            endereco,
            formaDePagamento: formaPagamento,
            parcelas: parcelasCredito,
            vendedor,
            observacao,
            observacaoAnalise,
          }))

          const valorTotal = produtosData.reduce((acc, { valor }) => acc + valor, 0)
          const valorPorParcela = (valorTotal / parcelasCredito).toFixed(2)

          const clienteData = {
            nome: cliente.nome || 'Nome não disponível',
            cpf: cliente.cpf || 'CPF não disponível',
            identidade: cliente.identidade || 'Identidade não disponível',
            endereco: `${cliente.endereco || 'Endereço não cadastrado'}, ${cliente.cidade || ''} - ${cliente.estado || ''}`,
            email: cliente.email || 'Email não cadastrado',
            telefone: cliente.telefone || 'Telefone não cadastrado',
            valorTotal: valorTotal.toFixed(2),
            formaDePagamento: produtosData[0].formaDePagamento,
            parcelas: produtosData[0].parcelas,
            enderecoEntrega: produtosData[0].endereco || 'Utilizar endereço do cliente',
            dataEntrega: produtosData[0]?.dataEntrega || 'Data da Entrega não disponível',
            valorPorParcela,
            vendedor: produtosData[0].vendedor,
            observacao: produtosData[0].observacao,
            observacaoAnalise: produtosData[0].observacaoAnalise,
            valorPago: produtosData[0].valorPago.toFixed(2),
          }

          setCliente(clienteData)
          setProdutos(produtosData)
          setObservacao(clienteData.observacao || '')
          setObservacaoAnalise(clienteData.observacaoAnalise || '')
        } else {
          setError('Dados incompletos ou ausentes na resposta da pré-venda.')
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        setError(`Erro ao buscar dados: ${error.message}`)
      }
    }

    fetchData()
  }, [idnumber])

  const acaoAnalise = async (analise) => {
    try {
      const resultado = await AcaoAnalise(analise, idnumber)
      if (resultado === true) {
        toast.success('Status atualizado com sucesso')
        router.push(ROUTES.LISTA_PREVENDA)
      }
    } catch (error) {
      toast.error('Erro ao atualizar status')
      console.error('Erro ao realizar a ação de análise:', error)
    }
  }

  const atualizarPVenda = async () => {
    try {
      const dadosAtualizados = {
        id: idnumber,
        ...(cliente.valorPago && { valorPago: parseFloat(cliente.valorPago) }),
        ...(cliente.dataEntrega && { dataEntrega: cliente.dataEntrega }),
        ...(observacaoAnalise && { observacaoAnalise }),
        ...(observacao && { observacao }),
      }

      if (Object.keys(dadosAtualizados).length === 1) {
        toast.error('Nenhum dado para atualizar.')
        return
      }

      const resultado = await atualizarPreVenda(dadosAtualizados)
      if (resultado === true) {
        toast.success('Pré-venda atualizada com sucesso')
        router.push(ROUTES.LISTA_PREVENDA)
      }
    } catch (error) {
      toast.error('Erro ao atualizar pré-venda')
      console.error('Erro ao atualizar a pré-venda:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <ToastContainer limit={20} />
      <h1 className="text-3xl font-bold text-center text-blue-400 mb-8 uppercase">
        Detalhes do Cliente e Produtos
      </h1>

      {error && (
        <p className="text-red-500 text-center mb-4 uppercase">{error}</p>
      )}

      {cliente && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          

            
          
            <h2 className="text-2xl font-semibold text-blue-300 mb-6 pb-2 border-b border-gray-700 uppercase">
              Informações do Cliente
            </h2>
          <p className="text-lg mb-4 text-gray-300 uppercase">{`Vendedor: ${cliente.vendedor.nome}`}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              {[
                { label: 'Nome', value: cliente.nome },
                { label: 'CPF', value: cliente.cpf },
                { label: 'Identidade', value: cliente.identidade },
                { label: 'Endereço', value: cliente.endereco },

              ].map(({ label, value }) => (
                <p key={label} className="mb-2 text-lg">
                  <strong className="text-gray-400 uppercase">{label}:</strong>{' '}
                  <span className="text-gray-200">{value}</span>
                </p>
              ))}
              <Link href='*'>
                <h2 className=" flex items-center gap-2 text-sm font-semibold text-blue-300 mb-6 pb-2 border-b border-gray-700 uppercase">
                  <FaRegFile /> Histórico
                </h2>
              </Link>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="mb-2 text-lg">
                <strong className="text-gray-400 uppercase">Valor Total dos Produtos:</strong>{' '}
                <span className="text-gray-200">R$ {cliente.valorTotal}</span>
              </p>
              <div className="mb-2 text-lg flex items-center">
                <strong className="text-gray-400 uppercase mr-2">Valor a ser pago:</strong>
                <input
                  value={cliente.valorPago}
                  onChange={(e) => setCliente({ ...cliente, valorPago: e.target.value })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="bg-gray-600 text-white rounded px-2 py-1 w-24"
                />
              </div>
              <div className="mb-2 text-lg flex items-center">
                <strong className="text-gray-400 uppercase mr-2">Data da Entrega:</strong>
                <input
                  type="date"
                  value={cliente.dataEntrega}
                  onChange={(e) => setCliente({ ...cliente, dataEntrega: e.target.value })}
                  className="bg-gray-600 text-white rounded px-2 py-1"
                />
              </div>
              {cliente.enderecoEntrega && (
                <p className="mb-2 text-lg">
                  <strong className="text-gray-400 uppercase">Endereço de Entrega:</strong>{' '}
                  <span className="text-gray-200">{cliente.enderecoEntrega}</span>
                </p>
              )}
              {cliente.formaDePagamento === 'CREDITO' && (
                <p className="mb-2 text-lg">
                  <strong className="text-gray-400 uppercase">Valor por Parcela:</strong>{' '}
                  <span className="text-gray-200">
                    {`${cliente.parcelas} X R$ ${cliente.valorPago > 0
                      ? (cliente.valorPago / cliente.parcelas).toFixed(2)
                      : (cliente.valorTotal / cliente.parcelas).toFixed(2)}`}
                  </span>
                </p>
              )}
              <p className="text-lg">
                <strong className="text-gray-400 uppercase">Forma de Pagamento:</strong>{' '}
                <span className="text-gray-200">{cliente.formaDePagamento}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {cliente && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-6 flex">
          <div className="w-1/2">
            {usuario && (
              <>
                {usuario.some((usr) => ['GERENTE', 'FINANCEIRO'].includes(usr.funcao)) && (
                  <>
                    <h2 className="text-2xl font-semibold text-blue-300 mb-4 uppercase">
                      Observação da Análise
                    </h2>
                    <textarea
                      value={observacaoAnalise}
                      onChange={(e) => setObservacaoAnalise(e.target.value)}
                      className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Escreva suas observações aqui..."
                    />
                  </>
                )}
                {usuario.some((usr) => ['FUNCIONARIO'].includes(usr.funcao)) && (
                  <>
                    <h2 className="text-2xl font-semibold text-blue-300 mb-4 uppercase">
                      Observação do Funcionário
                    </h2>
                    <textarea
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Escreva suas observações aqui..."
                    />
                  </>
                )}
              </>
            )}
            <div className="flex gap-4 mb-4">
              {usuario && usuario.some((usr) => ['GERENTE', 'FINANCEIRO'].includes(usr.funcao)) && (
                <>
                  <button
                    onClick={() => {
                      acaoAnalise('DEFERIDO')
                      atualizarPVenda()
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    <FaCheckCircle /> Deferir
                  </button>
                  <button
                    onClick={() => {
                      acaoAnalise('INDEFERIDO')
                      atualizarPVenda()
                    }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    <FaTimesCircle /> Indeferir
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => {
                acaoAnalise('ANALISE')
                atualizarPVenda()
              }}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <FaExclamationTriangle /> Análise
            </button>
          </div>
          <div className="w-1/2 bg-gray-700 rounded-lg p-4 ml-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2 uppercase">
                Observação do Funcionário
              </h3>
              <p className="bg-gray-600 text-gray-200 p-2 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {cliente.observacao || 'Nenhuma observação do funcionário.'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2 uppercase">
                Observação da Análise
              </h3>
              <p className="bg-gray-600 text-gray-200 p-2 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {cliente.observacaoAnalise || 'Nenhuma observação da análise.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {produtos.length > 0 && (
        <div className="mt-6 ">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4 uppercase">
            Informações dos Produtos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-5 shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-blue-300 mb-3 uppercase">
                  {produto.produto}
                </h3>
                <p className="text-lg">
                  <strong className="text-gray-400 uppercase">Valor:</strong>{' '}
                  <span className="text-gray-200">R$ {produto.valor.toFixed(2)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}