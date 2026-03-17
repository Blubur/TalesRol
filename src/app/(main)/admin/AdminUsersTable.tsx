'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile } from '@/types/database'
import { changeUserRole, banUser, unbanUser, updateRoleColors } from './actions'
import {
  NoSymbolIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline'

const ROLES = ['admin', 'master', 'director', 'jugador', 'miembro'] as const

const DEFAULT_ROLE_COLORS: Record<string, string> = {
  admin:    '#fbbf24',
  master:   '#a78bfa',
  director: '#34d399',
  jugador:  '#60a5fa',
  miembro:  '#9ca3af',
}

interface Props {
  users: (Profile & { email: string })[]
  currentUserId: string
  /** Colores actuales de cada rol, cargados desde la BD */
  roleColors?: Record<string, string>
}

export default function AdminUsersTable({ users, currentUserId, roleColors: initialRoleColors }: Props) {
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState<string | null>(null)
  const [localUsers, setLocalUsers] = useState(users)

  // ── Edición por fila ──────────────────────────────────────────────────────
  const [pendingRole, setPendingRole] = useState<Record<string, string>>({})
  const [savedRows,   setSavedRows]   = useState<Set<string>>(new Set())
  const [errorRows,   setErrorRows]   = useState<Record<string, string>>({})

  // ── Colores de rol ────────────────────────────────────────────────────────
  const [roleColors,    setRoleColors]    = useState<Record<string, string>>(initialRoleColors ?? DEFAULT_ROLE_COLORS)
  const [pendingColors, setPendingColors] = useState<Record<string, string>>({})
  const [colorPanelOpen, setColorPanelOpen] = useState(false)
  const [colorSaving, setColorSaving] = useState(false)
  const [colorSaved,  setColorSaved]  = useState(false)
  const [colorError,  setColorError]  = useState<string | null>(null)

  // Color efectivo (pending tiene prioridad sobre guardado)
  const effectiveColor = (role: string) =>
    pendingColors[role] ?? roleColors[role] ?? DEFAULT_ROLE_COLORS[role] ?? '#9ca3af'

  const filtered = localUsers.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.display_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

 async function handleSaveRole(userId: string) {
  const newRole = pendingRole[userId]
  console.log('handleSaveRole llamado:', userId, newRole) // añadir
  if (!newRole) return
  setLoading(userId + '_save')
  setErrorRows(prev => { const n = { ...prev }; delete n[userId]; return n })

  const result = await changeUserRole(userId, newRole)
  console.log('resultado changeUserRole:', result) // añadir

  if (result?.error) {
    setErrorRows(prev => ({ ...prev, [userId]: String(result.error) }))
  } else {
    setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u))
    setPendingRole(prev => { const n = { ...prev }; delete n[userId]; return n })
    setSavedRows(prev => new Set(prev).add(userId))
    setTimeout(() => setSavedRows(prev => { const n = new Set(prev); n.delete(userId); return n }), 2200)
  }
  setLoading(null)
}
  // ── Ban / Unban ───────────────────────────────────────────────────────────
  async function handleBan(userId: string) {
    if (!confirm('¿Banear a este usuario?')) return
    setLoading(userId + '_ban')
    const result = await banUser(userId)
    if (!result?.error) setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'banned' } : u))
    setLoading(null)
  }

  async function handleUnban(userId: string) {
    setLoading(userId + '_ban')
    const result = await unbanUser(userId)
    if (!result?.error) setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u))
    setLoading(null)
  }

  // ── Guardar colores de rol ────────────────────────────────────────────────
  async function handleSaveColors() {
    if (Object.keys(pendingColors).length === 0) return
    setColorSaving(true)
    setColorError(null)

    const merged = { ...roleColors, ...pendingColors }
    const result = await updateRoleColors(merged)

    if (result?.error) {
      setColorError(String(result.error))
    } else {
      setRoleColors(merged)
      setPendingColors({})
      setColorSaved(true)
      setTimeout(() => setColorSaved(false), 2500)
    }
    setColorSaving(false)
  }

  const hasColorChanges = Object.keys(pendingColors).length > 0

  return (
    <div className="admin-table-wrap">

      {/* ── Barra superior ───────────────────────────────────────────────── */}
      <div className="users-toolbar">
        <div className="admin-search-wrap">
          <MagnifyingGlassIcon className="admin-search-icon" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-search"
          />
        </div>

        <button
          className={`color-panel-btn ${colorPanelOpen ? 'active' : ''}`}
          onClick={() => setColorPanelOpen(v => !v)}
        >
          <SwatchIcon style={{ width: 14, height: 14 }} />
          Colores de rol
        </button>
      </div>

      {/* ── Panel de colores ─────────────────────────────────────────────── */}
      {colorPanelOpen && (
        <div className="color-panel">
          <p className="color-panel-title">Color de nombre por rol</p>
          <div className="color-panel-grid">
            {ROLES.map(role => (
              <div key={role} className="color-row">
                <span className="color-role-label" style={{ color: effectiveColor(role) }}>
                  {role}
                </span>
                <div className="color-input-wrap">
                  <span className="color-swatch" style={{ background: effectiveColor(role) }} />
                  <input
                    type="color"
                    value={effectiveColor(role)}
                    onChange={e => setPendingColors(prev => ({ ...prev, [role]: e.target.value }))}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={effectiveColor(role)}
                    onChange={e => {
                      if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))
                        setPendingColors(prev => ({ ...prev, [role]: e.target.value }))
                    }}
                    maxLength={7}
                    className="color-hex-input"
                    spellCheck={false}
                  />
                  {pendingColors[role] && (
                    <button
                      className="color-reset-btn"
                      onClick={() => setPendingColors(prev => { const n = { ...prev }; delete n[role]; return n })}
                      title="Deshacer"
                    >✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="color-panel-footer">
            {colorError && <span className="color-error">{colorError}</span>}
            <button
              className={`save-colors-btn ${colorSaved ? 'saved' : ''}`}
              onClick={handleSaveColors}
              disabled={!hasColorChanges || colorSaving}
            >
              {colorSaving ? 'Guardando…' : colorSaved ? '✓ Guardado' : 'Guardar colores'}
            </button>
          </div>
        </div>
      )}

      {/* ── Tabla ────────────────────────────────────────────────────────── */}
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Puntos</th>
              <th>Registrado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const isSelf       = u.id === currentUserId
              const isBanned     = u.status === 'banned'
              const avatarUrl    = u.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${u.username}`
              const currentRole  = u.role as string
              const selectedRole = pendingRole[u.id] ?? currentRole
              const isDirty      = pendingRole[u.id] !== undefined && pendingRole[u.id] !== currentRole
              const isSaving     = loading === u.id + '_save'
              const justSaved    = savedRows.has(u.id)
              const rowError     = errorRows[u.id]

              return (
                <tr
                  key={u.id}
                  className={[
                    isBanned  ? 'row-banned' : '',
                    isDirty   ? 'row-dirty'  : '',
                    justSaved ? 'row-saved'  : '',
                  ].filter(Boolean).join(' ')}
                >
                  {/* Usuario */}
                  <td>
                    <Link href={`/perfil/${u.username}`} className="user-cell">
                      <img src={avatarUrl} alt={u.username} className="user-avatar-sm" />
                      <div className="user-cell-info">
                        <span
                          className="user-cell-name"
                          style={{ color: effectiveColor(currentRole) }}
                        >
                          {u.display_name || u.username}
                        </span>
                        <span className="user-cell-username">@{u.username}</span>
                      </div>
                    </Link>
                  </td>
                  {/* correo */}
                  <td>
                    <span className="email-cell">{u.email || '—'}</span>
                  </td>
                  {/* Rol */}
                  <td>
                    <div className="role-cell">
                      <select
                        className="role-select"
                        value={selectedRole}
                        disabled={isSelf || isSaving}
                        onChange={e => {
                          const val = e.target.value
                          if (val === currentRole) {
                            setPendingRole(prev => { const n = { ...prev }; delete n[u.id]; return n })
                          } else {
                            setPendingRole(prev => ({ ...prev, [u.id]: val }))
                          }
                        }}
                        style={{ color: effectiveColor(selectedRole), borderColor: effectiveColor(selectedRole) }}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>

                      {isDirty && (
                        <button
                          className="save-role-btn"
                          onClick={() => handleSaveRole(u.id)}
                          disabled={isSaving}
                          title="Guardar cambio de rol"
                        >
                          {isSaving
                            ? <><span className="spinner" /> Guardando</>
                            : <><CheckIcon style={{ width: 11, height: 11 }} /> Guardar</>
                          }
                        </button>
                      )}

                      {justSaved && !isDirty && (
                        <span className="role-saved-flash">✓ Guardado</span>
                      )}

                      {rowError && (
                        <span className="role-error-flash">{rowError}</span>
                      )}
                    </div>
                  </td>

                  {/* Estado */}
                  <td>
                    <span className={`status-pill ${isBanned ? 'banned' : 'active'}`}>
                      {isBanned ? 'Baneado' : 'Activo'}
                    </span>
                  </td>

                  {/* Puntos */}
                  <td><span className="points-cell">{u.points}</span></td>

                  {/* Fecha */}
                  <td>
                    <span className="date-cell">
                      {new Date(u.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td>
                    {!isSelf ? (
                      <div className="action-btns">
                        {isBanned ? (
                          <button className="action-btn success" onClick={() => handleUnban(u.id)} disabled={loading === u.id + '_ban'}>
                            <CheckCircleIcon className="action-btn-icon" /> Desbanear
                          </button>
                        ) : (
                          <button className="action-btn danger" onClick={() => handleBan(u.id)} disabled={loading === u.id + '_ban'}>
                            <NoSymbolIcon className="action-btn-icon" /> Banear
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="self-label">Tú</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="empty-row">No se encontraron usuarios.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-table-wrap { display: flex; flex-direction: column; gap: 0.75rem; }

        /* Toolbar */
        .users-toolbar { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .admin-search-wrap { position: relative; }
        .admin-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: var(--text-muted); pointer-events: none; }
        .admin-search { width: 260px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.45rem 0.75rem 0.45rem 2.2rem; font-size: 0.82rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; }
        .admin-search:focus { border-color: var(--border-medium); }
        .admin-search::placeholder { color: var(--text-muted); }

        /* Botón panel colores */
        .color-panel-btn { display: flex; align-items: center; gap: 0.35rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.42rem 0.85rem; font-size: 0.75rem; font-family: var(--font-cinzel); letter-spacing: 0.05em; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
        .color-panel-btn:hover, .color-panel-btn.active { color: var(--text-primary); border-color: var(--border-medium); background: var(--bg-elevated); }
        .color-panel-btn.active { border-color: var(--color-crimson); color: var(--color-crimson); }

        /* Panel de colores */
        .color-panel { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .color-panel-title { font-family: var(--font-cinzel); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle); }
        .color-panel-grid { display: flex; flex-direction: column; gap: 0.55rem; }
        .color-row { display: flex; align-items: center; gap: 1rem; }
        .color-role-label { font-family: var(--font-cinzel); font-size: 0.8rem; letter-spacing: 0.06em; font-weight: 600; width: 72px; flex-shrink: 0; text-transform: capitalize; transition: color 0.2s; }
        .color-input-wrap { display: flex; align-items: center; gap: 0.5rem; }
        .color-swatch { width: 18px; height: 18px; border-radius: 3px; border: 1px solid var(--border-subtle); flex-shrink: 0; transition: background 0.15s; }
        .color-picker { width: 28px; height: 28px; padding: 2px; border: 1px solid var(--border-subtle); border-radius: 3px; background: none; cursor: pointer; }
        .color-hex-input { width: 74px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 3px; padding: 0.2rem 0.4rem; font-size: 0.72rem; font-family: monospace; color: var(--text-primary); outline: none; }
        .color-hex-input:focus { border-color: var(--border-medium); }
        .color-reset-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.68rem; padding: 0.1rem 0.3rem; transition: color 0.15s; }
        .color-reset-btn:hover { color: #ff6b6b; }
        .color-panel-footer { display: flex; align-items: center; justify-content: flex-end; gap: 1rem; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle); }
        .color-error { font-size: 0.72rem; color: #ff6b6b; }
        .save-colors-btn { background: var(--color-crimson); border: none; color: #fff; border-radius: 4px; padding: 0.4rem 1.1rem; font-size: 0.75rem; font-family: var(--font-cinzel); letter-spacing: 0.05em; cursor: pointer; transition: opacity 0.15s, background 0.2s; }
        .save-colors-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .save-colors-btn.saved { background: #34d399; }

        /* Tabla */
        .admin-table-scroll { overflow-x: auto; border-radius: 6px; border: 1px solid var(--border-subtle); }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .admin-table thead tr { background: var(--bg-secondary); }
        .admin-table th { padding: 0.65rem 1rem; text-align: left; font-family: var(--font-cinzel); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; border-bottom: 1px solid var(--border-subtle); }
        .admin-table td { padding: 0.65rem 1rem; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
        .admin-table tbody tr { background: var(--bg-card); transition: background 0.15s; }
        .admin-table tbody tr:hover { background: var(--bg-elevated); }
        .admin-table tbody tr:last-child td { border-bottom: none; }
        .admin-table tbody tr.row-banned { opacity: 0.55; }
        .admin-table tbody tr.row-dirty { background: rgba(251,191,36,0.03); }
        .admin-table tbody tr.row-saved { animation: flash-saved 2.2s ease forwards; }
        @keyframes flash-saved { 0%,25% { background: rgba(52,211,153,0.08); } 100% { background: transparent; } }

        /* Celda usuario */
        .user-cell { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
        .user-avatar-sm { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-subtle); flex-shrink: 0; }
        .user-cell-info { display: flex; flex-direction: column; gap: 0.05rem; }
        .user-cell-name { font-size: 0.82rem; font-family: var(--font-cinzel); letter-spacing: 0.02em; transition: color 0.2s; }
        .user-cell-username { color: var(--text-muted); font-size: 0.7rem; }

        /*correo*/
        .email-cell { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }

        /* Selector de rol + guardar */
        .role-cell { display: flex; align-items: center; gap: 0.45rem; }
        .role-select { background: transparent; border: 1px solid; border-radius: 3px; padding: 0.2rem 0.5rem; font-size: 0.72rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; cursor: pointer; outline: none; transition: color 0.2s, border-color 0.2s; }
        .role-select:disabled { opacity: 0.4; cursor: not-allowed; }
        .role-select option { background: var(--bg-elevated); color: var(--text-primary); }

        .save-role-btn { display: flex; align-items: center; gap: 0.25rem; background: var(--color-crimson); border: none; color: #fff; border-radius: 3px; padding: 0.22rem 0.6rem; font-size: 0.68rem; font-family: var(--font-cinzel); letter-spacing: 0.04em; cursor: pointer; white-space: nowrap; transition: opacity 0.15s; animation: pop-in 0.15s ease; }
        .save-role-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .save-role-btn:hover:not(:disabled) { opacity: 0.85; }
        @keyframes pop-in { from { transform: scale(0.82); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .role-saved-flash { font-size: 0.68rem; color: #34d399; font-family: var(--font-cinzel); letter-spacing: 0.04em; animation: fade-out 2.2s ease forwards; pointer-events: none; }
        @keyframes fade-out { 0%,50% { opacity: 1; } 100% { opacity: 0; } }
        .role-error-flash { font-size: 0.68rem; color: #ff6b6b; max-width: 160px; line-height: 1.3; }

        .spinner { display: inline-block; width: 10px; height: 10px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Resto */
        .status-pill { font-size: 0.68rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; padding: 0.15rem 0.5rem; border-radius: 2px; }
        .status-pill.active { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
        .status-pill.banned  { background: rgba(255,107,107,0.1); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.3); }
        .points-cell { font-family: var(--font-cinzel); font-size: 0.8rem; color: var(--color-crimson); }
        .date-cell { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }
        .self-label { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.06em; font-style: italic; }
        .empty-row { text-align: center; color: var(--text-muted); padding: 2rem !important; font-style: italic; }
        .action-btns { display: flex; gap: 0.35rem; }
        .action-btn { display: flex; align-items: center; gap: 0.3rem; background: transparent; border: 1px solid; border-radius: 3px; padding: 0.25rem 0.6rem; font-size: 0.7rem; font-family: var(--font-cinzel); letter-spacing: 0.04em; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn.danger  { color: #ff6b6b; border-color: rgba(255,107,107,0.4); }
        .action-btn.danger:hover:not(:disabled)  { background: rgba(255,107,107,0.1); }
        .action-btn.success { color: #34d399;  border-color: rgba(52,211,153,0.4); }
        .action-btn.success:hover:not(:disabled) { background: rgba(52,211,153,0.1); }
        .action-btn-icon { width: 12px; height: 12px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}