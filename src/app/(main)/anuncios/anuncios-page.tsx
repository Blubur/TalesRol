import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MegaphoneIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline'
import DOMPurify from 'isomorphic-dompurify'

export const metadata = { title: 'Anuncios — TalesRol' }

export default async function AnunciosPage() {
  const supabase = await createClient()

  const { data: announcementsData } = await supabase
    .from('announcements')
    .select('*, profiles!announcements_author_id_fkey(username, display_name, avatar_url)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const announcements = announcementsData ?? []
  const pinned   = announcements.filter(a => a.is_pinned)
  const regular  = announcements.filter(a => !a.is_pinned)

  return (
    <div className="ann-page">

      <div className="ann-header animate-enter">
        <div className="ann-header-left">
          <MegaphoneIcon className="ann-header-icon" />
          <div>
            <h1 className="ann-title">Anuncios</h1>
            <p className="ann-sub">Noticias y novedades de la comunidad</p>
          </div>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="ann-empty animate-enter">
          <MegaphoneIcon className="ann-empty-icon" />
          <p>No hay anuncios publicados todavía.</p>
        </div>
      ) : (
        <div className="ann-sections">
          {pinned.length > 0 && (
            <div className="ann-section animate-enter" style={{ animationDelay: '0.05s' }}>
              <h2 className="ann-section-title">
                <MapPinIcon className="ann-section-icon" /> Fijados
              </h2>
              <div className="ann-list">
                {pinned.map((ann, i) => (
                  <AnnouncementCard key={ann.id} ann={ann} pinned delay={0.05 + i * 0.04} />
                ))}
              </div>
            </div>
          )}
          {regular.length > 0 && (
            <div className="ann-section animate-enter" style={{ animationDelay: '0.1s' }}>
              {pinned.length > 0 && (
                <h2 className="ann-section-title">
                  <CalendarIcon className="ann-section-icon" /> Anteriores
                </h2>
              )}
              <div className="ann-list">
                {regular.map((ann, i) => (
                  <AnnouncementCard key={ann.id} ann={ann} pinned={false} delay={0.1 + i * 0.04} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .ann-page { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }

        .ann-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); position: relative; }
        .ann-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: var(--color-crimson); }
        .ann-header-left { display: flex; align-items: center; gap: 1rem; }
        .ann-header-icon { width: 28px; height: 28px; color: var(--color-crimson); }
        .ann-title { font-family: var(--font-cinzel); font-size: 1.6rem; font-weight: 700; letter-spacing: 0.08em; margin: 0; }
        .ann-sub { color: var(--text-muted); font-size: 0.85rem; margin: 0.2rem 0 0; }

        .ann-empty { text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .ann-empty-icon { width: 40px; height: 40px; color: var(--border-medium); }

        .ann-sections { display: flex; flex-direction: column; gap: 2rem; }
        .ann-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .ann-section-title { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-cinzel); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin: 0; }
        .ann-section-icon { width: 14px; height: 14px; flex-shrink: 0; }
        .ann-list { display: flex; flex-direction: column; gap: 0.5rem; }
      `}</style>
    </div>
  )
}

function AnnouncementCard({ ann, pinned, delay }: { ann: any; pinned: boolean; delay: number }) {
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
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ann.content ?? '') }}
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