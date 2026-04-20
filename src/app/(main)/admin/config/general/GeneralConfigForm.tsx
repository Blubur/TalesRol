'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

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

const wideInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.4rem 0.6rem',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-medium)',
  borderRadius: '4px',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  boxSizing: 'border-box' as const,
  marginTop: '0.5rem',
}

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-cinzel)',
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: 'var(--color-crimson)',
  margin: '0.5rem 0 0',
}

function ConfigCard({ title, description, children, fullWidth = false }: {
  title: string
  description: string
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: fullWidth ? 'flex-start' : 'center',
      flexDirection: fullWidth ? 'column' : 'row',
      justifyContent: 'space-between',
      gap: '0.75rem',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '6px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{ flex: 1 }}>
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={sectionLabelStyle}>{children}</p>
}

export default function GeneralConfigForm({ config }: { config: Record<string, string> }) {
  const [values, setValues] = useState({
    registration_open:        config.registration_open        ?? 'true',
    invite_only:              config.invite_only              ?? 'false',
    invite_code:              config.invite_code              ?? '',
    dice_enabled:             config.dice_enabled             ?? 'true',
    max_rooms_per_user:       config.max_rooms_per_user       ?? '10',
    max_rooms_joined:         config.max_rooms_joined         ?? '20',
    min_post_length:          config.min_post_length          ?? '10',
    min_post_message:         config.min_post_message         ?? 'Tu post es demasiado corto. Escribe al menos {min} caracteres.',
    max_post_length:          config.max_post_length          ?? '10000',
    max_reports_auto_block:   config.max_reports_auto_block   ?? '5',
    messages_enabled:         config.messages_enabled         ?? 'true',
    wiki_enabled:             config.wiki_enabled             ?? 'true',
    calendar_enabled:         config.calendar_enabled         ?? 'true',
    sheets_enabled:           config.sheets_enabled           ?? 'true',
    badges_enabled:           config.badges_enabled           ?? 'true',
  })

  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  function toggle(key: keyof typeof values) {
    setValues(v => ({ ...v, [key]: v[key] === 'true' ? 'false' : 'true' }))
  }

  function set(key: keyof typeof values, val: string) {
    setValues(v => ({ ...v, [key]: val }))
  }

  async function handleSave() {
    setSaving(true); setMsg(null)
    const res = await saveConfig(values)
    setSaving(false)
    setMsg(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Ajustes guardados.' }
    )
  }

  const inviteOnly = values.invite_only === 'true'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <SectionTitle>Registro</SectionTitle>

      <ConfigCard title="Registro abierto" description="Permite que nuevos usuarios se registren en la plataforma.">
        <Toggle active={values.registration_open === 'true'} onToggle={() => toggle('registration_open')} />
      </ConfigCard>

      <ConfigCard
        title="Modo invitación"
        description="Solo pueden registrarse usuarios que tengan el código de invitación."
        fullWidth={inviteOnly}
      >
        <Toggle active={inviteOnly} onToggle={() => toggle('invite_only')} />
        {inviteOnly && (
          <input
            type="text"
            value={values.invite_code}
            onChange={e => set('invite_code', e.target.value)}
            placeholder="Código de invitación…"
            style={wideInputStyle}
          />
        )}
      </ConfigCard>

      <SectionTitle>Contenido</SectionTitle>

      <ConfigCard title="Dados habilitados" description="Permite el uso del lanzador de dados en las salas.">
        <Toggle active={values.dice_enabled === 'true'} onToggle={() => toggle('dice_enabled')} />
      </ConfigCard>

      <ConfigCard title="Máximo de salas por usuario" description="Salas que un usuario puede crear (0 = sin límite).">
        <input type="number" min={0} value={values.max_rooms_per_user}
          onChange={e => set('max_rooms_per_user', e.target.value)} style={inputStyle} />
      </ConfigCard>

      <ConfigCard title="Máximo de salas por participante" description="Salas en las que un usuario puede participar, no crear (0 = sin límite).">
        <input type="number" min={0} value={values.max_rooms_joined}
          onChange={e => set('max_rooms_joined', e.target.value)} style={inputStyle} />
      </ConfigCard>

      <ConfigCard
        title="Longitud mínima de posts"
        description="Número mínimo de caracteres por post. Usa {min} en el mensaje para insertar el número."
        fullWidth
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
          <input type="number" min={0} value={values.min_post_length}
            onChange={e => set('min_post_length', e.target.value)}
            style={{ ...inputStyle, marginTop: 0 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>caracteres mínimos</span>
        </div>
        <input
          type="text"
          value={values.min_post_message}
          onChange={e => set('min_post_message', e.target.value)}
          placeholder="Mensaje de aviso al usuario…"
          style={wideInputStyle}
        />
      </ConfigCard>

      <ConfigCard title="Longitud máxima de posts" description="Número máximo de caracteres por post (0 = sin límite).">
        <input type="number" min={0} value={values.max_post_length}
          onChange={e => set('max_post_length', e.target.value)} style={inputStyle} />
      </ConfigCard>

      <SectionTitle>Moderación automática</SectionTitle>

      <ConfigCard
        title="Reportes para bloqueo automático"
        description="Número de reportes que recibe un post antes de bloquearse automáticamente (0 = desactivado)."
      >
        <input type="number" min={0} value={values.max_reports_auto_block}
          onChange={e => set('max_reports_auto_block', e.target.value)} style={inputStyle} />
      </ConfigCard>

      <SectionTitle>Funcionalidades</SectionTitle>

      <ConfigCard title="Mensajes privados" description="Habilita el sistema de mensajería privada entre usuarios.">
        <Toggle active={values.messages_enabled === 'true'} onToggle={() => toggle('messages_enabled')} />
      </ConfigCard>

      <ConfigCard title="Wiki en salas" description="Permite a las salas tener su propia wiki.">
        <Toggle active={values.wiki_enabled === 'true'} onToggle={() => toggle('wiki_enabled')} />
      </ConfigCard>

      <ConfigCard title="Calendario en salas" description="Permite a las salas tener calendario de sesiones.">
        <Toggle active={values.calendar_enabled === 'true'} onToggle={() => toggle('calendar_enabled')} />
      </ConfigCard>

      <ConfigCard title="Fichas de personaje en salas" description="Permite el uso de fichas de personaje dentro de las salas.">
        <Toggle active={values.sheets_enabled === 'true'} onToggle={() => toggle('sheets_enabled')} />
      </ConfigCard>

      <ConfigCard title="Insignias" description="Habilita el sistema de insignias y logros.">
        <Toggle active={values.badges_enabled === 'true'} onToggle={() => toggle('badges_enabled')} />
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
