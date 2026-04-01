import { getAllConfig } from '../configactions'
import BannerForm from './BannerForm'

export const metadata = { title: 'Banner de aviso' }

export default async function BannerPage() {
  const config = await getAllConfig()
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Banner de aviso global
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Barra fija visible en todas las páginas para comunicados urgentes.
        </p>
      </div>
      <BannerForm config={config} />
    </div>
  )
}