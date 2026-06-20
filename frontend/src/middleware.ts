import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes protection
    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "MANAGER") {
      return NextResponse.redirect(new URL("/login?error=AccessDenied", req.url));
    }

    // Client/Portfolio routes protection
    if ((path.startsWith("/client") || path.startsWith("/portfolio") || path.startsWith("/stocks")) && token?.role !== "CLIENT") {
      // Admins might also want to view client dash, but typically they use /admin/clients/[id]
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login?error=AccessDenied", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/portfolio/:path*", "/stocks/:path*"],
};
