'use client'

import { useState } from 'react'
import { savePointsPerPost, saveLevel, deleteLevel, saveBadge, deleteBadge } from './puntosactions'
import { CONDITION_OPTIONS } from './puntosConstants'

type Level = { id: number; name: string; min_points: number; icon: string }
type Badge = { id: string; name: string; description: string; icon_url: string | null; condition_key: string }

type Props = {
  pointsPerPost: number
  levels: Level[]
  badges: Badge[]
}

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  padding: '1rem 1.25rem',
}

const inputStyle: React.CSSProperties = {
  padding: '0.45rem 0.6rem',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-medium)',
  borderRadius: '4px',
  color: 'var(--text-primary)',
  fontSize: '0.85rem',
  width: '100%',
  boxSizing: 'border-box' as const,
}

function Msg({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null
  return (
    <p style={{ fontSize: '0.82rem', color: msg.ok ? 'var(--color-success, green)' : '#ff6b6b', margin: '0.5rem 0 0' }}>
      {msg.text}
    </p>
  )
}

// ─── SECCIÓN PUNTOS ──────────────────────────────────────────────────────────

function PuntosSection({ initial }: { initial: number }) {
  const [pts, setPts] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    const res = await savePointsPerPost(pts)
    setSaving(false)
    setMsg(res?.error ? { ok: false, text: res.error } : { ok: true, text: '✓ Guardado.' })
  }

  return (
    <div style={cardStyle}>
      <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>Puntos por post publicado</p>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Cada vez que un usuario publica un post gana esta cantidad de puntos.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input
          type="number" min={0} max={1000} value={pts}
          onChange={e => setPts(Number(e.target.value))}
          style={{ ...inputStyle, width: '100px', textAlign: 'right' }}
        />
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
      <Msg msg={msg} />
    </div>
  )
}

// ─── SECCIÓN NIVELES ─────────────────────────────────────────────────────────

function LevelRow({ level, onSaved, onDeleted }: {
  level: Level
  onSaved: (l: Level) => void
  onDeleted: (id: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(level.name)
  const [pts, setPts]         = useState(level.min_points)
  const [icon, setIcon]       = useState(level.icon)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    const res = await saveLevel({ id: level.id, name, min_points: pts, icon })
    setSaving(false)
    if (res?.error) { setMsg({ ok: false, text: res.error }); return }
    setMsg({ ok: true, text: '✓' })
    setEditing(false)
    onSaved({ ...level, name, min_points: pts, icon })
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar el nivel "${level.name}"?`)) return
    await deleteLevel(level.id)
    onDeleted(level.id)
  }

  if (!editing) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: '1.2rem', width: '28px', textAlign: 'center' }}>{level.icon}</span>
      <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{level.name}</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '80px', textAlign: 'right' }}>
        ≥ {level.min_points} pts
      </span>
      <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">Editar</button>
      <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.8rem' }}>
        Eliminar
      </button>
    </div>
  )

  return (
    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="🌱"
          style={{ ...inputStyle, width: '60px', textAlign: 'center', fontSize: '1.1rem' }} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre"
          style={{ ...inputStyle, flex: 1, minWidth: '120px' }} />
        <input type="number" min={0} value={pts} onChange={e => setPts(Number(e.target.value))}
          placeholder="Puntos mínimos"
          style={{ ...inputStyle, width: '120px', textAlign: 'right' }} />
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? '…' : 'Guardar'}
        </button>
        <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm">Cancelar</button>
      </div>
      <Msg msg={msg} />
    </div>
  )
}

function NewLevelRow({ onCreated }: { onCreated: (l: Level) => void }) {
  const [open, setOpen]   = useState(false)
  const [name, setName]   = useState('')
  const [pts, setPts]     = useState(0)
  const [icon, setIcon]   = useState('⭐')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]     = useState<{ ok: boolean; text: string } | null>(null)

  async function handleCreate() {
    if (!name.trim()) { setMsg({ ok: false, text: 'El nombre es obligatorio.' }); return }
    setSaving(true)
    const res = await saveLevel({ name, min_points: pts, icon })
    setSaving(false)
    if (res?.error) { setMsg({ ok: false, text: res.error }); return }
    setMsg(null)
    setName(''); setPts(0); setIcon('⭐')
    setOpen(false)
    // Recargar — el Server Component se revalida
    window.location.reload()
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
      + Nuevo nivel
    </button>
  )

  return (
    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '4px' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="🌱"
          style={{ ...inputStyle, width: '60px', textAlign: 'center', fontSize: '1.1rem' }} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del nivel"
          style={{ ...inputStyle, flex: 1, minWidth: '120px' }} />
        <input type="number" min={0} value={pts} onChange={e => setPts(Number(e.target.value))}
          placeholder="Puntos mínimos"
          style={{ ...inputStyle, width: '120px', textAlign: 'right' }} />
        <button onClick={handleCreate} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? '…' : 'Crear'}
        </button>
        <button onClick={() => setOpen(false)} className="btn btn-secondary btn-sm">Cancelar</button>
      </div>
      <Msg msg={msg} />
    </div>
  )
}

function NivelesSection({ initial }: { initial: Level[] }) {
  const [levels, setLevels] = useState(initial)

  return (
    <div style={cardStyle}>
      <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>Niveles</p>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Los usuarios suben de nivel al acumular puntos. Ordena por puntos mínimos.
      </p>
      {levels.length === 0 && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay niveles definidos.</p>
      )}
      {levels.map(l => (
        <LevelRow
          key={l.id} level={l}
          onSaved={updated => setLevels(prev => prev.map(x => x.id === updated.id ? updated : x))}
          onDeleted={id => setLevels(prev => prev.filter(x => x.id !== id))}
        />
      ))}
      <NewLevelRow onCreated={l => setLevels(prev => [...prev, l])} />
    </div>
  )
}

// ─── SECCIÓN BADGES ──────────────────────────────────────────────────────────

function BadgeRow({ badge, onSaved, onDeleted }: {
  badge: Badge
  onSaved: (b: Badge) => void
  onDeleted: (id: string) => void
}) {
  const [editing, setEditing]     = useState(false)
  const [name, setName]           = useState(badge.name)
  const [desc, setDesc]           = useState(badge.description ?? '')
  const [icon, setIcon]           = useState(badge.icon_url ?? '')
  const [condition, setCondition] = useState(badge.condition_key)
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState<{ ok: boolean; text: string } | null>(null)

  const condLabel = CONDITION_OPTIONS.find(o => o.key === badge.condition_key)?.label ?? badge.condition_key

  async function handleSave() {
    setSaving(true)
    const res = await saveBadge({ id: badge.id, name, description: desc, icon_url: icon, condition_key: condition })
    setSaving(false)
    if (res?.error) { setMsg({ ok: false, text: res.error }); return }
    setEditing(false)
    onSaved({ ...badge, name, description: desc, icon_url: icon || null, condition_key: condition })
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar la insignia "${badge.name}"?`)) return
    await deleteBadge(badge.id)
    onDeleted(badge.id)
  }

  if (!editing) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: '1.2rem', width: '28px', textAlign: 'center' }}>{badge.icon_url || '🏅'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>{badge.name}</p>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{condLabel}</p>
      </div>
      <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">Editar</button>
      <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.8rem' }}>
        Eliminar
      </button>
    </div>
  )

  return (
    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="🏅 emoji o URL"
          style={{ ...inputStyle, width: '120px' }} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre"
          style={{ ...inputStyle, flex: 1, minWidth: '120px' }} />
      </div>
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción"
        style={inputStyle} />
      <select value={condition} onChange={e => setCondition(e.target.value)} style={inputStyle}>
        {CONDITION_OPTIONS.map(o => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? '…' : 'Guardar'}
        </button>
        <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm">Cancelar</button>
      </div>
      <Msg msg={msg} />
    </div>
  )
}

function NewBadgeRow() {
  const [open, setOpen]           = useState(false)
  const [name, setName]           = useState('')
  const [desc, setDesc]           = useState('')
  const [icon, setIcon]           = useState('')
  const [condition, setCondition] = useState(CONDITION_OPTIONS[0].key)
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState<{ ok: boolean; text: string } | null>(null)

  async function handleCreate() {
    if (!name.trim()) { setMsg({ ok: false, text: 'El nombre es obligatorio.' }); return }
    setSaving(true)
    const res = await saveBadge({ name, description: desc, icon_url: icon, condition_key: condition })
    setSaving(false)
    if (res?.error) { setMsg({ ok: false, text: res.error }); return }
    window.location.reload()
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
      + Nueva insignia
    </button>
  )

  return (
    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="🏅 emoji o URL"
          style={{ ...inputStyle, width: '120px' }} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la insignia"
          style={{ ...inputStyle, flex: 1, minWidth: '120px' }} />
      </div>
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción"
        style={inputStyle} />
      <select value={condition} onChange={e => setCondition(e.target.value)} style={inputStyle}>
        {CONDITION_OPTIONS.map(o => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleCreate} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? '…' : 'Crear insignia'}
        </button>
        <button onClick={() => setOpen(false)} className="btn btn-secondary btn-sm">Cancelar</button>
      </div>
      <Msg msg={msg} />
    </div>
  )
}

function BadgesSection({ initial }: { initial: Badge[] }) {
  const [badges, setBadges] = useState(initial)

  return (
    <div style={cardStyle}>
      <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>Insignias automáticas</p>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Se conceden automáticamente cuando el usuario cumple la condición al publicar un post.
      </p>
      {badges.length === 0 && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay insignias definidas.</p>
      )}
      {badges.map(b => (
        <BadgeRow
          key={b.id} badge={b}
          onSaved={updated => setBadges(prev => prev.map(x => x.id === updated.id ? updated : x))}
          onDeleted={id => setBadges(prev => prev.filter(x => x.id !== id))}
        />
      ))}
      <NewBadgeRow />
    </div>
  )
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function PuntosClient({ pointsPerPost, levels, badges }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PuntosSection initial={pointsPerPost} />
      <NivelesSection initial={levels} />
      <BadgesSection initial={badges} />
    </div>
  )
}