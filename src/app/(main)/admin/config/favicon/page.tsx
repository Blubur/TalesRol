import { getAllConfig } from '../configactions'
import FaviconForm from './FaviconForm'

export const metadata = { title: 'Favicon' }

export default async function FaviconPage() {
  const config = await getAllConfig()
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Favicon
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Icono que aparece en la pestaña del navegador. Pega una URL pública de imagen (PNG, ICO o SVG).
        </p>
      </div>
      <FaviconForm config={config} />
    </div>
  )
}