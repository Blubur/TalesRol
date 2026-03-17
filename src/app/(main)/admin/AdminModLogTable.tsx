'use client'

import { useState } from 'react'

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  ban_user:              { label: 'Baneo',            color: '#ff6b6b' },
  unban_user:            { label: 'Desbaneo',         color: '#34d399' },
  change_role:           { label: 'Cambio de rol',    color: '#60a5fa' },
  ban_ip:                { label: 'Baneo de IP',      color: '#f87171' },
  warn_user:             { label: 'Aviso a usuario',  color: '#fbbf24' },
  warn_room:             { label: 'Aviso a sala',     color: '#fbbf24' },
  close_room_temp:       { label: 'Cierre temporal',  color: '#d4820a' },
  close_room_perm:       { label: 'Cierre permanente',color: '#ef4444' },
  delete_room:           { label: 'Sala eliminada',   color: '#9ca3af' },
  transfer_room:         { label: 'Transferencia',    color: '#a78bfa' },
}

const TARGET_ICONS: Record<string, string> = {
  user:   '👤',
  room:   '🏰',
  post:   '📝',
  ip:     '🌐',
  system: '⚙️',
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

export default function AdminModLogTable({ logs }: { logs: LogEntry[] }) {
  const [filter, setFilter] = useState<string>('all')

  const actionTypes = ['all', ...Array.from(new Set(logs.map(l => l.action)))]

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action === filter)

  return (
    <div className="modlog-wrap">
      <div className="modlog-filters">
        {actionTypes.map(a => (
          <button
            key={a}
            className={`modlog-filter-btn ${filter === a ? 'active' : ''}`}
            onClick={() => setFilter(a)}
          >
            {a === 'all' ? 'Todas' : (ACTION_LABELS[a]?.label ?? a)}
          </button>
        ))}
      </div>

      <div className="modlog-list">
        {filtered.length === 0 && (
          <div className="modlog-empty">No hay acciones registradas.</div>
        )}
        {filtered.map(log => {
          const meta = ACTION_LABELS[log.action]
          const adminAvatar = log.admin?.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${log.admin?.username}`
          return (
            <div key={log.id} className="modlog-row">
              <div className="modlog-action-col">
                <span
                  className="modlog-action-badge"
                  style={{ color: meta?.color ?? '#9ca3af', borderColor: (meta?.color ?? '#9ca3af') + '44', background: (meta?.color ?? '#9ca3af') + '18' }}
                >
                  {meta?.label ?? log.action}
                </span>
              </div>

              <div className="modlog-target-col">
                <span className="modlog-target-icon">{TARGET_ICONS[log.target_type] ?? '•'}</span>
                <span className="modlog-target-label">{log.target_label ?? log.target_id ?? '—'}</span>
              </div>

              {log.notes && (
                <div className="modlog-notes">{log.notes}</div>
              )}

              <div className="modlog-meta">
                {log.admin && (
                  <div className="modlog-admin">
                    <img src={adminAvatar} alt="" className="modlog-admin-avatar" />
                    <span>{log.admin.display_name || log.admin.username}</span>
                  </div>
                )}
                <span className="modlog-date">
                  {new Date(log.created_at).toLocaleString('es-ES', {
                    day: 'numeric', month: 'short', year: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}