import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      
      if(userExists && userExists.enabled) {
        return true
      }

      if(userExists && !userExists.enabled){
        return false
      }

      return !userExists && config?.allowRegistration
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
      if (token) {
        session.user.id = token.sub || ""; // Adiciona o Id do user a sessão
        session.role = token.role
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
