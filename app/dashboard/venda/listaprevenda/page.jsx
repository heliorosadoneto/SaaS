'use client'

import { useEffect, useState, useCallback } from 'react'
import { AcaoAnalise, excluirPreVenda, getPreVenda } from '@/backend/db/preVenda'
import { usuario as buscarUsuarioAPI } from '@/backend/db/db'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/routes/routes'
import { FaCheckCircle, FaEye, FaShoppingCart, FaTimesCircle, FaTrash } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '@/components/loading'

const ListaPreVenda = () => {
  const [preVendaData, setPreVendaData] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [tempoRestante, setTempoRestante] = useState(60)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      const [usuarioResposta, preVendaResposta] = await Promise.all([
        buscarUsuarioAPI(),
        getPreVenda()
      ])
      setUsuario(usuarioResposta)
      setPreVendaData(preVendaResposta)
      setIsLoading(false)
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro)
      toast.error('Falha ao carregar dados. Por favor, tente novamente.')
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const intervalo = setInterval(() => {
      setTempoRestante((prevTempo) => {
        if (prevTempo === 1) {
          fetchData()
          return 60
        }
        return prevTempo - 1
      })
    }, 1000)
    return () => clearInterval(intervalo)
  }, [fetchData])

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const preVendaMap = preVendaData.reduce((acc, item) => {
    if (!acc[item.preVendaId]) {
      acc[item.preVendaId] = {
        statusAnalise: item.analise,
        vendedor: item.vendedor.nome,
        valorTotal: 0,
        dataEntrega: item.dataEntrega,
        cliente: item.cliente,
        preVendaId: item.preVendaId,
        itens: []
      }
    }
    acc[item.preVendaId].valorTotal += item.valor
    acc[item.preVendaId].itens.push(item)
    return acc
  }, {})

  const obterCorStatus = (status) => {
    const cores = {
      ANALISE: 'bg-yellow-400',
      DEFERIDO: 'bg-green-500',
      INDEFERIDO: 'bg-red-500'
    }
    return cores[status] || 'bg-gray-500'
  }

  const Excluir = async (preVendaId) => {
    try {
      await excluirPreVenda(preVendaId)
      setPreVendaData(preVendaData.filter(item => item.preVendaId !== preVendaId))
      toast.success('Excluído com sucesso')
      router.push(ROUTES.PREVENDA)
    } catch (error) {
      toast.error('Erro ao excluir')
      console.error('Erro ao excluir pre-venda:', error)
    }
  }

  const acaoAnalise = async (analise, preVendaId) => {
    try {
      await AcaoAnalise(analise, preVendaId)
      setPreVendaData(preVendaData.map(item => 
        item.preVendaId === preVendaId ? { ...item, analise } : item
      ))
      toast.success('Atualizado com sucesso')
    } catch (error) {
      toast.error('Erro ao atualizar')
      console.error('Erro ao realizar a ação de análise:', error)
    }
  }

  

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <Loading isLoading={isLoading}/>
      <ToastContainer limit={20} position="top-right" autoClose={3000} />
      <h1 className="mb-8 text-center text-4xl font-bold text-blue-400 animate-pulse">
        Pré-Venda
      </h1>
      <div className="mb-4 bg-gray-800 rounded-lg shadow-md p-4">
        <div className="h-2.5 w-full bg-gray-700 rounded-full">
          <div
            className="h-2.5 bg-blue-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(tempoRestante / 60) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-400 text-center">
          Próxima atualização em {tempoRestante} segundo{tempoRestante !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              {['Cliente', 'Identidade', 'CPF', 'Valor Total', 'Data de Entrega', 'Vendedor', 'Status Análise', 'Ações'].map((header) => (
                <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {Object.values(preVendaMap).map((preVenda) => (
              <tr key={preVenda.preVendaId} className="hover:bg-gray-700 transition duration-150 ease-in-out">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{preVenda.cliente.nome}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{preVenda.cliente.identidade}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{preVenda.cliente.cpf}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{formatarValor(preVenda.valorTotal)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{formatarData(preVenda.dataEntrega)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{preVenda.vendedor}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${obterCorStatus(preVenda.statusAnalise)} text-white`}>
                    {preVenda.statusAnalise}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => acaoAnalise('ANALISE', preVenda.preVendaId)}
                      className="text-yellow-300 hover:text-yellow-100"
                      title="Análise"
                    >
                      <FaEye />
                    </button>
                    <Link href={`${ROUTES.LISTA_PREVENDA}/${preVenda.preVendaId}`}>
                      <button className="text-blue-400 hover:text-blue-200" title="Visualizar">
                        <FaShoppingCart />
                      </button>
                    </Link>
                    <button
                      onClick={() => Excluir(preVenda.preVendaId)}
                      className="text-red-400 hover:text-red-200"
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                    {usuario && usuario.some(usr => ['GERENTE', 'FINANCEIRO'].includes(usr.funcao)) && (
                      <>
                        <button
                          onClick={() => acaoAnalise('DEFERIDO', preVenda.preVendaId)}
                          className="text-green-400 hover:text-green-200"
                          title="Aprovar"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => acaoAnalise('INDEFERIDO', preVenda.preVendaId)}
                          className="text-red-400 hover:text-red-200"
                          title="Desaprovar"
                        >
                          <FaTimesCircle />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListaPreVenda