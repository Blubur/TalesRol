import type { Metadata } from 'next'
import './globals.css'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: { template: '%s | TalesRol', default: 'TalesRol — Plataforma de Roleplay' },
  description: 'Una plataforma de roleplay escrito.',
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function getSiteConfig(): Promise<Record<string, string>> {
  try {
    const { data } = await getServiceClient()
      .from('site_config')
      .select('key, value')
    return Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]))
  } catch {
    return {}
  }
}

async function getCustomCss(): Promise<string> {
  try {
    const { data } = await getServiceClient()
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
  const [config, customCss] = await Promise.all([getSiteConfig(), getCustomCss()])

  const maintenanceOn = config.maintenance_mode === 'true'
  const bannerOn      = config.banner_enabled   === 'true'
  const bannerMsg     = config.banner_message    ?? ''
  const bannerBg      = config.banner_color      ?? '#e63946'
  const bannerText    = config.banner_text_color ?? '#ffffff'

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <link
  rel="stylesheet"
  href="https://nagoshiashumari.github.io/Rpg-Awesome/stylesheets/rpg-awesome.min.css"
/>
        {customCss && (
          <style id="custom-css" dangerouslySetInnerHTML={{ __html: customCss }} />
        )}
      </head>
      <body>
        {bannerOn && bannerMsg && (
          <div
            id="global-banner"
            style={{
              background: bannerBg,
              color: bannerText,
              textAlign: 'center',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              position: 'sticky',
              top: 0,
              zIndex: 9999,
            }}
          >
            {bannerMsg}
          </div>
        )}
        {maintenanceOn ? <MaintenancePage message={config.maintenance_message} /> : children}
      </body>
    </html>
  )
}

function MaintenancePage({ message }: { message?: string }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--bg-base, #0f0f1a)',
      color: 'var(--text-primary, #e0e0e0)',
    }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
      <h1 style={{ fontFamily: 'var(--font-cinzel, serif)', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
        En mantenimiento
      </h1>
      <p style={{ color: 'var(--text-muted, #888)', maxWidth: '420px', lineHeight: 1.6, margin: 0 }}>
        {message || 'Estamos realizando tareas de mantenimiento. Volvemos pronto.'}
      </p>
    </div>
  )
}