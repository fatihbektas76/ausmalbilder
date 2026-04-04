import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login and /api/admin/auth)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const session = request.cookies.get("admin_session");

    if (!session || session.value !== "authenticated") {
      // API routes get 401, pages get redirected to login
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Nicht autorisiert" },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
