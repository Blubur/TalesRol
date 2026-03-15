import type { Metadata } from 'next'
import '@/app/globals.css'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: { template: '%s | TalesRol', default: 'TalesRol — Plataforma de Roleplay' },
  description: 'Una plataforma de roleplay escrito. Crea personajes, únete a salas y vive tus historias.',
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          {children}
        </main>
      </div>
      <Footer />

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