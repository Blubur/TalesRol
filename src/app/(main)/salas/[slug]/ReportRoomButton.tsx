'use client'

import { useState } from 'react'
import { FlagIcon } from '@heroicons/react/24/outline'
import { reportRoom } from './reportactions'

const REPORT_REASONS = [
  'Contenido inapropiado',
  'Acoso o bullying',
  'Spam',
  'Contenido fuera de tema',
  'Lenguaje ofensivo',
  'Otro',
]

interface Props {
  roomId: string
  slug: string
}

export default function ReportRoomButton({ roomId, slug }: Props) {
  const [open, setOpen]             = useState(false)
  const [reason, setReason]         = useState(REPORT_REASONS[0])
  const [custom, setCustom]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  async function handleSubmit() {
    const finalReason = reason === 'Otro' ? custom.trim() : reason
    if (!finalReason) return
    setLoading(true)
    setError(null)
    const result = await reportRoom(roomId, slug, finalReason)
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else {
      setSuccess(true)
      setTimeout(() => { setOpen(false); setSuccess(false); setReason(REPORT_REASONS[0]); setCustom('') }, 2000)
    }
  }

  return (
    <>
      <button
        className="btn-ghost"
        onClick={() => setOpen(true)}
        title="Reportar sala"
        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}
      >
        <FlagIcon style={{ width: 14, height: 14 }} />
        Reportar
      </button>

      {open && (
        <div className="report-overlay" onClick={() => setOpen(false)}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <h3 className="report-title">Reportar sala</h3>
            {success ? (
              <div className="report-success">Reporte enviado correctamente</div>
            ) : (
              <>
                <div className="report-reasons">
                  {REPORT_REASONS.map(r => (
                    <label key={r} className={`report-reason ${reason === r ? 'selected' : ''}`}>
                      <input type="radio" name="room-reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
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
                {error && <div className="auth-error"><span>⚠</span> {error}</div>}
                <div className="report-actions">
                  <button className="btn-ghost" onClick={() => setOpen(false)} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>Cancelar</button>
                  <button className="btn-danger" onClick={handleSubmit} disabled={loading} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
                    {loading ? 'Enviando...' : 'Enviar reporte'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}