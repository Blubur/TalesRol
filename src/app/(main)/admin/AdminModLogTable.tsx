'use client'

import { useState, useMemo } from 'react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  ban_user:        { label: 'Baneo',             color: '#ff6b6b' },
  unban_user:      { label: 'Desbaneo',          color: '#34d399' },
  change_role:     { label: 'Cambio de rol',     color: '#60a5fa' },
  ban_ip:          { label: 'Baneo de IP',       color: '#f87171' },
  warn_user:       { label: 'Aviso a usuario',   color: '#fbbf24' },
  warn_room:       { label: 'Aviso a sala',      color: '#fbbf24' },
  close_room_temp: { label: 'Cierre temporal',   color: '#d4820a' },
  close_room_perm: { label: 'Cierre permanente', color: '#ef4444' },
  delete_room:     { label: 'Sala eliminada',    color: '#9ca3af' },
  transfer_room:   { label: 'Transferencia',     color: '#a78bfa' },
}

const TARGET_TYPE_LABELS: Record<string, string> = {
  user: 'Usuario', room: 'Sala', post: 'Post', ip: 'IP', system: 'Sistema',
}

type LogEntry = {
  id: string
  action: string
  target_type: string
  target_id: string | null
  target_label: string | null
  notes: string | null
  created_at: string
  admin: { username: string; display_name: string | null; avatar_url: string | null } | null
}

type SortField = 'created_at' | 'action' | 'target_type'
type SortDir   = 'asc' | 'desc'

export default function AdminModLogTable({ logs }: { logs: LogEntry[] }) {
  const [actionFilter,     setActionFilter]     = useState('all')
  const [targetTypeFilter, setTargetTypeFilter] = useState('all')
  const [dateFrom,         setDateFrom]         = useState('')
  const [dateTo,           setDateTo]           = useState('')
  const [sortField,        setSortField]        = useState<SortField>('created_at')
  const [sortDir,          setSortDir]          = useState<SortDir>('desc')

  const uniqueActions = Array.from(new Set(logs.map(l => l.action)))

  const filtered = useMemo(() => {
    let result = logs

    if (actionFilter !== 'all')
      result = result.filter(l => l.action === actionFilter)

    if (targetTypeFilter !== 'all')
      result = result.filter(l => l.target_type === targetTypeFilter)

    if (dateFrom)
      result = result.filter(l => new Date(l.created_at) >= new Date(dateFrom))
    if (dateTo)
      result = result.filter(l => new Date(l.created_at) <= new Date(dateTo + 'T23:59:59'))

    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'created_at')
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      else if (sortField === 'action')
        cmp = (ACTION_LABELS[a.action]?.label ?? a.action).localeCompare(ACTION_LABELS[b.action]?.label ?? b.action)
      else if (sortField === 'target_type')
        cmp = a.target_type.localeCompare(b.target_type)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [logs, actionFilter, targetTypeFilter, dateFrom, dateTo, sortField, sortDir])

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
    setActionFilter('all'); setTargetTypeFilter('all'); setDateFrom(''); setDateTo('')
  }

  const hasActiveFilters = actionFilter !== 'all' || targetTypeFilter !== 'all' || dateFrom || dateTo

  return (
    <div className="admin-table-wrap">

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Acción</span>
          <div className="filter-btns">
            <button className={`filter-btn ${actionFilter === 'all' ? 'active' : ''}`} onClick={() => setActionFilter('all')}>Todas</button>
            {uniqueActions.map(a => {
              const meta = ACTION_LABELS[a]
              return (
                <button
                  key={a}
                  className={`filter-btn ${actionFilter === a ? 'active' : ''}`}
                  onClick={() => setActionFilter(a)}
                  style={actionFilter === a ? { color: meta?.color, borderColor: (meta?.color ?? '#9ca3af') + '88', background: (meta?.color ?? '#9ca3af') + '18' } : {}}
                >
                  {meta?.label ?? a}
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Tipo</span>
          <div className="filter-btns">
            <button className={`filter-btn ${targetTypeFilter === 'all' ? 'active' : ''}`} onClick={() => setTargetTypeFilter('all')}>Todos</button>
            {['user', 'room', 'post', 'ip', 'system'].map(t => (
              <button
                key={t}
                className={`filter-btn ${targetTypeFilter === t ? 'active' : ''}`}
                onClick={() => setTargetTypeFilter(t)}
              >
                {TARGET_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Fecha</span>
          <div className="filter-dates">
            <input type="date" className="filter-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span className="filter-date-sep">—</span>
            <input type="date" className="filter-date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        {hasActiveFilters && (
          <button className="filter-clear-btn" onClick={clearFilters}>Limpiar filtros</button>
        )}
        <span className="filter-count">{filtered.length} de {logs.length}</span>
      </div>

      {/* ── Tabla ────────────────────────────────────────────────────────── */}
      <div className="admin-table-scroll" style={{ borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <button className="sort-th" onClick={() => toggleSort('action')}>
                  Acción <SortIcon field="action" />
                </button>
              </th>
              <th>
                <button className="sort-th" onClick={() => toggleSort('target_type')}>
                  Tipo <SortIcon field="target_type" />
                </button>
              </th>
              <th>Objetivo</th>
              <th>Notas</th>
              <th>Admin</th>
              <th>
                <button className="sort-th" onClick={() => toggleSort('created_at')}>
                  Fecha <SortIcon field="created_at" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => {
              const meta       = ACTION_LABELS[log.action]
              const adminAvatar = log.admin?.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${log.admin?.username}`
              return (
                <tr key={log.id}>
                  <td>
                    <span
                      className="modlog-action-badge"
                      style={{ color: meta?.color ?? '#9ca3af', borderColor: (meta?.color ?? '#9ca3af') + '44', background: (meta?.color ?? '#9ca3af') + '18' }}
                    >
                      {meta?.label ?? log.action}
                    </span>
                  </td>
                  <td>
                    <span className="date-cell">{TARGET_TYPE_LABELS[log.target_type] ?? log.target_type}</span>
                  </td>
                  <td>
                    <span className="owner-name">{log.target_label ?? log.target_id ?? '—'}</span>
                  </td>
                  <td>
                    <span className="email-cell">{log.notes ?? '—'}</span>
                  </td>
                  <td>
                    {log.admin ? (
                      <div className="owner-cell">
                        <img src={adminAvatar} alt="" className="owner-avatar" />
                        <span className="owner-name">{log.admin.display_name || log.admin.username}</span>
                      </div>
                    ) : <span className="date-cell">—</span>}
                  </td>
                  <td>
                    <span className="date-cell">
                      {new Date(log.created_at).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="empty-row">No hay acciones registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}