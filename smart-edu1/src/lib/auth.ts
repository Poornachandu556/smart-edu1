import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        if (!creds?.email || !creds?.password) return null;
        const email = String(creds.email).toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        // Support either field name during schema transition
        // @ts-ignore
        const hash: string | null | undefined = (user as any)?.passwordHash ?? (user as any)?.hashedPassword;
        if (!user || !hash) return null;
        const ok = await bcrypt.compare(String(creds.password), hash);
        if (!ok) return null;
        return { id: user.id, name: user.name || undefined, email: user.email || undefined } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.userId) (session.user as any).id = token.userId as string;
      return session;
    },
  },
};


