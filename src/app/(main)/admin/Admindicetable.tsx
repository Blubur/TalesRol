'use client'

import { useState } from 'react'
import { createDice, updateDice, deleteDice } from './actions'
import { PlusIcon, TrashIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function AdminDiceTable({ dice }: { dice: any[] }) {
  const [localDice, setLocalDice] = useState(dice)
  const [loading, setLoading]     = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData]   = useState({ name: '', faces: 0, description: '' })
  const [creating, setCreating]   = useState(false)
  const [newData, setNewData]     = useState({ name: '', faces: '', description: '' })
  const [error, setError]         = useState<string | null>(null)

  function startEdit(d: any) {
    setEditingId(d.id)
    setEditData({ name: d.name, faces: d.faces, description: d.description ?? '' })
  }

  async function handleSaveEdit(id: string) {
    if (!editData.name || !editData.faces) return
    setLoading(id)
    const result = await updateDice(id, editData.name, editData.faces, editData.description)
    if (result?.error) { setError(result.error) } else {
      setLocalDice(prev => prev.map(d => d.id === id ? { ...d, ...editData } : d))
      setEditingId(null)
    }
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este tipo de dado?')) return
    setLoading(id + '_del')
    const result = await deleteDice(id)
    if (result?.error) { setError(result.error) } else {
      setLocalDice(prev => prev.filter(d => d.id !== id))
    }
    setLoading(null)
  }

  async function handleCreate() {
    if (!newData.name || !newData.faces) return
    setLoading('create')
    const result = await createDice(newData.name, parseInt(newData.faces), newData.description)
    if (result?.error) { setError(result.error) } else if (result?.data) {
      setLocalDice(prev => [...prev, result.data].sort((a, b) => a.faces - b.faces))
      setNewData({ name: '', faces: '', description: '' })
      setCreating(false)
    }
    setLoading(null)
  }

  return (
    <div className="dice-wrap">
      {error && <p className="dice-error">{error}</p>}

      <div className="dice-grid">
        {localDice.map(d => (
          <div key={d.id} className={`dice-card ${editingId === d.id ? 'editing' : ''}`}>
            {editingId === d.id ? (
              <div className="dice-edit-form">
                <input className="dice-input" value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} placeholder="Nombre (ej: d20)" />
                <input className="dice-input" type="number" value={editData.faces} onChange={e => setEditData(p => ({ ...p, faces: parseInt(e.target.value) }))} placeholder="Caras" />
                <input className="dice-input" value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} placeholder="Descripción" />
                <div className="dice-edit-actions">
                  <button className="action-btn success" onClick={() => handleSaveEdit(d.id)} disabled={loading === d.id}>
                    <CheckIcon className="action-btn-icon" /> Guardar
                  </button>
                  <button className="action-btn neutral" onClick={() => setEditingId(null)}>
                    <XMarkIcon className="action-btn-icon" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="dice-face">{d.name}</div>
                <div className="dice-info">
                  <span className="dice-faces">{d.faces} caras</span>
                  {d.description && <span className="dice-desc">{d.description}</span>}
                </div>
                <div className="dice-actions">
                  <button className="action-btn neutral" onClick={() => startEdit(d)}>
                    <PencilSquareIcon className="action-btn-icon" />
                  </button>
                  <button className="action-btn danger" onClick={() => handleDelete(d.id)} disabled={loading === d.id + '_del'}>
                    <TrashIcon className="action-btn-icon" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Crear nuevo */}
        {creating ? (
          <div className="dice-card editing">
            <div className="dice-edit-form">
              <input className="dice-input" value={newData.name} onChange={e => setNewData(p => ({ ...p, name: e.target.value }))} placeholder="Nombre (ej: d20)" />
              <input className="dice-input" type="number" value={newData.faces} onChange={e => setNewData(p => ({ ...p, faces: e.target.value }))} placeholder="Nº de caras" />
              <input className="dice-input" value={newData.description} onChange={e => setNewData(p => ({ ...p, description: e.target.value }))} placeholder="Descripción (opcional)" />
              <div className="dice-edit-actions">
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
          <button className="dice-add-btn" onClick={() => setCreating(true)}>
            <PlusIcon className="dice-add-icon" />
            Nuevo dado
          </button>
        )}
      </div>

      <style>{`
        .dice-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
        .dice-error { color: #ff6b6b; font-size: 0.82rem; margin: 0; }
        .dice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }

        .dice-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; transition: border-color 0.15s; }
        .dice-card:hover { border-color: var(--border-medium); }
        .dice-card.editing { border-color: var(--color-crimson); align-items: stretch; }

        .dice-face { font-family: var(--font-cinzel); font-size: 1.8rem; font-weight: 700; color: var(--color-crimson); letter-spacing: 0.05em; }
        .dice-info { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; }
        .dice-faces { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.06em; }
        .dice-desc { font-size: 0.72rem; color: var(--text-muted); text-align: center; }
        .dice-actions { display: flex; gap: 0.35rem; }

        .dice-edit-form { display: flex; flex-direction: column; gap: 0.5rem; }
        .dice-input { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.4rem 0.6rem; font-size: 0.82rem; color: var(--text-primary); outline: none; transition: border-color 0.2s; width: 100%; }
        .dice-input:focus { border-color: var(--color-crimson); }
        .dice-edit-actions { display: flex; gap: 0.35rem; }

        .dice-add-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; background: transparent; border: 1px dashed var(--border-medium); border-radius: 6px; padding: 1rem; color: var(--text-muted); cursor: pointer; font-size: 0.78rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; transition: all 0.15s; min-height: 100px; }
        .dice-add-btn:hover { border-color: var(--color-crimson); color: var(--color-crimson); background: rgba(193,6,6,0.04); }
        .dice-add-icon { width: 20px; height: 20px; }

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