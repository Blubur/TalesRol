'use client'

import { useState } from 'react'
import { rollDice } from '@/app/(main)/salas/[slug]/diceactions'
import type { DiceRollResult } from '@/app/(main)/salas/[slug]/diceactions'

interface DiceType {
  id: string
  name: string
  faces: number
  description: string | null
}

// Una "línea" de tirada: un tipo de dado + cantidad
interface DiceLine {
  diceTypeId: string
  quantity: number
}

interface Props {
  diceTypes: DiceType[]
  onResult: (results: DiceRollResult[]) => void
  onClose: () => void
}

export default function DiceRoller({ diceTypes, onResult, onClose }: Props) {
  const [lines, setLines]       = useState<DiceLine[]>([{ diceTypeId: diceTypes[0]?.id ?? '', quantity: 1 }])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [rolled, setRolled]     = useState(false)

  function updateLine(index: number, patch: Partial<DiceLine>) {
    setLines(prev => prev.map((l, i) => i === index ? { ...l, ...patch } : l))
  }

  function addLine() {
    if (lines.length >= 5) return
    setLines(prev => [...prev, { diceTypeId: diceTypes[0]?.id ?? '', quantity: 1 }])
  }

  function removeLine(index: number) {
    setLines(prev => prev.filter((_, i) => i !== index))
  }

  async function handleRoll() {
    setLoading(true)
    setError(null)
    setRolled(false)

    const results: DiceRollResult[] = []
    for (const line of lines) {
      if (!line.diceTypeId) continue
      const { result, error: err } = await rollDice(line.diceTypeId, line.quantity)
      if (err || !result) { setError(err ?? 'Error al tirar.'); setLoading(false); return }
      results.push(result)
    }

    setLoading(false)
    setRolled(true)
    onResult(results)
    // Reset para siguiente tirada
    setTimeout(() => setRolled(false), 2000)
  }

  return (
    <div className="dice-panel">
      <div className="dice-panel-header">
        <span className="dice-panel-title">Tirada de dados</span>
        <button className="dice-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="dice-panel-body">

        {lines.map((line, i) => {
          const selected = diceTypes.find(d => d.id === line.diceTypeId)
          return (
            <div key={i} className="dice-line">
              {/* Selector de tipo */}
              <div className="dice-types-grid">
                {diceTypes.map(d => (
                  <button
                    key={d.id}
                    className={`dice-type-btn ${line.diceTypeId === d.id ? 'selected' : ''}`}
                    onClick={() => updateLine(i, { diceTypeId: d.id })}
                    title={d.description ?? d.name}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              {/* Cantidad + quitar línea */}
              <div className="dice-line-controls">
                <div className="dice-qty-wrap">
                  <button className="dice-qty-btn" onClick={() => updateLine(i, { quantity: Math.max(1, line.quantity - 1) })}>−</button>
                  <span className="dice-qty-value">{line.quantity}</span>
                  <button className="dice-qty-btn" onClick={() => updateLine(i, { quantity: Math.min(20, line.quantity + 1) })}>+</button>
                  {selected && (
                    <span className="dice-qty-label">{line.quantity}{selected.name} · máx {selected.faces * line.quantity}</span>
                  )}
                </div>
                {lines.length > 1 && (
                  <button className="dice-remove-line" onClick={() => removeLine(i)} title="Quitar este dado">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {i < lines.length - 1 && <div className="dice-line-separator" />}
            </div>
          )
        })}

        {lines.length < 5 && (
          <button className="dice-add-line" onClick={addLine}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Añadir otro dado
          </button>
        )}

        {error && <div className="dice-error">⚠ {error}</div>}

        {rolled && (
          <div className="dice-rolled-confirm">Tirada añadida al post</div>
        )}

        <div className="dice-actions">
          <button className="btn-ghost" onClick={onClose} style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}>
            Cerrar
          </button>
          <button className="dice-roll-btn" onClick={handleRoll} disabled={loading || lines.every(l => !l.diceTypeId)}>
            {loading ? 'Tirando...' : lines.length > 1 ? `Tirar ${lines.length} dados` : `Tirar ${lines[0]?.quantity ?? 1}${diceTypes.find(d => d.id === lines[0]?.diceTypeId)?.name ?? ''}`}
          </button>
        </div>
      </div>

      <style>{`
        .dice-panel { background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: var(--space-3); }
        .dice-panel-header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) var(--space-4); background: var(--bg-secondary); border-bottom: 1px solid var(--border-subtle); }
        .dice-panel-title { font-family: var(--font-cinzel); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; color: var(--text-primary); text-transform: uppercase; }
        .dice-close { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.1rem 0.3rem; border-radius: var(--radius-sm); display: flex; align-items: center; transition: color var(--transition-fast); }
        .dice-close:hover { color: var(--color-crimson); }
        .dice-panel-body { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
        .dice-line { display: flex; flex-direction: column; gap: var(--space-2); }
        .dice-line-separator { height: 1px; background: var(--border-subtle); margin: var(--space-1) 0; }
        .dice-types-grid { display: flex; flex-wrap: wrap; gap: var(--space-1); }
        .dice-type-btn { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.25rem 0.6rem; font-family: var(--font-cinzel); font-size: var(--text-xs); letter-spacing: 0.05em; color: var(--text-secondary); cursor: pointer; transition: all var(--transition-fast); }
        .dice-type-btn:hover { border-color: var(--border-medium); color: var(--text-primary); }
        .dice-type-btn.selected { border-color: var(--color-crimson); color: var(--color-crimson); background: var(--color-crimson-subtle); }
        .dice-line-controls { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
        .dice-qty-wrap { display: flex; align-items: center; gap: var(--space-2); }
        .dice-qty-btn { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); width: 24px; height: 24px; font-size: 1rem; color: var(--text-secondary); cursor: pointer; transition: all var(--transition-fast); display: flex; align-items: center; justify-content: center; }
        .dice-qty-btn:hover { border-color: var(--color-crimson); color: var(--color-crimson); }
        .dice-qty-value { font-family: var(--font-cinzel); font-size: var(--text-base); font-weight: 700; color: var(--text-primary); min-width: 1.5rem; text-align: center; }
        .dice-qty-label { font-size: var(--text-xs); color: var(--text-muted); }
        .dice-remove-line { background: transparent; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--text-muted); width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast); flex-shrink: 0; }
        .dice-remove-line:hover { border-color: var(--color-error); color: var(--color-error); }
        .dice-add-line { display: flex; align-items: center; gap: var(--space-2); background: transparent; border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm); padding: var(--space-1) var(--space-3); font-family: var(--font-cinzel); font-size: var(--text-xs); letter-spacing: 0.06em; color: var(--text-muted); cursor: pointer; transition: all var(--transition-fast); width: fit-content; }
        .dice-add-line:hover { border-color: var(--border-medium); color: var(--text-secondary); }
        .dice-error { background: var(--color-error-bg); border: 1px solid var(--color-error-border); border-radius: var(--radius-sm); padding: var(--space-1) var(--space-3); color: var(--color-error); font-size: var(--text-xs); }
        .dice-rolled-confirm { color: var(--color-success); font-size: var(--text-xs); font-family: var(--font-cinzel); letter-spacing: 0.06em; text-align: center; padding: var(--space-1) 0; }
        .dice-actions { display: flex; justify-content: flex-end; gap: var(--space-2); }
        .dice-roll-btn { background: var(--color-crimson-subtle); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); color: var(--color-crimson-light); padding: var(--space-1) var(--space-4); font-family: var(--font-cinzel); font-size: var(--text-xs); letter-spacing: 0.06em; cursor: pointer; transition: all var(--transition-fast); }
        .dice-roll-btn:hover:not(:disabled) { background: var(--color-crimson-glow); border-color: var(--border-strong); }
        .dice-roll-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>
    </div>
  )
}