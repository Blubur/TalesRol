import type { Metadata } from 'next'
import './globals.css'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
    return Object.fromEntries(
      (data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
    )
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

/** Genera el bloque <style> con las variables CSS del tema */
function buildThemeCss(config: Record<string, string>): string {
  const v = (key: string, fallback: string) => config[key] ?? fallback
  const displayFont = v('theme_font_display', 'Texturina')
  const bodyFont    = v('theme_font_body',    'Radio Canada')
  const crimson     = v('theme_color_crimson', '#C10606')
  // Genera rgba de glow y subtle a partir del crimson principal
  const hex2rgb = (h: string) => {
    const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16)
    return `${r},${g},${b}`
  }
  const rgb = crimson.startsWith('#') && crimson.length === 7 ? hex2rgb(crimson) : '193,6,6'

  return `:root, [data-theme="dark"] {
  --color-crimson:        ${crimson};
  --color-crimson-dim:    ${v('theme_color_crimson_dim',   '#8a0404')};
  --color-crimson-light:  ${v('theme_color_crimson_light', '#e53535')};
  --color-crimson-glow:   rgba(${rgb},0.4);
  --color-crimson-subtle: rgba(${rgb},0.08);

  --bg-primary:   ${v('theme_bg_primary',   '#0a0a0a')};
  --bg-secondary: ${v('theme_bg_secondary', '#111111')};
  --bg-card:      ${v('theme_bg_card',      '#161616')};
  --bg-elevated:  ${v('theme_bg_elevated',  '#1e1e1e')};

  --text-primary:   ${v('theme_text_primary',   '#e8e0d0')};
  --text-secondary: ${v('theme_text_secondary', '#9a9080')};
  --text-muted:     ${v('theme_text_muted',     '#5a5248')};

  --font-display:     '${displayFont}', Georgia, serif;
  --font-body:        '${bodyFont}', sans-serif;
  --font-cinzel:      '${displayFont}', Georgia, serif;
  --font-crimson-pro: '${bodyFont}', Georgia, serif;

  --color-success:        ${v('theme_color_success', '#4a9e6b')};
  --color-warning:        ${v('theme_color_warning', '#d4820a')};
  --color-error:          ${v('theme_color_error',   '#e53535')};
  --color-info:           ${v('theme_color_info',    '#5b8fd4')};

  --color-role-admin:    ${v('theme_role_admin',    '#ff4444')};
  --color-role-director: ${v('theme_role_director', '#d4820a')};
  --color-role-master:   ${v('theme_role_master',   '#7b9bda')};
  --color-role-jugador:  ${v('theme_role_jugador',  '#6db56d')};
  --color-role-miembro:  ${v('theme_role_miembro',  '#9a9080')};
}`
}

/** Genera la URL de Google Fonts para las fuentes del tema */
function buildGoogleFontsUrl(config: Record<string, string>): string | null {
  const display = config.theme_font_display ?? 'Texturina'
  const body    = config.theme_font_body    ?? 'Radio Canada'
  const fonts = [...new Set([display, body])]
    .filter(Boolean)
    .map(f => f.replace(/ /g, '+'))
    .join('&family=')
  return fonts ? `https://fonts.googleapis.com/css2?family=${fonts}:wght@400;500;600;700&display=swap` : null
}

/** Extrae y sanitiza las etiquetas <link> del campo de links externos */
function extractExtraLinks(raw: string): string[] {
  if (!raw) return []
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('<link') && l.includes('stylesheet'))
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, customCss] = await Promise.all([getSiteConfig(), getCustomCss()])

  const maintenanceOn = config.maintenance_mode === 'true'
  const bannerOn      = config.banner_enabled   === 'true'
  const bannerMsg     = config.banner_message    ?? ''
  const bannerBg      = config.banner_color      ?? '#e63946'
  const bannerText    = config.banner_text_color ?? '#ffffff'

  const themeCss       = buildThemeCss(config)
  const googleFontsUrl = buildGoogleFontsUrl(config)
  const extraLinks     = extractExtraLinks(config.theme_font_extra_links ?? '')

  // Comprobar si el usuario actual es admin para saltarse el mantenimiento.
  // Solo se ejecuta si el mantenimiento está activo.
  let isAdmin = false
  if (maintenanceOn) {
    try {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await getServiceClient()
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        isAdmin = profile?.role === 'admin'
      }
    } catch {
      // Si falla la comprobación, no es admin
    }
  }

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Fuentes del tema (Google Fonts dinámico) */}
        {googleFontsUrl && (
          <link href={googleFontsUrl} rel="stylesheet" />
        )}

        {/* Fuentes estáticas que siempre cargamos como fallback */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
          rel="stylesheet"
        />

        {/* Links de fuentes externos adicionales configurados desde el PA */}
        {extraLinks.map((link, i) => (
          <link
            key={i}
            rel="stylesheet"
            href={link.match(/href="([^"]+)"/)?.[1] ?? ''}
          />
        ))}

        <link
          rel="stylesheet"
          href="https://nagoshiashumari.github.io/Rpg-Awesome/stylesheets/rpg-awesome.min.css"
        />
        <link rel="icon" href="/api/favicon" />

        {/* Variables CSS del tema — se inyectan antes que el CSS custom */}
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeCss }} />

        {/* CSS personalizado del admin (puede sobreescribir variables) */}
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
        {maintenanceOn && !isAdmin
          ? <MaintenancePage message={config.maintenance_message} />
          : children
        }
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
      <h1 style={{ fontFamily: 'var(--font-headings, serif)', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
        En mantenimiento
      </h1>
      <p style={{ color: 'var(--text-muted, #888)', maxWidth: '420px', lineHeight: 1.6, margin: 0 }}>
        {message || 'Estamos realizando tareas de mantenimiento. Volvemos pronto.'}
      </p>
    </div>
  )
}