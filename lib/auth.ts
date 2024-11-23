import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth",
    signOut: "/auth",
    error: "/auth",
    verifyRequest: "/auth",
    newUser: "/admin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      const config = await prisma.siteSettings.findFirst()
      const userExists = await prisma.user.findUnique({
        where: {
          id: user.id
        }
      })

      if (userExists && userExists.enabled) {
        return true
      }

      if (userExists && !userExists.enabled) {
        return false
      }

      if (!userExists && config?.allowRegistration) {
        return true
      }

      return false
    },
    async jwt({ token }) {

      const user = await prisma.user.findUnique({
        where: {
          id: token.sub
        }
      })
      if (user) {
        token.role = user.role
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session) {
        session.user = {
          ...session.user,
          id: token.sub || "" // Adiciona o Id do user a sessão
        } as any
        session.role = token.role
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};
