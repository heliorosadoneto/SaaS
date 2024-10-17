"use client";

import CadastroCliente from "@/backend/db/cliente";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FuturisticClientForm() {
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    cpf: "",
    identidade: "",
    cidade: "",
    estado: "",
    telefone: "",
    email: "",
    fotoCliente: null,
    fotoComprovanteEndereco: null,
    fotoIdentidade: null,
    fotoCPF: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const {
      nome,
      endereco,
      cpf,
      identidade,
      cidade,
      estado,
      telefone,
      email,
      fotoCliente,
      fotoComprovanteEndereco,
      fotoIdentidade,
      fotoCPF,
    } = formData;

    const regex = {
      cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      identidade: /^\d{7,8}$/,
    };

   
    if (!regex.cpf.test(cpf)) {
      toast.error("CPF deve estar no formato 123.456.789-01.");
      return false;
    }

    if (!regex.email.test(email)) {
      toast.error("Email inválido.");
      return false;
    }

    if (!regex.identidade.test(identidade)) {
      toast.error("Identidade deve ter 7 ou 8 dígitos.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSubmit.append(key, value);
        }
      });
  
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          body: formDataToSubmit, // Enviando o FormData diretamente
        });
  
        if (!response.ok) {
          throw new Error('Erro ao cadastrar cliente');
        }
  
        const data = await response.json();
        toast.success("Cliente cadastrado com sucesso!");
        console.log('Resposta:', data);
  
        // Limpar o formulário após o sucesso
        setFormData({
          nome: "",
          endereco: "",
          cpf: "",
          identidade: "",
          cidade: "",
          estado: "",
          telefone: "",
          email: "",
          fotoCliente: null,
          fotoComprovanteEndereco: null,
          fotoIdentidade: null,
          fotoCPF: null,
        });
      } catch (error) {
        toast.error(
          "Erro ao cadastrar cliente. Verifique se o CPF já está cadastrado.",
        );
        console.error('Erro:', error);
      }
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full">
        <h1 className="mb-8 text-center text-4xl font-bold text-blue-400">
          Clientes
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-700 bg-gray-800 bg-opacity-50 p-8 shadow-2xl backdrop-blur-lg"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(formData).map(([key, value]) => {
              if (key.startsWith("foto")) {
                return (
                  <div key={key} className="form-group">
                    <label
                      htmlFor={key}
                      className="mb-1 block text-sm font-medium uppercase tracking-wide text-blue-300"
                    >
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/_/g, " ")}
                      :
                    </label>
                    <input
                      type="file"
                      id={key}
                      name={key}
                      accept="image/*"
                      onChange={handleInputChange}
                      
                      className="w-full transform rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    />
                  </div>
                );
              } else {
                return (
                  <div key={key} className="form-group">
                    <label
                      htmlFor={key}
                      className="mb-1 block text-sm font-medium uppercase tracking-wide text-blue-300"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </label>
                    <input
                      type={key === "email" ? "email" : "text"}
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      
                      className="w-full transform rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    />
                  </div>
                );
              }
            })}
          </div>
          <button
            type="submit"
            className="w-full transform rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Cadastrar
          </button>
        </form>
        <ToastContainer />
      </div>
      <style jsx global>{`
        @keyframes glow {
          0%,
          100% {
            text-shadow:
              0 0 10px rgba(66, 153, 225, 0.5),
              0 0 20px rgba(66, 153, 225, 0.3),
              0 0 30px rgba(66, 153, 225, 0.2);
          }
          50% {
            text-shadow:
              0 0 20px rgba(66, 153, 225, 0.8),
              0 0 30px rgba(66, 153, 225, 0.5),
              0 0 40px rgba(66, 153, 225, 0.3);
          }
        }
        .animate-pulse {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

