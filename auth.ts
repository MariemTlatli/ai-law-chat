import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { signInSchema } from "./lib/zod";
import prisma from "@/lib/prisma-db1";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        // Valider les identifiants
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Chercher l'utilisateur dans la base
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log("User not found");
          return null;
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        // Retourner l'utilisateur s'il est valide
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const role = auth?.user?.role || 'user';

      // Autoriser l'accès à /auth/signup sans connexion
    if (pathname.startsWith('/auth/signup')) {
      return true; // ✅ Accès libre
    }
      // Redirection si déjà connecté
      if (pathname.startsWith('/auth/signin') && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Protection des pages admin
      if (pathname.startsWith("/page2") && role !== "admin") {
        return Response.redirect(new URL('/', nextUrl));
      }

      return !!auth;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
});