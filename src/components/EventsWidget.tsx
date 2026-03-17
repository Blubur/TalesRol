import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import EventJoinButton from './EventJoinButton'

interface Event {
  id: string
  title: string
  description: string | null
  type: 'sesion' | 'torneo' | 'especial' | 'otro'
  status: 'programado' | 'en_curso' | 'finalizado' | 'cancelado'
  starts_at: string
  ends_at: string | null
  room_id: string | null
  rooms: { slug: string; title: string } | null
  participant_count: number
}

const TYPE_LABELS: Record<string, string> = {
  sesion:   'Sesión',
  torneo:   'Torneo',
  especial: 'Especial',
  otro:     'Evento',
}

const TYPE_COLORS: Record<string, string> = {
  sesion:   'var(--color-role-jugador)',
  torneo:   'var(--color-role-admin)',
  especial: 'var(--color-role-director)',
  otro:     'var(--color-role-miembro)',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'en_curso') {
    return <span className="ev-live">● EN VIVO</span>
  }
  if (status === 'finalizado') {
    return <span className="ev-done">Finalizado</span>
  }
  if (status === 'cancelado') {
    return <span className="ev-cancelled">Cancelado</span>
  }
  return null
}

export default async function EventsWidget({ userId }: { userId: string | null }) {
  const supabase = await createClient()

  // Sincronizar estados automáticamente
  await supabase.rpc('sync_event_status')

  const now = new Date().toISOString()

  // Evento en curso
  const { data: liveData } = await supabase
    .from('events')
    .select('*, rooms(slug, title)')
    .eq('status', 'en_curso')
    .is('deleted_at', null)
    .order('starts_at', { ascending: true })
    .limit(1)

  // Próximos eventos
  const { data: upcomingData } = await supabase
    .from('events')
    .select('*, rooms(slug, title)')
    .eq('status', 'programado')
    .is('deleted_at', null)
    .gte('starts_at', now)
    .order('starts_at', { ascending: true })
    .limit(4)

  // Último evento finalizado
  const { data: pastData } = await supabase
    .from('events')
    .select('*, rooms(slug, title)')
    .eq('status', 'finalizado')
    .is('deleted_at', null)
    .order('ends_at', { ascending: false })
    .limit(1)

  // Contar participantes para cada evento
  const allEvents = [
    ...(liveData    ?? []),
    ...(upcomingData ?? []),
    ...(pastData    ?? []),
  ]

  if (allEvents.length === 0) return null

  const eventIds = allEvents.map(e => e.id)

  const { data: participantCounts } = await supabase
    .from('event_participants')
    .select('event_id')
    .in('event_id', eventIds)

  // IDs de eventos en los que participa el usuario actual
  let userEventIds: Set<string> = new Set()
  if (userId) {
    const { data: userParts } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('user_id', userId)
      .in('event_id', eventIds)
    userEventIds = new Set((userParts ?? []).map(p => p.event_id))
  }

  function countFor(eventId: string) {
    return (participantCounts ?? []).filter(p => p.event_id === eventId).length
  }

  const live     = (liveData    ?? []) as unknown as Event[]
  const upcoming = (upcomingData ?? []) as unknown as Event[]
  const past     = (pastData    ?? []) as unknown as Event[]

  function EventCard({ event, dimmed = false }: { event: Event; dimmed?: boolean }) {
    const typeColor = TYPE_COLORS[event.type] ?? TYPE_COLORS.otro
    const typeLabel = TYPE_LABELS[event.type] ?? 'Evento'
    const count     = countFor(event.id)
    const isJoined  = userEventIds.has(event.id)
    const isPast    = event.status === 'finalizado' || event.status === 'cancelado'

    return (
      <div className={`ev-card ${dimmed ? 'ev-dimmed' : ''} ${event.status === 'en_curso' ? 'ev-card-live' : ''}`}>
        <div className="ev-card-top">
          {/* Tipo + estado */}
          <div className="ev-card-badges">
            <span className="ev-type" style={{ color: typeColor, borderColor: typeColor }}>
              {typeLabel}
            </span>
            <StatusBadge status={event.status} />
          </div>

          {/* Participantes */}
          <span className="ev-count" title="Participantes apuntados">
            ✦ {count}
          </span>
        </div>

        {/* Título */}
        <p className="ev-title">{event.title}</p>

        {/* Sala */}
        {event.rooms && (
          <Link href={`/salas/${event.rooms.slug}`} className="ev-room">
            {event.rooms.title}
          </Link>
        )}

        {/* Fecha */}
        <span className="ev-date">
          {isPast ? '✓ ' : ''}{formatDate(event.starts_at)}
          {event.ends_at && !isPast && ` — ${formatDate(event.ends_at)}`}
        </span>

        {/* Botón */}
        {!isPast && userId && (
          <EventJoinButton
            eventId={event.id}
            isJoined={isJoined}
            isLive={event.status === 'en_curso'}
          />
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
        {/* En curso */}
        {live.map(e => <EventCard key={e.id} event={e} />)}

        {/* Próximos */}
        {upcoming.map(e => <EventCard key={e.id} event={e} />)}

        {/* Pasado */}
        {past.map(e => <EventCard key={e.id} event={e} dimmed />)}
      </div>

      <style>{`
        .ev-widget {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          overflow: hidden;
        }
        .ev-head {
          display: flex;
          align-items: center;
          padding: 0.6rem 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .ev-head-title {
          font-family: var(--font-cinzel);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .ev-body {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Tarjeta individual */
        .ev-card {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          transition: background 0.12s;
        }
        .ev-card:last-child { border-bottom: none; }
        .ev-card:hover { background: var(--bg-elevated); }
        .ev-card-live {
          border-left: 3px solid var(--color-crimson);
          padding-left: calc(1rem - 3px);
        }
        .ev-dimmed { opacity: 0.55; }

        .ev-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .ev-card-badges {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* Etiqueta de tipo */
        .ev-type {
          font-size: 0.6rem;
          font-family: var(--font-cinzel);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid;
          border-radius: 3px;
          padding: 0.05rem 0.35rem;
        }

        /* Badges de estado */
        .ev-live {
          font-size: 0.6rem;
          font-family: var(--font-cinzel);
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--color-crimson);
          animation: ev-pulse 1.5s ease-in-out infinite;
        }
        @keyframes ev-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .ev-done, .ev-cancelled {
          font-size: 0.6rem;
          font-family: var(--font-cinzel);
          color: var(--text-muted);
        }

        /* Contador */
        .ev-count {
          font-size: 0.65rem;
          font-family: var(--font-cinzel);
          color: var(--text-muted);
        }

        /* Título */
        .ev-title {
          font-size: 0.82rem;
          font-family: var(--font-cinzel);
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        /* Sala */
        .ev-room {
          font-size: 0.68rem;
          color: var(--color-crimson);
          text-decoration: none;
          transition: opacity 0.12s;
        }
        .ev-room:hover { opacity: 0.75; }

        /* Fecha */
        .ev-date {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-family: var(--font-cinzel);
        }

        /* Botón unirse */
        .ev-join-btn {
          align-self: flex-start;
          margin-top: 0.2rem;
          font-size: 0.68rem;
          font-family: var(--font-cinzel);
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: opacity 0.12s;
          text-decoration: none;
          display: inline-block;
        }
        .ev-join-btn:hover { opacity: 0.8; }
        .ev-join-primary {
          background: var(--color-crimson);
          color: #fff;
        }
        .ev-join-secondary {
          background: var(--bg-elevated);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
        }
        .ev-join-ghost {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
          font-size: 0.62rem;
        }
      `}</style>
    </div>
  )
}