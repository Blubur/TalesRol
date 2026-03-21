import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'  // ← una sola línea
import type { Profile, Topic, Room } from '@/types/database'
import PostsList from './PostsList'
import { parsePage, getRange, getTotalPages } from '@/lib/pagination'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; topicId: string }> }) {
  const { topicId } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('topics').select('title').eq('id', topicId).single()
  return { title: data?.title ?? 'Tema' }
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string; topicId: string }> }) {
  const { slug, topicId } = await params

  // Evitar colisión con rutas estáticas
  if (topicId === 'calendario') redirect(`/salas/${slug}/calendario`)
  if (topicId === 'wiki') redirect(`/salas/${slug}/wiki`)
  if (topicId === 'fichas') redirect(`/salas/${slug}/fichas`)
  if (topicId === 'miembros') redirect(`/salas/${slug}/miembros`)
  if (topicId === 'editar') redirect(`/salas/${slug}/editar`)




export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; topicId: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug, topicId } = await params
  const { page: pageParam }  = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Cargar sala
  const { data: roomData } = await supabase
    .from('rooms')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()
  if (!roomData) notFound()
  const room = roomData as Room

  // Cargar tema
  const { data: topicData, error: topicError } = await supabase
    .from('topics')
    .select('*, profiles!topics_author_id_fkey(username, display_name, avatar_url)')
    .eq('id', topicId)
    .is('deleted_at', null)
    .single()

  if (!topicData) notFound()
  const topic = topicData as Topic & {
    profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'> | null
  }

  // Contar posts totales (para paginación)
  const { count: totalPosts } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('topic_id', topicId)
    .is('deleted_at', null)

  const totalCount = totalPosts ?? 0
  const totalPages = getTotalPages(totalCount)

  // Validar página: si viene ?page=N mayor que el total, redirigir a la última
  const requestedPage = parsePage(pageParam)
  const currentPage   = Math.min(requestedPage, totalPages)

  const { from, to } = getRange(currentPage)

  // Incrementar view_count
  await supabase
    .from('topics')
    .update({ view_count: (topic.view_count ?? 0) + 1 } as Partial<Topic>)
    .eq('id', topicId)

  // Registrar participantes
  if (user) {
    await supabase
      .from('topic_participants')
      .upsert({ topic_id: topicId, user_id: user.id }, { onConflict: 'topic_id,user_id' })
    await supabase
      .from('room_participants')
      .upsert({ room_id: room.id, user_id: user.id }, { onConflict: 'room_id,user_id' })
  }

  // Cargar posts de la página actual
  const { data: postsData } = await supabase
    .from('posts')
    .select('*, profiles!posts_author_id_fkey(id, username, display_name, avatar_url, role), characters(id, name, avatar_url, description, sheet)')
    .eq('topic_id', topicId)
    .is('deleted_at', null)
    .order('post_number', { ascending: true })
    .range(from, to)

  const posts = postsData ?? []

  // Perfil del usuario actual
  let profile: Profile | null = null
  let characters: { id: string; name: string; avatar_url: string | null }[] = []
  if (user) {
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = p
    const { data: chars } = await supabase
      .from('characters')
      .select('id, name, avatar_url')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .is('deleted_at', null)
    characters = chars ?? []
  }

  // Tipos de dado disponibles
  const { data: diceTypesData } = await supabase
    .from('dice_types')
    .select('id, name, faces, description')
    .order('faces', { ascending: true })
  const diceTypes = diceTypesData ?? []

  // Comprobar participación
  let isParticipant = false
  if (user) {
    const { data: participation } = await supabase
      .from('room_participants')
      .select('user_id')
      .eq('room_id', room.id)
      .eq('user_id', user.id)
      .single()
    const isOwner = room.owner_id === user.id
    const isMod   = profile?.role === 'admin' || profile?.role === 'master'
    isParticipant = !!participation || isOwner || isMod
  }

  const canPost  = !!user && room.status === 'active' && !topic.is_locked
  const isAuthor = user?.id === topic.author_id
  const isAdmin  = profile?.role === 'admin'
  const canEdit  = isAuthor || isAdmin

  return (
    <div className="topic-page">

      {/* Breadcrumb */}
      <div className="topic-breadcrumb animate-enter">
        <Link href="/salas" className="bc-link">Salas</Link>
        <span className="bc-sep">›</span>
        <Link href={`/salas/${slug}`} className="bc-link">{room.title}</Link>
        <span className="bc-sep">›</span>
        <span className="bc-current">{topic.title}</span>
      </div>

      {/* Cabecera del tema */}
      <div className="topic-header animate-enter border-ornament" style={{ animationDelay: '0.05s' }}>
        <div className="topic-header-left">
          {topic.is_pinned && <span className="topic-badge pin">📌 Fijado</span>}
          {topic.is_locked && <span className="topic-badge lock">🔒 Bloqueado</span>}
          <h1 className="topic-title">{topic.title}</h1>
          <div className="topic-meta">
            {topic.profiles && (
              <Link href={`/perfil/${topic.profiles.username}`} className="topic-author">
                <img
                  src={topic.profiles.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${topic.profiles.username}`}
                  alt={topic.profiles.username}
                  className="topic-author-avatar"
                />
                <span>{topic.profiles.display_name || topic.profiles.username}</span>
              </Link>
            )}
            <span className="topic-date">
              {new Date(topic.created_at).toLocaleDateString('es-ES', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
            <span className="topic-views">👁 {topic.view_count + 1} lecturas</span>
            <span className="topic-count">💬 {totalCount} post{totalCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {canEdit && (
          <div className="topic-header-actions">
            <Link
              href={`/salas/${slug}/${topicId}/editar`}
              className="btn-ghost"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            >
              ✎ Editar
            </Link>
          </div>
        )}
      </div>

      {/* Starter / entrada inicial */}
      {topic.starter && (
        <div className="topic-starter animate-enter" style={{ animationDelay: '0.1s' }}>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: topic.starter }} />
        </div>
      )}

      {/* Lista de posts + controles de paginación + formulario */}
      <PostsList
        posts={posts}
        topicId={topicId}
        slug={slug}
        roomId={room.id}
        roomOwnerId={room.owner_id ?? null}
        userId={user?.id ?? null}
        userRole={profile?.role ?? null}
        characters={characters}
        canPost={canPost}
        isLocked={topic.is_locked}
        diceTypes={diceTypes}
        isParticipant={isParticipant}
        currentPage={currentPage}
        totalPages={totalPages}
        totalPosts={totalCount}
      />

      <style>{`
        .topic-page { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; }
        .topic-breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; font-family: var(--font-cinzel); letter-spacing: 0.05em; flex-wrap: wrap; }
        .bc-link { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
        .bc-link:hover { color: var(--color-crimson); }
        .bc-sep { color: var(--text-muted); }
        .bc-current { color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
        .topic-header { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1.25rem 1.5rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
        .topic-header-left { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .topic-badge { font-size: 0.72rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; color: var(--text-muted); }
        .topic-title { font-family: var(--font-cinzel); font-size: 1.4rem; font-weight: 700; margin: 0; letter-spacing: 0.05em; }
        .topic-meta { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .topic-author { display: flex; align-items: center; gap: 0.4rem; text-decoration: none; color: var(--text-secondary); font-size: 0.82rem; transition: color 0.2s; }
        .topic-author:hover { color: var(--color-crimson); }
        .topic-author-avatar { width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--border-subtle); }
        .topic-date, .topic-views, .topic-count { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.04em; }
        .topic-header-actions { flex-shrink: 0; }
        .topic-starter { background: var(--bg-card); border: 1px solid var(--border-subtle); border-left: 3px solid var(--color-crimson); border-radius: 6px; padding: 1.5rem; }
        @media (max-width: 600px) {
          .topic-header { flex-direction: column; }
          .bc-current { max-width: 180px; }
        }
      `}</style>
    </div>
  )
}