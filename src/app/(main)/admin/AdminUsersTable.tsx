'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile } from '@/types/database'
import { changeUserRole, banUser, unbanUser } from './actions'
import {
  ShieldCheckIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

const ROLES = ['admin', 'master', 'director', 'jugador', 'miembro'] as const
const ROLE_COLORS: Record<string, string> = {
  admin:    '#fbbf24',
  master:   '#a78bfa',
  director: '#34d399',
  jugador:   '#60a5fa',
  miembro:    '#9ca3af',
}

export default function AdminUsersTable({ users, currentUserId }: { users: Profile[]; currentUserId: string }) {
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState<string | null>(null)
  const [localUsers, setLocalUsers] = useState(users)

  const filtered = localUsers.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.display_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleRoleChange(userId: string, role: string) {
    setLoading(userId + '_role')
    const result = await changeUserRole(userId, role)
    if (!result?.error) {
      setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as any } : u))
    }
    setLoading(null)
  }

  async function handleBan(userId: string) {
    if (!confirm('¿Banear a este usuario?')) return
    setLoading(userId + '_ban')
    const result = await banUser(userId)
    if (!result?.error) {
      setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'banned' } : u))
    }
    setLoading(null)
  }

  async function handleUnban(userId: string) {
    setLoading(userId + '_ban')
    const result = await unbanUser(userId)
    if (!result?.error) {
      setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u))
    }
    setLoading(null)
  }

  return (
    <div className="admin-table-wrap">
      {/* Buscador */}
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

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Puntos</th>
              <th>Registrado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const isSelf   = u.id === currentUserId
              const isBanned = u.status === 'banned'
              const avatarUrl = u.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${u.username}`
              return (
                <tr key={u.id} className={isBanned ? 'row-banned' : ''}>
                  <td>
                    <Link href={`/perfil/${u.username}`} className="user-cell">
                      <img src={avatarUrl} alt={u.username} className="user-avatar-sm" />
                      <div className="user-cell-info">
                        <span className="user-cell-name">{u.display_name || u.username}</span>
                        <span className="user-cell-username">@{u.username}</span>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <select
                      className="role-select"
                      value={u.role}
                      disabled={isSelf || loading === u.id + '_role'}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      style={{ color: ROLE_COLORS[u.role] ?? '#9ca3af', borderColor: ROLE_COLORS[u.role] ?? '#9ca3af' }}
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`status-pill ${isBanned ? 'banned' : 'active'}`}>
                      {isBanned ? 'Baneado' : 'Activo'}
                    </span>
                  </td>
                  <td>
                    <span className="points-cell">{u.points}</span>
                  </td>
                  <td>
                    <span className="date-cell">
                      {new Date(u.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </td>
                  <td>
                    {!isSelf && (
                      <div className="action-btns">
                        {isBanned ? (
                          <button
                            className="action-btn success"
                            onClick={() => handleUnban(u.id)}
                            disabled={loading === u.id + '_ban'}
                            title="Desbanear"
                          >
                            <CheckCircleIcon className="action-btn-icon" />
                            Desbanear
                          </button>
                        ) : (
                          <button
                            className="action-btn danger"
                            onClick={() => handleBan(u.id)}
                            disabled={loading === u.id + '_ban'}
                            title="Banear"
                          >
                            <NoSymbolIcon className="action-btn-icon" />
                            Banear
                          </button>
                        )}
                      </div>
                    )}
                    {isSelf && <span className="self-label">Tú</span>}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-row">No se encontraron usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-table-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
        .admin-search-wrap { position: relative; max-width: 320px; }
        .admin-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: var(--text-muted); pointer-events: none; }
        .admin-search { width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.45rem 0.75rem 0.45rem 2.2rem; font-size: 0.82rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; }
        .admin-search:focus { border-color: var(--border-medium); }
        .admin-search::placeholder { color: var(--text-muted); }

        .admin-table-scroll { overflow-x: auto; border-radius: 6px; border: 1px solid var(--border-subtle); }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .admin-table thead tr { background: var(--bg-secondary); }
        .admin-table th { padding: 0.65rem 1rem; text-align: left; font-family: var(--font-cinzel); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; border-bottom: 1px solid var(--border-subtle); }
        .admin-table td { padding: 0.65rem 1rem; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
        .admin-table tbody tr { background: var(--bg-card); transition: background 0.15s; }
        .admin-table tbody tr:hover { background: var(--bg-elevated); }
        .admin-table tbody tr:last-child td { border-bottom: none; }
        .admin-table tbody tr.row-banned { opacity: 0.55; }

        .user-cell { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
        .user-avatar-sm { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-subtle); flex-shrink: 0; }
        .user-cell-info { display: flex; flex-direction: column; gap: 0.05rem; }
        .user-cell-name { color: var(--text-primary); font-size: 0.82rem; font-family: var(--font-cinzel); letter-spacing: 0.02em; }
        .user-cell-username { color: var(--text-muted); font-size: 0.7rem; }

        .role-select { background: transparent; border: 1px solid; border-radius: 3px; padding: 0.2rem 0.5rem; font-size: 0.72rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; cursor: pointer; outline: none; }
        .role-select:disabled { opacity: 0.4; cursor: not-allowed; }
        .role-select option { background: var(--bg-elevated); color: var(--text-primary); }

        .status-pill { font-size: 0.68rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; padding: 0.15rem 0.5rem; border-radius: 2px; }
        .status-pill.active { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
        .status-pill.banned { background: rgba(255,107,107,0.1); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.3); }

        .points-cell { font-family: var(--font-cinzel); font-size: 0.8rem; color: var(--color-crimson); }
        .date-cell { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }
        .self-label { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.06em; font-style: italic; }
        .empty-row { text-align: center; color: var(--text-muted); padding: 2rem !important; font-style: italic; }

        .action-btns { display: flex; gap: 0.35rem; }
        .action-btn { display: flex; align-items: center; gap: 0.3rem; background: transparent; border: 1px solid; border-radius: 3px; padding: 0.25rem 0.6rem; font-size: 0.7rem; font-family: var(--font-cinzel); letter-spacing: 0.04em; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn.danger { color: #ff6b6b; border-color: rgba(255,107,107,0.4); }
        .action-btn.danger:hover:not(:disabled) { background: rgba(255,107,107,0.1); }
        .action-btn.success { color: #34d399; border-color: rgba(52,211,153,0.4); }
        .action-btn.success:hover:not(:disabled) { background: rgba(52,211,153,0.1); }
        .action-btn-icon { width: 12px; height: 12px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}