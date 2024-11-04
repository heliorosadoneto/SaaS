"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import InputForm from "@/components/InputForm";

export default function FuturisticClientForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: "",
      endereco: "",
      cpf: "",
      identidade: "",
      nascimento: "",
      salario: "",
      cidade: "",
      estado: "",
      telefone: "",
      email: "",
      trabalhos: { proficao: "", cargo: "", endereco: "", telefone: "" },
      estadocivil: { EC: "", nome: "", proficao: "", trabalho: "" },
      referenciaPessoal: [
        { nome: "", telefone: "" },
        { nome: "", telefone: "" },
        { nome: "", telefone: "" },
      ],
      referenciaComercial: [
        { nome: "", telefone: "" },
        { nome: "", telefone: "" },
        { nome: "", telefone: "" },
      ],
      documentos: null,
    },
  });
  const [activEstadoCivil, setActiveEstadoCivil] = useState("solteiro");

  const handleEstadoCivilChange = (event) => {
    setActiveEstadoCivil(event.target.value);
  };
  const onSubmit = async (data) => {
    try {
      const formDataToSubmit = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "documentos" && value instanceof FileList) {
            Array.from(value).forEach((file, index) => {
              formDataToSubmit.append(`${key}[${index}]`, file);
            });
          } else if (Array.isArray(value) || typeof value === "object") {
            formDataToSubmit.append(key, JSON.stringify(value));
          } else {
            formDataToSubmit.append(key, value);
          }
        }
      });

      console.log(data);
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formDataToSubmit,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Erro ao cadastrar cliente");

      toast.success("Cliente cadastrado com sucesso!");
      reset();
    } catch (error) {
      toast.error(
        "Erro ao cadastrar cliente. Verifique se o CPF já está cadastrado.",
      );
      console.error("Erro:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <ToastContainer />
      <div className="w-full">
        <h1 className="mb-8 text-center text-4xl font-bold text-blue-400">
          Cadastro de Cliente
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl border border-gray-700 bg-gray-800 bg-opacity-50 p-8 shadow-2xl backdrop-blur-lg"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InputForm
              name="nome"
              label="Nome"
              register={register}
              errors={errors.nome}
              validation={{ required: "Nome é obrigatório" }}
            />
            <InputForm
              name="endereco"
              label="Endereço"
              register={register}
              errors={errors.endereco}
              validation={{ required: "Endereço é obrigatório" }}
            />
            <InputForm
              name="cpf"
              label="CPF"
              register={register}
              errors={errors.cpf}
              validation={{ required: "CPF é obrigatório" }}
            />
            <InputForm
              name="identidade"
              label="Identidade"
              register={register}
              errors={errors.identidade}
              validation={{ required: "Identidade é obrigatória" }}
            />
            <InputForm
              name="nascimento"
              label="Data de Nascimento"
              register={register}
              errors={errors.nascimento}
              type="date"
              validation={{ required: "Data de Nascimento é obrigatória" }}
            />
            <InputForm
              name="salario"
              label="Salário"
              register={register}
              errors={errors.salario}
              validation={{ required: "Salário é obrigatório" }}
            />
            <InputForm
              name="cidade"
              label="Cidade"
              register={register}
              errors={errors.cidade}
              validation={{ required: "Cidade é obrigatória" }}
            />
            <InputForm
              name="estado"
              label="Estado"
              register={register}
              errors={errors.estado}
              validation={{ required: "Estado é obrigatório" }}
            />
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-semibold text-blue-400">
              Contato
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <InputForm
                name="telefone"
                label="Telefone"
                register={register}
                errors={errors.telefone}
                validation={{ required: "Telefone é obrigatório" }}
              />
              <InputForm
                name="email"
                label="Email"
                register={register}
                errors={errors.email}
                type="email"
                validation={{
                  required: "Email é obrigatório",
                  pattern: { value: /^\S+@\S+$/, message: "Email inválido" },
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-semibold text-blue-400">
              Trabalho e Estado Civil
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <InputForm
                name="trabalhos.proficao"
                label="Trabalhos"
                register={register}
                errors={errors.trabalhos?.proficao}
              />
              <InputForm
                name="trabalhos.cargo"
                label="Cargo"
                register={register}
                errors={errors.trabalhos?.cargo}
              />
              <InputForm
                name="trabalhos.endereco"
                label="Endereço"
                register={register}
                errors={errors.trabalhos?.endereco}
              />
              <InputForm
                name="trabalhos.telefone"
                label="Telefone"
                register={register}
                errors={errors.trabalhos?.telefone}
              />

              <div className="grid">
                <label
                  htmlFor="estadocivil"
                  className="text-sm font-medium uppercase text-blue-300"
                >
                  Estado Civil
                </label>
                <select
                  {...register("estadocivil.EC")}
                  id="estadocivil"
                  className="mb-2 h-[42px] rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white hover:scale-105 focus:scale-105 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  onChange={handleEstadoCivilChange} // Atualiza o estado ao mudar
                >
                  <option value="solteiro">Solteiro</option>
                  <option value="casado">Casado</option>
                </select>
              </div>
            </div>
          </div>
          {/* Se o estado civil for 'casado', exibe a aba adicional */}
          {activEstadoCivil === "casado" && (
            <div className="mb-6">
              <h2 className="mb-4 text-2xl font-semibold text-blue-400">
                Informações Adicionais para Casado
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InputForm
                  name="estadocivil.nome"
                  label="Nome do Cônjuge"
                  register={register}
                  errors={errors.estadocivil?.nome}
                  validation={{
                    required: "Nome do cônjuge é obrigatório para casados",
                  }}
                />
                <InputForm
                  name="estadocivil.trabalho"
                  label="Trabalho do Cônjuge"
                  register={register}
                  errors={errors.estadocivil?.trabalho}
                  validation={{
                    required: "Trabalho do cônjuge é obrigatório para casados",
                  }}
                />
                <InputForm
                  name="estadocivil.proficao"
                  label="Profição do Cônjuge"
                  register={register}
                  errors={errors.estadocivil?.proficao}
                  validation={{
                    required: "Profição do cônjuge é obrigatória para casados",
                  }}
                />

                {/* Outros campos necessários */}
              </div>
            </div>
          )}

          {/*Referencia Pessoal*/}
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-semibold text-blue-400">
              Referências Pessoais
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <InputForm
                    name={`referenciaPessoal[${index}].nome`}
                    label="Nome"
                    register={register}
                    errors={errors.referenciaPessoal?.[index]?.nome}
                  />
                  <InputForm
                    name={`referenciaPessoal[${index}].telefone`}
                    label="Telefone"
                    register={register}
                    errors={errors.referenciaPessoal?.[index]?.telefone}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Referencia Comercial */}
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-semibold text-blue-400">
              Referências Comercial
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <InputForm
                    name={`referenciaComercial[${index}].nome`}
                    label="Nome"
                    register={register}
                    errors={errors.referenciaComercial?.[index]?.nome}
                  />
                  <InputForm
                    name={`referenciaComercial[${index}].telefone`}
                    label="Telefone"
                    register={register}
                    errors={errors.referenciaComercial?.[index]?.telefone}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-semibold text-blue-400">
              Arquivos
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <InputForm
                name={`documentos`}
                multiple="multiple"
                type={"file"}
                label="Documentos"
                register={register}
                errors={errors.documentos}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-blue-500 py-2 text-white"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
