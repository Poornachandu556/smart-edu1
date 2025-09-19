import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        if (!creds?.email) return null;
        return { id: "1", name: creds.email.split("@")[0], email: creds.email } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };


