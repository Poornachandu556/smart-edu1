import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to login and signup without session
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const publicPaths = ["/login", "/signup", "/api/auth", "/favicon.ico", "/_next", "/public"];        
        const isPublic = publicPaths.some((p) => pathname.startsWith(p));
        if (isPublic) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|login|signup).*)",
  ],
};


