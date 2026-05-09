import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes: only ADMIN
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Reviewer routes: ADMIN or REVIEWER
    if (
      pathname.startsWith("/reviewer") &&
      token?.role !== "ADMIN" &&
      token?.role !== "REVIEWER"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Worker routes: any authenticated user (handled by withAuth)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/reviewer/:path*", "/worker/:path*"],
};
