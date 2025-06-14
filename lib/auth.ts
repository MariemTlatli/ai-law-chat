import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma-db1";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email: email as string }
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password as string, user.password);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  secret: process.env.AUTH_SECRET, 
});