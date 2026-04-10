import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Profile } from '@/types/database'
import ReportButton from '@/components/ReportButton'
import BadgeIcon from '@/components/BadgeIcon'
import {
  PencilIcon,
  EnvelopeIcon,
  CalendarIcon,
  BookOpenIcon,
  UserGroupIcon,
  LockClosedIcon,
  TrophyIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline'

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin:    { label: 'Administrador', color: 'var(--color-role-admin)' },
  master:   { label: 'Moderador',     color: 'var(--color-role-master)' },
  director: { label: 'Director',      color: 'var(--color-role-director)' },
  jugador:  { label: 'Jugador',       color: 'var(--color-role-jugador)' },
  miembro:  { label: 'Miembro',       color: 'var(--color-role-miembro)' },
  player:   { label: 'Jugador',       color: 'var(--color-role-jugador)' },
  guest:    { label: 'Invitado',      color: 'var(--color-role-miembro)' },
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('display_name, username').eq('username', username).single()
  return { title: data ? `${data.display_name || data.username} — TalesRol` : 'Perfil' }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profileData } = await supabase
    .from('profiles').select('*').eq('username', username).single()

  if (!profileData) notFound()
  const profile = profileData as Profile & {
    privacy_characters: boolean
    privacy_rooms: boolean
    privacy_posts: boolean
  }

  const { data: myProfile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const isOwnProfile = user.id === profile.id
  const isAdmin = myProfile?.role === 'admin'
  const canSeeAll = isOwnProfile || isAdmin

  // Personajes
  const showCharacters = canSeeAll || profile.privacy_characters !== false
  const { data: characters } = showCharacters ? await supabase
    .from('characters').select('id, name, avatar_url, description')
    .eq('user_id', profile.id).eq('is_active', true).is('deleted_at', null)
    .order('created_at', { ascending: false }) : { data: [] }

  // Posts recientes
  const showPosts = canSeeAll || profile.privacy_posts !== false
  const { data: recentPosts } = showPosts ? await supabase
    .from('posts').select('id, content, post_number, created_at, topic_id, topics(title, rooms(slug, title))')
    .eq('author_id', profile.id).is('deleted_at', null)
    .order('created_at', { ascending: false }).limit(5) : { data: [] }

  // Temas abiertos por el usuario
  const { data: userTopics } = showPosts ? await supabase
    .from('topics')
    .select('id, title, created_at, rooms!inner(slug, title)')
    .eq('author_id', profile.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(10) : { data: [] }

  // Último posteador por tema
  const topicIds = (userTopics ?? []).map((t: any) => t.id)
  const lastPosterMap: Record<string, { username: string; display_name: string | null; created_at: string }> = {}
  if (topicIds.length > 0) {
    const { data: lastPosts } = await supabase
      .from('posts')
      .select('topic_id, created_at, profiles!posts_author_id_fkey(username, display_name)')
      .in('topic_id', topicIds)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    ;(lastPosts ?? []).forEach((p: any) => {
      if (!lastPosterMap[p.topic_id]) {
        lastPosterMap[p.topic_id] = {
          username: p.profiles?.username ?? '',
          display_name: p.profiles?.display_name ?? null,
          created_at: p.created_at,
        }
      }
    })
  }

  // Salas
  const showRooms = canSeeAll || profile.privacy_rooms !== false
  const { data: roomActivity } = showRooms ? await supabase
    .from('posts').select('topics(rooms(id, slug, title, cover_url, status))')
    .eq('author_id', profile.id).is('deleted_at', null).limit(50) : { data: [] }

  const roomsMap = new Map()
  roomActivity?.forEach((p: any) => {
    const room = p.topics?.rooms
    if (room && !roomsMap.has(room.id)) roomsMap.set(room.id, room)
  })
  const rooms = Array.from(roomsMap.values()).slice(0, 6)

  const { count: postCount } = await supabase
    .from('posts').select('*', { count: 'exact', head: true })
    .eq('author_id', profile.id).is('deleted_at', null)

  // Badges visibles — usando tabla badges unificada
  const { data: rawVisibleBadges } = await supabase
    .from('user_badges')
    .select('badge_id, unlocked_at, earned_at')
    .eq('user_id', profile.id)
    .eq('is_visible', true)
    .order('unlocked_at', { ascending: true })

  const { data: allBadgesData } = await supabase
    .from('badges')
    .select('id, name, icon_url, color, condition_key')

  const visibleBadges = (rawVisibleBadges ?? []).map(ub => {
    const badge = (allBadgesData ?? []).find(
      b => b.condition_key === ub.badge_id || b.id === ub.badge_id
    )
    return badge ? { badge_id: ub.badge_id, badge } : null
  }).filter(Boolean) as { badge_id: string; badge: { name: string; icon_url: string | null; color: string } }[]

  const roleInfo = ROLE_LABELS[profile.role] ?? ROLE_LABELS.guest
  const avatarUrl = profile.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${profile.username}`
  const joinDate = new Date(profile.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const lastSeen = new Date(profile.ultimo_acceso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="profile-page">

      {/* HERO */}
      <div className="profile-hero animate-enter">
        <div className="profile-banner" style={{ backgroundImage: profile.banner_url ? `url(${profile.banner_url})` : undefined }} />
        <div className="profile-hero-content">
          <div className="profile-avatar-wrap">
            <img src={avatarUrl} alt={profile.username} className="profile-avatar" />
            <span className="profile-role-dot" style={{ background: roleInfo.color }} title={roleInfo.label} />
          </div>
          <div className="profile-identity">
            <h1 className="profile-displayname">{profile.display_name || profile.username}</h1>
            <span className="profile-username">@{profile.username}</span>
            <span className="profile-role-badge" style={{ color: roleInfo.color, borderColor: roleInfo.color }}>
              {roleInfo.label}
            </span>
          </div>
          <div className="profile-hero-actions">
            {isOwnProfile ? (
              <>
                <Link href="/perfil/editar" className="btn-ghost btn-sm">
                  <PencilIcon style={{ width: 13, height: 13 }} /> Editar perfil
                </Link>
                <Link href="/perfil/privacidad" className="btn-ghost btn-sm">
                  <LockClosedIcon style={{ width: 13, height: 13 }} /> Privacidad
                </Link>
              </>
            ) : (
              <>
                <Link href={`/mensajes/${profile.username}`} className="btn-ghost btn-sm">
                  <EnvelopeIcon style={{ width: 13, height: 13 }} /> Mensaje
                </Link>
                <ReportButton targetUserId={profile.id} targetUsername={profile.username} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="profile-body">

        {/* ASIDE */}
        <aside className="profile-aside">

          <div className="profile-card animate-enter" style={{ animationDelay: '0.05s' }}>
            <h2 className="profile-card-title">Sobre mí</h2>
            {profile.bio
              ? <p className="profile-bio">{profile.bio}</p>
              : <p className="profile-bio empty">Sin biografía.</p>
            }
          </div>

          <div className="profile-card animate-enter" style={{ animationDelay: '0.1s' }}>
            <h2 className="profile-card-title">Estadísticas</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{postCount ?? 0}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profile.points}</span>
                <span className="stat-label">Puntos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{characters?.length ?? 0}</span>
                <span className="stat-label">Personajes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{rooms.length}</span>
                <span className="stat-label">Salas</span>
              </div>
            </div>
          </div>

          <div className="profile-card animate-enter" style={{ animationDelay: '0.15s' }}>
            <h2 className="profile-card-title">Actividad</h2>
            <div className="dates-list">
              <div className="date-item">
                <CalendarIcon className="date-icon" />
                <div>
                  <span className="date-label">Registrado</span>
                  <span className="date-value">{joinDate}</span>
                </div>
              </div>
              <div className="date-item">
                <CalendarIcon className="date-icon" />
                <div>
                  <span className="date-label">Último acceso</span>
                  <span className="date-value">{lastSeen}</span>
                </div>
              </div>
            </div>
          </div>

          {/* INSIGNIAS */}
          <div className="profile-card animate-enter" style={{ animationDelay: '0.2s' }}>
            <h2 className="profile-card-title">
              <TrophyIcon style={{ width: 13, height: 13 }} /> Insignias
            </h2>
            {visibleBadges.length > 0 ? (
              <div className="badges-list">
                {visibleBadges.map(ub => {
                  const def = ub.badge
                  return (
                    <span
                      key={ub.badge_id}
                      className={`profile-badge ${def.color === 'gold' ? 'gold' : def.color === 'purple' ? 'purple' : def.color === 'crimson' ? 'crimson' : ''}`}
                      title={def.name}
                    >
                      <BadgeIcon icon={def.icon_url} size={11} />
                      {def.name}
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="empty-text">Sin insignias visibles.</p>
            )}
            {isOwnProfile && (
              <Link
                href="/perfil/badges"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--color-crimson)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: 'var(--space-1)' }}
              >
                Gestionar insignias →
              </Link>
            )}
          </div>

        </aside>

        {/* MAIN */}
        <main className="profile-main">

          {/* Personajes */}
          <div className="profile-card animate-enter" style={{ animationDelay: '0.1s' }}>
            <h2 className="profile-card-title">
              <UserGroupIcon style={{ width: 14, height: 14 }} /> Personajes
              {!showCharacters && <LockClosedIcon style={{ width: 12, height: 12, marginLeft: 'auto', color: 'var(--text-muted)' }} />}
            </h2>
            {!showCharacters ? (
              <p className="empty-text private-notice">
                <LockClosedIcon style={{ width: 13, height: 13 }} /> Este usuario ha ocultado sus personajes.
              </p>
            ) : characters && characters.length > 0 ? (
              <div className="characters-grid">
                {characters.map(c => (
                  <Link href={`/personajes/${c.id}`} key={c.id} className="char-card">
                    <img
                      src={c.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${c.name}`}
                      alt={c.name} className="char-avatar"
                    />
                    <div className="char-info">
                      <span className="char-name">{c.name}</span>
                      {c.description && (
                        <span className="char-desc">{c.description.slice(0, 60)}{c.description.length > 60 ? '…' : ''}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty-text">Sin personajes activos.</p>
            )}
          </div>

          {/* Salas */}
          <div className="profile-card animate-enter" style={{ animationDelay: '0.15s' }}>
            <h2 className="profile-card-title">
              <BookOpenIcon style={{ width: 14, height: 14 }} /> Salas en las que participa
            </h2>
            {!showRooms ? (
              <p className="empty-text private-notice">
                <LockClosedIcon style={{ width: 13, height: 13 }} /> Este usuario ha ocultado sus salas.
              </p>
            ) : rooms.length > 0 ? (
              <div className="rooms-list">
                {rooms.map((room: any) => (
                  <Link href={`/salas/${room.slug}`} key={room.id} className="room-item">
                    {room.cover_url
                      ? <img src={room.cover_url} alt={room.title} className="room-cover" />
                      : <div className="room-cover-placeholder"><BookOpenIcon style={{ width: 14, height: 14 }} /></div>
                    }
                    <span className="room-title">{room.title}</span>
                    <span className={`room-status ${room.status}`}>{room.status}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty-text">No participa en ninguna sala aún.</p>
            )}
          </div>

          {/* Temas abiertos */}
          <div className="profile-card animate-enter" style={{ animationDelay: '0.2s' }}>
            <h2 className="profile-card-title">
              <ChatBubbleLeftEllipsisIcon style={{ width: 14, height: 14 }} /> Temas abiertos
              {!showPosts && <LockClosedIcon style={{ width: 12, height: 12, marginLeft: 'auto', color: 'var(--text-muted)' }} />}
            </h2>
            {!showPosts ? (
              <p className="empty-text private-notice">
                <LockClosedIcon style={{ width: 13, height: 13 }} /> Este usuario ha ocultado su actividad.
              </p>
            ) : userTopics && userTopics.length > 0 ? (
              <div className="topics-list">
                {(userTopics as any[]).map(topic => {
                  const room = topic.rooms
                  const lastPoster = lastPosterMap[topic.id]
                  return (
                    <Link
                      key={topic.id}
                      href={room ? `/salas/${room.slug}/${topic.id}` : '#'}
                      className="topic-item"
                    >
                      <div className="topic-item-main">
                        <span className="topic-item-title">{topic.title}</span>
                        <span className="topic-item-room">{room?.title ?? '—'}</span>
                      </div>
                      <div className="topic-item-meta">
                        <span className="topic-item-date">
                          <CalendarIcon style={{ width: 10, height: 10 }} />
                          {new Date(topic.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {lastPoster && (
                          <span className="topic-item-last">
                            Último post:{' '}
                            <Link href={`/perfil/${lastPoster.username}`} className="topic-item-last-author">
                              {lastPoster.display_name || lastPoster.username}
                            </Link>
                            {' · '}
                            {new Date(lastPoster.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="empty-text">No ha abierto ningún tema aún.</p>
            )}
          </div>

          {/* Posts recientes */}
          <div className="profile-card animate-enter" style={{ animationDelay: '0.25s' }}>
            <h2 className="profile-card-title">
              <PencilIcon style={{ width: 14, height: 14 }} /> Posts recientes
            </h2>
            {!showPosts ? (
              <p className="empty-text private-notice">
                <LockClosedIcon style={{ width: 13, height: 13 }} /> Este usuario ha ocultado sus posts.
              </p>
            ) : recentPosts && recentPosts.length > 0 ? (
              <div className="recent-posts-list">
                {(recentPosts as any[]).map((post) => {
                  const topic = post.topics
                  const room = topic?.rooms
                  const preview = post.content.replace(/<[^>]*>/g, '').trim().slice(0, 120)
                  return (
                    <Link
                      key={post.id}
                      href={room ? `/salas/${room.slug}/${post.topic_id}#post-${post.post_number}` : '#'}
                      className="recent-post-item"
                    >
                      <div className="post-meta">
                        <span className="post-room">{room?.title ?? '—'}</span>
                        <span className="post-sep">›</span>
                        <span className="post-topic">{topic?.title ?? '—'}</span>
                        <span className="post-date">
                          {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="post-preview">{preview || '(sin texto)'}</p>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="empty-text">Sin posts recientes.</p>
            )}
          </div>

        </main>
      </div>

      <style>{`
        .profile-page { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6); }
        .profile-hero { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; }
        .profile-banner { height: 160px; background: linear-gradient(135deg, rgba(193,6,6,0.15) 0%, var(--bg-secondary) 100%); background-size: cover; background-position: center; }
        .profile-hero-content { display: flex; align-items: flex-end; gap: var(--space-5); padding: 0 var(--space-6) var(--space-5); margin-top: -48px; flex-wrap: wrap; }
        .profile-avatar-wrap { position: relative; flex-shrink: 0; }
        .profile-avatar { width: 96px; height: 96px; border-radius: 50%; border: 3px solid var(--bg-card); object-fit: cover; background: var(--bg-secondary); display: block; }
        .profile-role-dot { position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--bg-card); display: block; }
        .profile-identity { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); padding-top: var(--space-4); min-width: 160px; }
        .profile-displayname { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; margin: 0; letter-spacing: 0.05em; }
        .profile-username { font-size: var(--text-sm); color: var(--text-muted); }
        .profile-role-badge { font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.08em; border: 1px solid; border-radius: var(--radius-sm); padding: 0.15rem 0.5rem; width: fit-content; }
        .profile-hero-actions { display: flex; gap: var(--space-2); align-items: center; margin-left: auto; padding-top: var(--space-4); flex-wrap: wrap; }
        .profile-body { display: grid; grid-template-columns: 260px 1fr; gap: var(--space-5); align-items: start; }
        .profile-aside { display: flex; flex-direction: column; gap: var(--space-4); }
        .profile-main { display: flex; flex-direction: column; gap: var(--space-4); }
        .profile-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); }
        .profile-card-title { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-crimson); margin: 0; padding-bottom: var(--space-2); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: var(--space-2); }
        .profile-bio { font-family: var(--font-body); font-size: var(--text-base); line-height: 1.7; color: var(--text-secondary); margin: 0; white-space: pre-line; }
        .profile-bio.empty { color: var(--text-muted); font-style: italic; font-size: var(--text-sm); }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
        .stat-item { display: flex; flex-direction: column; align-items: center; gap: var(--space-1); background: var(--bg-secondary); border-radius: var(--radius-sm); padding: var(--space-3); }
        .stat-value { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; color: var(--color-crimson); }
        .stat-label { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.06em; text-transform: uppercase; }
        .dates-list { display: flex; flex-direction: column; gap: var(--space-3); }
        .date-item { display: flex; align-items: flex-start; gap: var(--space-3); }
        .date-icon { width: 14px; height: 14px; color: var(--color-crimson); flex-shrink: 0; margin-top: 2px; }
        .date-label { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.04em; display: block; }
        .date-value { font-size: var(--text-sm); color: var(--text-secondary); display: block; }
        .badges-list { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .profile-badge { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.05em; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.2rem 0.5rem; color: var(--text-secondary); }
        .profile-badge.gold    { border-color: rgba(251,191,36,0.4);  color: #fbbf24; background: rgba(251,191,36,0.06); }
        .profile-badge.purple  { border-color: rgba(167,139,250,0.4); color: #a78bfa; background: rgba(167,139,250,0.06); }
        .profile-badge.crimson { border-color: var(--border-medium);  color: var(--color-crimson); background: var(--color-crimson-subtle); }
        .characters-grid { display: flex; flex-direction: column; gap: var(--space-2); }
        .char-card { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); background: var(--bg-secondary); border: 1px solid var(--border-subtle); text-decoration: none; transition: border-color var(--transition-base); }
        .char-card:hover { border-color: var(--color-crimson); }
        .char-avatar { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border-subtle); object-fit: cover; flex-shrink: 0; }
        .char-info { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; }
        .char-name { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }
        .char-desc { font-size: var(--text-xs); color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rooms-list { display: flex; flex-direction: column; gap: var(--space-2); }
        .room-item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); background: var(--bg-secondary); border: 1px solid var(--border-subtle); text-decoration: none; transition: border-color var(--transition-base); }
        .room-item:hover { border-color: var(--color-crimson); }
        .room-cover { width: 32px; height: 32px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
        .room-cover-placeholder { width: 32px; height: 32px; border-radius: var(--radius-sm); background: var(--bg-card); display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; border: 1px solid var(--border-subtle); }
        .room-title { font-size: var(--text-sm); color: var(--text-primary); font-family: var(--font-display); letter-spacing: 0.03em; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .room-status { font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.06em; text-transform: uppercase; padding: 0.1rem 0.4rem; border-radius: var(--radius-sm); flex-shrink: 0; }
        .room-status.active   { color: var(--color-success); background: var(--color-success-bg); }
        .room-status.paused   { color: var(--color-warning); background: var(--color-warning-bg); }
        .room-status.closed, .room-status.archived { color: var(--text-muted); background: var(--bg-elevated); }
        .topics-list { display: flex; flex-direction: column; gap: var(--space-2); }
        .topic-item { display: flex; flex-direction: column; gap: var(--space-1); padding: var(--space-3); border-radius: var(--radius-sm); background: var(--bg-secondary); border: 1px solid var(--border-subtle); text-decoration: none; transition: border-color var(--transition-base); }
        .topic-item:hover { border-color: var(--color-crimson); }
        .topic-item-main { display: flex; flex-direction: column; gap: 2px; }
        .topic-item-title { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); letter-spacing: 0.03em; }
        .topic-item-room { font-size: var(--text-xs); color: var(--color-crimson); font-family: var(--font-display); letter-spacing: 0.04em; }
        .topic-item-meta { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-1); }
        .topic-item-date { display: flex; align-items: center; gap: 3px; font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.03em; }
        .topic-item-last { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.03em; }
        .topic-item-last-author { color: var(--text-secondary); text-decoration: none; transition: color var(--transition-fast); }
        .topic-item-last-author:hover { color: var(--color-crimson); }
        .recent-posts-list { display: flex; flex-direction: column; gap: var(--space-2); }
        .recent-post-item { display: flex; flex-direction: column; gap: var(--space-1); padding: var(--space-3); border-radius: var(--radius-sm); background: var(--bg-secondary); border: 1px solid var(--border-subtle); text-decoration: none; transition: border-color var(--transition-base); }
        .recent-post-item:hover { border-color: var(--color-crimson); }
        .post-meta { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
        .post-room { font-size: var(--text-xs); font-family: var(--font-display); color: var(--color-crimson); letter-spacing: 0.04em; }
        .post-sep { font-size: var(--text-xs); color: var(--text-muted); }
        .post-topic { font-size: var(--text-xs); font-family: var(--font-display); color: var(--text-secondary); letter-spacing: 0.03em; }
        .post-date { margin-left: auto; font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); }
        .post-preview { font-size: var(--text-sm); color: var(--text-muted); margin: 0; line-height: 1.5; font-family: var(--font-body); }
        .empty-text { color: var(--text-muted); font-style: italic; font-size: var(--text-sm); margin: 0; }
        .private-notice { display: flex; align-items: center; gap: var(--space-2); color: var(--text-muted); font-style: normal; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: var(--space-3) var(--space-4); }
        @media (max-width: 700px) {
          .profile-body { grid-template-columns: 1fr; }
          .profile-hero-content { margin-top: -40px; }
          .profile-avatar { width: 80px; height: 80px; }
          .profile-displayname { font-size: var(--text-xl); }
        }
      `}</style>
    </div>
  )
}