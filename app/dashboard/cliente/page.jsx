'use client'

import { useState } from 'react'

export default function FuturisticClientForm() {
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cpf: '',
    identidade: '',
    cidade: '',
    estado: '',
    telefone: '',
    email: '',
    empresaId: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Adicione sua lógica de envio do formulário aqui
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400 animate-pulse">Clientes</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-2xl backdrop-blur-lg border border-gray-700">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="form-group">
              <label htmlFor={key} className="block text-sm font-medium text-blue-300 mb-1 uppercase tracking-wide">
                {key === 'empresaId' ? 'Empresa ID' : key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type={key === 'email' ? 'email' : key === 'empresaId' ? 'number' : 'text'}
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105 focus:outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 px-6 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md font-semibold text-lg shadow-lg hover:shadow-blue-500/50 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Cadastrar
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(66, 153, 225, 0.5), 0 0 20px rgba(66, 153, 225, 0.3), 0 0 30px rgba(66, 153, 225, 0.2); }
          50% { text-shadow: 0 0 20px rgba(66, 153, 225, 0.8), 0 0 30px rgba(66, 153, 225, 0.5), 0 0 40px rgba(66, 153, 225, 0.3); }
        }
        .animate-pulse {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}