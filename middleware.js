// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Importa a função para obter o token JWT

export async function middleware(req) {
  // Ignora as rotas de API
  // if (req.nextUrl.pathname.startsWith("/api")) {
  //   return NextResponse.next();
  // }

  // Obtém o token JWT dos cookies
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Se não houver token e a rota começar com "/dashboard" ou "/admin", redirecione para "/login"
    if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // Se houver token e a função for 'ADMINISTRADOR'
    if (token.funcao === "ADMINISTRADOR") {
      // Se estiver tentando acessar "/login" ou "/dashboard", redirecione para "/admin"
      if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } else {
      // Para usuários não administradores
      if (req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // Impede acesso à área de administração
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

// Define os caminhos a serem protegidos pelo middleware
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
