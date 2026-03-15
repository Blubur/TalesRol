'use client'

import { useState } from 'react'
import { reportUser } from '@/app/(main)/salas/[slug]/reportactions'

const REPORT_REASONS = [
  'Comportamiento inapropiado',
  'Acoso o bullying',
  'Spam o publicidad',
  'Lenguaje ofensivo',
  'Suplantación de identidad',
  'Otro',
]

interface Props {
  targetUserId: string
  targetUsername: string
}

export default function ReportButton({ targetUserId, targetUsername }: Props) {
  const [open, setOpen]           = useState(false)
  const [reason, setReason]       = useState(REPORT_REASONS[0])
  const [custom, setCustom]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  async function handleSubmit() {
    const finalReason = reason === 'Otro' ? custom.trim() : reason
    if (!finalReason) return
    setLoading(true)
    setError(null)
    const result = await reportUser(targetUserId, finalReason)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => { setOpen(false); setSuccess(false) }, 2000)
    }
  }

  function handleOpen() {
    setOpen(true)
    setReason(REPORT_REASONS[0])
    setCustom('')
    setError(null)
    setSuccess(false)
  }

  return (
    <>
      <button className="btn-danger-sm" onClick={handleOpen}>
        ⚑ Reportar
      </button>

      {open && (
        <div className="report-overlay" onClick={() => setOpen(false)}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <h3 className="report-title">⚠ Reportar a @{targetUsername}</h3>

            {success ? (
              <div className="report-success">✓ Reporte enviado correctamente</div>
            ) : (
              <>
                <div className="report-reasons">
                  {REPORT_REASONS.map(r => (
                    <label key={r} className={`report-reason ${reason === r ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="user-reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                      />
                      {r}
                    </label>
                  ))}
                </div>

                {reason === 'Otro' && (
                  <textarea
                    className="report-custom"
                    placeholder="Describe el motivo..."
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    rows={3}
                  />
                )}

                {error && (
                  <div className="report-error">⚠ {error}</div>
                )}

                <div className="report-actions">
                  <button
                    className="btn-ghost"
                    onClick={() => setOpen(false)}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-report-submit"
                    onClick={handleSubmit}
                    disabled={loading || (reason === 'Otro' && !custom.trim())}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                  >
                    {loading ? 'Enviando...' : 'Enviar reporte'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .report-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .report-modal { background: var(--bg-elevated, #1a1a1a); border: 1px solid var(--border-medium); border-radius: 8px; padding: 1.5rem; width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 1rem; }
        .report-title { font-family: var(--font-cinzel); font-size: 0.9rem; font-weight: 600; letter-spacing: 0.08em; color: #f59e0b; margin: 0; }
        .report-reasons { display: flex; flex-direction: column; gap: 0.4rem; }
        .report-reason { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.88rem; color: var(--text-secondary); border: 1px solid transparent; transition: all 0.15s; }
        .report-reason:hover { background: var(--bg-secondary); }
        .report-reason.selected { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.08); }
        .report-reason input { accent-color: #f59e0b; }
        .report-custom { width: 100%; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.6rem; color: var(--text-primary); font-size: 0.88rem; resize: none; box-sizing: border-box; }
        .report-custom:focus { outline: none; border-color: #f59e0b; }
        .report-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
        .report-success { color: #4ade80; font-size: 0.9rem; text-align: center; padding: 1rem; }
        .report-error { background: rgba(193,6,6,0.12); border: 1px solid rgba(193,6,6,0.3); border-radius: 4px; padding: 0.5rem 0.75rem; color: #ff6b6b; font-size: 0.82rem; }
        .btn-report-submit { background: rgba(193,6,6,0.15); border: 1px solid rgba(193,6,6,0.4); color: #ff6b6b; border-radius: 4px; cursor: pointer; font-family: var(--font-cinzel); letter-spacing: 0.06em; transition: all 0.15s; }
        .btn-report-submit:hover:not(:disabled) { background: rgba(193,6,6,0.3); }
        .btn-report-submit:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </>
  )
}