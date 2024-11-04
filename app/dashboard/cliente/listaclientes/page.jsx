'use client'

import { useEffect, useState } from 'react'
import Read from '@/backend/db/cliente'

export default function ListaClientes() {
    const [clientes, setClientes] = useState([])
    const [pesquisa, setPesquisa] = useState('')

    useEffect(() => {
        const getClientes = async () => {
            const clientes = await Read(pesquisa); // Passa a pesquisa como argumento
            setClientes(clientes)
        };

        getClientes();
    }, [pesquisa]); // Inclui pesquisa no array de dependências

    const excluirCliente = (id) => {
        setClientes(clientes.filter(cliente => cliente.id !== id))
    }

    const editarCliente = (id) => {
        console.log(`Editar cliente com ID: ${id}`)
    }

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        cliente.cpf.includes(pesquisa) ||
        cliente.identidade.toLowerCase().includes(pesquisa.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-4">
            <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">Lista de Clientes</h1>

            <div className="w-full max-w-4xl bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700 p-8 shadow-2xl backdrop-blur-lg">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou CPF"
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-700 bg-opacity-50">
                                <th className="px-4 py-2 text-left text-blue-400">Nome</th>
                                <th className="px-4 py-2 text-left text-blue-400">CPF</th>
                                <th className="px-4 py-2 text-left text-blue-400">Identidade</th>
                                <th className="px-4 py-2 text-left text-blue-400">Data de Criação</th>
                                <th className="px-4 py-2 text-left text-blue-400">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.map((cliente) => (
                                <tr key={cliente.id} className="border-b border-gray-700">
                                    <td className="px-4 py-2 text-white">{cliente.nome}</td>
                                    <td className="px-4 py-2 text-white">{cliente.cpf}</td>
                                    <td className="px-4 py-2 text-white">{cliente.identidade}</td>
                                    <td className="px-4 py-2 text-white">
                                        {new Date(cliente.criadoEm).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }).toLowerCase()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2 transition duration-300"
                                            onClick={() => editarCliente(cliente.id)}
                                            aria-label={`Editar ${cliente.nome}`}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition duration-300"
                                            onClick={() => excluirCliente(cliente.id)}
                                            aria-label={`Excluir ${cliente.nome}`}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
