'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Room } from '@/types/database'
import { changeRoomStatus, deleteRoom } from '../salas/actions'
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'

const STATUSES = [
  { value: 'pending',  label: 'Próximamente', color: '#60a5fa' },
  { value: 'active',   label: 'Activa',       color: '#34d399' },
  { value: 'paused',   label: 'En pausa',     color: '#d4820a' },
  { value: 'finished', label: 'Finalizada',   color: '#a78bfa' },
  { value: 'closed',   label: 'Cerrada',      color: '#9ca3af' },
  { value: 'archived', label: 'Archivada',    color: '#6b7280' },
]

const STATUS_COLORS: Record<string, string> = Object.fromEntries(STATUSES.map(s => [s.value, s.color]))

type SortField = 'title' | 'created_at'
type SortDir   = 'asc' | 'desc'

type RoomWithOwner = Room & {
  owner: { username: string; display_name: string | null; avatar_url: string | null } | null
}

export default function AdminRoomsTable({ rooms }: { rooms: RoomWithOwner[] }) {
  const [loading, setLoading]       = useState<string | null>(null)
  const [localRooms, setLocalRooms] = useState(rooms)

  // ── Filtros ───────────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState('all')
  const [search,       setSearch]       = useState('')
  const [dateFrom,     setDateFrom]     = useState('')
  const [dateTo,       setDateTo]       = useState('')

  // ── Ordenación ────────────────────────────────────────────────────────────
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir,   setSortDir]   = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    let result = localRooms

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.owner?.username ?? '').toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all')
      result = result.filter(r => r.status === statusFilter)

    if (dateFrom)
      result = result.filter(r => new Date(r.created_at) >= new Date(dateFrom))
    if (dateTo)
      result = result.filter(r => new Date(r.created_at) <= new Date(dateTo + 'T23:59:59'))

    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'title')
        cmp = a.title.localeCompare(b.title)
      else if (sortField === 'created_at')
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [localRooms, search, statusFilter, dateFrom, dateTo, sortField, sortDir])

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
    setSearch(''); setStatusFilter('all'); setDateFrom(''); setDateTo('')
  }

  const hasActiveFilters = search || statusFilter !== 'all' || dateFrom || dateTo

  async function handleStatus(roomId: string, status: string) {
    setLoading(roomId + '_status')
    const result = await changeRoomStatus(roomId, status)
    if (!result?.error)
      setLocalRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: status as any } : r))
    setLoading(null)
  }

  async function handleDelete(roomId: string) {
    if (!confirm('¿Eliminar esta sala permanentemente?')) return
    setLoading(roomId + '_del')
    await deleteRoom(roomId)
    setLocalRooms(prev => prev.filter(r => r.id !== roomId))
    setLoading(null)
  }

  return (
    <div className="admin-table-wrap">

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="users-toolbar">
        <div className="admin-search-wrap">
          <input
            type="text"
            placeholder="Buscar por título o creador..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-search"
            style={{ paddingLeft: '0.75rem' }}
          />
        </div>
      </div>

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Estado</span>
          <div className="filter-btns">
            <button className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>Todos</button>
            {STATUSES.map(s => (
              <button
                key={s.value}
                className={`filter-btn ${statusFilter === s.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(s.value)}
                style={statusFilter === s.value ? { color: s.color, borderColor: s.color + '88', background: s.color + '18' } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Creación</span>
          <div className="filter-dates">
            <input type="date" className="filter-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span className="filter-date-sep">—</span>
            <input type="date" className="filter-date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        {hasActiveFilters && (
          <button className="filter-clear-btn" onClick={clearFilters}>Limpiar filtros</button>
        )}
        <span className="filter-count">{filtered.length} de {localRooms.length}</span>
      </div>

      {/* ── Tabla ────────────────────────────────────────────────────────── */}
      <div className="admin-table-scroll" style={{ borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <button className="sort-th" onClick={() => toggleSort('title')}>
                  Sala <SortIcon field="title" />
                </button>
              </th>
              <th>Creador</th>
              <th>Estado</th>
              <th>Tags</th>
              <th>
                <button className="sort-th" onClick={() => toggleSort('created_at')}>
                  Creada <SortIcon field="created_at" />
                </button>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(room => (
              <tr key={room.id}>
                <td>
                  <div className="room-cell">
                    {room.cover_url
                      ? <img src={room.cover_url} alt={room.title} className="room-thumb" />
                      : <div className="room-thumb-placeholder" />
                    }
                    <span className="room-cell-title">{room.title}</span>
                  </div>
                </td>
                <td>
                  {room.owner ? (
                    <div className="owner-cell">
                      {room.owner.avatar_url && <img src={room.owner.avatar_url} alt="" className="owner-avatar" />}
                      <div className="owner-cell-info">
                        <span className="owner-name">{room.owner.display_name || room.owner.username}</span>
                        <span className="owner-username">@{room.owner.username}</span>
                      </div>
                    </div>
                  ) : <span className="date-cell">—</span>}
                </td>
                <td>
                  <select
                    className="role-select"
                    value={room.status}
                    disabled={loading === room.id + '_status'}
                    onChange={e => handleStatus(room.id, e.target.value)}
                    style={{ color: STATUS_COLORS[room.status] ?? '#9ca3af', borderColor: STATUS_COLORS[room.status] ?? '#9ca3af' }}
                  >
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
                <td>
                  <div className="tags-cell">
{(Array.isArray(room.tags) ? room.tags.slice(0, 3) : []).map(tag => (
  <span key={String(tag)} className="tag-pill">{String(tag)}</span>
))}                  </div>
                </td>
                <td>
                  <span className="date-cell">
                    {new Date(room.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <Link href={`/salas/${room.slug}`} className="action-btn neutral" title="Ver sala" target="_blank">
                      <ArrowTopRightOnSquareIcon className="action-btn-icon" /> Ver
                    </Link>
                    <button className="action-btn danger" onClick={() => handleDelete(room.id)} disabled={loading === room.id + '_del'} title="Eliminar">
                      <TrashIcon className="action-btn-icon" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="empty-row">No hay salas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}