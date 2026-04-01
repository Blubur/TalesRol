import { getAllConfig } from '../configactions'
import MantenimientoForm from './MantenimientoForm'

export const metadata = { title: 'Modo mantenimiento' }

export default async function MantenimientoPage() {
  const config = await getAllConfig()
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Modo mantenimiento
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Cuando está activo, los usuarios ven una pantalla de mantenimiento. Los admins pueden seguir accediendo con normalidad.
        </p>
      </div>
      <MantenimientoForm config={config} />
    </div>
  )
}