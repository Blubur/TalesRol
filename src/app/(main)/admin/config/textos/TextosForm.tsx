'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

export default function TextosForm({ config }: { config: Record<string, string> }) {
  const [values, setValues] = useState({
    site_name:        config.site_name        ?? 'TalesRol',
    site_description: config.site_description ?? 'Una plataforma de roleplay escrito.',
    site_footer:      config.site_footer      ?? '© 2026 — Plataforma de Roleplay',
    welcome_message:  config.welcome_message  ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  function set(key: keyof typeof values, val: string) {
    setValues(v => ({ ...v, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    const res = await saveConfig(values)
    setSaving(false)
    setMsg(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Textos guardados.' }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {[
        { key: 'site_name',        label: 'Nombre del sitio',      desc: 'Aparece en el título de las páginas y la navbar.', multiline: false },
        { key: 'site_description', label: 'Descripción',           desc: 'Meta descripción usada en SEO y redes sociales.', multiline: false },
        { key: 'site_footer',      label: 'Texto del footer',      desc: 'Línea de copyright en el pie de página.', multiline: false },
        { key: 'welcome_message',  label: 'Mensaje de bienvenida', desc: 'Texto visible en la página de inicio para todos los usuarios.', multiline: true },
      ].map(({ key, label, desc, multiline }) => (
        <div key={key} style={cardStyle}>
          <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>{label}</p>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</p>
          {multiline ? (
            <textarea
              value={values[key as keyof typeof values]}
              onChange={e => set(key as keyof typeof values, e.target.value)}
              rows={3}
              style={textareaStyle}
            />
          ) : (
            <input
              type="text"
              value={values[key as keyof typeof values]}
              onChange={e => set(key as keyof typeof values, e.target.value)}
              style={inputStyle}
            />
          )}
        </div>
      ))}

      {msg && (
        <p style={{ color: msg.ok ? 'var(--color-success, green)' : '#ff6b6b', fontSize: '0.85rem' }}>
          {msg.text}
        </p>
      )}

      <div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? 'Guardando…' : 'Guardar textos'}
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
const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
}