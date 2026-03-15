'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  ChatBubbleIcon,
  ArrowLeftIcon,
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  GearIcon,
  StarIcon,
  BellIcon,
  ReaderIcon,
  TrashIcon,
} from '@radix-ui/react-icons'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

const TYPE_META: Record<string, { icon: React.ReactNode; label: string }> = {
  mention:   { icon: <ChatBubbleIcon width={14} height={14} />,          label: 'Menciones' },
  reply:     { icon: <ArrowLeftIcon width={14} height={14} />,           label: 'Respuestas' },
  message:   { icon: <EnvelopeClosedIcon width={14} height={14} />,      label: 'Mensajes' },
  report:    { icon: <ExclamationTriangleIcon width={14} height={14} />, label: 'Reportes' },
  system:    { icon: <GearIcon width={14} height={14} />,                label: 'Sistema' },
  points:    { icon: <StarIcon width={14} height={14} />,                label: 'Puntos' },
  new_topic: { icon: <ReaderIcon width={14} height={14} />,              label: 'Nuevos temas' },
  new_post:  { icon: <ArrowLeftIcon width={14} height={14} />,           label: 'Nuevos posts' },
}

const FILTERS = ['todas', 'mention', 'reply', 'message', 'new_topic', 'new_post', 'system', 'points']

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d`
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState('todas')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      // Marcar todas como leídas al entrar
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('read_at', null)

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)

      setNotifications(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function deleteOne(id: string) {
    await supabase.from('notifications').delete().eq('id', id)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  async function deleteAll() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notifications').delete().eq('user_id', user.id)
    setNotifications([])
  }

  const filtered = filter === 'todas'
    ? notifications
    : notifications.filter(n => n.type === filter)

  const unreadCount = notifications.filter(n => !n.read_at).length
  const countByType = (type: string) => notifications.filter(n => n.type === type).length

  return (
    <div className="np-wrap">

      {/* Header */}
      <div className="np-header">
        <div className="np-header-left">
          <BellIcon width={18} height={18} className="np-bell-icon" />
          <h1 className="np-title">Notificaciones</h1>
          {unreadCount > 0 && <span className="np-unread-badge">{unreadCount} nuevas</span>}
        </div>
        {notifications.length > 0 && (
          <button className="np-delete-all" onClick={deleteAll}>
            <TrashIcon width={13} height={13} /> Borrar todas
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="np-filters">
        {FILTERS.map(f => {
          const count = f === 'todas' ? notifications.length : countByType(f)
          if (f !== 'todas' && count === 0) return null
          return (
            <button
              key={f}
              className={`np-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f !== 'todas' && TYPE_META[f]?.icon}
              <span>{f === 'todas' ? 'Todas' : TYPE_META[f]?.label ?? f}</span>
              <span className="np-filter-count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="np-empty">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="np-empty">
          <BellIcon width={32} height={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
          <p>Sin notificaciones{filter !== 'todas' ? ' en esta categoría' : ''}.</p>
        </div>
      ) : (
        <div className="np-list">
          {filtered.map(n => {
            const meta = TYPE_META[n.type]
            const inner = (
              <>
                <div className="np-item-icon">
                  {meta?.icon ?? <BellIcon width={14} height={14} />}
                </div>
                <div className="np-item-content">
                  <span className="np-item-title">{n.title}</span>
                  {n.body && <span className="np-item-body">{n.body}</span>}
                </div>
                <div className="np-item-right">
                  <span className="np-item-time">{timeAgo(n.created_at)}</span>
                  <button
                    className="np-delete-btn"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); deleteOne(n.id) }}
                    title="Eliminar"
                  >
                    <TrashIcon width={12} height={12} />
                  </button>
                </div>
              </>
            )

            return n.link ? (
              <Link key={n.id} href={n.link} className={`np-item ${!n.read_at ? 'unread' : ''}`}>
                {inner}
              </Link>
            ) : (
              <div key={n.id} className={`np-item ${!n.read_at ? 'unread' : ''}`}>
                {inner}
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .np-wrap { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; }

        .np-header { display: flex; align-items: center; justify-content: space-between; }
        .np-header-left { display: flex; align-items: center; gap: 0.6rem; }
        .np-bell-icon { color: var(--color-crimson); }
        .np-title { font-family: var(--font-cinzel); font-size: 1.3rem; font-weight: 700; letter-spacing: 0.06em; margin: 0; }
        .np-unread-badge { background: var(--color-crimson); color: #fff; font-size: 0.68rem; font-weight: 700; font-family: var(--font-cinzel); padding: 0.2rem 0.5rem; border-radius: 10px; letter-spacing: 0.04em; }
        .np-delete-all { display: flex; align-items: center; gap: 0.35rem; background: none; border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.35rem 0.75rem; font-size: 0.75rem; font-family: var(--font-cinzel); color: var(--text-muted); cursor: pointer; transition: all 0.2s; letter-spacing: 0.04em; }
        .np-delete-all:hover { color: #ff4444; border-color: #ff4444; background: rgba(255,68,68,0.06); }

        .np-filters { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .np-filter-btn { display: flex; align-items: center; gap: 0.35rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 0.3rem 0.75rem; font-size: 0.75rem; font-family: var(--font-cinzel); color: var(--text-muted); cursor: pointer; transition: all 0.2s; letter-spacing: 0.04em; }
        .np-filter-btn:hover { border-color: var(--border-medium); color: var(--text-primary); }
        .np-filter-btn.active { background: rgba(193,6,6,0.1); border-color: var(--color-crimson); color: var(--color-crimson); }
        .np-filter-count { background: rgba(255,255,255,0.08); border-radius: 8px; padding: 0 5px; font-size: 0.68rem; }
        .np-filter-btn.active .np-filter-count { background: rgba(193,6,6,0.2); }

        .np-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; color: var(--text-muted); font-style: italic; font-size: 0.9rem; gap: 0.25rem; }

        .np-list { display: flex; flex-direction: column; gap: 2px; }
        .np-item { display: flex; align-items: flex-start; gap: 0.85rem; padding: 0.9rem 1rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; text-decoration: none; transition: border-color 0.2s; }
        .np-item:hover { border-color: var(--border-medium); }
        .np-item:hover .np-delete-btn { opacity: 1; }
        .np-item.unread { border-left: 3px solid var(--color-crimson); background: rgba(193,6,6,0.03); }

        .np-item-icon { width: 28px; height: 28px; border-radius: 50%; background: rgba(193,6,6,0.1); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--color-crimson); margin-top: 1px; }
        .np-item-content { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
        .np-item-title { font-family: var(--font-cinzel); font-size: 0.83rem; font-weight: 500; color: var(--text-primary); letter-spacing: 0.03em; }
        .np-item-body { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .np-item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; flex-shrink: 0; }
        .np-item-time { font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-cinzel); white-space: nowrap; }
        .np-delete-btn { opacity: 0; background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; border-radius: 3px; display: flex; align-items: center; transition: all 0.15s; }
        .np-delete-btn:hover { color: #ff4444; }

        @media (max-width: 600px) {
          .np-item-time { display: none; }
          .np-delete-btn { opacity: 1; }
        }
      `}</style>
    </div>
  )
}