'use client'

import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'

export default function AnnouncementCard({ ann, pinned, delay }: { ann: any; pinned: boolean; delay: number }) {
  const author    = ann.profiles
  const avatarUrl = author?.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${author?.username ?? 'admin'}`
  const date      = new Date(ann.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <article
      id={`anuncio-${ann.id}`}
      className={`ann-card animate-enter ${pinned ? 'pinned' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="ann-card-header">
        <div className="ann-card-title-row">
          {pinned && <MapPinIcon className="ann-pin-icon" />}
          <h2 className="ann-card-title">{ann.title}</h2>
        </div>
        <span className="ann-card-date">{date}</span>
      </div>

      <div
        className="ann-card-content ql-output"
        dangerouslySetInnerHTML={{ __html: ann.content ?? '' }}
      />

      {author && (
        <div className="ann-card-footer">
          <Link href={`/perfil/${author.username}`} className="ann-author">
            <img src={avatarUrl} alt={author.username} className="ann-author-avatar" />
            <span>{author.display_name || author.username}</span>
          </Link>
        </div>
      )}

      <style>{`
        .ann-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; transition: border-color 0.2s; }
        .ann-card:hover { border-color: var(--border-medium); }
        .ann-card.pinned { border-left: 3px solid var(--color-crimson); background: linear-gradient(to right, rgba(193,6,6,0.03), transparent 30%); }

        .ann-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .ann-card-title-row { display: flex; align-items: center; gap: 0.5rem; }
        .ann-pin-icon { width: 14px; height: 14px; color: var(--color-crimson); flex-shrink: 0; }
        .ann-card-title { font-family: var(--font-cinzel); font-size: 1.1rem; font-weight: 600; letter-spacing: 0.04em; margin: 0; }
        .ann-card-date { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.04em; white-space: nowrap; flex-shrink: 0; }

        .ann-card-content { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.75; margin: 0; }
        .ann-card-content.ql-output p { margin: 0 0 0.5em; }
        .ann-card-content.ql-output ul, .ann-card-content.ql-output ol { padding-left: 1.5rem; margin: 0.4em 0; }
        .ann-card-content.ql-output strong { color: var(--text-primary); }
        .ann-card-content.ql-output em { font-style: italic; }
        .ann-card-content.ql-output a { color: var(--color-crimson); text-decoration: underline; }
        .ann-card-content.ql-output blockquote { border-left: 3px solid var(--border-medium); padding-left: 0.75rem; color: var(--text-muted); margin: 0.5em 0; font-style: italic; }
        .ann-card-content.ql-output h1 { font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--color-crimson); margin: 0.6em 0 0.3em; }
        .ann-card-content.ql-output h2 { font-family: var(--font-cinzel); font-size: 1.1rem; color: #d4820a; margin: 0.5em 0 0.3em; }
        .ann-card-content.ql-output h3 { font-family: var(--font-cinzel); font-size: 0.95rem; margin: 0.4em 0 0.2em; }

        .ann-card-footer { display: flex; align-items: center; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle); }
        .ann-author { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: var(--text-muted); font-size: 0.78rem; transition: color 0.2s; }
        .ann-author:hover { color: var(--text-primary); }
        .ann-author-avatar { width: 22px; height: 22px; border-radius: 50%; border: 1px solid var(--border-subtle); object-fit: cover; }
      `}</style>
    </article>
  )
}