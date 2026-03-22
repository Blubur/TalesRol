'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { FlagIcon, LockClosedIcon, LockOpenIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { createPost, updatePost, deletePost } from '../topicactions'
import { reportPost, blockPost, unblockPost } from '../reportactions'
import QuillEditor, { type QuillEditorHandle } from '@/components/editor/quilleditor'
import DiceRoller from '@/components/DiceRoller'
import { buildDiceHTML } from '@/app/(main)/salas/[slug]/diceutils'
import type { DiceRollResult } from '@/app/(main)/salas/[slug]/diceactions'
import { getPageForPostNumber } from '@/lib/pagination'

interface Post {
  id: string
  topic_id: string
  author_id: string | null
  content: string
  post_number: number
  edited_at: string | null
  created_at: string
  blocked_at: string | null
  blocked_by: string | null
  profiles: { id: string; username: string; display_name: string | null; avatar_url: string | null; role: string } | null
  characters: {
    id: string
    name: string
    avatar_url: string | null
    description: string | null
    sheet: Record<string, unknown> | null
  } | null
}

interface DiceType {
  id: string
  name: string
  faces: number
  description: string | null
}

interface Props {
  posts: Post[]
  topicId: string
  slug: string
  roomId: string
  roomOwnerId: string | null
  userId: string | null
  userRole: string | null
  characters: { id: string; name: string; avatar_url: string | null }[]
  canPost: boolean
  isLocked: boolean
  diceTypes: DiceType[]
  isParticipant: boolean
  currentPage: number
  totalPages: number
  totalPosts: number
}

const REPORT_REASONS = [
  'Contenido inapropiado',
  'Acoso o bullying',
  'Spam',
  'Contenido fuera de tema',
  'Lenguaje ofensivo',
  'Otro',
]

const PRIORITY_FIELDS = ['raza', 'clase', 'edad', 'procedencia', 'origen', 'profesion', 'profesión', 'especie']

function storageKey(topicId: string) {
  return `talesrol_page_${topicId}`
}

function savePageToStorage(topicId: string, page: number) {
  try { localStorage.setItem(storageKey(topicId), String(page)) } catch { /* noop */ }
}

function CharacterSheet({ sheet }: { sheet: Record<string, unknown> }) {
  const entries = Object.entries(sheet).filter(([, v]) => v !== '' && v != null)
  if (entries.length === 0) return null

  const sorted = [...entries].sort(([a], [b]) => {
    const ai = PRIORITY_FIELDS.indexOf(a.toLowerCase())
    const bi = PRIORITY_FIELDS.indexOf(b.toLowerCase())
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return (
    <div className="char-sheet">
      {sorted.map(([key, val]) => (
        <div key={key} className="char-sheet-row">
          <span className="char-sheet-key">{key}</span>
          <span className="char-sheet-val">{String(val)}</span>
        </div>
      ))}
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  topicId,
  slug,
  onNavigate,
}: {
  currentPage: number
  totalPages: number
  topicId: string
  slug: string
  onNavigate: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pathname = `/salas/${slug}/${topicId}`

  function getPages(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <nav className="pagination" aria-label="Páginas del tema">
      <Link
        href={currentPage > 1 ? `${pathname}?page=${currentPage - 1}` : '#'}
        className={`page-btn page-prev ${currentPage === 1 ? 'disabled' : ''}`}
        aria-disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onNavigate(currentPage - 1)}
      >
        ‹
      </Link>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
        ) : (
          <Link
            key={p}
            href={`${pathname}?page=${p}`}
            className={`page-btn ${p === currentPage ? 'active' : ''}`}
            onClick={() => onNavigate(p as number)}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={currentPage < totalPages ? `${pathname}?page=${currentPage + 1}` : '#'}
        className={`page-btn page-next ${currentPage === totalPages ? 'disabled' : ''}`}
        aria-disabled={currentPage === totalPages}
        onClick={() => currentPage < totalPages && onNavigate(currentPage + 1)}
      >
        ›
      </Link>
    </nav>
  )
}

export default function PostsList({
  posts,
  topicId,
  slug,
  roomId,
  roomOwnerId,
  userId,
  userRole,
  characters,
  canPost,
  isLocked,
  diceTypes,
  isParticipant,
  currentPage,
  totalPages,
  totalPosts,
}: Props) {
  const [editingId, setEditingId]         = useState<string | null>(null)
  const [editContent, setEditContent]     = useState<string>('')
  const [error, setError]                 = useState<string | null>(null)
  const [loading, setLoading]             = useState(false)
  const [newContent, setNewContent]       = useState('')
  const [selectedChar, setSelectedChar]   = useState('')
  const editorRef                         = useRef<QuillEditorHandle>(null)
  const [pendingRolls, setPendingRolls]   = useState<DiceRollResult[]>([])
  const [showDice, setShowDice]           = useState(false)
  const [reportingId, setReportingId]     = useState<string | null>(null)
  const [reportReason, setReportReason]   = useState(REPORT_REASONS[0])
  const [reportCustom, setReportCustom]   = useState('')
  const [reportSuccess, setReportSuccess] = useState(false)

  const isRoomOwner   = userId === roomOwnerId
  const isModerator   = userRole === 'master' || userRole === 'admin'
  const canBlock      = isRoomOwner || isModerator
  const canHardDelete = isModerator
  const canUseDice    = canPost && isParticipant && diceTypes.length > 0
console.log('DEBUG', { userId, roomOwnerId, userRole, isRoomOwner, isModerator, canBlock })



  useEffect(() => {
    savePageToStorage(topicId, currentPage)
  }, [topicId, currentPage])

  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#post-')) return
    const el = document.querySelector(hash)
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    }
  }, [posts])

  function handlePageNavigate(page: number) {
    savePageToStorage(topicId, page)
  }

  function startEditing(post: Post) {
    setEditingId(post.id)
    setEditContent(post.content)
  }

  function forceReload(postNumber?: number) {
    if (postNumber) {
      const targetPage = getPageForPostNumber(postNumber)
      const hash       = `#post-${postNumber}`
      const query      = targetPage > 1 ? `?page=${targetPage}` : ''
      window.location.href = `/salas/${slug}/${topicId}${query}${hash}`
    } else {
      window.location.href = window.location.pathname + window.location.search
    }
  }

  function handleDiceResults(results: DiceRollResult[]) {
    setPendingRolls(prev => [...prev, ...results])
  }

  function removePendingRoll(index: number) {
    setPendingRolls(prev => prev.filter((_, i) => i !== index))
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const textContent = editorRef.current?.getHTML() ?? newContent
    const hasText     = textContent && textContent.trim() !== '<p><br></p>' && textContent.replace(/<[^>]*>/g, '').trim().length > 0
    const hasDice     = pendingRolls.length > 0

    if (!hasText && !hasDice) {
      setError('El post no puede estar vacío.')
      setLoading(false)
      return
    }

    const diceBlocks   = pendingRolls.map(r => buildDiceHTML(r)).join('\n')
    const finalContent = hasText
      ? textContent + (hasDice ? '\n' + diceBlocks : '')
      : diceBlocks

    const formData = new FormData()
    formData.set('topic_id', topicId)
    formData.set('slug', slug)
    formData.set('content', finalContent)
    if (selectedChar) formData.set('character_id', selectedChar)

    try {
      const result = await createPost(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.success) {
        editorRef.current?.setHTML('')
        setNewContent('')
        setPendingRolls([])
        setSelectedChar('')
        setLoading(false)
        const nextPostNumber = result.postNumber ?? (totalPosts + 1)
        forceReload(nextPostNumber)
      } else {
        setLoading(false)
      }
    } catch (err) {
      setError('Error inesperado al publicar.')
      setLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.set('id', editingId!)
    formData.set('topic_id', topicId)
    formData.set('slug', slug)
    formData.set('content', editContent)
    try {
      const result = await updatePost(formData)
      if (result?.error) { setError(result.error); setLoading(false) }
      else if (result?.success) { forceReload() }
    } catch {
      setError('Error inesperado al guardar.')
      setLoading(false)
    }
  }

  async function handleDelete(postId: string) {
    if (!confirm('¿Eliminar este post permanentemente?')) return
    setLoading(true)
    const result = await deletePost(postId, topicId, slug)
    if (result?.error) { setError(result.error); setLoading(false) }
    else forceReload()
  }

  async function handleReport(postId: string) {
    setLoading(true)
    const reason = reportReason === 'Otro' ? reportCustom : reportReason
    if (!reason.trim()) { setLoading(false); return }
    const result = await reportPost(postId, reason, topicId, slug)
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else {
      setReportSuccess(true)
      setTimeout(() => { setReportingId(null); setReportSuccess(false) }, 2000)
    }
  }

  async function handleBlock(postId: string) {
    if (!confirm('¿Bloquear este post? Se notificará a moderación.')) return
    setLoading(true)
    const result = await blockPost(postId, topicId, slug, roomId)
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else forceReload()
  }

  async function handleUnblock(postId: string) {
    if (!confirm('¿Desbloquear este post?')) return
    setLoading(true)
    const result = await unblockPost(postId, topicId, slug)
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else forceReload()
  }

  const paginationProps = { currentPage, totalPages, topicId, slug, onNavigate: handlePageNavigate }

  return (
    <div className="posts-section">

      {reportingId && (
        <div className="report-overlay" onClick={() => setReportingId(null)}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <h3 className="report-title">Reportar post</h3>
            {reportSuccess ? (
              <div className="report-success">Reporte enviado correctamente</div>
            ) : (
              <>
                <div className="report-reasons">
                  {REPORT_REASONS.map(r => (
                    <label key={r} className={`report-reason ${reportReason === r ? 'selected' : ''}`}>
                      <input type="radio" name="reason" value={r} checked={reportReason === r} onChange={() => setReportReason(r)} />
                      {r}
                    </label>
                  ))}
                </div>
                {reportReason === 'Otro' && (
                  <textarea className="report-custom" placeholder="Describe el motivo..." value={reportCustom} onChange={e => setReportCustom(e.target.value)} rows={3} />
                )}
                {error && <div className="auth-error"><span>⚠</span> {error}</div>}
                <div className="report-actions">
                  <button className="btn-ghost" onClick={() => setReportingId(null)} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>Cancelar</button>
                  <button className="btn-danger" onClick={() => handleReport(reportingId)} disabled={loading} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
                    {loading ? 'Enviando...' : 'Enviar reporte'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Pagination {...paginationProps} />

      {posts.length > 0 ? (
        <div className="posts-list">
          {posts.map(post => {
            const isOwner   = userId === post.author_id
            const hasDice   = post.content.includes('data-verified="true"')
            const canEdit   = isOwner && !post.blocked_at && !hasDice
            const canDelete = isOwner || canHardDelete
            const isBlocked = !!post.blocked_at
            const hasChar   = !!post.characters

            const avatar   = post.characters?.avatar_url ?? post.profiles?.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${post.profiles?.username ?? 'anon'}`
            const name     = post.characters?.name ?? post.profiles?.display_name ?? post.profiles?.username ?? 'Anónimo'
            const username = post.profiles?.username

            return (
              <div key={post.id} id={`post-${post.post_number}`} className={`post-item ${isBlocked ? 'post-blocked' : ''} ${hasChar ? 'post-has-char' : ''}`}>
                <div className="post-sidebar">
                  <Link href={username ? `/perfil/${username}` : '#'}>
                    <img src={avatar} alt={name} className="post-avatar" />
                  </Link>
                  <div className="post-author-info">
                    <Link href={username ? `/perfil/${username}` : '#'} className="post-author-name">{name}</Link>

                    {post.characters && post.profiles && (
                      <>
                        <span className="post-player">✦ {post.profiles.display_name || post.profiles.username}</span>
                        {post.characters.description && (
                          <p className="char-description">{post.characters.description}</p>
                        )}
                        {post.characters.sheet && Object.keys(post.characters.sheet).length > 0 && (
                          <CharacterSheet sheet={post.characters.sheet as Record<string, unknown>} />
                        )}
                      </>
                    )}

                    {!post.characters && post.profiles?.role && (
                      <span className={`role-badge ${post.profiles.role}`}>{post.profiles.role}</span>
                    )}
                  </div>
                </div>

                <div className="post-main">
                  <div className="post-header">
                    <a href={`#post-${post.post_number}`} className="post-number">#{post.post_number}</a>
                    <span className="post-date">
                      {new Date(post.created_at).toLocaleString('es-ES', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    {post.edited_at && <span className="post-edited">(editado)</span>}
                    {isBlocked && <span className="post-blocked-badge">bloqueado</span>}
                    {hasDice && <span className="post-dice-badge">tirada verificada</span>}
                    <div className="post-actions">
                      {userId && !isOwner && (
                        <button
                          className="post-action-btn report"
                          onClick={() => { setReportingId(post.id); setReportReason(REPORT_REASONS[0]); setReportCustom(''); setError(null) }}
                          title="Reportar"
                        >
                          <FlagIcon className="action-icon" />
                        </button>
                      )}
                      {canBlock && !isBlocked && (
                        <button className="post-action-btn warn" onClick={() => handleBlock(post.id)} title="Bloquear post">
                          <LockClosedIcon className="action-icon" />
                        </button>
                      )}
                      {canBlock && isBlocked && (
                        <button className="post-action-btn warn" onClick={() => handleUnblock(post.id)} title="Desbloquear post">
                          <LockOpenIcon className="action-icon" />
                        </button>
                      )}
                      {canEdit && (
                        <button className="post-action-btn" onClick={() => editingId === post.id ? setEditingId(null) : startEditing(post)} title="Editar">
                          <PencilIcon className="action-icon" />
                        </button>
                      )}
                      {canDelete && (
                        <button className="post-action-btn danger" onClick={() => handleDelete(post.id)} title="Eliminar">
                          <XMarkIcon className="action-icon" />
                        </button>
                      )}



                      {canBlock && !isBlocked && (
  <button 
    className="post-action-btn warn" 
    onClick={() => handleBlock(post.id)} 
    title="Bloquear post"
    style={{ display: 'flex', opacity: 1, visibility: 'visible' }}
  >
    <LockClosedIcon className="action-icon" />
  </button>
)}
                    </div>
                  </div>

                  {editingId === post.id ? (
                    <form onSubmit={handleUpdate} className="post-edit-form">
                      <div className="edit-html-wrapper">
                        <div className="edit-html-label">Editando HTML</div>
                        <textarea className="edit-html-textarea" value={editContent} onChange={e => setEditContent(e.target.value)} style={{ height: 200 }} spellCheck={false} />
                        <div className="edit-preview-label">Vista previa</div>
                        <div className="edit-preview post-content" dangerouslySetInnerHTML={{ __html: editContent }} />
                      </div>
                      {error && <div className="auth-error"><span>⚠</span> {error}</div>}
                      <div className="post-edit-actions">
                        <button type="button" className="btn-ghost" onClick={() => setEditingId(null)} style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
                          {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    </form>
                  ) : isBlocked ? (
                    <div className="post-blocked-content">
                      <span>Este mensaje ha sido bloqueado por un moderador y está pendiente de revisión.</span>
                      {isModerator && (
                        <details className="blocked-details">
                          <summary>Ver contenido original</summary>
                          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </details>
                      )}
                    </div>
                  ) : (
                    <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="posts-empty"><p>Aún no hay respuestas en este tema.</p></div>
      )}

      <Pagination {...paginationProps} />

      {canPost ? (
        <div className="new-post-form">
          <h3 className="new-post-title">✦ Responder</h3>
          <form onSubmit={handleCreate} className="new-post-inner">
            {characters.length > 0 && (
              <div className="form-group">
                <label htmlFor="character_id">Publicar como <span className="optional">(opcional)</span></label>
                <select id="character_id" className="input-base" style={{ maxWidth: '300px' }} value={selectedChar} onChange={e => setSelectedChar(e.target.value)}>
                  <option value="">— Yo mismo —</option>
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            {canUseDice && (
              <div className="dice-toggle-row">
                <button type="button" className={`dice-toggle-btn ${showDice ? 'active' : ''}`} onClick={() => setShowDice(v => !v)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="dice-toggle-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  {showDice ? 'Ocultar dados' : 'Tirar dados'}
                </button>
              </div>
            )}

            {showDice && canUseDice && (
              <DiceRoller diceTypes={diceTypes} onResult={handleDiceResults} onClose={() => setShowDice(false)} />
            )}

            {pendingRolls.length > 0 && (
              <div className="pending-rolls">
                <div className="pending-rolls-label">Tiradas que se añadirán al post:</div>
                {pendingRolls.map((roll, i) => (
                  <div key={i} className="pending-roll-item">
                    <span className="pending-roll-info">
                      <span className="pending-roll-dice">{roll.quantity}{roll.diceType}</span>
                      {roll.quantity > 1 && <span className="pending-roll-individual">[{roll.rolls.join(', ')}]</span>}
                      <span className="pending-roll-arrow">→</span>
                      <span className="pending-roll-total">{roll.total}</span>
                    </span>
                    <button type="button" className="pending-roll-remove" onClick={() => removePendingRoll(i)} title="Quitar tirada">
                      <XMarkIcon style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <QuillEditor ref={editorRef} name="content" placeholder="Escribe tu respuesta..." height={240} onChange={setNewContent} />

            {error && <div className="auth-error"><span>⚠</span> {error}</div>}
            <div className="new-post-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Publicando...</> : 'Publicar Post'}
              </button>
            </div>
          </form>
        </div>
      ) : !userId ? (
        <div className="posts-login-cta">
          <Link href="/auth/login" className="btn-primary">Inicia sesión para responder</Link>
        </div>
      ) : isLocked ? (
        <div className="posts-locked">Este tema está cerrado. No se aceptan más respuestas.</div>
      ) : null}

      <style>{`
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 0.5rem 0;
          flex-wrap: wrap;
        }
        .page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 2rem;
          height: 2rem;
          padding: 0 0.5rem;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-family: var(--font-cinzel);
          text-decoration: none;
          transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
          cursor: pointer;
        }
        .page-btn:hover:not(.disabled):not(.active) {
          background: var(--bg-elevated);
          border-color: var(--border-medium);
          color: var(--text-primary);
        }
        .page-btn.active {
          background: var(--color-crimson);
          border-color: var(--color-crimson);
          color: #fff;
          font-weight: 700;
          cursor: default;
        }
        .page-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }
        .page-prev, .page-next {
          font-size: 1.1rem;
          line-height: 1;
        }
        .page-ellipsis {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 2rem;
          height: 2rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  )
}