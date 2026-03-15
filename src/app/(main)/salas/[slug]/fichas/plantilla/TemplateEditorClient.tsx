'use client'

import { useState, useTransition } from 'react'
import { addField, deleteField } from '../sheetactions'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

const FIELD_TYPES = [
  { value: 'text_short',    label: 'Texto corto' },
  { value: 'text_long',     label: 'Texto largo' },
  { value: 'number',        label: 'Número / Barra' },
  { value: 'skill_list',    label: 'Lista de habilidades' },
  { value: 'image_avatar',  label: 'Imagen de avatar' },
  { value: 'image_header',  label: 'Imagen de cabecera' },
]

const TYPE_ICON: Record<string, string> = {
  text_short:   'Aa',
  text_long:    '¶',
  number:       '##',
  skill_list:   '☰',
  image_avatar: '◉',
  image_header: '▬',
}

interface Field {
  id: string
  label: string
  type: string
  is_base: boolean
  position: number
  min_value: number | null
  max_value: number | null
}

interface Props {
  templateId: string
  fields: Field[]
  slug: string
}

export default function TemplateEditorClient({ templateId, fields: initialFields, slug }: Props) {
  const [fields, setFields] = useState<Field[]>(initialFields)
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState('text_short')
  const [minVal, setMinVal] = useState('')
  const [maxVal, setMaxVal] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleAdd() {
    if (!newLabel.trim()) { setError('Escribe un nombre para el campo.'); return }
    setError(null)

    const fd = new FormData()
    fd.set('template_id', templateId)
    fd.set('label', newLabel.trim())
    fd.set('type', newType)
    fd.set('slug', slug)
    if (newType === 'number') {
      if (minVal) fd.set('min_value', minVal)
      if (maxVal) fd.set('max_value', maxVal)
    }

    startTransition(async () => {
      const res = await addField(fd)
      if (res.error) { setError(res.error); return }

      // Usar el ID REAL devuelto por la BD, no un ID falso
      setFields(prev => [...prev, {
        id:        res.fieldId!,
        label:     newLabel.trim(),
        type:      newType,
        is_base:   false,
        position:  prev.length,
        min_value: newType === 'number' && minVal ? Number(minVal) : null,
        max_value: newType === 'number' && maxVal ? Number(maxVal) : null,
      }])
      setNewLabel('')
      setMinVal('')
      setMaxVal('')
    })
  }

  async function handleDelete(fieldId: string) {
    startTransition(async () => {
      const res = await deleteField(fieldId, slug)
      if (res.error) { setError(res.error); return }
      setFields(prev => prev.filter(f => f.id !== fieldId))
    })
  }

  return (
    <div className="te-wrap">

      <div className="te-fields">
        <h2 className="te-section-title">Campos de la plantilla</h2>
        {fields.map(f => (
          <div key={f.id} className="te-field">
            <span className="te-field-icon">{TYPE_ICON[f.type] ?? '?'}</span>
            <div className="te-field-info">
              <span className="te-field-label">{f.label}</span>
              <span className="te-field-type">
                {FIELD_TYPES.find(t => t.value === f.type)?.label ?? f.type}
                {f.type === 'number' && (f.min_value != null || f.max_value != null) &&
                  ` (${f.min_value ?? '—'} – ${f.max_value ?? '—'})`
                }
                {f.is_base && <span className="te-field-base-badge"> · Base</span>}
              </span>
            </div>
            <button
              className="te-field-delete"
              onClick={() => handleDelete(f.id)}
              disabled={isPending}
              title="Eliminar campo"
            >
              <TrashIcon style={{ width: 14, height: 14 }} />
            </button>
          </div>
        ))}
      </div>

      <div className="te-add-wrap">
        <h2 className="te-section-title">Añadir campo personalizado</h2>

        <div className="te-add-row">
          <input
            className="te-input"
            placeholder="Nombre del campo (ej: Clase, Alineamiento...)"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <select
            className="te-select"
            value={newType}
            onChange={e => setNewType(e.target.value)}
          >
            {FIELD_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {newType === 'number' && (
          <div className="te-add-row te-num-row">
            <label className="te-num-label">Mín</label>
            <input className="te-input te-num-input" type="number" placeholder="0" value={minVal} onChange={e => setMinVal(e.target.value)} />
            <label className="te-num-label">Máx</label>
            <input className="te-input te-num-input" type="number" placeholder="100" value={maxVal} onChange={e => setMaxVal(e.target.value)} />
          </div>
        )}

        {error && <p className="te-error">{error}</p>}

        <button className="btn-primary btn-sm te-add-btn" onClick={handleAdd} disabled={isPending}>
          <PlusIcon style={{ width: 14, height: 14 }} />
          {isPending ? 'Añadiendo...' : 'Añadir campo'}
        </button>
      </div>

      <style>{`
        .te-wrap { display: flex; flex-direction: column; gap: var(--space-6); }
        .te-section-title { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; letter-spacing: 0.08em; color: var(--text-secondary); text-transform: uppercase; margin: 0 0 var(--space-3); }

        .te-fields { display: flex; flex-direction: column; gap: var(--space-2); }
        .te-field { display: flex; align-items: center; gap: var(--space-3); background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: var(--space-3) var(--space-4); transition: border-color var(--transition-fast); }
        .te-field:hover { border-color: var(--border-medium); }
        .te-field-icon { font-family: var(--font-display); font-size: var(--text-xs); color: var(--color-crimson); width: 24px; text-align: center; flex-shrink: 0; font-weight: 700; }
        .te-field-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .te-field-label { font-size: var(--text-sm); color: var(--text-primary); font-family: var(--font-display); letter-spacing: 0.02em; }
        .te-field-type { font-size: var(--text-xs); color: var(--text-muted); }
        .te-field-base-badge { color: var(--color-crimson); font-style: italic; }
        .te-field-delete { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: var(--space-1); border-radius: var(--radius-sm); transition: color var(--transition-fast); flex-shrink: 0; }
        .te-field-delete:hover:not(:disabled) { color: var(--color-error); }
        .te-field-delete:disabled { opacity: 0.4; cursor: not-allowed; }

        .te-add-wrap { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); }
        .te-add-row { display: flex; gap: var(--space-3); align-items: center; }
        .te-input { flex: 1; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.55rem var(--space-3); color: var(--text-primary); font-family: var(--font-body); font-size: var(--text-sm); outline: none; transition: border-color var(--transition-fast); }
        .te-input:focus { border-color: var(--color-crimson); }
        .te-input::placeholder { color: var(--text-muted); }
        .te-select { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.55rem var(--space-3); color: var(--text-primary); font-family: var(--font-body); font-size: var(--text-sm); outline: none; cursor: pointer; }
        .te-select:focus { border-color: var(--color-crimson); }
        .te-num-row { gap: var(--space-2); }
        .te-num-label { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.05em; flex-shrink: 0; }
        .te-num-input { flex: 0 0 80px; }
        .te-error { color: var(--color-error); font-size: var(--text-xs); margin: 0; }
        .te-add-btn { display: flex; align-items: center; gap: var(--space-2); align-self: flex-start; }
      `}</style>
    </div>
  )
}