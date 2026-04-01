import { getAllConfig } from '../configactions'
import GeneralConfigForm from './GeneralConfigForm'

export const metadata = { title: 'Ajustes globales' }

export default async function GeneralConfigPage() {
  const config = await getAllConfig()
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Ajustes globales
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Configuración general de la plataforma.
        </p>
      </div>
      <GeneralConfigForm config={config} />
    </div>
  )
}