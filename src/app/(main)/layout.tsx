import type { Metadata } from 'next'
import '@/app/globals.css'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: { template: '%s | TalesRol', default: 'TalesRol — Plataforma de Roleplay' },
  description: 'Una plataforma de roleplay escrito. Crea personajes, únete a salas y vive tus historias.',
}

async function getSiteConfig(): Promise<Record<string, string>> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase.from('site_config').select('key, value')
    return Object.fromEntries(
      (data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
    )
  } catch {
    return {}
  }
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig()

  const siteName   = config.site_name   || 'TalesRol'
  const footerText = config.site_footer || `© ${new Date().getFullYear()} — Plataforma de Roleplay`

  return (
    <div className="app-shell">
      <Navbar siteName={siteName} />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          {children}
        </main>
      </div>
      <Footer footerText={footerText} />

      <style>{`
        .app-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .app-body {
          display: flex;
          flex: 1;
        }
        .app-main {
          flex: 1;
          min-width: 0;
          padding: 1.5rem;
          max-width: 100%;
        }
        @media (max-width: 768px) {
          .app-main { padding: 1rem; }
        }
      `}</style>
    </div>
  )
}