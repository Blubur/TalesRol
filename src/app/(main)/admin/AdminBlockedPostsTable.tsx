'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LockOpenIcon } from '@heroicons/react/24/outline'
import { unblockPostFromAdmin } from './actions'

interface BlockedPost {
  id: string
  content: string
  blocked_at: string
  topic_id: string
  author: { username: string; display_name: string | null } | null
  blocker: { username: string; display_name: string | null } | null
  topic: { title: string; room: { slug: string; title: string } | null } | null
}

export default function AdminBlockedPostsTable({ posts }: { posts: BlockedPost[] }) {
  const [local, setLocal]     = useState(posts)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  async function handleUnblock(post: BlockedPost) {
    if (!confirm('¿Desbloquear este post?')) return
    setLoading(post.id)
    const result = await unblockPostFromAdmin(post.id)
    setLoading(null)
    if (result?.error) {
      setError(result.error)
    } else {
      setLocal(prev => prev.filter(p => p.id !== post.id))
    }
  }

  if (local.length === 0) {
    return <p className="bp-empty">No hay posts bloqueados.</p>
  }

  return (
    <div className="bp-wrap">
      {error && <p className="bp-error">{error}</p>}
      <div className="bp-list">
        {local.map(post => {
          const room    = post.topic?.room
          const preview = post.content.replace(/<[^>]*>/g, '').trim().slice(0, 140)
          return (
            <div key={post.id} className="bp-card">
              <div className="bp-card-header">
                <div className="bp-card-meta">
                  {room && (
                    <Link href={`/salas/${room.slug}`} className="bp-room">{room.title}</Link>
                  )}
                  {post.topic && (
                    <>
                      <span className="bp-sep">›</span>
                      <Link
                        href={room ? `/salas/${room.slug}/${post.topic_id}` : '#'}
                        className="bp-topic"
                      >
                        {post.topic.title}
                      </Link>
                    </>
                  )}
                </div>
                <span className="bp-date">
                  Bloqueado {new Date(post.blocked_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <p className="bp-preview">{preview || '(sin texto)'}</p>

              <div className="bp-card-footer">
                <div className="bp-authors">
                  {post.author && (
                    <span className="bp-author">
                      Autor:{' '}
                      <Link href={`/perfil/${post.author.username}`} className="bp-author-link">
                        {post.author.display_name || post.author.username}
                      </Link>
                    </span>
                  )}
                  {post.blocker && (
                    <span className="bp-author">
                      Bloqueado por:{' '}
                      <Link href={`/perfil/${post.blocker.username}`} className="bp-author-link">
                        {post.blocker.display_name || post.blocker.username}
                      </Link>
                    </span>
                  )}
                </div>
                <button
                  className="action-btn success"
                  onClick={() => handleUnblock(post)}
                  disabled={loading === post.id}
                >
                  <LockOpenIcon className="action-btn-icon" />
                  {loading === post.id ? 'Desbloqueando...' : 'Desbloquear'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .bp-wrap { display: flex; flex-direction: column; gap: 0.5rem; }
        .bp-error { color: #ff6b6b; font-size: 0.82rem; margin: 0; }
        .bp-empty { color: var(--text-muted); font-style: italic; font-size: 0.88rem; margin: 0; }
        .bp-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .bp-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-left: 3px solid #ff6b6b; border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .bp-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .bp-card-meta { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
        .bp-room { font-size: 0.78rem; font-family: var(--font-cinzel); color: var(--color-crimson); text-decoration: none; letter-spacing: 0.04em; }
        .bp-room:hover { text-decoration: underline; }
        .bp-sep { font-size: 0.78rem; color: var(--text-muted); }
        .bp-topic { font-size: 0.78rem; font-family: var(--font-cinzel); color: var(--text-secondary); text-decoration: none; letter-spacing: 0.03em; }
        .bp-topic:hover { color: var(--color-crimson); }
        .bp-date { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-cinzel); white-space: nowrap; }
        .bp-preview { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0; font-style: italic; }
        .bp-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; }
        .bp-authors { display: flex; flex-direction: column; gap: 0.2rem; }
        .bp-author { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.03em; }
        .bp-author-link { color: var(--text-secondary); text-decoration: none; }
        .bp-author-link:hover { color: var(--color-crimson); }
        .action-btn { display: flex; align-items: center; gap: 0.3rem; background: transparent; border: 1px solid; border-radius: 3px; padding: 0.25rem 0.6rem; font-size: 0.7rem; font-family: var(--font-cinzel); letter-spacing: 0.04em; cursor: pointer; transition: all 0.15s; }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn.success { color: #34d399; border-color: rgba(52,211,153,0.4); }
        .action-btn.success:hover:not(:disabled) { background: rgba(52,211,153,0.1); }
        .action-btn-icon { width: 12px; height: 12px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}