import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!session?.user?.email || !ownerEmail || session.user.email.toLowerCase() !== ownerEmail.toLowerCase()) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      // never return password
    } as any,
    orderBy: { email: "asc" },
  } as any);
  return new Response(JSON.stringify({ users }), { headers: { "content-type": "application/json" } });
}
