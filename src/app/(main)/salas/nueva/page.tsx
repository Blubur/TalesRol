'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createRoom } from '../actions'

export default function NuevaSalaPage() {
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cover, setCover]     = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createRoom(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="sala-form-page">
      <div className="sala-form-header animate-enter">
        <Link href="/salas" className="sala-form-back">← Volver a Salas</Link>
        <h1 className="sala-form-title">Nueva Sala de Rol</h1>
      </div>

      <form action={handleSubmit} className="sala-form animate-enter border-ornament" style={{ animationDelay: '0.1s' }}>

        {/* Cover preview */}
        {cover && (
          <div className="sala-cover-preview">
            <img src={cover} alt="Cover" />
            <div className="sala-cover-overlay" />
            <span className="sala-cover-label">Vista previa del banner</span>
          </div>
        )}

        <div className="sala-form-grid">
          {/* Título */}
          <div className="form-group full">
            <label htmlFor="title">Título de la Sala *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Ej: Las Crónicas de Valdris"
              className="input-base"
              required
              maxLength={80}
              autoFocus
            />
            <span className="field-hint">El slug (URL) se generará automáticamente desde el título</span>
          </div>

          {/* Descripción */}
          <div className="form-group full">
            <label htmlFor="description">Descripción <span className="optional">(opcional)</span></label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe el mundo, la ambientación, el tipo de rol..."
              className="input-base sala-textarea"
              maxLength={1000}
              rows={5}
            />
          </div>

          {/* Cover URL */}
          <div className="form-group full">
            <label htmlFor="cover_url">URL del Banner <span className="optional">(opcional)</span></label>
            <input
              id="cover_url"
              name="cover_url"
              type="url"
              placeholder="https://ejemplo.com/banner.jpg"
              className="input-base"
              value={cover}
              onChange={e => setCover(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="form-group full">
            <label htmlFor="tags">Etiquetas / Content Warnings <span className="optional">(opcional)</span></label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="Ej: Fantasía, TW: Violencia, Adultos"
              className="input-base"
              maxLength={200}
            />
            <span className="field-hint">Separa las etiquetas con comas</span>
          </div>
        </div>

        {error && (
          <div className="auth-error"><span>⚠</span> {error}</div>
        )}

        <div className="sala-form-actions">
          <Link href="/salas" className="btn-ghost">Cancelar</Link>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Creando...</> : 'Crear Sala'}
          </button>
        </div>
      </form>

      <style>{`
        .sala-form-page { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .sala-form-header { display: flex; align-items: center; gap: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle); position: relative; }
        .sala-form-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 60px; height: 2px; background: var(--color-crimson); }
        .sala-form-back { color: var(--text-muted); font-family: var(--font-cinzel); font-size: 0.78rem; letter-spacing: 0.06em; text-decoration: none; transition: color 0.2s; white-space: nowrap; }
        .sala-form-back:hover { color: var(--color-crimson); }
        .sala-form-title { font-family: var(--font-cinzel); font-size: 1.6rem; font-weight: 700; margin: 0; }
        .sala-form { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; overflow: hidden; }
        .sala-cover-preview { height: 160px; border-radius: 4px; overflow: hidden; position: relative; }
        .sala-cover-preview img { width: 100%; height: 100%; object-fit: cover; }
        .sala-cover-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.7)); }
        .sala-cover-label { position: absolute; bottom: 0.75rem; left: 1rem; font-family: var(--font-cinzel); font-size: 0.7rem; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; text-transform: uppercase; }
        .sala-form-grid { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group.full { width: 100%; }
        .form-group label { font-family: var(--font-cinzel); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); }
        .optional { text-transform: none; font-weight: 400; color: var(--text-muted); font-family: var(--font-crimson-pro); letter-spacing: 0; font-size: 0.8rem; }
        .field-hint { font-size: 0.78rem; color: var(--text-muted); }
        .sala-textarea { resize: vertical; min-height: 120px; font-family: var(--font-crimson-pro); font-size: 1rem; }
        .auth-error { background: rgba(193,6,6,0.12); border: 1px solid rgba(193,6,6,0.3); border-radius: 4px; padding: 0.65rem 1rem; color: #ff6b6b; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; }
        .sala-form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}