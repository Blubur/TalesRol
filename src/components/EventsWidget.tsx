import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import EventJoinButton from './EventJoinButton'

interface EventRow {
  id: string
  title: string
  description: string | null
  type: string
  status: string
  starts_at: string
  ends_at: string | null
  room_id: string | null
  rooms: { slug: string; title: string } | null
}

const TYPE_LABELS: Record<string, string> = {
  sesion: 'Sesión', torneo: 'Torneo', especial: 'Especial', otro: 'Evento',
}
const TYPE_COLORS: Record<string, string> = {
  sesion:   'var(--color-role-jugador)',
  torneo:   'var(--color-role-admin)',
  especial: 'var(--color-role-director)',
  otro:     'var(--color-role-miembro)',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default async function EventsWidget({ userId }: { userId: string | null }) {
  const supabase = await createClient()

  await supabase.rpc('sync_event_status')

  const now = new Date().toISOString()

  const [
    { data: liveData },
    { data: upcomingData },
    { data: pastData },
  ] = await Promise.all([
    supabase.from('events').select('*, rooms(slug, title)')
      .eq('status', 'en_curso').is('deleted_at', null)
      .order('starts_at', { ascending: true }).limit(1),
    supabase.from('events').select('*, rooms(slug, title)')
      .eq('status', 'programado').is('deleted_at', null)
      .gte('starts_at', now).order('starts_at', { ascending: true }).limit(4),
    supabase.from('events').select('*, rooms(slug, title)')
      .eq('status', 'finalizado').is('deleted_at', null)
      .order('ends_at', { ascending: false }).limit(1),
  ])

  const live     = (liveData     ?? []) as EventRow[]
  const upcoming = (upcomingData ?? []) as EventRow[]
  const past     = (pastData     ?? []) as EventRow[]
  const allEvents = [...live, ...upcoming, ...past]

  if (allEvents.length === 0) return null

  const eventIds = allEvents.map(e => e.id)

  const { data: participantCounts } = await supabase
    .from('event_participants').select('event_id').in('event_id', eventIds)

  let userEventIds: Set<string> = new Set()
  if (userId) {
    const { data: userParts } = await supabase
      .from('event_participants').select('event_id')
      .eq('user_id', userId).in('event_id', eventIds)
    userEventIds = new Set((userParts ?? []).map((p: { event_id: string }) => p.event_id))
  }

  function countFor(id: string) {
    return (participantCounts ?? []).filter((p: { event_id: string }) => p.event_id === id).length
  }

  function renderCard(event: EventRow, dimmed = false) {
    const typeColor = TYPE_COLORS[event.type] ?? TYPE_COLORS.otro
    const typeLabel = TYPE_LABELS[event.type] ?? 'Evento'
    const count     = countFor(event.id)
    const isJoined  = userEventIds.has(event.id)
    const isPast    = event.status === 'finalizado' || event.status === 'cancelado'
    const isLive    = event.status === 'en_curso'

    return (
      <div
        key={event.id}
        className={`ev-card${dimmed ? ' ev-dimmed' : ''}${isLive ? ' ev-card-live' : ''}`}
      >
        <div className="ev-card-top">
          <div className="ev-card-badges">
            <span className="ev-type" style={{ color: typeColor, borderColor: typeColor }}>
              {typeLabel}
            </span>
            {isLive && <span className="ev-live">● EN VIVO</span>}
            {event.status === 'finalizado' && <span className="ev-done">Finalizado</span>}
            {event.status === 'cancelado'  && <span className="ev-done">Cancelado</span>}
          </div>
          <span className="ev-count">✦ {count}</span>
        </div>

        <p className="ev-title">{event.title}</p>

        {event.rooms && (
          <Link href={`/salas/${event.rooms.slug}`} className="ev-room">
            {event.rooms.title}
          </Link>
        )}

        <span className="ev-date">
          {isPast ? '✓ ' : ''}{formatDate(event.starts_at)}
          {event.ends_at && !isPast && ` — ${formatDate(event.ends_at)}`}
        </span>

        {!isPast && userId && (
          <EventJoinButton eventId={event.id} isJoined={isJoined} isLive={isLive} />
        )}
        {!isPast && !userId && (
          <Link href="/auth/login" className="ev-join-btn ev-join-ghost">
            Inicia sesión para apuntarte
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="ev-widget animate-enter">
      <div className="ev-head">
        <span className="ev-head-title">✦ Eventos y sesiones</span>
      </div>

      <div className="ev-body">
        {live.map(e     => renderCard(e))}
        {upcoming.map(e => renderCard(e))}
        {past.map(e     => renderCard(e, true))}
      </div>

      <style>{`
        .ev-widget { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; overflow: hidden; }
        .ev-head { display: flex; align-items: center; padding: 0.6rem 1rem; border-bottom: 1px solid var(--border-subtle); }
        .ev-head-title { font-family: var(--font-cinzel); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-secondary); }
        .ev-body { display: flex; flex-direction: column; }
        .ev-card { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.25rem; transition: background 0.12s; }
        .ev-card:last-child { border-bottom: none; }
        .ev-card:hover { background: var(--bg-elevated); }
        .ev-card-live { border-left: 3px solid var(--color-crimson); padding-left: calc(1rem - 3px); }
        .ev-dimmed { opacity: 0.55; }
        .ev-card-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .ev-card-badges { display: flex; align-items: center; gap: 0.4rem; }
        .ev-type { font-size: 0.6rem; font-family: var(--font-cinzel); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid; border-radius: 3px; padding: 0.05rem 0.35rem; }
        .ev-live { font-size: 0.6rem; font-family: var(--font-cinzel); font-weight: 700; color: var(--color-crimson); animation: ev-pulse 1.5s ease-in-out infinite; }
        @keyframes ev-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .ev-done { font-size: 0.6rem; font-family: var(--font-cinzel); color: var(--text-muted); }
        .ev-count { font-size: 0.65rem; font-family: var(--font-cinzel); color: var(--text-muted); }
        .ev-title { font-size: 0.82rem; font-family: var(--font-cinzel); color: var(--text-primary); margin: 0; line-height: 1.3; }
        .ev-room { font-size: 0.68rem; color: var(--color-crimson); text-decoration: none; transition: opacity 0.12s; }
        .ev-room:hover { opacity: 0.75; }
        .ev-date { font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-cinzel); }
        .ev-join-btn { align-self: flex-start; margin-top: 0.2rem; font-size: 0.68rem; font-family: var(--font-cinzel); padding: 0.25rem 0.65rem; border-radius: 4px; border: none; cursor: pointer; transition: opacity 0.12s; text-decoration: none; display: inline-block; }
        .ev-join-btn:hover { opacity: 0.8; }
        .ev-join-primary { background: var(--color-crimson); color: #fff; }
        .ev-join-secondary { background: var(--bg-elevated); color: var(--text-muted); border: 1px solid var(--border-subtle); }
        .ev-join-ghost { background: transparent; color: var(--text-muted); border: 1px solid var(--border-subtle); font-size: 0.62rem; }
      `}</style>
    </div>
  )
}