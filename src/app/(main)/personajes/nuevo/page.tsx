'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCharacter } from '../actions'

export default function NuevoPersonajePage() {
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar]   = useState('')
  const [sheetFields, setSheetFields] = useState<{ key: string; value: string }[]>([
    { key: 'Raza', value: '' },
    { key: 'Clase', value: '' },
    { key: 'Edad', value: '' },
  ])
  const router = useRouter()

  function addField() {
    setSheetFields(prev => [...prev, { key: '', value: '' }])
  }

  function removeField(i: number) {
    setSheetFields(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateField(i: number, k: 'key' | 'value', val: string) {
    setSheetFields(prev => prev.map((f, idx) => idx === i ? { ...f, [k]: val } : f))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    sheetFields.forEach(f => {
      formData.append('sheet_key', f.key)
      formData.append('sheet_value', f.value)
    })
    const result = await createCharacter(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const previewAvatar = avatar || `https://api.dicebear.com/7.x/gothic/svg?seed=${Date.now()}`

  return (
    <div className="char-form-page">
      {/* Cabecera */}
      <div className="char-form-header animate-enter">
        <Link href="/personajes" className="char-form-back">← Volver</Link>
        <h1 className="char-form-title">Nuevo Personaje</h1>
      </div>

      <form action={handleSubmit} className="char-form animate-enter" style={{ animationDelay: '0.1s' }}>
        <div className="char-form-layout">

          {/* Columna izquierda — Avatar */}
          <div className="char-form-left">
            <div className="char-avatar-preview">
              <img src={previewAvatar} alt="Avatar" className="char-avatar-img" />
              <span className="char-avatar-label">Vista previa</span>
            </div>

            <div className="form-group">
              <label>URL del Avatar <span className="optional">(opcional)</span></label>
              <input
                name="avatar_url"
                type="url"
                placeholder="https://ejemplo.com/imagen.png"
                className="input-base"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
              />
              <span className="field-hint">Si no pones imagen, se generará una automáticamente</span>
            </div>
          </div>

          {/* Columna derecha — Datos */}
          <div className="char-form-right">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="name">Nombre del Personaje *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ej: Lyra Ashveil"
                className="input-base"
                required
                maxLength={60}
                autoFocus
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="description">Descripción <span className="optional">(opcional)</span></label>
              <textarea
                id="description"
                name="description"
                placeholder="Breve descripción del personaje, su apariencia o personalidad..."
                className="input-base char-textarea"
                maxLength={500}
                rows={4}
              />
            </div>

            {/* Ficha */}
            <div className="form-group">
              <div className="char-sheet-header">
                <label>Ficha del Personaje <span className="optional">(opcional)</span></label>
                <button type="button" className="btn-ghost char-add-field" onClick={addField}>
                  + Campo
                </button>
              </div>
              <div className="char-sheet-fields">
                {sheetFields.map((field, i) => (
                  <div key={i} className="char-sheet-field">
                    <input
                      type="text"
                      placeholder="Campo (ej: Raza)"
                      className="input-base"
                      value={field.key}
                      onChange={e => updateField(i, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Valor"
                      className="input-base"
                      value={field.value}
                      onChange={e => updateField(i, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="char-remove-field"
                      onClick={() => removeField(i)}
                      title="Eliminar campo"
                    >✕</button>
                  </div>
                ))}
                {sheetFields.length === 0 && (
                  <p className="char-sheet-empty">No hay campos. Pulsa "+ Campo" para añadir.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="char-form-actions">
          <Link href="/personajes" className="btn-ghost">Cancelar</Link>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Creando...</> : 'Crear Personaje'}
          </button>
        </div>
      </form>

      <style>{`
        .char-form-page {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .char-form-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          position: relative;
        }
        .char-form-header::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 60px; height: 2px;
          background: var(--color-crimson);
        }
        .char-form-back {
          color: var(--text-muted);
          font-family: var(--font-cinzel);
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          text-decoration: none;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .char-form-back:hover { color: var(--color-crimson); }
        .char-form-title {
          font-family: var(--font-cinzel);
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0;
        }
        .char-form {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .char-form::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, var(--color-crimson), transparent);
        }
        .char-form-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
        }
        .char-form-left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        .char-avatar-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .char-avatar-img {
          width: 120px; height: 120px;
          border-radius: 50%;
          border: 3px solid var(--border-medium);
          object-fit: cover;
          background: var(--bg-secondary);
        }
        .char-avatar-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-family: var(--font-cinzel);
          letter-spacing: 0.06em;
        }
        .char-form-right {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-family: var(--font-cinzel);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .optional {
          text-transform: none;
          font-weight: 400;
          color: var(--text-muted);
          font-family: var(--font-crimson-pro);
          letter-spacing: 0;
          font-size: 0.8rem;
        }
        .field-hint {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .char-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: var(--font-crimson-pro);
          font-size: 1rem;
        }
        .char-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .char-sheet-header label { margin: 0; }
        .char-add-field {
          padding: 0.25rem 0.75rem;
          font-size: 0.72rem;
        }
        .char-sheet-fields {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: var(--bg-secondary);
          border-radius: 4px;
          padding: 0.75rem;
        }
        .char-sheet-field {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 0.5rem;
          align-items: center;
        }
        .char-remove-field {
          background: transparent;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          color: var(--text-muted);
          width: 28px; height: 28px;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .char-remove-field:hover {
          border-color: var(--color-crimson);
          color: var(--color-crimson);
          background: rgba(193,6,6,0.08);
        }
        .char-sheet-empty {
          color: var(--text-muted);
          font-size: 0.82rem;
          text-align: center;
          margin: 0.5rem 0;
        }
        .auth-error {
          background: rgba(193,6,6,0.12);
          border: 1px solid rgba(193,6,6,0.3);
          border-radius: 4px;
          padding: 0.65rem 1rem;
          color: #ff6b6b;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .char-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .char-form-layout { grid-template-columns: 1fr; }
          .char-form-left { flex-direction: row; align-items: flex-start; }
          .char-avatar-img { width: 80px; height: 80px; }
          .char-sheet-field { grid-template-columns: 1fr 1fr auto; }
        }
      `}</style>
    </div>
  )
}