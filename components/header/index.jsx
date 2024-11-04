'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usuario as buscarUsuarioAPI } from '@/backend/db/db'
import { ROUTES } from '@/routes/routes'
import { FaHome, FaShoppingCart, FaCashRegister, FaBoxes, FaChartLine, FaUsers, FaSignOutAlt } from 'react-icons/fa'

const Header = () => {
  const [usuario, setUsuario] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    async function buscarUsuario() {
      try {
        const resposta = await buscarUsuarioAPI()
        setUsuario(resposta)
      } catch (erro) {
        console.error('Erro ao buscar usuário:', erro)
      }
    }
    buscarUsuario()
  }, [])

  const menuItems = [
    { href: '/dashboard', label: 'Home', icon: <FaHome /> },
    {
      href: ROUTES.VENDA, label: 'Vendas', icon: <FaShoppingCart />
    },
    { href: ROUTES.CAIXA, label: 'Caixa', icon: <FaCashRegister /> },
    { href: ROUTES.ESTOQUE, label: 'Estoque', icon: <FaBoxes /> },
    { href: ROUTES.FINANCEIRO, label: 'Financeiro', icon: <FaChartLine /> },
    { href: ROUTES.CLIENTE, label: 'Clientes', icon: <FaUsers /> },
  ]

  return (
    <header className="bg-gray-900 text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <nav>
          <ul className="flex gap-4 items-center">
            {menuItems.map((item, index) => (
              <li key={index} className="relative group">
                <Link href={item.href} className="flex items-center p-2 hover:bg-blue-600 transition duration-300 ease-out hover:scale-105 rounded-md">
                  {item.icon}
                  <span className="ml-2 uppercase font-bold">{item.label}</span>
                </Link>
                {item.dropdown && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                    <div className="py-1">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          {usuario && (
            <div className="text-white bg-gray-800 rounded-lg p-2 shadow-inner">
              {usuario.map((user, index) => (
                <h1 key={index} className="text-sm font-semibold">
                  {user.nome.toUpperCase()} - {user.email} - {user.funcao}
                </h1>
              ))}
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
          >
            <FaSignOutAlt className="mr-2" />
            Log Out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header