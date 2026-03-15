'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteRoom, changeRoomStatus } from '../actions'
import {
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

const STATUSES = [
  { value: 'pending',  label: 'Próximamente', color: '#60a5fa' },
  { value: 'active',   label: 'Activa',       color: '#ff8888' },
  { value: 'paused',   label: 'En pausa',     color: '#d4820a' },
  { value: 'finished', label: 'Finalizada',   color: '#34d399' },
  { value: 'closed',   label: 'Cerrada',      color: '#808080' },
]

export default function RoomActions({ roomId, slug, currentStatus }: { roomId: string; slug: string; currentStatus?: string }) {
  const [loading, setLoading]       = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [status, setStatus]         = useState(currentStatus ?? 'active')
  const [error, setError]           = useState<string | null>(null)

  async function handleDelete() {
    if (!confirm('¿Eliminar esta sala? Se archivarán todos sus temas.')) return
    setLoading(true)
    await deleteRoom(roomId)
  }

  async function handleStatusChange(newStatus: string) {
    if (newStatus === status) { setStatusOpen(false); return }
    setLoading(true)
    setError(null)
    const result = await changeRoomStatus(roomId, newStatus)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setStatus(newStatus)
      setStatusOpen(false)
      setLoading(false)
    }
  }

  const current = STATUSES.find(s => s.value === status)

  return (
    <div className="room-actions-wrap">
      {/* Selector de estado */}
      <div className="status-selector">
        <button
          className="status-btn"
          onClick={() => setStatusOpen(v => !v)}
          disabled={loading}
          style={{ borderColor: current?.color, color: current?.color }}
        >
          <span className="status-dot" style={{ background: current?.color }} />
          {current?.label}
          <ChevronDownIcon className={`status-caret ${statusOpen ? 'open' : ''}`} />
        </button>

        {statusOpen && (
          <div className="status-dropdown">
            {STATUSES.map(s => (
              <button
                key={s.value}
                className={`status-option ${s.value === status ? 'active' : ''}`}
                onClick={() => handleStatusChange(s.value)}
              >
                <span className="status-dot" style={{ background: s.color }} />
                {s.label}
                {s.value === status && <CheckIcon className="status-check" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editar */}
      <Link
        href={`/salas/${slug}/editar`}
        className="btn-ghost room-action-btn"
      >
        <PencilSquareIcon className="room-action-icon" />
        Editar
      </Link>

      {/* Eliminar */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="btn-ghost room-action-btn danger"
      >
        <TrashIcon className="room-action-icon" />
        Eliminar
      </button>

      {error && <span className="room-action-error">{error}</span>}

      <style>{`
        .room-actions-wrap { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; position: relative; }

        .status-selector { position: relative; }
        .status-btn { display: flex; align-items: center; gap: 0.4rem; background: transparent; border: 1px solid; border-radius: 4px; padding: 0.35rem 0.75rem; font-size: 0.75rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .status-btn:hover { opacity: 0.8; }
        .status-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .status-caret { width: 12px; height: 12px; transition: transform 0.2s; }
        .status-caret.open { transform: rotate(180deg); }

        .status-dropdown { position: absolute; top: calc(100% + 6px); left: 0; background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: 6px; min-width: 160px; box-shadow: 0 12px 32px rgba(0,0,0,0.5); z-index: 200; overflow: hidden; animation: dropdownIn 0.15s ease-out; }
        @keyframes dropdownIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .status-option { display: flex; align-items: center; gap: 0.5rem; width: 100%; padding: 0.55rem 0.85rem; background: transparent; border: none; font-size: 0.82rem; font-family: var(--font-cinzel); letter-spacing: 0.04em; color: var(--text-secondary); cursor: pointer; transition: background 0.15s; }
        .status-option:hover { background: rgba(193,6,6,0.08); color: var(--text-primary); }
        .status-option.active { color: var(--text-primary); background: rgba(193,6,6,0.06); }
        .status-check { width: 13px; height: 13px; margin-left: auto; color: var(--color-crimson); }

        .room-action-btn { display: flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; font-size: 0.78rem; }
        .room-action-btn.danger { color: var(--text-muted); }
        .room-action-btn.danger:hover { color: #ff4444; border-color: #ff4444; }
        .room-action-icon { width: 14px; height: 14px; flex-shrink: 0; }
        .room-action-error { font-size: 0.75rem; color: #ff6b6b; }
      `}</style>
    </div>
  )
}