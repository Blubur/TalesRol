'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

const PRESETS = [
  { label: 'Rojo',    bg: '#e63946', text: '#ffffff' },
  { label: 'Naranja', bg: '#f4a261', text: '#1a1a1a' },
  { label: 'Azul',    bg: '#457b9d', text: '#ffffff' },
  { label: 'Verde',   bg: '#2a9d8f', text: '#ffffff' },
  { label: 'Oscuro',  bg: '#1d1d2e', text: '#e0e0e0' },
]

export default function BannerForm({ config }: { config: Record<string, string> }) {
  const [enabled,   setEnabled]   = useState(config.banner_enabled    === 'true')
  const [message,   setMessage]   = useState(config.banner_message    ?? '')
  const [bgColor,   setBgColor]   = useState(config.banner_color      ?? '#e63946')
  const [textColor, setTextColor] = useState(config.banner_text_color ?? '#ffffff')
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    const res = await saveConfig({
      banner_enabled:    enabled ? 'true' : 'false',
      banner_message:    message,
      banner_color:      bgColor,
      banner_text_color: textColor,
    })
    setSaving(false)
    setMsg(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Banner guardado.' }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Preview */}
      <div style={{
        background: bgColor,
        color: textColor,
        padding: '0.6rem 1rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        textAlign: 'center',
        opacity: enabled ? 1 : 0.4,
        transition: 'opacity 0.2s',
        minHeight: '36px',
      }}>
        {message || 'Escribe un mensaje para ver la previsualización…'}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Banner activo</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Muestra el banner en todas las páginas del sitio.
            </p>
          </div>
          <button
            onClick={() => setEnabled(e => !e)}
            style={{
              flexShrink: 0,
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: enabled ? 'var(--color-crimson, #e63946)' : 'var(--border-medium, #555)',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <span style={{
              position: 'absolute',
              top: '3px',
              left: enabled ? '23px' : '3px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
            }} />
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Mensaje</p>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Ej: Mañana habrá mantenimiento a las 22:00h"
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={cardStyle}>
        <p style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>Color</p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {PRESETS.map(p => (
            <button
              key={p.bg}
              onClick={() => { setBgColor(p.bg); setTextColor(p.text) }}
              title={p.label}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: p.bg,
                border: bgColor === p.bg ? '3px solid var(--text-primary)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Fondo
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
              style={{ width: '36px', height: '28px', border: 'none', background: 'none', cursor: 'pointer' }} />
          </label>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Texto
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
              style={{ width: '36px', height: '28px', border: 'none', background: 'none', cursor: 'pointer' }} />
          </label>
        </div>
      </div>

      {msg && (
        <p style={{ color: msg.ok ? 'var(--color-success, green)' : '#ff6b6b', fontSize: '0.85rem' }}>
          {msg.text}
        </p>
      )}

      <div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? 'Guardando…' : 'Guardar banner'}
        </button>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  padding: '1rem 1.25rem',
}