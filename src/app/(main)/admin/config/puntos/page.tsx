import { getLevels, getBadges, getPointsPerPost } from './puntosactions'
import PuntosClient from './PuntosClient'

export const metadata = { title: 'Puntos, niveles e insignias' }

export default async function PuntosPage() {
  const [pointsPerPost, levels, badges] = await Promise.all([
    getPointsPerPost(),
    getLevels(),
    getBadges(),
  ])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Puntos, niveles e insignias
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Configura el sistema de progresión de la plataforma.
        </p>
      </div>
      <PuntosClient
        pointsPerPost={pointsPerPost}
        levels={levels}
        badges={badges}
      />
    </div>
  )
}