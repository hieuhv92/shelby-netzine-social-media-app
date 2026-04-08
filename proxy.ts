import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The function name must be "proxy" in Next.js 16
export function proxy(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Protected and Public route logic
  const isProtectedRoute = pathname.startsWith('/create')
  const isLoginPage = pathname === '/login'

  // Redirect to login if accessing protected routes without session
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to home if already logged in and trying to access login page
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api, _next/static, _next/image, favicon.ico, assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
}