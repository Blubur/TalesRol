'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Room } from '@/types/database'
import { changeRoomStatus, deleteRoom } from '../salas/actions'
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
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

export default function AdminRoomsTable({ rooms }: { rooms: Room[] }) {
  const [loading, setLoading]     = useState<string | null>(null)
  const [localRooms, setLocalRooms] = useState(rooms)

  async function handleStatus(roomId: string, status: string) {
    setLoading(roomId + '_status')
    const result = await changeRoomStatus(roomId, status)
    if (!result?.error) {
      setLocalRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: status as any } : r))
    }
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
    <div className="admin-table-scroll" style={{ borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Sala</th>
            <th>Estado</th>
            <th>Tags</th>
            <th>Creada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {localRooms.map(room => (
            <tr key={room.id}>
              <td>
                <div className="room-cell">
                  {room.cover_url ? (
                    <img src={room.cover_url} alt={room.title} className="room-thumb" />
                  ) : (
                    <div className="room-thumb-placeholder" />
                  )}
                  <span className="room-cell-title">{room.title}</span>
                </div>
              </td>
              <td>
                <select
                  className="role-select"
                  value={room.status}
                  disabled={loading === room.id + '_status'}
                  onChange={e => handleStatus(room.id, e.target.value)}
                  style={{ color: STATUS_COLORS[room.status] ?? '#9ca3af', borderColor: STATUS_COLORS[room.status] ?? '#9ca3af' }}
                >
                  {STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </td>
              <td>
                <div className="tags-cell">
                  {room.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </td>
              <td>
                <span className="date-cell">
                  {new Date(room.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}
                </span>
              </td>
              <td>
                <div className="action-btns">
                  <Link
                    href={`/salas/${room.slug}`}
                    className="action-btn neutral"
                    title="Ver sala"
                    target="_blank"
                  >
                    <ArrowTopRightOnSquareIcon className="action-btn-icon" />
                    Ver
                  </Link>
                  <button
                    className="action-btn danger"
                    onClick={() => handleDelete(room.id)}
                    disabled={loading === room.id + '_del'}
                    title="Eliminar"
                  >
                    <TrashIcon className="action-btn-icon" />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {localRooms.length === 0 && (
            <tr><td colSpan={5} className="empty-row">No hay salas.</td></tr>
          )}
        </tbody>
      </table>

      <style>{`
        .admin-table-scroll { overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .admin-table thead tr { background: var(--bg-secondary); }
        .admin-table th { padding: 0.65rem 1rem; text-align: left; font-family: var(--font-cinzel); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; border-bottom: 1px solid var(--border-subtle); }
        .admin-table td { padding: 0.65rem 1rem; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
        .admin-table tbody tr { background: var(--bg-card); transition: background 0.15s; }
        .admin-table tbody tr:hover { background: var(--bg-elevated); }
        .admin-table tbody tr:last-child td { border-bottom: none; }

        .room-cell { display: flex; align-items: center; gap: 0.6rem; }
        .room-thumb { width: 36px; height: 36px; border-radius: 3px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border-subtle); }
        .room-thumb-placeholder { width: 36px; height: 36px; border-radius: 3px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); flex-shrink: 0; }
        .room-cell-title { font-family: var(--font-cinzel); font-size: 0.82rem; color: var(--text-primary); letter-spacing: 0.03em; }

        .role-select { background: transparent; border: 1px solid; border-radius: 3px; padding: 0.2rem 0.5rem; font-size: 0.72rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; cursor: pointer; outline: none; }
        .role-select:disabled { opacity: 0.4; cursor: not-allowed; }
        .role-select option { background: var(--bg-elevated); color: var(--text-primary); }

        .tags-cell { display: flex; gap: 0.3rem; flex-wrap: wrap; }
        .tag-pill { font-size: 0.65rem; padding: 0.1rem 0.4rem; background: rgba(193,6,6,0.1); border: 1px solid rgba(193,6,6,0.2); border-radius: 2px; color: var(--color-crimson); font-family: var(--font-cinzel); letter-spacing: 0.04em; }
        .date-cell { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }
        .empty-row { text-align: center; color: var(--text-muted); padding: 2rem !important; font-style: italic; }

        .action-btns { display: flex; gap: 0.35rem; }
        .action-btn { display: flex; align-items: center; gap: 0.3rem; background: transparent; border: 1px solid; border-radius: 3px; padding: 0.25rem 0.6rem; font-size: 0.7rem; font-family: var(--font-cinzel); letter-spacing: 0.04em; cursor: pointer; transition: all 0.15s; white-space: nowrap; text-decoration: none; }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn.danger { color: #ff6b6b; border-color: rgba(255,107,107,0.4); }
        .action-btn.danger:hover:not(:disabled) { background: rgba(255,107,107,0.1); }
        .action-btn.neutral { color: var(--text-secondary); border-color: var(--border-subtle); }
        .action-btn.neutral:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .action-btn-icon { width: 12px; height: 12px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}