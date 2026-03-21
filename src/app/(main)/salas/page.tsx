import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Room, Profile } from '@/types/database'
import { BookOpenIcon, ChatBubbleLeftRightIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/outline'

export const metadata = { title: 'Salas de Rol' }

export default async function SalasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .is('deleted_at', null)
    .neq('status', 'archived')
    .order('ultima_actividad', { ascending: false })

  const allRooms = (rooms ?? []) as Room[]
  const roomIds  = allRooms.map(r => r.id)

  const topicCounts: Record<string, number> = {}
  const postCounts:  Record<string, number> = {}
  const newPostCounts: Record<string, number> = {}

  if (roomIds.length > 0) {
    const { data: topicsData } = await supabase
      .from('topics')
      .select('id, room_id')
      .in('room_id', roomIds)
      .is('deleted_at', null)

    const topicsList = topicsData ?? []
    topicsList.forEach(t => {
      topicCounts[t.room_id] = (topicCounts[t.room_id] ?? 0) + 1
    })

    const topicIds = topicsList.map(t => t.id)
    if (topicIds.length > 0) {
      const { data: postsData } = await supabase
        .from('posts')
        .select('id, topic_id, created_at, topics!inner(room_id)')
        .in('topic_id', topicIds)
        .is('deleted_at', null)

      const allPosts = postsData ?? []

      allPosts.forEach((p: any) => {
        const roomId = p.topics?.room_id
        if (roomId) postCounts[roomId] = (postCounts[roomId] ?? 0) + 1
      })

      // Calcular posts nuevos por sala
      if (user) {
        const { data: visitsData } = await supabase
          .from('topic_visits')
          .select('topic_id, last_seen_at')
          .eq('user_id', user.id)
          .in('topic_id', topicIds)

        const visitMap: Record<string, string> = {}
        ;(visitsData ?? []).forEach((v: any) => { visitMap[v.topic_id] = v.last_seen_at })

        allPosts.forEach((p: any) => {
          const roomId  = p.topics?.room_id
          const lastSeen = visitMap[p.topic_id]
          if (roomId && (!lastSeen || new Date(p.created_at) > new Date(lastSeen))) {
            newPostCounts[roomId] = (newPostCounts[roomId] ?? 0) + 1
          }
        })
      }
    }
  }

  const pending  = allRooms.filter(r => r.status === 'pending')
  const active   = allRooms.filter(r => r.status === 'active')
  const paused   = allRooms.filter(r => r.status === 'paused')
  const finished = allRooms.filter(r => r.status === 'finished')
  const closed   = allRooms.filter(r => r.status === 'closed')

  const canCreate = profile && ['admin', 'director'].includes(profile.role)

  return (
    <div className="salas-page">
      <div className="salas-header animate-enter">
        <div>
          <h1 className="salas-title">Salas de Rol</h1>
          <p className="salas-sub">{allRooms.length} sala{allRooms.length !== 1 ? 's' : ''} disponible{allRooms.length !== 1 ? 's' : ''}</p>
        </div>
        {canCreate && (
          <Link href="/salas/nueva" className="btn-primary">
            <PlusIcon style={{ width: 14, height: 14 }} /> Nueva Sala
          </Link>
        )}
      </div>

      {allRooms.length === 0 ? (
        <div className="salas-empty animate-enter">
          <BookOpenIcon className="salas-empty-icon" />
          <h2>No hay salas disponibles</h2>
          <p>Aún no se ha creado ninguna sala de rol</p>
          {canCreate && (
            <Link href="/salas/nueva" className="btn-primary">Crear la primera sala</Link>
          )}
        </div>
      ) : (
        <div className="salas-sections">
          {pending.length > 0  && <SalasSection title="Próximamente" rooms={pending}  dot="pending"  delay={0.1}  topicCounts={topicCounts} postCounts={postCounts} newPostCounts={newPostCounts} />}
          {active.length > 0   && <SalasSection title="Activas"      rooms={active}   dot="active"   delay={0.15} topicCounts={topicCounts} postCounts={postCounts} newPostCounts={newPostCounts} />}
          {paused.length > 0   && <SalasSection title="En Pausa"     rooms={paused}   dot="paused"   delay={0.2}  topicCounts={topicCounts} postCounts={postCounts} newPostCounts={newPostCounts} />}
          {finished.length > 0 && <SalasSection title="Finalizadas"  rooms={finished} dot="finished" delay={0.25} topicCounts={topicCounts} postCounts={postCounts} newPostCounts={newPostCounts} />}
          {closed.length > 0   && <SalasSection title="Cerradas"     rooms={closed}   dot="closed"   delay={0.3}  topicCounts={topicCounts} postCounts={postCounts} newPostCounts={newPostCounts} />}
        </div>
      )}
    </div>
  )
}

function SalasSection({ title, rooms, dot, delay, topicCounts, postCounts, newPostCounts }: {
  title: string; rooms: Room[]; dot: 'active' | 'paused' | 'closed' | 'pending' | 'finished'
  delay: number; topicCounts: Record<string, number>; postCounts: Record<string, number>
  newPostCounts: Record<string, number>
}) {
  return (
    <div className="salas-section animate-enter" style={{ animationDelay: `${delay}s` }}>
      <h2 className="salas-section-title">
        <span className={`salas-dot ${dot}`} />
        {title} ({rooms.length})
      </h2>
      <div className="salas-grid">
        {rooms.map((room, i) => (
          <RoomCard
            key={room.id}
            room={room}
            delay={i * 0.04}
            topicCount={topicCounts[room.id] ?? 0}
            postCount={postCounts[room.id] ?? 0}
            newPostCount={newPostCounts[room.id] ?? 0}
          />
        ))}
      </div>
    </div>
  )
}

function RoomCard({ room, delay, topicCount, postCount, newPostCount }: {
  room: Room; delay: number; topicCount: number; postCount: number; newPostCount: number
}) {
  const timeAgo = getTimeAgo(room.ultima_actividad)
  return (
    <Link href={`/salas/${room.slug}`} className={`room-card animate-enter ${newPostCount > 0 ? 'has-new' : ''}`} style={{ animationDelay: `${delay}s` }}>
      {room.cover_url ? (
        <div className="room-card-cover">
          <img src={room.cover_url} alt={room.title} />
          <div className="room-card-cover-overlay" />
          {newPostCount > 0 && (
            <span className="room-new-badge">{newPostCount} nuevo{newPostCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      ) : (
        <div className="room-card-cover-placeholder" style={{ position: 'relative' }}>
          {newPostCount > 0 && (
            <span className="room-new-badge">{newPostCount} nuevo{newPostCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}
      <div className="room-card-body">
        <h3 className="room-card-title">{room.title}</h3>
        {room.description && (
          <p className="room-card-desc">
            {room.description.slice(0, 100)}{room.description.length > 100 ? '…' : ''}
          </p>
        )}
        {room.tags && room.tags.length > 0 && (
          <div className="room-card-tags">
            {room.tags.slice(0, 3).map(tag => (
              <span key={tag} className="room-tag">{tag}</span>
            ))}
          </div>
        )}
        <div className="room-card-stats">
          <span className="room-stat">
            <BookOpenIcon className="room-stat-icon" />
            {topicCount} tema{topicCount !== 1 ? 's' : ''}
          </span>
          <span className="room-stat">
            <ChatBubbleLeftRightIcon className="room-stat-icon" />
            {postCount} post{postCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="room-card-footer">
          <span className="room-card-activity">
            <ClockIcon className="room-stat-icon" />
            {timeAgo}
          </span>
          <span className="room-card-arrow">Entrar →</span>
        </div>
      </div>

      <style>{`
        .room-card.has-new { border-color: var(--color-crimson); }
        .room-new-badge {
          position: absolute; top: 0.5rem; right: 0.5rem;
          background: var(--color-crimson); color: #fff;
          font-size: 0.65rem; font-family: var(--font-cinzel);
          letter-spacing: 0.06em; font-weight: 600;
          padding: 0.15rem 0.5rem; border-radius: 999px;
          white-space: nowrap; z-index: 2;
        }
      `}</style>
    </Link>
  )
}

function getTimeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'ahora mismo'
  if (mins < 60)  return `hace ${mins}m`
  if (hours < 24) return `hace ${hours}h`
  if (days < 30)  return `hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}