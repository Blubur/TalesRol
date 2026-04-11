'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

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
  boxSizing: 'border-box' as const,
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical' as const,
}

const ROLES = [
  { key: 'welcome_msg_admin',    label: 'Admin' },
  { key: 'welcome_msg_master',   label: 'Master' },
  { key: 'welcome_msg_director', label: 'Director' },
  { key: 'welcome_msg_jugador',  label: 'Jugador' },
  { key: 'welcome_msg_miembro',  label: 'Miembro' },
]

const SITE_FIELDS = [
  { key: 'site_name',        label: 'Nombre del sitio',      desc: 'Aparece en el título de las páginas y la navbar.',           multiline: false },
  { key: 'site_description', label: 'Descripción',           desc: 'Meta descripción usada en SEO y redes sociales.',           multiline: false },
  { key: 'site_footer',      label: 'Texto del footer',      desc: 'Línea de copyright en el pie de página.',                   multiline: false },
  { key: 'welcome_message',  label: 'Mensaje de bienvenida', desc: 'Texto visible en la página de inicio para todos.',          multiline: true },
]

export default function TextosForm({ config }: { config: Record<string, string> }) {
  const [siteValues, setSiteValues] = useState<Record<string, string>>(
    Object.fromEntries(SITE_FIELDS.map(f => [f.key, config[f.key] ?? '']))
  )
  const [roleValues, setRoleValues] = useState<Record<string, string>>(
    Object.fromEntries(ROLES.map(r => [r.key, config[r.key] ?? '']))
  )

  const [savingSite, setSavingSite] = useState(false)
  const [savingRoles, setSavingRoles] = useState(false)
  const [msgSite, setMsgSite]   = useState<{ ok: boolean; text: string } | null>(null)
  const [msgRoles, setMsgRoles] = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSaveSite() {
    setSavingSite(true); setMsgSite(null)
    const res = await saveConfig(siteValues)
    setSavingSite(false)
    setMsgSite(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Textos guardados.' }
    )
  }

  async function handleSaveRoles() {
    setSavingRoles(true); setMsgRoles(null)
    const res = await saveConfig(roleValues)
    setSavingRoles(false)
    setMsgRoles(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Mensajes de bienvenida guardados.' }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Textos generales ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-crimson)', margin: 0 }}>
          Textos generales
        </h2>

        {SITE_FIELDS.map(({ key, label, desc, multiline }) => (
          <div key={key} style={cardStyle}>
            <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>{label}</p>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</p>
            {multiline ? (
              <textarea
                value={siteValues[key] ?? ''}
                onChange={e => setSiteValues(v => ({ ...v, [key]: e.target.value }))}
                rows={3}
                style={textareaStyle}
              />
            ) : (
              <input
                type="text"
                value={siteValues[key] ?? ''}
                onChange={e => setSiteValues(v => ({ ...v, [key]: e.target.value }))}
                style={inputStyle}
              />
            )}
          </div>
        ))}

        {msgSite && (
          <p style={{ color: msgSite.ok ? 'var(--color-success, green)' : '#ff6b6b', fontSize: '0.85rem' }}>
            {msgSite.text}
          </p>
        )}
        <div>
          <button onClick={handleSaveSite} disabled={savingSite} className="btn btn-primary btn-sm">
            {savingSite ? 'Guardando…' : 'Guardar textos'}
          </button>
        </div>
      </div>

      {/* ── Mensajes de bienvenida por rol ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-crimson)', margin: '0 0 0.25rem' }}>
            Mensajes de bienvenida por rol
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Se envían como notificación al usuario en el momento del registro, según el rol que tenga asignado.
          </p>
        </div>

        {ROLES.map(({ key, label }) => (
          <div key={key} style={cardStyle}>
            <p style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>
              {label}
            </p>
            <textarea
              value={roleValues[key] ?? ''}
              onChange={e => setRoleValues(v => ({ ...v, [key]: e.target.value }))}
              rows={2}
              placeholder={`Mensaje de bienvenida para ${label}…`}
              style={textareaStyle}
            />
          </div>
        ))}

        {msgRoles && (
          <p style={{ color: msgRoles.ok ? 'var(--color-success, green)' : '#ff6b6b', fontSize: '0.85rem' }}>
            {msgRoles.text}
          </p>
        )}
        <div>
          <button onClick={handleSaveRoles} disabled={savingRoles} className="btn btn-primary btn-sm">
            {savingRoles ? 'Guardando…' : 'Guardar mensajes'}
          </button>
        </div>
      </div>

    </div>
  )
}