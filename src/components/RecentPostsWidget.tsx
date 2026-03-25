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
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  <  1) return 'ahora'
  if (mins  < 60) return `${mins}m`
  if (hours < 24) return `${hours}h`
  if (days  <  7) return `${days}d`
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
    <div className="rpw">
      <div className="rpw-head">
        <span className="rpw-head-title">✦ Últimas respuestas</span>
        <Link href="/salas" className="rpw-head-link">Ver salas →</Link>
      </div>

      <ul className="rpw-list">
        {posts.map((post) => {
          const room    = post.topics?.rooms
          const profile = post.profiles
          if (!room || !profile) return null

          const page   = getPageForPostNumber(post.post_number)
          const query  = page > 1 ? `?page=${page}` : ''
          const href   = `/salas/${room.slug}/${post.topic_id}${query}#post-${post.post_number}`
          const color  = roleColor(profile.role)
          const name   = profile.display_name || profile.username
          const avatar = profile.avatar_url
            ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${profile.username}`

          return (
            <li key={post.id} className="rpw-item">
              {/* Fila superior: avatar pequeño + título del tema */}
              <div className="rpw-row-top">
                <Link href={`/perfil/${profile.username}`} className="rpw-avatar-wrap" title={name}>
                  <img src={avatar} alt={name} className="rpw-avatar" />
                  <span className="rpw-role-dot" style={{ background: color }} />
                </Link>
                <Link href={href} className="rpw-topic" title={post.topics?.title}>
                  {post.topics?.title}
                </Link>
              </div>

              {/* Fila inferior: autor · sala · tiempo */}
              <div className="rpw-row-bottom">
                <Link href={`/perfil/${profile.username}`} className="rpw-author" style={{ color }}>
                  {name}
                </Link>
                <span className="rpw-sep">·</span>
                <span className="rpw-room">{room.title}</span>
                <span className="rpw-sep">·</span>
                <span className="rpw-time" title={new Date(post.created_at).toLocaleString('es-ES')}>
                  {timeAgo(post.created_at)}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <style>{`
        .rpw {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
         overflow: auto;
         height: 21em;
        }

        /* Cabecera */
        .rpw-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.55rem 0.85rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .rpw-head-title {
          font-family: var(--font-cinzel);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .rpw-head-link {
          font-size: 0.63rem;
          font-family: var(--font-cinzel);
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .rpw-head-link:hover { color: var(--color-crimson); }

        /* Lista */
        .rpw-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .rpw-item {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          padding: 0.4rem 0.85rem;
          border-bottom: 1px solid var(--border-subtle);
          transition: background 0.12s;
        }
        .rpw-item:last-child { border-bottom: none; }
        .rpw-item:hover { background: var(--bg-elevated); }

        /* Fila del título con avatar */
        .rpw-row-top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          min-width: 0;
        }

        /* Avatar 18px con punto de rol */
        .rpw-avatar-wrap {
          position: relative;
          flex-shrink: 0;
          display: block;
          width: 18px;
          height: 18px;
        }
        .rpw-avatar {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          object-fit: cover;
          display: block;
        }
        .rpw-role-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          border: 1px solid var(--bg-card);
        }

        /* Título del tema */
        .rpw-topic {
          font-size: 0.76rem;
          font-family: var(--font-cinzel);
          color: var(--text-primary);
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
          transition: color 0.12s;
          flex: 1;
          min-width: 0;
        }
        .rpw-topic:hover { color: var(--color-crimson); }

        /* Fila de metadatos — indentada para alinear con el título */
        .rpw-row-bottom {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding-left: 1.45rem;
        }
        .rpw-author {
          font-size: 0.65rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 0.12s;
        }
        .rpw-author:hover { opacity: 0.75; }
        .rpw-sep {
          font-size: 0.58rem;
          color: var(--text-muted);
        }
        .rpw-room {
          font-size: 0.63rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }
        .rpw-time {
          font-size: 0.63rem;
          color: var(--text-muted);
          font-family: var(--font-cinzel);
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}