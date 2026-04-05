'use client'

import { useState, useCallback } from 'react'
import BadgeIcon from '@/components/BadgeIcon'
import {
  savePointsPerPost,
  saveLevel,
  deleteLevel,
  saveBadge,
  deleteBadge,
  assignBadgeToUser,
  revokeBadgeFromUser,
  searchUsersForBadge,
  getUserBadges,
} from './puntosactions'
import { CONDITION_OPTIONS } from './puntosConstants'

type Level    = { id: number; name: string; min_points: number; icon: string }
type Badge    = { id: string; name: string; description: string; icon_url: string | null; condition_key: string; is_manual: boolean }
type User     = { id: string; username: string; display_name: string | null; avatar_url: string | null }
type UserBadge = { badge_id: string; earned_at: string; badges: { id: string; name: string; icon_url: string | null; is_manual: boolean } | null }

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

const addBtnStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.4rem 0.9rem',
  background: 'transparent',
  border: '1px dashed var(--border-medium)',
  borderRadius: '4px',
  color: 'var(--text-muted)',
  fontSize: '0.8rem',
  fontFamily: 'var(--font-cinzel)',
  letterSpacing: '0.05em',
  cursor: 'pointer',
  transition: 'all 0.15s',
}

function Msg({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null
  return (
    <p style={{ fontSize: '0.82rem', color: msg.ok ? 'var(--color-success, green)' : '#ff6b6b', margin: '0.5rem 0 0' }}>
      {msg.text}
    </p>
  )
}

// ─── PUNTOS ──────────────────────────────────────────────────────────────────

function PuntosSection({ initial }: { initial: number }) {
  const [pts, setPts]       = useState(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSave() {
    setSaving(true); setMsg(null)
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
        <input type="number" min={0} max={1000} value={pts}
          onChange={e => setPts(Number(e.target.value))}
          style={{ ...inputStyle, width: '100px', textAlign: 'right' }} />
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
      <Msg msg={msg} />
    </div>
  )
}

// ─── NIVELES ─────────────────────────────────────────────────────────────────

function LevelRow({ level, onSaved, onDeleted }: {
  level: Level; onSaved: (l: Level) => void; onDeleted: (id: number) => void
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
      <BadgeIcon icon={level.icon} size={20} />
      <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{level.name}</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '80px', textAlign: 'right' }}>≥ {level.min_points} pts</span>
      <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">Editar</button>
      <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.8rem' }}>Eliminar</button>
    </div>
  )

  return (
    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="🌱 o ra-crown"
          style={{ ...inputStyle, width: '120px' }} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre"
          style={{ ...inputStyle, flex: 1, minWidth: '120px' }} />
        <input type="number" min={0} value={pts} onChange={e => setPts(Number(e.target.value))}
          style={{ ...inputStyle, width: '120px', textAlign: 'right' }} />
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">{saving ? '…' : 'Guardar'}</button>
        <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm">Cancelar</button>
      </div>
      <Msg msg={msg} />
    </div>
  )
}

function NewLevelRow({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen]     = useState(false)
  const [name, setName]     = useState('')
  const [pts, setPts]       = useState(0)
  const [icon, setIcon]     = useState('⭐')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  async function handleCreate() {
    if (!name.trim()) { setMsg({ ok: false, text: 'El nombre es obligatorio.' }); return }
    setSaving(true)
    const res = await saveLevel({ name, min_points: pts, icon })
    setSaving(false)
    if (res?.error) { setMsg({ ok: false, text: res.error }); return }
    setName(''); setPts(0); setIcon('⭐'); setOpen(false); setMsg(null)
    onCreated()
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={addBtnStyle}
      onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; (e.target as HTMLElement).style.borderColor = 'var(--border-medium)' }}
      onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; (e.target as HTMLElement).style.borderColor = 'var(--border-medium)' }}
    >
      + Nuevo nivel
    </button>
  )

  return (
    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '4px' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="🌱 o ra-crown"
          style={{ ...inputStyle, width: '120px' }} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del nivel"
          style={{ ...inputStyle, flex: 1, minWidth: '120px' }} />
        <input type="number" min={0} value={pts} onChange={e => setPts(Number(e.target.value))}
          style={{ ...inputStyle, width: '120px', textAlign: 'right' }} />
        <button onClick={handleCreate} disabled={saving} className="btn btn-primary btn-sm">{saving ? '…' : 'Crear'}</button>
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
        Los usuarios suben de nivel al acumular puntos.
      </p>
      {levels.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay niveles definidos.</p>}
      {levels.map(l => (
        <LevelRow key={l.id} level={l}
          onSaved={updated => setLevels(prev => prev.map(x => x.id === updated.id ? updated : x))}
          onDeleted={id => setLevels(prev => prev.filter(x => x.id !== id))}
        />
      ))}
      <NewLevelRow onCreated={() => window.location.reload()} />
    </div>
  )
}

// ─── BADGE FORM ───────────────────────────────────────────────────────────────

function BadgeForm({ badge, onSaved, onCancel }: {
  badge?: Badge; onSaved: () => void; onCancel: () => void
}) {
  const [name, setName]           = useState(badge?.name ?? '')
  const [desc, setDesc]           = useState(badge?.description ?? '')
  const [icon, setIcon]           = useState(badge?.icon_url ?? '')
  const [condition, setCondition] = useState(badge?.condition_key ?? CONDITION_OPTIONS[0].key)
  const [isManual, setIsManual]   = useState(badge?.is_manual ?? false)
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSave() {
    if (!name.trim()) { setMsg({ ok: false, text: 'El nombre es obligatorio.' }); return }
    setSaving(true)
    const res = await saveBadge({
      id: badge?.id,
      name, description: desc, icon_url: icon,
      condition_key: condition,
      is_manual: isManual,
    })
    setSaving(false)
    if (res?.error) { setMsg({ ok: false, text: res.error }); return }
    onSaved()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BadgeIcon icon={icon || null} size={24} />
          <input value={icon} onChange={e => setIcon(e.target.value)}
            placeholder="🏅 o PencilIcon o ra-sword"
            style={{ ...inputStyle, width: '180px' }} />
        </div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre"
          style={{ ...inputStyle, flex: 1, minWidth: '120px' }} />
      </div>
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción"
        style={inputStyle} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={isManual} onChange={e => setIsManual(e.target.checked)} />
          Insignia manual (asignada por admin)
        </label>
      </div>
      {!isManual && (
        <select value={condition} onChange={e => setCondition(e.target.value)} style={inputStyle}>
          {CONDITION_OPTIONS.map(o => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? '…' : badge ? 'Guardar' : 'Crear insignia'}
        </button>
        <button onClick={onCancel} className="btn btn-secondary btn-sm">Cancelar</button>
      </div>
      <Msg msg={msg} />
    </div>
  )
}

function BadgeRow({ badge, onDeleted, onEdited }: {
  badge: Badge; onDeleted: (id: string) => void; onEdited: () => void
}) {
  const [editing, setEditing] = useState(false)

  async function handleDelete() {
    if (!confirm(`¿Eliminar la insignia "${badge.name}"?`)) return
    await deleteBadge(badge.id)
    onDeleted(badge.id)
  }

  const condLabel = CONDITION_OPTIONS.find(o => o.key === badge.condition_key)?.label ?? (badge.is_manual ? 'Manual' : badge.condition_key)

  if (editing) return (
    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <BadgeForm badge={badge} onSaved={() => { setEditing(false); onEdited() }} onCancel={() => setEditing(false)} />
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <BadgeIcon icon={badge.icon_url} size={20} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>{badge.name}</p>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {badge.is_manual ? '🔑 Manual' : condLabel}
        </p>
      </div>
      <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">Editar</button>
      <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.8rem' }}>Eliminar</button>
    </div>
  )
}

function BadgesSection({ initial }: { initial: Badge[] }) {
  const [badges, setBadges] = useState(initial)
  const [creating, setCreating] = useState(false)

  const auto   = badges.filter(b => !b.is_manual)
  const manual = badges.filter(b => b.is_manual)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={cardStyle}>
        <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>Insignias automáticas</p>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Se conceden cuando el usuario cumple una condición al publicar un post.
        </p>
        {auto.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay insignias automáticas.</p>}
        {auto.map(b => (
          <BadgeRow key={b.id} badge={b}
            onDeleted={id => setBadges(prev => prev.filter(x => x.id !== id))}
            onEdited={() => window.location.reload()}
          />
        ))}
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            style={addBtnStyle}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            + Nueva insignia automática
          </button>
        )}
        {creating && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '4px' }}>
            <BadgeForm
              onSaved={() => { setCreating(false); window.location.reload() }}
              onCancel={() => setCreating(false)}
            />
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>Insignias manuales</p>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Solo las puede asignar un admin manualmente a usuarios concretos.
        </p>
        {manual.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay insignias manuales.</p>}
        {manual.map(b => (
          <BadgeRow key={b.id} badge={b}
            onDeleted={id => setBadges(prev => prev.filter(x => x.id !== id))}
            onEdited={() => window.location.reload()}
          />
        ))}
        <ManualAssignSection manualBadges={manual} />
      </div>
    </div>
  )
}

// ─── ASIGNACIÓN MANUAL ────────────────────────────────────────────────────────

function ManualAssignSection({ manualBadges }: { manualBadges: Badge[] }) {
  const [query, setQuery]               = useState('')
  const [results, setResults]           = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userBadges, setUserBadges]     = useState<UserBadge[]>([])
  const [selectedBadge, setSelectedBadge] = useState(manualBadges[0]?.id ?? '')
  const [searching, setSearching]       = useState(false)
  const [assigning, setAssigning]       = useState(false)
  const [msg, setMsg]                   = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSearch() {
    if (query.trim().length < 2) return
    setSearching(true)
    const res = await searchUsersForBadge(query)
    setResults(res)
    setSearching(false)
  }

  async function handleSelectUser(user: User) {
    setSelectedUser(user)
    setResults([])
    setQuery(user.display_name ?? user.username)
    const badges = await getUserBadges(user.id)
    setUserBadges(badges as UserBadge[])
  }

  async function handleAssign() {
    if (!selectedUser || !selectedBadge) return
    setAssigning(true); setMsg(null)
    const res = await assignBadgeToUser(selectedUser.id, selectedBadge)
    setAssigning(false)
    if (res?.error) { setMsg({ ok: false, text: res.error }); return }
    setMsg({ ok: true, text: '✓ Insignia asignada.' })
    const badges = await getUserBadges(selectedUser.id)
    setUserBadges(badges as UserBadge[])
  }

  async function handleRevoke(badgeId: string) {
    if (!selectedUser) return
    const res = await revokeBadgeFromUser(selectedUser.id, badgeId)
    if (res?.error) { setMsg({ ok: false, text: res.error }); return }
    setMsg({ ok: true, text: '✓ Insignia retirada.' })
    const badges = await getUserBadges(selectedUser.id)
    setUserBadges(badges as UserBadge[])
  }

  if (manualBadges.length === 0) return (
    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
      Crea insignias manuales arriba para poder asignarlas.
    </p>
  )

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
      <p style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.85rem' }}>Asignar insignia a usuario</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setSelectedUser(null) }}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar usuario por nombre..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={handleSearch} disabled={searching} className="btn btn-secondary btn-sm">
          {searching ? '…' : 'Buscar'}
        </button>
      </div>

      {results.length > 0 && (
        <div style={{ border: '1px solid var(--border-medium)', borderRadius: '4px', marginBottom: '0.5rem', overflow: 'hidden' }}>
          {results.map(u => (
            <button key={u.id} onClick={() => handleSelectUser(u)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.75rem', background: 'none', border: 'none', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)' }}>
              <img src={u.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${u.id}`}
                alt={u.username} style={{ width: 24, height: 24, borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85rem' }}>{u.display_name ?? u.username}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{u.username}</span>
            </button>
          ))}
        </div>
      )}

      {selectedUser && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <select value={selectedBadge} onChange={e => setSelectedBadge(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
              {manualBadges.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <button onClick={handleAssign} disabled={assigning} className="btn btn-primary btn-sm">
              {assigning ? '…' : 'Asignar'}
            </button>
          </div>
          {userBadges.length > 0 && (
            <div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.35rem' }}>
                Insignias de {selectedUser.display_name ?? selectedUser.username}:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {userBadges.map(ub => (
                  <div key={ub.badge_id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.6rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.8rem' }}>
                    <BadgeIcon icon={ub.badges?.icon_url ?? null} size={14} />
                    <span>{ub.badges?.name ?? ub.badge_id}</span>
                    {ub.badges?.is_manual && (
                      <button onClick={() => handleRevoke(ub.badge_id)}
                        style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0', fontSize: '0.75rem', lineHeight: 1 }}
                        title="Retirar insignia">✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <Msg msg={msg} />
    </div>
  )
}

// ─── PRINCIPAL ────────────────────────────────────────────────────────────────

export default function PuntosClient({ pointsPerPost, levels, badges }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PuntosSection initial={pointsPerPost} />
      <NivelesSection initial={levels} />
      <BadgesSection initial={badges} />
    </div>
  )
}