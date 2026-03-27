import type { Metadata } from 'next'
import './globals.css'
import { createServiceClient } from '@/lib/supabase/service'

export const metadata: Metadata = {
  title: { template: '%s | TalesRol', default: 'TalesRol — Plataforma de Roleplay' },
  description: 'Una plataforma de roleplay escrito.',
}

async function getCustomCss(): Promise<string> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('custom_css')
      .select('css')
      .eq('id', 1)
      .single()
    return data?.css ?? ''
  } catch {
    return ''
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const customCss = await getCustomCss()

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        {customCss && (
          <style
            id="custom-css"
            dangerouslySetInnerHTML={{ __html: customCss }}
          />
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}