'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

export default function MantenimientoForm({ config }: { config: Record<string, string> }) {
  const [enabled, setEnabled]   = useState(config.maintenance_mode    === 'true')
  const [message, setMessage]   = useState(config.maintenance_message ?? 'Estamos realizando tareas de mantenimiento. Volvemos pronto.')
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    const res = await saveConfig({
      maintenance_mode:    enabled ? 'true' : 'false',
      maintenance_message: message,
    })
    setSaving(false)
    setMsg(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Configuración guardada.' }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {enabled && (
        <div style={{
          background: 'rgba(255,107,107,0.1)',
          border: '1px solid rgba(255,107,107,0.4)',
          borderRadius: '6px',
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
          color: '#ff6b6b',
        }}>
          ⚠ El modo mantenimiento está activo. Los usuarios no pueden acceder a la plataforma.
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Modo mantenimiento</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Actívalo para mostrar la pantalla de mantenimiento a todos los usuarios.
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
              background: enabled ? '#ff6b6b' : 'var(--border-medium, #555)',
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
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Mensaje de mantenimiento</p>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Texto que verán los usuarios en la pantalla de mantenimiento.
        </p>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '0.6rem',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {msg && (
        <p style={{ color: msg.ok ? 'var(--color-success, green)' : '#ff6b6b', fontSize: '0.85rem' }}>
          {msg.text}
        </p>
      )}

      <div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? 'Guardando…' : 'Guardar configuración'}
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