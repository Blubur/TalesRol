import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'favicon_url')
      .single()

    const faviconUrl = data?.value?.trim()

    if (faviconUrl) {
      // Redirigir a la URL configurada
      return NextResponse.redirect(faviconUrl, { status: 302 })
    }
  } catch {
    // Si falla, servir el favicon por defecto
  }

  // Favicon por defecto — redirigir al .ico estático
  return NextResponse.redirect(new URL('/favicon.ico', process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tales-rol.vercel.app'))
}