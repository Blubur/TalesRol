'use client'

import { useState, useTransition } from 'react'
import { saveSheetValues } from '../sheetactions'
import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline'

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
  roomId: string
  targetUserId: string
  slug: string
  fields: Field[]
  valueMap: Record<string, any>
  canEdit: boolean
  isSelf: boolean
}

export default function SheetEditorClient({
  roomId, targetUserId, slug, fields, valueMap, canEdit,
}: Props) {
  // Estado local de todos los valores
  const [values, setValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {}
    fields.forEach(f => {
      const v = valueMap[f.id]
      if (f.type === 'text_short' || f.type === 'text_long' || f.type === 'image_avatar' || f.type === 'image_header') {
        init[f.id] = v?.value_text ?? ''
      } else if (f.type === 'number') {
        init[f.id] = v?.value_num ?? ''
      } else if (f.type === 'skill_list') {
        init[f.id] = v?.value_list ?? []
      }
    })
    return init
  })
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function setVal(fieldId: string, val: any) {
    setValues(prev => ({ ...prev, [fieldId]: val }))
    setSaved(false)
  }

  function addSkill(fieldId: string) {
    const text = (skillInputs[fieldId] ?? '').trim()
    if (!text) return
    setVal(fieldId, [...(values[fieldId] ?? []), text])
    setSkillInputs(prev => ({ ...prev, [fieldId]: '' }))
  }

  function removeSkill(fieldId: string, idx: number) {
    setVal(fieldId, (values[fieldId] ?? []).filter((_: any, i: number) => i !== idx))
  }

  async function handleSave() {
    setError(null)
    const fd = new FormData()
    fd.set('room_id', roomId)
    fd.set('target_user_id', targetUserId)
    fd.set('slug', slug)

    fields.forEach(f => {
      const v = values[f.id]
      if (f.type === 'text_short' || f.type === 'text_long' || f.type === 'image_avatar' || f.type === 'image_header') {
        fd.set(`field_${f.id}_text`, v ?? '')
      } else if (f.type === 'number') {
        fd.set(`field_${f.id}_num`, String(v ?? 0))
      } else if (f.type === 'skill_list') {
        fd.set(`field_${f.id}_list`, JSON.stringify(v ?? []))
      }
    })

    startTransition(async () => {
      const res = await saveSheetValues(fd)
      if (res.error) { setError(res.error); return }
      setSaved(true)
    })
  }

  // Avatar e imagen de cabecera para la vista previa
  const avatarField = fields.find(f => f.type === 'image_avatar')
  const headerField = fields.find(f => f.type === 'image_header')
  const nameField   = fields.find(f => f.is_base && f.label === 'Nombre del personaje')
  const avatarUrl   = avatarField ? values[avatarField.id] : ''
  const headerUrl   = headerField ? values[headerField.id] : ''
  const charName    = nameField ? values[nameField.id] : ''

  // Campos visibles sin avatar ni header (se muestran en la cabecera)
  const mainFields = fields.filter(f => f.type !== 'image_avatar' && f.type !== 'image_header')

  return (
    <div className="se-wrap">

      {/* Cabecera visual de la ficha */}
      <div className="se-card-header animate-enter">
        {headerUrl
          ? <img src={headerUrl} alt="cabecera" className="se-card-header-img" />
          : <div className="se-card-header-placeholder" />
        }
        <div className="se-card-header-overlay" />
        <div className="se-card-header-content">
          <div className="se-card-avatar-wrap">
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="se-card-avatar" />
              : <div className="se-card-avatar-empty">?</div>
            }
          </div>
          <h2 className="se-card-name">{charName || 'Personaje sin nombre'}</h2>
        </div>
      </div>

      {/* Campos */}
      <div className="se-fields animate-enter" style={{ animationDelay: '0.1s' }}>
        {mainFields.map(f => (
          <div key={f.id} className="se-field">
            <label className="se-field-label">{f.label}</label>
            <FieldInput
              field={f}
              value={values[f.id]}
              skillInput={skillInputs[f.id] ?? ''}
              canEdit={canEdit}
              onChange={val => setVal(f.id, val)}
              onSkillInputChange={v => setSkillInputs(prev => ({ ...prev, [f.id]: v }))}
              onAddSkill={() => addSkill(f.id)}
              onRemoveSkill={idx => removeSkill(f.id, idx)}
            />
          </div>
        ))}

        {/* Campos de imagen (URLs) */}
        {avatarField && (
          <div className="se-field">
            <label className="se-field-label">URL Avatar</label>
            <input
              className="se-input"
              type="url"
              placeholder="https://..."
              value={values[avatarField.id] ?? ''}
              onChange={e => setVal(avatarField.id, e.target.value)}
              disabled={!canEdit}
            />
          </div>
        )}
        {headerField && (
          <div className="se-field">
            <label className="se-field-label">URL Imagen de cabecera</label>
            <input
              className="se-input"
              type="url"
              placeholder="https://..."
              value={values[headerField.id] ?? ''}
              onChange={e => setVal(headerField.id, e.target.value)}
              disabled={!canEdit}
            />
          </div>
        )}
      </div>

      {/* Botón guardar */}
      {canEdit && (
        <div className="se-actions animate-enter" style={{ animationDelay: '0.15s' }}>
          {error && <p className="se-error">{error}</p>}
          {saved && (
            <span className="se-saved">
              <CheckIcon style={{ width: 14, height: 14 }} /> Guardado
            </span>
          )}
          <button className="btn-primary" onClick={handleSave} disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar ficha'}
          </button>
        </div>
      )}

      <style>{`
        .se-wrap { display: flex; flex-direction: column; gap: var(--space-6); }

        .se-card-header { position: relative; border-radius: var(--radius-md); overflow: hidden; height: 180px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); }
        .se-card-header-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .se-card-header-placeholder { position: absolute; inset: 0; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-secondary)); }
        .se-card-header-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); }
        .se-card-header-content { position: absolute; bottom: var(--space-4); left: var(--space-5); display: flex; align-items: flex-end; gap: var(--space-4); }
        .se-card-avatar-wrap { flex-shrink: 0; }
        .se-card-avatar { width: 72px; height: 72px; border-radius: 50%; border: 3px solid var(--color-crimson); object-fit: cover; display: block; }
        .se-card-avatar-empty { width: 72px; height: 72px; border-radius: 50%; border: 3px solid var(--border-medium); background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; font-size: var(--text-xl); color: var(--text-muted); font-family: var(--font-display); }
        .se-card-name { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700; letter-spacing: 0.06em; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.8); margin: 0; }

        .se-fields { display: flex; flex-direction: column; gap: var(--space-4); }
        .se-field { display: flex; flex-direction: column; gap: var(--space-2); }
        .se-field-label { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; color: var(--text-secondary); text-transform: uppercase; }

        .se-input { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.6rem var(--space-3); color: var(--text-primary); font-family: var(--font-body); font-size: var(--text-base); outline: none; transition: border-color var(--transition-fast); width: 100%; box-sizing: border-box; }
        .se-input:focus { border-color: var(--color-crimson); box-shadow: 0 0 0 3px var(--color-crimson-glow); }
        .se-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .se-input::placeholder { color: var(--text-muted); }
        .se-textarea { resize: vertical; min-height: 100px; }
        .se-number-wrap { display: flex; flex-direction: column; gap: var(--space-2); }
        .se-number-row { display: flex; align-items: center; gap: var(--space-3); }
        .se-number-input { width: 100px; }
        .se-number-bar-wrap { flex: 1; height: 6px; background: var(--bg-elevated); border-radius: var(--radius-full); overflow: hidden; border: 1px solid var(--border-subtle); }
        .se-number-bar { height: 100%; background: var(--color-crimson); border-radius: var(--radius-full); transition: width var(--transition-base); }

        .se-skill-list { display: flex; flex-direction: column; gap: var(--space-2); }
        .se-skill-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .se-skill-tag { display: flex; align-items: center; gap: var(--space-1); background: var(--color-crimson-subtle); border: 1px solid var(--color-crimson-glow); border-radius: var(--radius-sm); padding: 0.2rem 0.6rem; font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.04em; color: var(--text-primary); }
        .se-skill-remove { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0; line-height: 1; transition: color var(--transition-fast); }
        .se-skill-remove:hover { color: var(--color-error); }
        .se-skill-add-row { display: flex; gap: var(--space-2); }
        .se-skill-add-row .se-input { flex: 1; }
        .se-skill-add-btn { display: flex; align-items: center; gap: var(--space-1); padding: 0 var(--space-3); flex-shrink: 0; height: 38px; }

        .se-actions { display: flex; align-items: center; gap: var(--space-4); justify-content: flex-end; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle); }
        .se-error { color: var(--color-error); font-size: var(--text-xs); margin: 0; flex: 1; }
        .se-saved { display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); color: var(--color-success); font-family: var(--font-display); letter-spacing: 0.04em; }
      `}</style>
    </div>
  )
}

// ── Subcomponente por tipo de campo ─────────────────────────

function FieldInput({
  field, value, skillInput, canEdit,
  onChange, onSkillInputChange, onAddSkill, onRemoveSkill,
}: {
  field: Field
  value: any
  skillInput: string
  canEdit: boolean
  onChange: (v: any) => void
  onSkillInputChange: (v: string) => void
  onAddSkill: () => void
  onRemoveSkill: (i: number) => void
}) {
  if (field.type === 'text_short') {
    return (
      <input
        className="se-input"
        type="text"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        disabled={!canEdit}
        placeholder={`Escribe ${field.label.toLowerCase()}...`}
      />
    )
  }

  if (field.type === 'text_long') {
    return (
      <textarea
        className="se-input se-textarea"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        disabled={!canEdit}
        placeholder={`Escribe ${field.label.toLowerCase()}...`}
      />
    )
  }

  if (field.type === 'number') {
    const min = field.min_value ?? 0
    const max = field.max_value ?? 100
    const num = Number(value) || 0
    const pct = max > min ? Math.min(100, Math.max(0, ((num - min) / (max - min)) * 100)) : 0
    return (
      <div className="se-number-wrap">
        <div className="se-number-row">
          <input
            className="se-input se-number-input"
            type="number"
            min={min}
            max={max}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            disabled={!canEdit}
          />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{min} – {max}</span>
          <div className="se-number-bar-wrap">
            <div className="se-number-bar" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    )
  }

  if (field.type === 'skill_list') {
    const skills: string[] = Array.isArray(value) ? value : []
    return (
      <div className="se-skill-list">
        {skills.length > 0 && (
          <div className="se-skill-tags">
            {skills.map((s, i) => (
              <span key={i} className="se-skill-tag">
                {s}
                {canEdit && (
                  <button className="se-skill-remove" onClick={() => onRemoveSkill(i)} title="Eliminar">×</button>
                )}
              </span>
            ))}
          </div>
        )}
        {canEdit && (
          <div className="se-skill-add-row">
            <input
              className="se-input"
              type="text"
              placeholder="Nueva habilidad..."
              value={skillInput}
              onChange={e => onSkillInputChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onAddSkill()}
            />
            <button className="btn-ghost btn-sm se-skill-add-btn" onClick={onAddSkill}>
              <PlusIcon style={{ width: 13, height: 13 }} /> Añadir
            </button>
          </div>
        )}
        {skills.length === 0 && !canEdit && (
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>Sin habilidades</p>
        )}
      </div>
    )
  }

  return null
}