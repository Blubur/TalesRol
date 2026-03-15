'use client'

import { useState } from 'react'
import { createAnnouncement, updateAnnouncement, deleteAnnouncement, togglePinAnnouncement } from './actions'
import { PlusIcon, TrashIcon, PencilSquareIcon, CheckIcon, XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function AdminAnnouncementsTable({ announcements, currentUserId }: { announcements: any[]; currentUserId: string }) {
  const [local, setLocal]         = useState(announcements)
  const [loading, setLoading]     = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData]   = useState({ title: '', content: '' })
  const [creating, setCreating]   = useState(false)
  const [newData, setNewData]     = useState({ title: '', content: '' })
  const [error, setError]         = useState<string | null>(null)

  async function handleCreate() {
    if (!newData.title || !newData.content) return
    setLoading('create')
    const result = await createAnnouncement(newData.title, newData.content, currentUserId)
    if (result?.error) { setError(result.error) } else if (result?.data) {
      setLocal(prev => [result.data, ...prev])
      setNewData({ title: '', content: '' })
      setCreating(false)
    }
    setLoading(null)
  }

  async function handleSaveEdit(id: string) {
    if (!editData.title || !editData.content) return
    setLoading(id)
    const result = await updateAnnouncement(id, editData.title, editData.content)
    if (result?.error) { setError(result.error) } else {
      setLocal(prev => prev.map(a => a.id === id ? { ...a, ...editData } : a))
      setEditingId(null)
    }
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este anuncio?')) return
    setLoading(id + '_del')
    const result = await deleteAnnouncement(id)
    if (result?.error) { setError(result.error) } else {
      setLocal(prev => prev.filter(a => a.id !== id))
    }
    setLoading(null)
  }

  async function handlePin(id: string, current: boolean) {
    setLoading(id + '_pin')
    const result = await togglePinAnnouncement(id, !current)
    if (result?.error) { setError(result.error) } else {
      setLocal(prev => prev.map(a => a.id === id ? { ...a, is_pinned: !current } : a))
    }
    setLoading(null)
  }

  return (
    <div className="ann-wrap">
      {error && <p className="ann-error">{error}</p>}

      {/* Botón crear */}
      {!creating && (
        <button className="ann-create-btn" onClick={() => setCreating(true)}>
          <PlusIcon style={{ width: 14, height: 14 }} /> Nuevo anuncio
        </button>
      )}

      {/* Formulario crear */}
      {creating && (
        <div className="ann-form-card">
          <input
            className="ann-input"
            value={newData.title}
            onChange={e => setNewData(p => ({ ...p, title: e.target.value }))}
            placeholder="Título del anuncio"
            autoFocus
          />
          <textarea
            className="ann-textarea"
            value={newData.content}
            onChange={e => setNewData(p => ({ ...p, content: e.target.value }))}
            placeholder="Contenido del anuncio..."
            rows={4}
          />
          <div className="ann-form-actions">
            <button className="action-btn success" onClick={handleCreate} disabled={loading === 'create'}>
              <CheckIcon className="action-btn-icon" /> Publicar
            </button>
            <button className="action-btn neutral" onClick={() => setCreating(false)}>
              <XMarkIcon className="action-btn-icon" /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="ann-list">
        {local.length === 0 && !creating && (
          <p className="ann-empty">No hay anuncios publicados.</p>
        )}
        {local.map(ann => (
          <div key={ann.id} className={`ann-card ${ann.is_pinned ? 'pinned' : ''}`}>
            {editingId === ann.id ? (
              <div className="ann-form-card">
                <input
                  className="ann-input"
                  value={editData.title}
                  onChange={e => setEditData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Título"
                  autoFocus
                />
                <textarea
                  className="ann-textarea"
                  value={editData.content}
                  onChange={e => setEditData(p => ({ ...p, content: e.target.value }))}
                  placeholder="Contenido"
                  rows={4}
                />
                <div className="ann-form-actions">
                  <button className="action-btn success" onClick={() => handleSaveEdit(ann.id)} disabled={loading === ann.id}>
                    <CheckIcon className="action-btn-icon" /> Guardar
                  </button>
                  <button className="action-btn neutral" onClick={() => setEditingId(null)}>
                    <XMarkIcon className="action-btn-icon" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="ann-card-header">
                  <div className="ann-card-meta">
                    {ann.is_pinned && <MapPinIcon className="ann-pin-icon" />}
                    <h3 className="ann-card-title">{ann.title}</h3>
                  </div>
                  <span className="ann-card-date">
                    {new Date(ann.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="ann-card-content">{ann.content}</p>
                {ann.profiles && (
                  <span className="ann-card-author">Por {ann.profiles.display_name || ann.profiles.username}</span>
                )}
                <div className="ann-card-actions">
                  <button
                    className={`action-btn ${ann.is_pinned ? 'pinned-btn' : 'neutral'}`}
                    onClick={() => handlePin(ann.id, ann.is_pinned)}
                    disabled={loading === ann.id + '_pin'}
                    title={ann.is_pinned ? 'Desfijar' : 'Fijar'}
                  >
                    <MapPinIcon className="action-btn-icon" />
                    {ann.is_pinned ? 'Desfijar' : 'Fijar'}
                  </button>
                  <button className="action-btn neutral" onClick={() => { setEditingId(ann.id); setEditData({ title: ann.title, content: ann.content }) }}>
                    <PencilSquareIcon className="action-btn-icon" /> Editar
                  </button>
                  <button className="action-btn danger" onClick={() => handleDelete(ann.id)} disabled={loading === ann.id + '_del'}>
                    <TrashIcon className="action-btn-icon" /> Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .ann-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
        .ann-error { color: #ff6b6b; font-size: 0.82rem; margin: 0; }
        .ann-empty { color: var(--text-muted); font-style: italic; font-size: 0.88rem; margin: 0; }

        .ann-create-btn { display: flex; align-items: center; gap: 0.4rem; background: transparent; border: 1px dashed var(--border-medium); border-radius: 4px; padding: 0.45rem 1rem; color: var(--text-muted); cursor: pointer; font-size: 0.78rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; transition: all 0.15s; width: fit-content; }
        .ann-create-btn:hover { border-color: var(--color-crimson); color: var(--color-crimson); background: rgba(193,6,6,0.04); }

        .ann-form-card { background: var(--bg-secondary); border: 1px solid var(--color-crimson); border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .ann-input { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.5rem 0.75rem; font-size: 0.9rem; font-family: var(--font-cinzel); letter-spacing: 0.03em; color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .ann-input:focus { border-color: var(--color-crimson); }
        .ann-textarea { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.5rem 0.75rem; font-size: 0.88rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; resize: vertical; font-family: inherit; line-height: 1.6; }
        .ann-textarea:focus { border-color: var(--color-crimson); }
        .ann-form-actions { display: flex; gap: 0.5rem; }

        .ann-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .ann-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .ann-card.pinned { border-left: 3px solid var(--color-crimson); }
        .ann-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
        .ann-card-meta { display: flex; align-items: center; gap: 0.4rem; }
        .ann-pin-icon { width: 14px; height: 14px; color: var(--color-crimson); flex-shrink: 0; }
        .ann-card-title { font-family: var(--font-cinzel); font-size: 0.95rem; font-weight: 600; letter-spacing: 0.04em; margin: 0; }
        .ann-card-date { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-cinzel); white-space: nowrap; }
        .ann-card-content { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0; white-space: pre-line; }
        .ann-card-author { font-size: 0.72rem; color: var(--text-muted); }
        .ann-card-actions { display: flex; gap: 0.4rem; padding-top: 0.25rem; border-top: 1px solid var(--border-subtle); }

        .action-btn { display: flex; align-items: center; gap: 0.3rem; background: transparent; border: 1px solid; border-radius: 3px; padding: 0.25rem 0.6rem; font-size: 0.7rem; font-family: var(--font-cinzel); letter-spacing: 0.04em; cursor: pointer; transition: all 0.15s; }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn.danger  { color: #ff6b6b; border-color: rgba(255,107,107,0.4); }
        .action-btn.danger:hover:not(:disabled)  { background: rgba(255,107,107,0.1); }
        .action-btn.success { color: #34d399; border-color: rgba(52,211,153,0.4); }
        .action-btn.success:hover:not(:disabled) { background: rgba(52,211,153,0.1); }
        .action-btn.neutral { color: var(--text-muted); border-color: var(--border-subtle); }
        .action-btn.neutral:hover { color: var(--text-primary); background: var(--bg-elevated); }
        .action-btn.pinned-btn { color: var(--color-crimson); border-color: rgba(193,6,6,0.4); }
        .action-btn.pinned-btn:hover { background: rgba(193,6,6,0.08); }
        .action-btn-icon { width: 12px; height: 12px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}