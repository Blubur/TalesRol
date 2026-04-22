'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  UsersIcon,
  ShieldCheckIcon,
  StarIcon,
  ChatBubbleLeftEllipsisIcon,
  CalendarIcon,
  ClockIcon,
  ChevronUpDownIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  admin:    { label: 'Admin',      color: 'var(--color-role-admin)' },
  master:   { label: 'Moderador',  color: 'var(--color-role-master)' },
  director: { label: 'Director',   color: 'var(--color-role-director)' },
jugador:  { label: 'Jugador',    color: 'var(--color-role-jugador)' },
miembro:  { label: 'Miembro',    color: 'var(--color-role-miembro)' },}

type SortKey = 'ultimo_acceso' | 'created_at' | 'level' | 'post_count' | 'badge_count'

interface User {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  role: string
  level: number
  points: number
  status: string
  created_at: string
  ultimo_acceso: string
  post_count: number
  badge_count: number
}

interface Props {
  users: User[]
  currentUserId: string
}

export default function UsersClient({ users, currentUserId }: Props) {
  const [search, setSearch]         = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [sortBy, setSortBy]         = useState<SortKey>('ultimo_acceso')
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('desc')

const roles = ['all', 'admin', 'master', 'director', 'jugador', 'miembro']

  function toggleSort(key: SortKey) {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    let list = [...users]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.username.toLowerCase().includes(q) ||
        (u.display_name ?? '').toLowerCase().includes(q)
      )
    }

    if (roleFilter !== 'all') {
      list = list.filter(u => u.role === roleFilter)
    }

    list.sort((a, b) => {
      let va: any = a[sortBy] ?? 0
      let vb: any = b[sortBy] ?? 0
      if (sortBy === 'ultimo_acceso' || sortBy === 'created_at') {
        va = new Date(va).getTime()
        vb = new Date(vb).getTime()
      }
      return sortDir === 'asc' ? va - vb : vb - va
    })

    return list
  }, [users, search, roleFilter, sortBy, sortDir])

  return (
    <div className="users-page">

      {/* Header */}
      <div className="users-header animate-enter">
        <div className="users-header-left">
          <UsersIcon className="users-header-icon" />
          <div>
            <h1 className="users-title">Comunidad</h1>
            <p className="users-sub">{users.length} miembro{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="users-controls animate-enter" style={{ animationDelay: '0.05s' }}>

        {/* Buscador */}
        <div className="users-search-wrap">
          <MagnifyingGlassIcon className="users-search-icon" />
          <input
            type="text"
            className="users-search"
            placeholder="Buscar por nombre o usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filtro por rol */}
        <div className="users-roles">
          {roles.map(r => (
            <button
              key={r}
              className={`role-filter-btn ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
              style={roleFilter === r && r !== 'all' ? {
                color: ROLE_CONFIG[r]?.color,
                borderColor: ROLE_CONFIG[r]?.color,
                background: `color-mix(in srgb, ${ROLE_CONFIG[r]?.color} 10%, transparent)`,
              } : {}}
            >
              {r === 'all' ? 'Todos' : ROLE_CONFIG[r]?.label ?? r}
              <span className="role-filter-count">
                {r === 'all' ? users.length : users.filter(u => u.role === r).length}
              </span>
            </button>
          ))}
        </div>

        {/* Ordenar */}
        <div className="users-sort">
          <span className="sort-label">Ordenar:</span>
          {([
            ['ultimo_acceso', 'Última conexión'],
            ['created_at',    'Registro'],
            ['level',         'Nivel'],
            ['post_count',    'Posts'],
            ['badge_count',   'Insignias'],
          ] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              className={`sort-btn ${sortBy === key ? 'active' : ''}`}
              onClick={() => toggleSort(key)}
            >
              {label}
              {sortBy === key && (
                <ChevronUpDownIcon style={{ width: 11, height: 11, transform: sortDir === 'asc' ? 'scaleY(-1)' : 'none' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="users-empty animate-enter">
          <UsersIcon className="users-empty-icon" />
          <p>No se encontraron usuarios.</p>
        </div>
      ) : (
        <div className="users-grid">
          {filtered.map((u, i) => {
const roleInfo = ROLE_CONFIG[u.role] ?? { label: u.role, color: 'var(--text-muted)' }
const avatar = u.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${u.username}`
            const isMe = u.id === currentUserId
            const lastSeen = new Date(u.ultimo_acceso)
            const now = new Date()
            const diffDays = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24))
            const lastSeenLabel = diffDays === 0 ? 'Hoy' : diffDays === 1 ? 'Ayer' : `Hace ${diffDays} días`
            const isOnline = diffDays === 0

            return (
              <Link
                key={u.id}
                href={`/perfil/${u.username}`}
                className="user-card animate-enter"
                style={{ animationDelay: `${0.05 + i * 0.03}s` }}
              >
                {/* Avatar + online dot */}
                <div className="user-card-avatar-wrap">
                  <img src={avatar} alt={u.username} className="user-card-avatar" />
                  {isOnline && <span className="user-online-dot" title="Activo hoy" />}
                  {isMe && <span className="user-me-badge">Tú</span>}
                </div>

                {/* Info */}
                <div className="user-card-info">
                  <span className="user-card-name">{u.display_name || u.username}</span>
                  <span className="user-card-username">@{u.username}</span>
                  <span
                    className="user-card-role"
                    style={{ color: roleInfo.color, borderColor: `color-mix(in srgb, ${roleInfo.color} 40%, transparent)` }}
                  >
                    {roleInfo.label}
                  </span>
                </div>

                {/* Stats */}
                <div className="user-card-stats">
                  <span className="user-stat" title="Nivel">
                    <StarIcon style={{ width: 11, height: 11 }} />
                    {u.level}
                  </span>
                  <span className="user-stat" title="Posts">
                    <ChatBubbleLeftEllipsisIcon style={{ width: 11, height: 11 }} />
                    {u.post_count}
                  </span>
                  {u.badge_count > 0 && (
                    <span className="user-stat user-stat-badges" title="Insignias obtenidas">
                      <TrophyIcon style={{ width: 11, height: 11 }} />
                      {u.badge_count}
                    </span>
                  )}
                  <span className="user-stat" title="Último acceso">
                    <ClockIcon style={{ width: 11, height: 11 }} />
                    {lastSeenLabel}
                  </span>
                  <span className="user-stat" title="Registrado">
                    <CalendarIcon style={{ width: 11, height: 11 }} />
                    {new Date(u.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="user-card-arrow">→</div>
              </Link>
            )
          })}
        </div>
      )}

    </div>
  )
}