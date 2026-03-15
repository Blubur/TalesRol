'use client'

import { useState } from 'react'
import { createTag, updateTag, deleteTag } from './actions'
import { PlusIcon, TrashIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

const PRESET_COLORS = [
  '#c10606', '#ff8c42', '#fbbf24', '#34d399', '#60a5fa',
  '#a78bfa', '#f472b6', '#94a3b8', '#6ee7b7', '#fb923c',
]

export default function AdminTagsTable({ tags }: { tags: any[] }) {
  const [localTags, setLocalTags] = useState(tags)
  const [loading, setLoading]     = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData]   = useState({ name: '', color: '#c10606' })
  const [creating, setCreating]   = useState(false)
  const [newData, setNewData]     = useState({ name: '', color: '#c10606' })
  const [error, setError]         = useState<string | null>(null)

  async function handleSaveEdit(id: string) {
    if (!editData.name) return
    setLoading(id)
    const result = await updateTag(id, editData.name, editData.color)
    if (result?.error) { setError(result.error) } else {
      setLocalTags(prev => prev.map(t => t.id === id ? { ...t, ...editData } : t))
      setEditingId(null)
    }
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta etiqueta?')) return
    setLoading(id)
    const result = await deleteTag(id)
    if (result?.error) { setError(result.error) } else {
      setLocalTags(prev => prev.filter(t => t.id !== id))
    }
    setLoading(null)
  }

  async function handleCreate() {
    if (!newData.name) return
    setLoading('create')
    const result = await createTag(newData.name, newData.color)
    if (result?.error) { setError(result.error) } else if (result?.data) {
      setLocalTags(prev => [...prev, result.data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewData({ name: '', color: '#c10606' })
      setCreating(false)
    }
    setLoading(null)
  }

  function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
    return (
      <div className="color-picker">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            type="button"
            className={`color-swatch ${value === c ? 'selected' : ''}`}
            style={{ background: c }}
            onClick={() => onChange(c)}
          />
        ))}
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="color-custom" title="Color personalizado" />
      </div>
    )
  }

  return (
    <div className="tags-wrap">
      {error && <p className="tags-error">{error}</p>}

      <div className="tags-list-admin">
        {localTags.map(tag => (
          <div key={tag.id} className="tag-row">
            {editingId === tag.id ? (
              <div className="tag-edit-form">
                <input
                  className="dice-input"
                  value={editData.name}
                  onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Nombre de la etiqueta"
                />
                <ColorPicker value={editData.color} onChange={c => setEditData(p => ({ ...p, color: c }))} />
                <div className="tag-preview-wrap">
                  <span className="tag-preview" style={{ color: editData.color, borderColor: editData.color }}>
                    {editData.name || 'Vista previa'}
                  </span>
                </div>
                <div className="tag-edit-actions">
                  <button className="action-btn success" onClick={() => handleSaveEdit(tag.id)} disabled={loading === tag.id}>
                    <CheckIcon className="action-btn-icon" /> Guardar
                  </button>
                  <button className="action-btn neutral" onClick={() => setEditingId(null)}>
                    <XMarkIcon className="action-btn-icon" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="tag-pill-admin" style={{ color: tag.color, borderColor: tag.color, background: `${tag.color}18` }}>
                  {tag.name}
                </span>
                <div className="tag-color-dot" style={{ background: tag.color }} />
                <span className="tag-color-hex">{tag.color}</span>
                <div className="tag-row-actions">
                  <button className="action-btn neutral" onClick={() => { setEditingId(tag.id); setEditData({ name: tag.name, color: tag.color }) }}>
                    <PencilSquareIcon className="action-btn-icon" />
                  </button>
                  <button className="action-btn danger" onClick={() => handleDelete(tag.id)} disabled={loading === tag.id}>
                    <TrashIcon className="action-btn-icon" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Crear */}
        {creating ? (
          <div className="tag-row tag-create-row">
            <div className="tag-edit-form">
              <input
                className="dice-input"
                value={newData.name}
                onChange={e => setNewData(p => ({ ...p, name: e.target.value }))}
                placeholder="Nombre de la etiqueta"
                autoFocus
              />
              <ColorPicker value={newData.color} onChange={c => setNewData(p => ({ ...p, color: c }))} />
              <div className="tag-preview-wrap">
                <span className="tag-preview" style={{ color: newData.color, borderColor: newData.color }}>
                  {newData.name || 'Vista previa'}
                </span>
              </div>
              <div className="tag-edit-actions">
                <button className="action-btn success" onClick={handleCreate} disabled={loading === 'create'}>
                  <CheckIcon className="action-btn-icon" /> Crear
                </button>
                <button className="action-btn neutral" onClick={() => setCreating(false)}>
                  <XMarkIcon className="action-btn-icon" /> Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="tag-add-btn" onClick={() => setCreating(true)}>
            <PlusIcon style={{ width: 14, height: 14 }} /> Nueva etiqueta
          </button>
        )}
      </div>

      <style>{`
        .tags-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
        .tags-error { color: #ff6b6b; font-size: 0.82rem; margin: 0; }

        .tags-list-admin { display: flex; flex-direction: column; gap: 2px; border: 1px solid var(--border-subtle); border-radius: 6px; overflow: hidden; }
        .tag-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem; background: var(--bg-card); border-bottom: 1px solid var(--border-subtle); }
        .tag-row:last-child { border-bottom: none; }
        .tag-row:hover { background: var(--bg-elevated); }

        .tag-pill-admin { font-size: 0.78rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; padding: 0.2rem 0.6rem; border-radius: 3px; border: 1px solid; min-width: 80px; text-align: center; }
        .tag-color-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        .tag-color-hex { font-size: 0.72rem; color: var(--text-muted); font-family: monospace; flex: 1; }
        .tag-row-actions { display: flex; gap: 0.35rem; margin-left: auto; }

        .tag-edit-form { display: flex; flex-direction: column; gap: 0.6rem; width: 100%; padding: 0.5rem 0; }
        .tag-preview-wrap { display: flex; align-items: center; gap: 0.5rem; }
        .tag-preview { font-size: 0.78rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; padding: 0.2rem 0.6rem; border-radius: 3px; border: 1px solid; }
        .tag-edit-actions { display: flex; gap: 0.35rem; }
        .tag-create-row { background: rgba(193,6,6,0.03) !important; }

        .tag-add-btn { display: flex; align-items: center; gap: 0.4rem; background: transparent; border: none; padding: 0.65rem 1rem; color: var(--text-muted); cursor: pointer; font-size: 0.78rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; transition: color 0.15s; width: 100%; text-align: left; }
        .tag-add-btn:hover { color: var(--color-crimson); }

        .color-picker { display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; }
        .color-swatch { width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.15s; flex-shrink: 0; }
        .color-swatch:hover { transform: scale(1.2); }
        .color-swatch.selected { border-color: #fff; box-shadow: 0 0 0 1px rgba(255,255,255,0.5); transform: scale(1.15); }
        .color-custom { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--border-subtle); cursor: pointer; background: transparent; padding: 0; }

        .dice-input { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.4rem 0.6rem; font-size: 0.82rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .dice-input:focus { border-color: var(--color-crimson); }

        .action-btn { display: flex; align-items: center; gap: 0.3rem; background: transparent; border: 1px solid; border-radius: 3px; padding: 0.25rem 0.6rem; font-size: 0.7rem; font-family: var(--font-cinzel); letter-spacing: 0.04em; cursor: pointer; transition: all 0.15s; }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn.danger  { color: #ff6b6b; border-color: rgba(255,107,107,0.4); }
        .action-btn.danger:hover:not(:disabled)  { background: rgba(255,107,107,0.1); }
        .action-btn.success { color: #34d399; border-color: rgba(52,211,153,0.4); }
        .action-btn.success:hover:not(:disabled) { background: rgba(52,211,153,0.1); }
        .action-btn.neutral { color: var(--text-muted); border-color: var(--border-subtle); }
        .action-btn.neutral:hover { color: var(--text-primary); background: var(--bg-elevated); }
        .action-btn-icon { width: 12px; height: 12px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}