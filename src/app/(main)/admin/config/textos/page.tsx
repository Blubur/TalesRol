import { getAllConfig } from '../configactions'
import TextosForm from './TextosForm'

export const metadata = { title: 'Textos del sitio' }

export default async function TextosPage() {
  const config = await getAllConfig()
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Textos del sitio
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Nombre, descripción y textos visibles en la plataforma.
        </p>
      </div>
      <TextosForm config={config} />
    </div>
  )
}