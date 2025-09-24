import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name: string | undefined = body?.name;
    const emailRaw: string | undefined = body?.email;
    const password: string | undefined = body?.password;
    if (!emailRaw || !password) return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    if (password.length < 8) return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400 });
    const email = emailRaw.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ error: "Account already exists" }), { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        // Support either field name during transition
        // @ts-ignore - prisma type may not be updated until migration
        passwordHash: hash,
        role: "user",
      },
      select: { id: true, email: true, name: true },
    });

    return new Response(JSON.stringify({ user }), { headers: { "content-type": "application/json" } });
  } catch (e: any) {
    // Known Prisma unique constraint
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 409 });
    }
    console.error("/api/signup error", e);
    const message = typeof e?.message === "string" ? e.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
