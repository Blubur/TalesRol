'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Profile } from '@/types/database'
import { changeUserRole, banUser, unbanUser, updateRoleColors } from './actions'
import {
  NoSymbolIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  SwatchIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'

const ROLES = ['admin', 'master', 'director', 'jugador', 'miembro'] as const

const DEFAULT_ROLE_COLORS: Record<string, string> = {
  admin:    '#fbbf24',
  master:   '#a78bfa',
  director: '#34d399',
  jugador:  '#60a5fa',
  miembro:  '#9ca3af',
}

type SortField = 'name' | 'created_at' | 'points'
type SortDir   = 'asc' | 'desc'

interface Props {
  users: (Profile & { email: string })[]
  currentUserId: string
  roleColors?: Record<string, string>
}

export default function AdminUsersTable({ users, currentUserId, roleColors: initialRoleColors }: Props) {
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState<string | null>(null)
  const [localUsers, setLocalUsers] = useState(users)

  // ── Filtros ───────────────────────────────────────────────────────────────
  const [roleFilter,   setRoleFilter]   = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFrom,     setDateFrom]     = useState('')
  const [dateTo,       setDateTo]       = useState('')

  // ── Ordenación ────────────────────────────────────────────────────────────
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir,   setSortDir]   = useState<SortDir>('desc')

  // ── Edición por fila ──────────────────────────────────────────────────────
  const [pendingRole, setPendingRole] = useState<Record<string, string>>({})
  const [savedRows,   setSavedRows]   = useState<Set<string>>(new Set())
  const [errorRows,   setErrorRows]   = useState<Record<string, string>>({})

  // ── Colores de rol ────────────────────────────────────────────────────────
  const [roleColors,     setRoleColors]     = useState<Record<string, string>>(initialRoleColors ?? DEFAULT_ROLE_COLORS)
  const [pendingColors,  setPendingColors]  = useState<Record<string, string>>({})
  const [colorPanelOpen, setColorPanelOpen] = useState(false)
  const [colorSaving,    setColorSaving]    = useState(false)
  const [colorSaved,     setColorSaved]     = useState(false)
  const [colorError,     setColorError]     = useState<string | null>(null)

  const effectiveColor = (role: string) =>
    pendingColors[role] ?? roleColors[role] ?? DEFAULT_ROLE_COLORS[role] ?? '#9ca3af'

  // ── Datos filtrados y ordenados ───────────────────────────────────────────
  const filtered = useMemo(() => {
  let result = Array.isArray(localUsers) ? [...localUsers] : []

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.username.toLowerCase().includes(q) ||
        (u.display_name ?? '').toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q)
      )
    }

    if (roleFilter !== 'all')
      result = result.filter(u => u.role === roleFilter)

    if (statusFilter === 'active')
      result = result.filter(u => u.status !== 'banned')
    else if (statusFilter === 'banned')
      result = result.filter(u => u.status === 'banned')

    if (dateFrom)
      result = result.filter(u => new Date(u.created_at) >= new Date(dateFrom))
    if (dateTo)
      result = result.filter(u => new Date(u.created_at) <= new Date(dateTo + 'T23:59:59'))

    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'name')
        cmp = (a.display_name || a.username).localeCompare(b.display_name || b.username)
      else if (sortField === 'created_at')
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      else if (sortField === 'points')
        cmp = (a.points ?? 0) - (b.points ?? 0)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [localUsers, search, roleFilter, statusFilter, dateFrom, dateTo, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUpDownIcon className="sort-icon muted" />
    return sortDir === 'asc'
      ? <ChevronUpIcon className="sort-icon active" />
      : <ChevronDownIcon className="sort-icon active" />
  }

  function clearFilters() {
    setSearch(''); setRoleFilter('all'); setStatusFilter('all')
    setDateFrom(''); setDateTo('')
  }

  const hasActiveFilters = search || roleFilter !== 'all' || statusFilter !== 'all' || dateFrom || dateTo

  // ── Acciones ──────────────────────────────────────────────────────────────
  async function handleSaveRole(userId: string) {
    const newRole = pendingRole[userId]
    if (!newRole) return
    setLoading(userId + '_save')
    setErrorRows(prev => { const n = { ...prev }; delete n[userId]; return n })
    const result = await changeUserRole(userId, newRole)
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

  async function handleSaveColors() {
    if (Object.keys(pendingColors).length === 0) return
    setColorSaving(true); setColorError(null)
    const merged = { ...roleColors, ...pendingColors }
    const result = await updateRoleColors(merged)
    if (result?.error) {
      setColorError(String(result.error))
    } else {
      setRoleColors(merged); setPendingColors({})
      setColorSaved(true)
      setTimeout(() => setColorSaved(false), 2500)
    }
    setColorSaving(false)
  }

  const hasColorChanges = Object.keys(pendingColors).length > 0

  return (
    <div className="admin-table-wrap">

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="users-toolbar">
        <div className="admin-search-wrap">
          <MagnifyingGlassIcon className="admin-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o email..."
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

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Rol</span>
          <div className="filter-btns">
            {['all', ...ROLES].map(r => (
              <button
                key={r}
                className={`filter-btn ${roleFilter === r ? 'active' : ''}`}
                onClick={() => setRoleFilter(r)}
                style={roleFilter === r && r !== 'all' ? { color: effectiveColor(r), borderColor: effectiveColor(r) + '88', background: effectiveColor(r) + '18' } : {}}
              >
                {r === 'all' ? 'Todos' : r}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Estado</span>
          <div className="filter-btns">
            {[
              { value: 'all',    label: 'Todos' },
              { value: 'active', label: 'Activos' },
              { value: 'banned', label: 'Baneados' },
            ].map(s => (
              <button
                key={s.value}
                className={`filter-btn ${statusFilter === s.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Registro</span>
          <div className="filter-dates">
            <input type="date" className="filter-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span className="filter-date-sep">—</span>
            <input type="date" className="filter-date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        {hasActiveFilters && (
          <button className="filter-clear-btn" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}

        <span className="filter-count">{filtered.length} de {localUsers.length}</span>
      </div>

      {/* ── Panel de colores ─────────────────────────────────────────────── */}
      {colorPanelOpen && (
        <div className="color-panel">
          <p className="color-panel-title">Color de nombre por rol</p>
          <div className="color-panel-grid">
            {ROLES.map(role => (
              <div key={role} className="color-row">
                <span className="color-role-label" style={{ color: effectiveColor(role) }}>{role}</span>
                <div className="color-input-wrap">
                  <span className="color-swatch" style={{ background: effectiveColor(role) }} />
                  <input type="color" value={effectiveColor(role)} onChange={e => setPendingColors(prev => ({ ...prev, [role]: e.target.value }))} className="color-picker" />
                  <input
                    type="text" value={effectiveColor(role)} maxLength={7} className="color-hex-input" spellCheck={false}
                    onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setPendingColors(prev => ({ ...prev, [role]: e.target.value })) }}
                  />
                  {pendingColors[role] && (
                    <button className="color-reset-btn" onClick={() => setPendingColors(prev => { const n = { ...prev }; delete n[role]; return n })} title="Deshacer">✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="color-panel-footer">
            {colorError && <span className="color-error">{colorError}</span>}
            <button className={`save-colors-btn ${colorSaved ? 'saved' : ''}`} onClick={handleSaveColors} disabled={!hasColorChanges || colorSaving}>
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
              <th>
                <button className="sort-th" onClick={() => toggleSort('name')}>
                  Usuario <SortIcon field="name" />
                </button>
              </th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>
                <button className="sort-th" onClick={() => toggleSort('points')}>
                  Puntos <SortIcon field="points" />
                </button>
              </th>
              <th>
                <button className="sort-th" onClick={() => toggleSort('created_at')}>
                  Registrado <SortIcon field="created_at" />
                </button>
              </th>
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
                  <td>
                    <Link href={`/perfil/${u.username}`} className="user-cell">
                      <img src={avatarUrl} alt={u.username} className="user-avatar-sm" />
                      <div className="user-cell-info">
                        <span className="user-cell-name" style={{ color: effectiveColor(currentRole) }}>
                          {u.display_name || u.username}
                        </span>
                        <span className="user-cell-username">@{u.username}</span>
                      </div>
                    </Link>
                  </td>
                  <td><span className="email-cell">{u.email || '—'}</span></td>
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
                        <button className="save-role-btn" onClick={() => handleSaveRole(u.id)} disabled={isSaving} title="Guardar cambio de rol">
                          {isSaving ? <><span className="spinner" /> Guardando</> : <><CheckIcon style={{ width: 11, height: 11 }} /> Guardar</>}
                        </button>
                      )}
                      {justSaved && !isDirty && <span className="role-saved-flash">✓ Guardado</span>}
                      {rowError && <span className="role-error-flash">{rowError}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${isBanned ? 'banned' : 'active'}`}>
                      {isBanned ? 'Baneado' : 'Activo'}
                    </span>
                  </td>
                  <td><span className="points-cell">{u.points}</span></td>
                  <td>
                    <span className="date-cell">
                      {new Date(u.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </td>
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
    </div>
  )
}