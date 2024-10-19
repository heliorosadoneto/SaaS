"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const PaginaDeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    signIn("credentials", {
      ...data,
      callbackUrl: "/dashboard",
    });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a2037] to-[#2b1e4d]">
      <header className="w-full p-4 flex justify-between items-center">
        <Link href="/" className="text-[#4a90e2] text-2xl font-bold">FuturoSaaS</Link>
        <Link href="/signup" className="bg-[#4a90e2] text-white px-4 py-2 rounded hover:bg-[#3a80d2] transition duration-300">
          Criar Conta
        </Link>
      </header>
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#252b48] bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <Link href='/'
                onClick={handleGoBack}
                className="mb-4 text-[#4a90e2] hover:text-[#3a80d2] transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Voltar
              </Link>
              <h2 className="text-3xl font-bold text-center text-[#4a90e2] mb-6">
                Login
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-3 bg-[#1a2037] border border-[#3a4567] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition duration-200 ease-in-out"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="mt-1 block w-full px-4 py-3 bg-[#1a2037] border border-[#3a4567] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition duration-200 ease-in-out"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#4a90e2] to-[#7e57c2] hover:from-[#3a80d2] hover:to-[#6e47b2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a90e2] transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                  >
                    Entrar
                  </button>
                </div>
              </form>
              <div className="mt-6 text-center">
                <a href="#" className="text-sm text-[#4a90e2] hover:text-[#3a80d2] transition duration-200 ease-in-out">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDeLogin;