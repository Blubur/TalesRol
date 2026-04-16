import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  TrophyIcon,
  DocumentTextIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { href: '/admin/config/general',       label: 'Ajustes globales',   icon: Cog6ToothIcon },
  { href: '/admin/config/mantenimiento', label: 'Mantenimiento',      icon: WrenchScrewdriverIcon },
  { href: '/admin/config/banner',        label: 'Banner de aviso',    icon: MegaphoneIcon },
  { href: '/admin/config/textos',        label: 'Textos del sitio',   icon: DocumentTextIcon },
  { href: '/admin/config/favicon',       label: 'Favicon',            icon: PhotoIcon },
  { href: '/admin/config/roles',         label: 'Roles y permisos',   icon: ShieldCheckIcon },
  { href: '/admin/config/puntos',        label: 'Puntos e insignias', icon: TrophyIcon },
  { href: '/admin/config/tema',          label: 'Tema Rápido',        icon: PaintBrushIcon },
  { href: '/admin/css',                  label: 'CSS personalizado',  icon: PaintBrushIcon },
]

export default async function ConfigLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/')

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

      {/* Menú lateral */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '0.75rem',
        position: 'sticky',
        top: '90px',
      }}>
        <p style={{
          fontSize: '0.65rem',
          fontFamily: 'var(--font-cinzel)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          padding: '0.25rem 0.5rem',
          marginBottom: '0.25rem',
        }}>
          Configuración
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-cinzel)',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                border: '1px solid transparent',
                transition: 'all 0.15s',
              }}
              className="config-nav-link"
            >
              <item.icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
            }}
          >
            ← Volver al panel
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>

      <style>{`
        .config-nav-link:hover {
          color: var(--text-primary) !important;
          border-color: var(--border-medium) !important;
          background: var(--bg-elevated) !important;
        }
      `}</style>
    </div>
  )
}