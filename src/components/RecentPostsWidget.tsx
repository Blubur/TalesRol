import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { getPageForPostNumber } from '@/lib/pagination'

interface RecentPost {
  id: string
  post_number: number
  created_at: string
  topic_id: string
  profiles: {
    username: string
    display_name: string | null
    avatar_url: string | null
    role: string
  } | null
  topics: {
    title: string
    rooms: {
      slug: string
      title: string
    } | null
  } | null
}

// Mapa de colores por rol — usa las variables CSS del proyecto
const ROLE_COLORS: Record<string, string> = {
  admin:    'var(--color-role-admin)',
  master:   'var(--color-role-master)',
  director: 'var(--color-role-director)',
  jugador:  'var(--color-role-jugador)',
  miembro:  'var(--color-role-miembro)',
}

function roleColor(role: string | undefined | null) {
  return role ? (ROLE_COLORS[role] ?? 'var(--color-role-miembro)') : 'var(--text-muted)'
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  <  1) return 'ahora mismo'
  if (mins  < 60) return `hace ${mins}m`
  if (hours < 24) return `hace ${hours}h`
  if (days  <  7) return `hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export default async function RecentPostsWidget({ limit = 10 }: { limit?: number }) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('posts')
    .select(`
      id,
      post_number,
      created_at,
      topic_id,
      profiles!posts_author_id_fkey (
        username,
        display_name,
        avatar_url,
        role
      ),
      topics (
        title,
        rooms (
          slug,
          title
        )
      )
    `)
    .is('deleted_at', null)
    .is('blocked_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  const posts = (data ?? []) as unknown as RecentPost[]

  if (posts.length === 0) return null

  return (
    <div className="rpw-widget animate-enter">
      <div className="rpw-header">
        <span className="rpw-title-icon">✦</span>
        <span className="rpw-title">Últimos posts</span>
        <Link href="/salas" className="rpw-all-link">Ver salas →</Link>
      </div>

      <ol className="rpw-list">
        {posts.map((post, i) => {
          const room    = post.topics?.rooms
          const profile = post.profiles
          if (!room || !profile) return null

          const page   = getPageForPostNumber(post.post_number)
          const query  = page > 1 ? `?page=${page}` : ''
          const href   = `/salas/${room.slug}/${post.topic_id}${query}#post-${post.post_number}`
          const color  = roleColor(profile.role)
          const avatar = profile.avatar_url
            ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${profile.username}`
          const displayName = profile.display_name || profile.username

          return (
            <li
              key={post.id}
              className="rpw-item animate-enter"
              style={{ animationDelay: `${0.03 * i}s` }}
            >
              {/* Número ordinal */}
              <span className="rpw-index">{i + 1}</span>

              {/* Avatar + rol */}
              <Link href={`/perfil/${profile.username}`} className="rpw-avatar-wrap" title={displayName}>
                <img src={avatar} alt={displayName} className="rpw-avatar" />
                <span className="rpw-role-dot" style={{ background: color }} />
              </Link>

              {/* Cuerpo */}
              <div className="rpw-body">
                {/* Título del tema → enlace directo al post */}
                <Link href={href} className="rpw-topic-title">
                  {post.topics?.title}
                </Link>

                {/* Sala */}
                <span className="rpw-room">{room.title}</span>

                {/* Autor + fecha */}
                <div className="rpw-meta">
                  <Link
                    href={`/perfil/${profile.username}`}
                    className="rpw-author"
                    style={{ color }}
                  >
                    {displayName}
                  </Link>
                  <span className="rpw-sep">·</span>
                  <span className="rpw-date" title={new Date(post.created_at).toLocaleString('es-ES')}>
                    {timeAgo(post.created_at)}
                  </span>
                  <span className="rpw-sep">·</span>
                  <span className="rpw-post-num">#{post.post_number}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <style>{`
        /* ── Widget contenedor ──────────────────────────────────── */
        .rpw-widget {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          overflow: hidden;
        }

        /* ── Cabecera ───────────────────────────────────────────── */
        .rpw-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .rpw-title-icon {
          color: var(--color-crimson);
          font-size: 0.75rem;
        }
        .rpw-title {
          flex: 1;
          font-family: var(--font-cinzel);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .rpw-all-link {
          font-size: 0.72rem;
          font-family: var(--font-cinzel);
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .rpw-all-link:hover { color: var(--color-crimson); }

        /* ── Lista ──────────────────────────────────────────────── */
        .rpw-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .rpw-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.7rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          transition: background 0.15s;
        }
        .rpw-item:last-child { border-bottom: none; }
        .rpw-item:hover { background: var(--bg-elevated); }

        /* ── Número ordinal ─────────────────────────────────────── */
        .rpw-index {
          flex-shrink: 0;
          width: 1.1rem;
          font-size: 0.68rem;
          font-family: var(--font-cinzel);
          color: var(--text-muted);
          padding-top: 0.15rem;
          text-align: right;
        }

        /* ── Avatar ─────────────────────────────────────────────── */
        .rpw-avatar-wrap {
          position: relative;
          flex-shrink: 0;
          display: block;
          width: 32px;
          height: 32px;
        }
        .rpw-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          object-fit: cover;
          display: block;
        }
        .rpw-role-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid var(--bg-card);
        }

        /* ── Cuerpo del ítem ────────────────────────────────────── */
        .rpw-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .rpw-topic-title {
          font-size: 0.83rem;
          font-family: var(--font-cinzel);
          color: var(--text-primary);
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
          transition: color 0.15s;
        }
        .rpw-topic-title:hover { color: var(--color-crimson); }

        .rpw-room {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rpw-meta {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-wrap: wrap;
          margin-top: 0.05rem;
        }
        .rpw-author {
          font-size: 0.72rem;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .rpw-author:hover { opacity: 0.75; }
        .rpw-sep {
          font-size: 0.65rem;
          color: var(--text-muted);
        }
        .rpw-date, .rpw-post-num {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-family: var(--font-cinzel);
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}