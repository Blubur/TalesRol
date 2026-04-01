'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

export default function GeneralConfigForm({ config }: { config: Record<string, string> }) {
  const [values, setValues] = useState({
    registration_open:  config.registration_open  ?? 'true',
    max_rooms_per_user: config.max_rooms_per_user ?? '10',
    max_post_length:    config.max_post_length    ?? '10000',
    dice_enabled:       config.dice_enabled       ?? 'true',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function toggle(key: keyof typeof values) {
    setValues(v => ({ ...v, [key]: v[key] === 'true' ? 'false' : 'true' }))
  }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    const res = await saveConfig(values)
    setSaving(false)
    setMsg(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Ajustes guardados.' }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <ConfigCard
        title="Registro abierto"
        description="Permite que nuevos usuarios se registren en la plataforma."
      >
        <Toggle
          active={values.registration_open === 'true'}
          onToggle={() => toggle('registration_open')}
        />
      </ConfigCard>

      <ConfigCard
        title="Dados habilitados"
        description="Permite el uso del lanzador de dados en las salas."
      >
        <Toggle
          active={values.dice_enabled === 'true'}
          onToggle={() => toggle('dice_enabled')}
        />
      </ConfigCard>

      <ConfigCard
        title="Máximo de salas por usuario"
        description="Número máximo de salas que un usuario puede crear (0 = sin límite)."
      >
        <input
          type="number"
          min={0}
          value={values.max_rooms_per_user}
          onChange={e => setValues(v => ({ ...v, max_rooms_per_user: e.target.value }))}
          style={inputStyle}
        />
      </ConfigCard>

      <ConfigCard
        title="Longitud máxima de posts"
        description="Número máximo de caracteres por post (0 = sin límite)."
      >
        <input
          type="number"
          min={0}
          value={values.max_post_length}
          onChange={e => setValues(v => ({ ...v, max_post_length: e.target.value }))}
          style={inputStyle}
        />
      </ConfigCard>

      {msg && (
        <p style={{ color: msg.ok ? 'var(--color-success, green)' : 'var(--color-danger, #ff6b6b)', fontSize: '0.85rem' }}>
          {msg.text}
        </p>
      )}

      <div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? 'Guardando…' : 'Guardar ajustes'}
        </button>
      </div>
    </div>
  )
}

function ConfigCard({ title, description, children }: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '6px',
      padding: '1rem 1.25rem',
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{title}</p>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{description}</p>
      </div>
      {children}
    </div>
  )
}

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        flexShrink: 0,
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--color-crimson, #e63946)' : 'var(--border-medium, #555)',
        position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: active ? '23px' : '3px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100px',
  padding: '0.4rem 0.6rem',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-medium)',
  borderRadius: '4px',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  textAlign: 'right',
  flexShrink: 0,
}