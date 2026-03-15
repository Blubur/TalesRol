'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resolveReport, dismissReport, warnUser, banUserFromReport, banIpFromReport,
         warnRoomOwner, closeRoomTemporarily, closeRoomPermanently, deleteRoomFromReport, transferRoomOwnership } from './actions'
import {
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  ShieldExclamationIcon,
  BookOpenIcon,
  LockClosedIcon,
  ArchiveBoxXMarkIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline'

const STATUS_COLORS: Record<string, string> = {
  pending:   '#fbbf24',
  resolved:  '#34d399',
  dismissed: '#9ca3af',
}

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  resolved:  'Resuelto',
  dismissed: 'Descartado',
}

type ModalType =
  | { kind: 'warn_user';     reportId: string; userId: string }
  | { kind: 'warn_room';     reportId: string; roomId: string }
  | { kind: 'close_temp';    reportId: string; roomId: string }
  | { kind: 'close_perm';    reportId: string; roomId: string }
  | { kind: 'delete_room';   reportId: string; roomId: string }
  | { kind: 'transfer';      reportId: string; roomId: string }

export default function AdminReportsTable({ reports }: { reports: any[] }) {
  const [loading, setLoading]           = useState<string | null>(null)
  const [localReports, setLocalReports] = useState(reports)
  const [filter, setFilter]             = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending')
  const [modal, setModal]               = useState<ModalType | null>(null)
  const [modalText, setModalText]       = useState('')
  const [error, setError]               = useState<string | null>(null)

  const filtered = localReports.filter(r => filter === 'all' || r.status === filter)

  function markResolved(reportId: string, notes?: string) {
    setLocalReports(prev => prev.map(r =>
      r.id === reportId ? { ...r, status: 'resolved', notes: notes ?? r.notes } : r
    ))
  }

  function closeModal() { setModal(null); setModalText(''); setError(null) }

  async function handleResolve(reportId: string) {
    setLoading(reportId + '_res')
    await resolveReport(reportId)
    markResolved(reportId)
    setLoading(null)
  }

  async function handleDismiss(reportId: string) {
    setLoading(reportId + '_dis')
    await dismissReport(reportId)
    setLocalReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'dismissed' } : r))
    setLoading(null)
  }

  async function handleModalSubmit() {
    if (!modal) return
    setError(null)
    setLoading(modal.reportId + '_modal')
    let result: any

    if (modal.kind === 'warn_user') {
      if (!modalText.trim()) { setLoading(null); return }
      result = await warnUser(modal.userId, modal.reportId, modalText)
      if (!result?.error) markResolved(modal.reportId, `Aviso enviado: ${modalText}`)
    }
    if (modal.kind === 'warn_room') {
      if (!modalText.trim()) { setLoading(null); return }
      result = await warnRoomOwner(modal.roomId, modal.reportId, modalText)
      if (!result?.error) markResolved(modal.reportId, `Aviso al director: ${modalText}`)
    }
    if (modal.kind === 'close_temp') {
      result = await closeRoomTemporarily(modal.roomId, modal.reportId, modalText)
      if (!result?.error) markResolved(modal.reportId, `Sala cerrada temporalmente.`)
    }
    if (modal.kind === 'close_perm') {
      result = await closeRoomPermanently(modal.roomId, modal.reportId, modalText)
      if (!result?.error) markResolved(modal.reportId, `Sala cerrada permanentemente.`)
    }
    if (modal.kind === 'delete_room') {
      result = await deleteRoomFromReport(modal.roomId, modal.reportId)
      if (!result?.error) markResolved(modal.reportId, 'Sala eliminada.')
    }
    if (modal.kind === 'transfer') {
      if (!modalText.trim()) { setLoading(null); return }
      result = await transferRoomOwnership(modal.roomId, modal.reportId, modalText)
      if (!result?.error) markResolved(modal.reportId, `Dirección transferida a: ${modalText}`)
    }

    if (result?.error) { setError(result.error) }
    else { closeModal() }
    setLoading(null)
  }

  async function handleBan(userId: string, reportId: string) {
    if (!confirm('¿Banear a este usuario? Se le notificará y el reporte quedará resuelto.')) return
    setLoading(reportId + '_ban')
    const result = await banUserFromReport(userId, reportId)
    if (result?.error) { setError(result.error) }
    else { markResolved(reportId, 'Usuario baneado.') }
    setLoading(null)
  }

  async function handleBanIp(userId: string, reportId: string) {
    if (!confirm('¿Banear la IP de este usuario? Se baneará también la cuenta.')) return
    setLoading(reportId + '_ip')
    const result = await banIpFromReport(userId, reportId)
    if (result?.error) { setError(result.error) }
    else { markResolved(reportId) }
    setLoading(null)
  }

  // ── Modal config ────────────────────────────────────────
  const MODAL_CONFIG: Record<ModalType['kind'], { title: string; desc: string; placeholder?: string; confirmLabel: string; confirmClass: string; needsText: boolean }> = {
    warn_user:   { title: 'Enviar aviso al usuario',          desc: 'El usuario recibirá una notificación con el motivo.',                            placeholder: 'Escribe el motivo del aviso...',              confirmLabel: 'Enviar aviso',    confirmClass: 'warn',    needsText: true  },
    warn_room:   { title: 'Avisar al director de la sala',    desc: 'El director recibirá una notificación. La sala no se cierra.',                   placeholder: 'Escribe el motivo del aviso...',              confirmLabel: 'Enviar aviso',    confirmClass: 'warn',    needsText: true  },
    close_temp:  { title: 'Cerrar sala temporalmente',        desc: 'La sala pasará a estado "pausada" y se mostrará un aviso de moderación.',        placeholder: 'Motivo del cierre (visible en la sala)...',   confirmLabel: 'Cerrar sala',    confirmClass: 'danger',  needsText: false },
    close_perm:  { title: 'Cerrar sala permanentemente',      desc: 'La sala pasará a estado "cerrada". Esta acción es difícil de revertir.',         placeholder: 'Motivo del cierre (visible en la sala)...',   confirmLabel: 'Cerrar sala',    confirmClass: 'danger',  needsText: false },
    delete_room: { title: 'Eliminar sala',                    desc: 'La sala será eliminada (soft delete). El director recibirá una notificación.',   placeholder: undefined,                                     confirmLabel: 'Eliminar sala',  confirmClass: 'danger',  needsText: false },
    transfer:    { title: 'Transferir dirección de sala',     desc: 'El nuevo director recibirá una notificación. El anterior perderá el acceso.',    placeholder: 'Nombre de usuario del nuevo director...',     confirmLabel: 'Transferir',     confirmClass: 'warn',    needsText: true  },
  }

  const cfg = modal ? MODAL_CONFIG[modal.kind] : null

  return (
    <div className="reports-wrap">

      {/* Modal unificado */}
      {modal && cfg && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{cfg.title}</h3>
            <p className="modal-desc">{cfg.desc}</p>
            {modal.kind !== 'delete_room' && (
              <textarea
                className="modal-textarea"
                placeholder={cfg.placeholder}
                value={modalText}
                onChange={e => setModalText(e.target.value)}
                rows={modal.kind === 'transfer' ? 1 : 3}
                style={{ resize: modal.kind === 'transfer' ? 'none' : 'vertical' }}
              />
            )}
            {error && <div className="modal-error">{error}</div>}
            <div className="modal-actions">
              <button className="btn-ghost" onClick={closeModal} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
                Cancelar
              </button>
              <button
                className={`action-btn ${cfg.confirmClass}`}
                onClick={handleModalSubmit}
                disabled={cfg.needsText ? !modalText.trim() || !!loading : !!loading}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
              >
                {loading ? 'Procesando...' : cfg.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="reports-filters">
        {(['pending', 'all', 'resolved', 'dismissed'] as const).map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Todos' : STATUS_LABELS[f]}
            <span className="filter-count">
              {f === 'all' ? localReports.length : localReports.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="reports-empty">
          <CheckCircleIcon className="reports-empty-icon" />
          <p>{filter === 'pending' ? 'No hay reportes pendientes.' : 'No hay reportes en esta categoría.'}</p>
        </div>
      ) : (
        <div className="reports-list">
          {filtered.map(report => {
            const isPending    = report.status === 'pending'
            const hasUser      = !!report.target_user
            const hasRoom      = !!report.target_room_id
            const hasPost      = !!report.target_post

            return (
              <div key={report.id} className={`report-card ${report.status}`}>
                <div className="report-header">
                  <span className="report-status-pill" style={{ color: STATUS_COLORS[report.status], borderColor: STATUS_COLORS[report.status] }}>
                    {STATUS_LABELS[report.status] ?? report.status}
                  </span>
                  {hasUser && <span className="report-type-pill user"><UserIcon className="pill-icon" /> Usuario</span>}
                  {hasRoom && <span className="report-type-pill room"><BookOpenIcon className="pill-icon" /> Sala</span>}
                  {hasPost && <span className="report-type-pill post"><DocumentTextIcon className="pill-icon" /> Post</span>}
                  <span className="report-date">
                    {new Date(report.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="report-body">
                  <div className="report-row">
                    <UserIcon className="report-row-icon" />
                    <span className="report-row-label">Reportado por:</span>
                    {report.reporter
                      ? <Link href={`/perfil/${report.reporter.username}`} className="report-user-link">@{report.reporter.username}</Link>
                      : <span className="report-unknown">Desconocido</span>}
                  </div>

                  {report.target_user && (
                    <div className="report-row">
                      <UserIcon className="report-row-icon" />
                      <span className="report-row-label">Usuario reportado:</span>
                      <Link href={`/perfil/${report.target_user.username}`} className="report-user-link danger">
                        @{report.target_user.username}
                      </Link>
                    </div>
                  )}

                  {report.target_post && (
                    <div className="report-row">
                      <DocumentTextIcon className="report-row-icon" />
                      <span className="report-row-label">Post:</span>
                      <span className="report-post-preview">
                        {report.target_post.content?.replace(/<[^>]*>/g, '').slice(0, 80) ?? '(sin contenido)'}…
                      </span>
                    </div>
                  )}

                  {report.target_room_id && (
                    <div className="report-row">
                      <BookOpenIcon className="report-row-icon" />
                      <span className="report-row-label">Sala reportada:</span>
                      <span className="report-user-link" style={{ color: 'var(--color-crimson)' }}>
                        {report.target_room?.title ?? report.target_room_id}
                      </span>
                    </div>
                  )}

                  <div className="report-reason">
                    <span className="report-reason-label">Motivo:</span>
                    <span className="report-reason-text">{report.reason}</span>
                  </div>

                  {report.notes && (
                    <div className="report-notes">
                      <span className="report-reason-label">Resolución:</span>
                      <span className="report-reason-text">{report.notes}</span>
                    </div>
                  )}
                </div>

                {isPending && (
                  <div className="report-actions">

                    {/* Siempre disponibles */}
                    <button className="action-btn success" onClick={() => handleResolve(report.id)} disabled={!!loading} title="Marcar como resuelto">
                      <CheckCircleIcon className="action-btn-icon" /> Resolver
                    </button>
                    <button className="action-btn neutral" onClick={() => handleDismiss(report.id)} disabled={!!loading} title="Descartar reporte">
                      <XCircleIcon className="action-btn-icon" /> Descartar
                    </button>

                    {/* Acciones sobre usuario */}
                    {hasUser && (
                      <>
                        <div className="actions-separator" />
                        <button className="action-btn warn" onClick={() => { setModal({ kind: 'warn_user', reportId: report.id, userId: report.target_user.id }); setError(null) }} disabled={!!loading} title="Enviar aviso al usuario">
                          <BellAlertIcon className="action-btn-icon" /> Avisar usuario
                        </button>
                        <button className="action-btn danger" onClick={() => handleBan(report.target_user.id, report.id)} disabled={!!loading} title="Banear usuario">
                          <NoSymbolIcon className="action-btn-icon" />
                          {loading === report.id + '_ban' ? 'Baneando...' : 'Banear'}
                        </button>
                        <button className="action-btn danger-ip" onClick={() => handleBanIp(report.target_user.id, report.id)} disabled={!!loading} title="Banear IP del usuario">
                          <ShieldExclamationIcon className="action-btn-icon" />
                          {loading === report.id + '_ip' ? 'Baneando...' : 'Banear IP'}
                        </button>
                      </>
                    )}

                    {/* Acciones sobre sala */}
                    {hasRoom && (
                      <>
                        <div className="actions-separator" />
                        <button className="action-btn warn" onClick={() => { setModal({ kind: 'warn_room', reportId: report.id, roomId: report.target_room_id }); setError(null) }} disabled={!!loading} title="Avisar al director">
                          <ExclamationTriangleIcon className="action-btn-icon" /> Avisar director
                        </button>
                        <button className="action-btn orange" onClick={() => { setModal({ kind: 'close_temp', reportId: report.id, roomId: report.target_room_id }); setError(null) }} disabled={!!loading} title="Cerrar temporalmente">
                          <LockClosedIcon className="action-btn-icon" /> Cerrar temp.
                        </button>
                        <button className="action-btn danger" onClick={() => { setModal({ kind: 'close_perm', reportId: report.id, roomId: report.target_room_id }); setError(null) }} disabled={!!loading} title="Cerrar permanentemente">
                          <ArchiveBoxXMarkIcon className="action-btn-icon" /> Cerrar perm.
                        </button>
                        <button className="action-btn neutral" onClick={() => { setModal({ kind: 'transfer', reportId: report.id, roomId: report.target_room_id }); setError(null) }} disabled={!!loading} title="Transferir dirección">
                          <ArrowRightOnRectangleIcon className="action-btn-icon" /> Transferir
                        </button>
                        <button className="action-btn danger" onClick={() => { setModal({ kind: 'delete_room', reportId: report.id, roomId: report.target_room_id }); setError(null) }} disabled={!!loading} title="Eliminar sala">
                          <TrashIcon className="action-btn-icon" /> Eliminar sala
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .reports-wrap { display: flex; flex-direction: column; gap: 0.75rem; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal-box { background: var(--bg-elevated, #1a1a1a); border: 1px solid var(--border-medium); border-radius: 8px; padding: 1.5rem; width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 1rem; }
        .modal-title { font-family: var(--font-cinzel); font-size: 0.9rem; font-weight: 600; letter-spacing: 0.08em; color: var(--text-primary); margin: 0; }
        .modal-desc { font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.5; }
        .modal-textarea { width: 100%; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.6rem; color: var(--text-primary); font-size: 0.88rem; box-sizing: border-box; font-family: inherit; }
        .modal-textarea:focus { outline: none; border-color: var(--color-crimson); }
        .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
        .modal-error { background: rgba(193,6,6,0.12); border: 1px solid rgba(193,6,6,0.3); border-radius: 4px; padding: 0.5rem 0.75rem; color: #ff6b6b; font-size: 0.82rem; }

        .reports-filters { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .filter-btn { display: flex; align-items: center; gap: 0.4rem; background: transparent; border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.3rem 0.75rem; font-size: 0.72rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
        .filter-btn:hover, .filter-btn.active { border-color: var(--color-crimson); color: var(--text-primary); background: rgba(193,6,6,0.06); }
        .filter-count { background: var(--bg-secondary); border-radius: 10px; padding: 0.05rem 0.4rem; font-size: 0.65rem; }

        .reports-empty { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; color: var(--text-muted); }
        .reports-empty-icon { width: 32px; height: 32px; color: #34d399; }
        .reports-empty p { margin: 0; font-size: 0.88rem; }

        .reports-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .report-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .report-card.pending { border-left: 3px solid #fbbf24; }
        .report-card.resolved { opacity: 0.6; }
        .report-card.dismissed { opacity: 0.45; }

        .report-header { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .report-status-pill { font-size: 0.68rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; padding: 0.15rem 0.5rem; border-radius: 2px; border: 1px solid; }
        .report-type-pill { display: flex; align-items: center; gap: 0.25rem; font-size: 0.68rem; font-family: var(--font-cinzel); letter-spacing: 0.05em; padding: 0.15rem 0.5rem; border-radius: 2px; border: 1px solid; }
        .report-type-pill.user { color: #60a5fa; border-color: rgba(96,165,250,0.3); background: rgba(96,165,250,0.05); }
        .report-type-pill.room { color: #34d399; border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.05); }
        .report-type-pill.post { color: #c4b5fd; border-color: rgba(196,181,253,0.3); background: rgba(196,181,253,0.05); }
        .pill-icon { width: 10px; height: 10px; }
        .report-date { font-size: 0.72rem; color: var(--text-muted); margin-left: auto; font-family: var(--font-cinzel); }

        .report-body { display: flex; flex-direction: column; gap: 0.4rem; }
        .report-row { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; }
        .report-row-icon { width: 13px; height: 13px; color: var(--text-muted); flex-shrink: 0; }
        .report-row-label { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }
        .report-user-link { color: var(--text-secondary); font-size: 0.82rem; text-decoration: none; transition: color 0.15s; }
        .report-user-link:hover { color: var(--text-primary); }
        .report-user-link.danger { color: #ff6b6b; }
        .report-unknown { color: var(--text-muted); font-style: italic; font-size: 0.8rem; }
        .report-post-preview { font-size: 0.78rem; color: var(--text-muted); font-style: italic; }

        .report-reason { display: flex; gap: 0.5rem; align-items: flex-start; padding: 0.6rem; background: var(--bg-secondary); border-radius: 4px; }
        .report-notes { display: flex; gap: 0.5rem; align-items: flex-start; padding: 0.6rem; background: rgba(167,139,250,0.05); border: 1px solid rgba(167,139,250,0.15); border-radius: 4px; }
        .report-reason-label { font-size: 0.68rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; color: var(--text-muted); white-space: nowrap; padding-top: 0.1rem; }
        .report-reason-text { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; }

        .report-actions { display: flex; gap: 0.4rem; padding-top: 0.25rem; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; align-items: center; }
        .actions-separator { width: 1px; height: 20px; background: var(--border-subtle); margin: 0 0.15rem; }
        .action-btn { display: flex; align-items: center; gap: 0.3rem; background: transparent; border: 1px solid; border-radius: 3px; padding: 0.3rem 0.65rem; font-size: 0.72rem; font-family: var(--font-cinzel); letter-spacing: 0.05em; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn.success { color: #34d399; border-color: rgba(52,211,153,0.4); }
        .action-btn.success:hover:not(:disabled) { background: rgba(52,211,153,0.1); }
        .action-btn.neutral { color: var(--text-muted); border-color: var(--border-subtle); }
        .action-btn.neutral:hover:not(:disabled) { color: var(--text-primary); background: var(--bg-elevated); }
        .action-btn.warn { color: #f59e0b; border-color: rgba(245,158,11,0.4); }
        .action-btn.warn:hover:not(:disabled) { background: rgba(245,158,11,0.1); }
        .action-btn.orange { color: #fb923c; border-color: rgba(251,146,60,0.4); }
        .action-btn.orange:hover:not(:disabled) { background: rgba(251,146,60,0.1); }
        .action-btn.danger { color: #ff6b6b; border-color: rgba(255,107,107,0.4); }
        .action-btn.danger:hover:not(:disabled) { background: rgba(255,107,107,0.1); }
        .action-btn.danger-ip { color: #f87171; border-color: rgba(248,113,113,0.4); background: rgba(193,6,6,0.05); }
        .action-btn.danger-ip:hover:not(:disabled) { background: rgba(193,6,6,0.15); }
        .action-btn-icon { width: 13px; height: 13px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}