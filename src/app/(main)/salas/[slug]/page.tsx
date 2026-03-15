import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import WikiDeleteButton from '../WikiDeleteButton'
import type { Room, Topic, Profile } from '@/types/database'
import RoomActions from './RoomActions'
import {
  ArrowLeftIcon,
  PlusIcon,
  MapPinIcon,
  LockClosedIcon,
  EyeIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  CalendarIcon,
  BookOpenIcon,
  UsersIcon, 
  IdentificationIcon,
} from '@heroicons/react/24/outline'
import ReportRoomButton from './ReportRoomButton'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('rooms').select('title').eq('slug', slug).single()
  return { title: data?.title ?? 'Sala de Rol' }
}

export default async function SalaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: roomData } = await supabase
    .from('rooms').select('*').eq('slug', slug).is('deleted_at', null).single()

  if (!roomData) notFound()
  const room = roomData as Room

  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  if (user) {
    await supabase
      .from('room_participants')
      .upsert({ room_id: room.id, user_id: user.id }, { onConflict: 'room_id,user_id' })
  }

  const { data: ownerData } = await supabase
    .from('profiles').select('username, display_name, avatar_url').eq('id', room.owner_id!).single()
  const owner = ownerData as Pick<Profile, 'username' | 'display_name' | 'avatar_url'> | null

  const { data: topicsData } = await supabase
    .from('topics')
    .select('*, profiles!topics_author_id_fkey(username, display_name, avatar_url)')
    .eq('room_id', room.id)
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const topics = (topicsData ?? []) as (Topic & { profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'> | null })[]

  const topicIds = topics.map(t => t.id)
  const postCounts: Record<string, number> = {}
  if (topicIds.length > 0) {
    const { data: postsData } = await supabase
      .from('posts').select('id, topic_id').in('topic_id', topicIds).is('deleted_at', null)
    ;(postsData ?? []).forEach((p: any) => {
      postCounts[p.topic_id] = (postCounts[p.topic_id] ?? 0) + 1
    })
  }

  const isOwner = user?.id === room.owner_id
  const isAdmin = profile?.role === 'admin'
  const canEdit = isOwner || isAdmin
  const canPost = !!user && room.status === 'active'
  const totalPosts = Object.values(postCounts).reduce((a, b) => a + b, 0)

  const STATUS_LABEL: Record<string, string> = {
    active: 'Activa', paused: 'En pausa', closed: 'Cerrada',
    pending: 'Pendiente', finished: 'Finalizada', archived: 'Archivada',
  }

  return (
    <div className="sala-detail-page">

      {/* Banner */}
      <div className="sala-banner animate-enter">
        {room.cover_url
          ? <img src={room.cover_url} alt={room.title} className="sala-banner-img" />
          : <div className="sala-banner-placeholder" />
        }
        <div className="sala-banner-overlay" />
        <div className="sala-banner-content">
          <div className="sala-banner-tags">
            {room.tags?.map(tag => <span key={tag} className="room-tag">{tag}</span>)}
          </div>
          <h1 className="sala-banner-title">{room.title}</h1>
          <div className="sala-banner-meta">
            {owner && (
              <Link href={`/perfil/${owner.username}`} className="sala-banner-owner">
                <img
                  src={owner.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${owner.username}`}
                  alt={owner.username} className="sala-owner-avatar"
                />
                <UserIcon className="sala-meta-icon" />
                <span>Director: <strong>{owner.display_name || owner.username}</strong></span>
              </Link>
            )}
            <span className={`sala-status-badge ${room.status}`}>
              {STATUS_LABEL[room.status] ?? room.status}
            </span>
          </div>
          <div className="sala-banner-stats">
            <span className="sala-banner-stat">
              <BookOpenIcon className="sala-stat-icon" />
              {topics.length} tema{topics.length !== 1 ? 's' : ''}
            </span>
            <span className="sala-banner-stat">
              <ChatBubbleLeftEllipsisIcon className="sala-stat-icon" />
              {totalPosts} post{totalPosts !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

{room.moderation_status && (
  <div className={`sala-moderation-notice ${room.moderation_status}`}>
    <ExclamationTriangleIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
    <span>{room.moderation_message ?? 'Esta sala está bajo revisión de moderación.'}</span>
  </div>
)}



      {/* Nav */}
      <div className="sala-nav animate-enter" style={{ animationDelay: '0.1s' }}>
        <Link href="/salas" className="sala-back">
          <ArrowLeftIcon className="sala-back-icon" /> Todas las Salas
        </Link>
        <div className="sala-nav-actions">
          {canEdit && <RoomActions roomId={room.id} slug={room.slug} currentStatus={room.status} />}
          {user && !isOwner && !isAdmin && (
          <ReportRoomButton roomId={room.id} slug={room.slug} />
          )}
          {canPost && (
            <Link href={`/salas/${slug}/nuevo-tema`} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <PlusIcon style={{ width: 14, height: 14 }} /> Nuevo Tema
            </Link>
          )}
          {canEdit && (
             <Link href={`/salas/${slug}/miembros`} className="btn-ghost btn-sm"
             style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <UsersIcon style={{ width: 14, height: 14 }} /> Miembros
          </Link>
          )}
          {!!user && (
          <Link
           href={`/salas/${slug}/wiki`}
            className="btn-ghost btn-sm"
             style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <BookOpenIcon style={{ width: 14, height: 14 }} /> Wiki
            </Link>
              )}

          {canEdit && (
           <Link href={`/salas/${slug}/fichas`}
           className="btn-ghost btn-sm"
           style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
           <IdentificationIcon style={{ width: 14, height: 14 }} /> Fichas
            </Link>
            )}
        </div>
      </div>





      {/* Descripción */}
      {room.description && (
        <div className="sala-desc-card animate-enter border-ornament" style={{ animationDelay: '0.15s' }}>
          <h2 className="sala-desc-label">Sobre esta sala</h2>
          <p className="sala-desc-text">{room.description}</p>
        </div>
      )}

      {/* Temas */}
      <div className="sala-topics animate-enter" style={{ animationDelay: '0.2s' }}>
        <div className="sala-topics-header">
          <h2 className="sala-topics-title">
            Temas <span className="sala-topics-count">({topics.length})</span>
          </h2>
        </div>

        {topics.length === 0 ? (
          <div className="sala-topics-empty">
            <BookOpenIcon className="topics-empty-icon" />
            <p>Esta sala aún no tiene temas.</p>
            {canPost && (
              <Link href={`/salas/${slug}/nuevo-tema`} className="btn-primary" style={{ marginTop: '1rem' }}>
                Crear el primer tema
              </Link>
            )}
          </div>
        ) : (
          <div className="topics-list">
            {topics.map((topic, i) => {
              const pCount = postCounts[topic.id] ?? 0
              return (
                <Link
                  key={topic.id}
                  href={`/salas/${slug}/${topic.id}`}
                  className={`topic-row animate-enter ${topic.is_pinned ? 'pinned' : ''}`}
                  style={{ animationDelay: `${0.2 + i * 0.04}s` }}
                >
                  <div className="topic-row-left">
                    {topic.is_pinned && <MapPinIcon className="topic-icon pin" title="Fijado" />}
                    {topic.is_locked && <LockClosedIcon className="topic-icon lock" title="Bloqueado" />}
                    <div className="topic-info">
                      <span className="topic-title">{topic.title}</span>
                      {topic.profiles && (
                        <span className="topic-author">
                          por <strong>{topic.profiles.display_name || topic.profiles.username}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="topic-row-right">
                    <span className="topic-stat">
                      <ChatBubbleLeftEllipsisIcon className="topic-stat-icon" /> {pCount}
                    </span>
                    <span className="topic-stat">
                      <EyeIcon className="topic-stat-icon" /> {topic.view_count}
                    </span>
                    <span className="topic-stat">
                      <CalendarIcon className="topic-stat-icon" />
                      {new Date(topic.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="topic-arrow">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}