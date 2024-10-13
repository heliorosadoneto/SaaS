"use server";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/backend/prisma";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const user = await prisma.usuarios.findFirst({
          where: { email: credentials.email },
        });

        if (user && credentials.password === user.senha) {
          return {
            id: user.id,
            email: user.email,
            empresaId: user.empresaId,
            funcao: user.funcao,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    maxAge: 24 * 60 * 60, // 24 horas em segundos
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
    newUser: "/dashboard",
  },
  callbacks: {
    async session({ session, token }) {
      // Inclui empresaId na sessão
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.empresaId = token.empresaId;
      session.user.funcao = token.funcao;

      return session;
    },
    async jwt({ token, user }) {
      // Inclui empresaId no token JWT
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.empresaId = user.empresaId;
        token.funcao = user.funcao;
        token.sessionId = user.id + Date.now(); // Gera um ID de sessão único
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
