import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Actualizar last_seen_at — solo en rutas de página, fire-and-forget
  if (user) {
    const { pathname } = request.nextUrl
    const isPageRoute  = !pathname.startsWith('/_next') &&
                         !pathname.startsWith('/api')   &&
                         !pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|woff2?)$/)
    if (isPageRoute) {
      supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', user.id)
        .then(() => {})
    }
  }

  // Rutas protegidas — redirigir al login si no hay sesión
  const protectedRoutes = [
    '/perfil',
    '/mensajes',
    '/notificaciones',
    '/admin',
    '/salas/nueva',          // crear sala
    '/personajes/nuevo',     // crear personaje
  ]

  // Rutas protegidas por patrón (editar sala, wiki nueva, fichas, etc.)
  const protectedPatterns = [
    /^\/salas\/[^/]+\/editar/,
    /^\/salas\/[^/]+\/wiki\/nueva/,
    /^\/salas\/[^/]+\/fichas/,
    /^\/salas\/[^/]+\/miembros/,
    /^\/salas\/[^/]+\/nuevo-tema/,
    /^\/personajes\/[^/]+\/editar/,
  ]

  const { pathname } = request.nextUrl
  const isProtected =
    protectedRoutes.some(route => pathname.startsWith(route)) ||
    protectedPatterns.some(pattern => pattern.test(pathname))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Si ya está logueado y va al login/register, redirigir al inicio
  const authRoutes = ['/auth/login', '/auth/register']
  if (user && authRoutes.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}