import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/uploads", "/maintenance", "/api/front", "/api/auth", "/api/package-types", "/api/contact", "/api/config", "/auth/signin"];
const ADMIN_PATHS = ["/admin/users", "/admin/package-types","/admin/article-categories", "/admin/settings"];
const EDITOR_PATHS = ["/admin/packages", "/admin/articles", "/api"];
const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow access to public routes
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if it's an admin path
  const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path));
  const isEditorPath = EDITOR_PATHS.some(path => pathname.startsWith(path));

  // Get user token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If no token and trying to access admin routes, redirect to login
  if (!token && (isAdminPath || isEditorPath || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Check role-based access
  if (token) {
    const userRole = token.role;

    // Only allow admin access to admin paths
    if (isAdminPath && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Only allow admin and editor access to editor paths
    if (isEditorPath && !["ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  try {
    // Check site configuration
    const response = await fetch(new URL("/api/config", baseUrl));
    if (!response.ok) {
      throw new Error("Failed to fetch site config");
    }

    const config = await response.json();

    // If site is inactive and not a public route, redirect to maintenance
    if (!config?.status && !token) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }

    // Site active, allow normal access
    return NextResponse.next();
  } catch (error) {
    console.error("Error checking site status:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api/admin|_next/static|_next/image|favicon.ico|uploads).*)"],
};