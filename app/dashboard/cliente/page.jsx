"use client";
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

  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(false); // Estado de carregamento

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

    if (!cpf) {
      toast.error("insira o CPF");
      return false;
    }

    if (!email) {
      toast.error("Email inválido.");
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

      setLoading(true); // Inicia o carregamento

      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          body: formDataToSubmit,
          headers: {
            Accept: "application/json",
          },
        });

        console.log("resultados:", response);
        if (!response.ok) {
          throw new Error("Erro ao cadastrar cliente");
        }

        const data = await response.json();
        toast.success("Cliente cadastrado com sucesso!");
        console.log("Resposta:", data);

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
        console.error("Erro:", error);
      } finally {
        setLoading(false); // Termina o carregamento
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
                      required
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
                      required
                      className="w-full transform rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    />
                  </div>
                );
              }
            })}
          </div>
          <button
            type="submit"
            className={`w-full transform rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading} // Desabilita o botão enquanto está carregando
          >
            {loading ? "Carregando..." : "Cadastrar"} {/* Exibe mensagem de carregamento */}
          </button>
        </form>
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="mb-2">
                <label className="block text-sm text-blue-300">
                  {fileName}
                </label>
                <div className="h-2 rounded bg-gray-700">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
