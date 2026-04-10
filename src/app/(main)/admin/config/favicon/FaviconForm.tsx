'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

export default function FaviconForm({ config }: { config: Record<string, string> }) {
  const [url, setUrl]       = useState(config.favicon_url ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSave() {
    setSaving(true); setMsg(null)
    const res = await saveConfig({ favicon_url: url.trim() })
    setSaving(false)
    setMsg(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Favicon guardado. Se aplicará en la próxima carga de página.' }
    )
  }

  async function handleClear() {
    setUrl('')
    setSaving(true); setMsg(null)
    const res = await saveConfig({ favicon_url: '' })
    setSaving(false)
    setMsg(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Favicon eliminado. Se usará el favicon por defecto.' }
    )
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '6px',
    padding: '1rem 1.25rem',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-medium)',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Preview */}
      <div style={cardStyle}>
        <p style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>Vista previa</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px', height: '48px',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-elevated)',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {url ? (
              <img
                src={url}
                alt="favicon preview"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <span style={{ fontSize: '1.2rem' }}>🌐</span>
            )}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {url ? 'Favicon personalizado activo' : 'Usando favicon por defecto'}
            </p>
            {url && (
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                {url}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Input URL */}
      <div style={cardStyle}>
        <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>URL del favicon</p>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Debe ser una URL pública accesible. Formatos recomendados: PNG (32×32 o 64×64), ICO o SVG.
        </p>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://ejemplo.com/mi-favicon.png"
          style={inputStyle}
        />
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Puedes subir una imagen a <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-crimson)' }}>imgur.com</a> u otro servicio y pegar la URL directa aquí.
        </p>
      </div>

      {msg && (
        <p style={{ color: msg.ok ? 'var(--color-success, green)' : '#ff6b6b', fontSize: '0.85rem' }}>
          {msg.text}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? 'Guardando…' : 'Guardar favicon'}
        </button>
        {url && (
          <button onClick={handleClear} disabled={saving} className="btn btn-secondary btn-sm">
            Restaurar por defecto
          </button>
        )}
      </div>
    </div>
  )
}