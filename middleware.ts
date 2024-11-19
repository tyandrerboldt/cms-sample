import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/uploads", "/maintenance", "/api"]
const ADMIN_PATHS = ["/admin", "/api/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Sempre permite acesso às rotas administrativas
  if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Permite acesso à página de manutenção e endpoint de configuração
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  try {
    const response = await fetch(new URL("/api/config", request.url))
    if (!response.ok) {
      throw new Error("Failed to fetch site config")
    }
    
    const config = await response.json()

    // Se o site estiver inativo e não for uma rota pública, redireciona para manutenção
    if (!config?.status) {
      return NextResponse.redirect(new URL("/maintenance", request.url))
    }

    // Site ativo, permite acesso normal
    return NextResponse.next()
  } catch (error) {
    console.error("Erro ao verificar status do site:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!api/admin|_next/static|_next/image|favicon.ico|uploads).*)"],
}