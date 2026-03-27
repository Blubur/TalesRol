'use client'

import { useState } from 'react'
import { saveCustomCss } from './cssactions'

type Version = {
  id: number
  css: string
  saved_at: string
}

type Props = {
  initialCss: string
  versions: Version[]
}

export default function AdminCssEditor({ initialCss, versions }: Props) {
  const [css, setCss] = useState(initialCss)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [showVersions, setShowVersions] = useState(false)

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    const res = await saveCustomCss(css)
    setSaving(false)
    if (res?.error) {
      setMsg({ ok: false, text: res.error })
    } else {
      setMsg({ ok: true, text: '✓ CSS guardado y aplicado en toda la plataforma.' })
    }
  }

  function handleRestore(versionCss: string) {
    setCss(versionCss)
    setShowVersions(false)
    setMsg({ ok: true, text: 'Versión restaurada en el editor. Guarda para aplicarla.' })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>CSS personalizado</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="btn btn-secondary btn-sm"
          >
            {showVersions ? 'Ocultar historial' : `Historial (${versions.length})`}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm"
          >
            {saving ? 'Guardando…' : 'Guardar y aplicar'}
          </button>
        </div>
      </div>

      {msg && (
        <p style={{ color: msg.ok ? 'var(--color-success, green)' : 'var(--color-danger, red)', marginBottom: '0.5rem' }}>
          {msg.text}
        </p>
      )}

      <textarea
        value={css}
        onChange={(e) => setCss(e.target.value)}
        spellCheck={false}
        style={{
          width: '100%',
          minHeight: '420px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid var(--border-color, #ccc)',
          background: 'var(--code-bg, #1e1e1e)',
          color: 'var(--code-fg, #d4d4d4)',
          resize: 'vertical',
          lineHeight: 1.6,
        }}
        placeholder={`/* Escribe aquí tu CSS personalizado */\n\nbody {\n  font-family: 'Georgia', serif;\n}\n\n.navbar {\n  background: #1a1a2e;\n}`}
      />

      {showVersions && versions.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Versiones anteriores</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {versions.map((v) => (
              <div
                key={v.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border-color, #ccc)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                }}
              >
                <span>
                  {new Date(v.saved_at).toLocaleString('es-ES', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                  {' — '}
                  <span style={{ color: 'var(--text-muted, #888)' }}>
                    {v.css.length} caracteres
                  </span>
                </span>
                <button
                  onClick={() => handleRestore(v.css)}
                  className="btn btn-secondary btn-sm"
                >
                  Restaurar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showVersions && versions.length === 0 && (
        <p style={{ marginTop: '0.75rem', color: 'var(--text-muted, #888)' }}>
          Aún no hay versiones guardadas.
        </p>
      )}
    </div>
  )
}