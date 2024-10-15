"use client"
import Link from "next/link";
import { ROUTES } from '@/routes/routes'
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
      <h1>Home</h1>
      <Link href={ROUTES.LOGIN}>Login</Link>
    </div>
  );
}

export default Home;
