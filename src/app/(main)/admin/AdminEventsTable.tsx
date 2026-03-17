'use client'

import { useState } from 'react'
import { createEvent, updateEvent, deleteEvent } from './actions'

interface Room {
  id: string
  title: string
  slug: string
}

interface Event {
  id: string
  title: string
  description: string | null
  type: string
  status: string
  starts_at: string
  ends_at: string | null
  room_id: string | null
  rooms: { title: string } | null
}

interface Props {
  events: Event[]
  rooms: Room[]
}

const EVENT_TYPES   = ['sesion', 'torneo', 'especial', 'otro']
const EVENT_STATUSES = ['programado', 'en_curso', 'finalizado', 'cancelado']

function toDatetimeLocal(iso: string | null) {
  if (!iso) return ''
  return iso.slice(0, 16) // "YYYY-MM-DDTHH:MM"
}

export default function AdminEventsTable({ events, rooms }: Props) {
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await createEvent(new FormData(e.currentTarget))
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else { setCreating(false); window.location.reload() }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('id', id)
    const result = await updateEvent(fd)
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else { setEditingId(null); window.location.reload() }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este evento?')) return
    setLoading(true)
    const result = await deleteEvent(id)
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else window.location.reload()
  }

  function EventForm({ event }: { event?: Event }) {
    return (
      <form onSubmit={event ? e => handleUpdate(e, event.id) : handleCreate} className="ev-admin-form">
        <div className="ev-admin-form-grid">
          <div className="form-group">
            <label>Título *</label>
            <input name="title" className="input-base" required defaultValue={event?.title} />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select name="type" className="input-base" defaultValue={event?.type ?? 'sesion'}>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {event && (
            <div className="form-group">
              <label>Estado</label>
              <select name="status" className="input-base" defaultValue={event.status}>
                {EVENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Inicio *</label>
            <input name="starts_at" type="datetime-local" className="input-base" required
              defaultValue={toDatetimeLocal(event?.starts_at ?? null)} />
          </div>

          <div className="form-group">
            <label>Fin <span className="optional">(opcional)</span></label>
            <input name="ends_at" type="datetime-local" className="input-base"
              defaultValue={toDatetimeLocal(event?.ends_at ?? null)} />
          </div>

          <div className="form-group">
            <label>Sala <span className="optional">(opcional)</span></label>
            <select name="room_id" className="input-base" defaultValue={event?.room_id ?? ''}>
              <option value="">— Sin sala —</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Descripción <span className="optional">(opcional)</span></label>
          <textarea name="description" className="input-base" rows={2}
            defaultValue={event?.description ?? ''} />
        </div>

        {error && <div className="auth-error"><span>⚠</span> {error}</div>}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn-primary" disabled={loading}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
            {loading ? 'Guardando...' : event ? 'Guardar cambios' : 'Crear evento'}
          </button>
          <button type="button" className="btn-ghost" disabled={loading}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
            onClick={() => { setCreating(false); setEditingId(null) }}>
            Cancelar
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Eventos y sesiones</h2>
        {!creating && (
          <button className="btn-primary" onClick={() => setCreating(true)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
            + Nuevo evento
          </button>
        )}
      </div>

      {creating && <EventForm />}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Sala</th>
              <th>Inicio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                No hay eventos todavía
              </td></tr>
            )}
            {events.map(ev => (
              <>
                <tr key={ev.id}>
                  <td>{ev.title}</td>
                  <td><span style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>{ev.type}</span></td>
                  <td><span style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>{ev.status}</span></td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {ev.rooms?.title ?? '—'}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(ev.starts_at).toLocaleString('es-ES', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn-ghost" onClick={() => setEditingId(editingId === ev.id ? null : ev.id)}
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                        Editar
                      </button>
                      <button className="btn-danger" onClick={() => handleDelete(ev.id)}
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
                {editingId === ev.id && (
                  <tr key={`${ev.id}-edit`}>
                    <td colSpan={6} style={{ background: 'var(--bg-elevated)', padding: '1rem' }}>
                      <EventForm event={ev} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .ev-admin-form {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .ev-admin-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  )
}