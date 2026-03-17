import { createClient } from '@/lib/supabase/server'

interface Stat {
  label: string
  value: number
  suffix?: string
}

export default async function StatsWidget() {
  const supabase = await createClient()

  const now        = new Date()
  const fiveMinAgo = new Date(now.getTime() - 5  * 60 * 1000).toISOString()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const [
    { count: onlineCount },
    { count: postsToday  },
    { count: roomsActive },
  ] = await Promise.all([
    // Usuarios vistos en los últimos 5 minutos
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('last_seen_at', fiveMinAgo),

    // Posts publicados hoy
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfDay)
      .is('deleted_at', null),

    // Salas con status active y no eliminadas
    supabase
      .from('rooms')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .is('deleted_at', null),
  ])

  const stats: Stat[] = [
    { label: 'en línea',      value: onlineCount ?? 0 },
    { label: 'posts hoy',     value: postsToday  ?? 0 },
    { label: 'salas activas', value: roomsActive ?? 0 },
  ]

  return (
    <div className="sw-bar">
      {stats.map((s, i) => (
        <div key={i} className="sw-stat">
          <span className="sw-value">{s.value}</span>
          <span className="sw-label">{s.label}</span>
        </div>
      ))}

      <style>{`
        .sw-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          overflow: hidden;
        }
        .sw-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          padding: 0.7rem 1rem;
          border-right: 1px solid var(--border-subtle);
        }
        .sw-stat:last-child { border-right: none; }
        .sw-value {
          font-family: var(--font-cinzel);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-crimson);
          line-height: 1;
        }
        .sw-label {
          font-family: var(--font-cinzel);
          font-size: 0.62rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}