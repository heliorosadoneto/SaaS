"use client";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";
import Loading from "@/components/loading";
import { useState, useEffect } from "react"; // Importando useState e useEffect

function Home() {
  const [isLoading, setIsLoading] = useState(true); // Definindo o estado de carregamento

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simulando carregamento
    }, 2000); // Tempo de carregamento de 2 segundos

    return () => clearTimeout(timer); // Limpando o timer ao desmontar
  }, []);

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  }
  return (
    <div>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-gray-900"></div>

        <header className="relative z-10 flex items-center justify-between bg-gray-800 bg-opacity-50 p-4 backdrop-blur-lg">
          <div className="text-2xl font-bold text-blue-400">FuturoSaaS</div>
          <nav>
            <Link
              href={ROUTES.LOGIN}
              className="px-4 py-2 text-blue-300 transition-colors hover:text-blue-400"
            >
              Login
            </Link>
            <button className="ml-4 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400">
              Criar Conta
            </button>
          </nav>
        </header>

        <main className="container relative z-10 mx-auto px-4 py-16">
          <h1 className="mb-8 text-center text-5xl font-bold text-blue-400">
            Revolucione seu Negócio com FuturoSaaS
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-center text-xl text-gray-300">
            Gestão empresarial, vendas, análise de crédito e PDV em uma única
            plataforma futurística.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {["Básico", "Profissional", "Empresarial"].map((plan, index) => (
              <div
                key={plan}
                className="transform rounded-lg border border-gray-700 bg-gray-800 bg-opacity-50 p-6 backdrop-blur-lg transition-all duration-300 hover:scale-105"
              >
                <h3 className="mb-4 text-2xl font-bold text-blue-400">
                  {plan}
                </h3>
                <p className="mb-6 text-gray-400">
                  Perfeito para{" "}
                  {index === 0
                    ? "iniciantes"
                    : index === 1
                      ? "negócios em crescimento"
                      : "grandes empresas"}
                </p>
                <ul className="mb-8 space-y-2">
                  {[
                    "Gestão Empresarial",
                    "Análise de Crédito",
                    "PDV Integrado",
                    ...(index > 0 ? ["Relatórios Avançados"] : []),
                    ...(index > 1 ? ["Suporte 24/7", "API Personalizada"] : []),
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-gray-300"
                    >
                      <svg
                        className="mr-2 h-5 w-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white transition-colors duration-300 hover:from-blue-600 hover:to-purple-700">
                  Escolher Plano
                </button>
              </div>
            ))}
          </div>
        </main>

        <footer className="relative z-10 bg-gray-800 bg-opacity-50 py-8 text-center text-gray-400 backdrop-blur-lg">
          © 2024 FuturoSaaS. Todos os direitos reservados.
        </footer>

        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          h1 {
            animation: pulse 3s infinite;
          }
          .backdrop-blur-lg {
            backdrop-filter: blur(8px);
          }
        `}</style>
      </div>
    </div>
  );
}

export default Home;
