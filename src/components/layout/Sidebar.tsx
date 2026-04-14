'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Room } from '@/types/database'
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  SpeakerWaveIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UsersIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'

function SidebarSection({
  icon,
  title,
  right,
  defaultOpen = true,
  children,
}: {
  icon: React.ReactNode
  title: string
  right?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="sidebar-section">
      <button
        className="sidebar-section-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="sidebar-section-icon-svg">{icon}</span>
        <span className="sidebar-section-title">{title}</span>
        {right && <span onClick={e => e.stopPropagation()}>{right}</span>}
        <span className="sidebar-section-chevron">
          {open
            ? <ChevronUpIcon width={10} height={10} />
            : <ChevronDownIcon width={10} height={10} />
          }
        </span>
      </button>
      {open && <div className="sidebar-section-body">{children}</div>}
    </div>
  )
}

export default function Sidebar() {
  const [rooms, setRooms]         = useState<Room[]>([])
  const [loading, setLoading]     = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [isAdmin, setIsAdmin]     = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const [{ data: roomsData }, { data: { user } }] = await Promise.all([
        supabase
          .from('rooms')
          .select('*')
          .eq('status', 'active')
          .is('deleted_at', null)
          .order('ultima_actividad', { ascending: false })
          .limit(10),
        supabase.auth.getUser(),
      ])

      if (roomsData) setRooms(roomsData)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setIsAdmin(profile?.role === 'admin')
      }

      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      {/* Toggle colapsar sidebar completo */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expandir' : 'Colapsar'}
      >
        {collapsed
          ? <ChevronRightIcon width={10} height={10} />
          : <ChevronLeftIcon width={10} height={10} />
        }
      </button>

      {!collapsed && (
        <>
          {/* Administración */}
          {isAdmin && (
            <>
              <SidebarSection
                icon={<Cog6ToothIcon width={13} height={13} />}
                title="Administración"
                defaultOpen
              >
                <div className="sidebar-quick">
                  <Link
                    href="/admin"
                    className={`sidebar-quick-link admin ${pathname.startsWith('/admin') ? 'active' : ''}`}
                  >
                    <span className="admin-dot" />
                    Panel de Admin
                  </Link>
                </div>
              </SidebarSection>
              <div className="sidebar-divider" />
            </>

             {/* configuracion */}
          {isAdmin && (
            <>
              <SidebarSection
                icon={<Cog6ToothIcon width={13} height={13} />}
                title="Configuración"
                defaultOpen
              >
                <div className="sidebar-quick">
                  <Link
                    href="/admin/config/general"
                    className={`sidebar-quick-link admin ${pathname.startsWith('/admin/config/general') ? 'active' : ''}`}
                  >
                    <span className="admin-dot" />
                    Configuración
                  </Link>
                </div>
              </SidebarSection>
              <div className="sidebar-divider" />
            </>
          )}

          {/* Salas activas */}
          <SidebarSection
            icon={<Squares2X2Icon width={13} height={13} />}
            title="Salas Activas"
            right={
              <Link href="/salas" className="sidebar-see-all">Ver todas</Link>
            }
            defaultOpen
          >
            {loading ? (
              <div className="sidebar-loading">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="sidebar-skeleton skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <p className="sidebar-empty">No hay salas activas</p>
            ) : (
              <div className="sidebar-rooms">
                {rooms.map(room => (
                  <Link
                    key={room.id}
                    href={`/salas/${room.slug}`}
                    className={`sidebar-room ${pathname === `/salas/${room.slug}` ? 'active' : ''}`}
                  >
                    <div className="sidebar-room-indicator" />
                    <div className="sidebar-room-info">
                      <span className="sidebar-room-title">{room.title}</span>
                      {room.tags && room.tags.length > 0 && (
                        <span className="sidebar-room-tag">{room.tags[0]}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SidebarSection>

          <div className="sidebar-divider" />

          {/* Accesos rápidos */}
          <SidebarSection
            icon={<DocumentTextIcon width={13} height={13} />}
            title="Accesos Rápidos"
            defaultOpen={false}
          >
            <div className="sidebar-quick">
              <Link href="/anuncios" className={`sidebar-quick-link ${pathname === '/anuncios' ? 'active' : ''}`}>
                <SpeakerWaveIcon width={13} height={13} className="sidebar-quick-icon" />
                Anuncios
              </Link>
              <Link href="/normas" className={`sidebar-quick-link ${pathname === '/normas' ? 'active' : ''}`}>
                <ShieldCheckIcon width={13} height={13} className="sidebar-quick-icon" />
                Normas
              </Link>
              <Link href="/usuarios" className={`sidebar-quick-link ${pathname === '/usuarios' ? 'active' : ''}`}>
                <UsersIcon width={13} height={13} className="sidebar-quick-icon" />
                Usuarios
              </Link>
              <Link href="/insignias" className={`sidebar-quick-link ${pathname === '/insignias' ? 'active' : ''}`}>
                <TrophyIcon width={13} height={13} className="sidebar-quick-icon" />
                Insignias
              </Link>
            </div>
          </SidebarSection>
        </>
      )}

      <style>{`
        .sidebar {
          width: 220px;
          flex-shrink: 0;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-subtle);
          min-height: calc(100vh - 62px);
          position: sticky;
          top: 62px;
          height: calc(100vh - 62px);
          overflow-y: auto;
          overflow-x: hidden;
          transition: width var(--transition-slow);
          padding: 1rem 0;
        }
        .sidebar.collapsed { width: 36px; padding: 1rem 0; }

        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          background: transparent;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          width: 24px; height: 24px;
          cursor: pointer;
          transition: all var(--transition-base);
        }
        .sidebar-toggle:hover { border-color: var(--color-crimson); color: var(--color-crimson); }

        .sidebar-section { margin-bottom: 0.25rem; }

        .sidebar-section-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          width: 100%;
          padding: 0.4rem 0.75rem;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
          text-align: left;
          transition: background var(--transition-fast);
          margin-bottom: 0;
        }
        .sidebar-section-header:hover { background: var(--color-crimson-subtle); }

        .sidebar-section-icon-svg { color: var(--text-muted); flex-shrink: 0; display: flex; }
        .sidebar-section-title {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          flex: 1;
        }
        .sidebar-section-chevron { color: var(--text-muted); display: flex; flex-shrink: 0; }

        .sidebar-section-body { padding: 0.4rem 0.75rem 0.5rem; }

        .sidebar-see-all {
          font-size: var(--text-xs);
          color: var(--color-crimson);
          text-decoration: none;
          font-family: var(--font-display);
          letter-spacing: 0.05em;
          transition: color var(--transition-fast);
        }
        .sidebar-see-all:hover { color: var(--color-crimson-light); }

        .sidebar-rooms { display: flex; flex-direction: column; gap: 2px; }
        .sidebar-room {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.5rem;
          border-radius: var(--radius-sm);
          text-decoration: none;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }
        .sidebar-room:hover { background: var(--color-crimson-subtle); border-color: var(--border-subtle); }
        .sidebar-room.active { background: rgba(193,6,6,0.1); border-color: var(--border-medium); }
        .sidebar-room-indicator {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--color-crimson);
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(193,6,6,0.6);
        }
        .sidebar-room-info { display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-room-title {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color var(--transition-fast);
        }
        .sidebar-room:hover .sidebar-room-title,
        .sidebar-room.active .sidebar-room-title { color: var(--text-primary); }
        .sidebar-room-tag {
          font-size: var(--text-xs);
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-loading { display: flex; flex-direction: column; gap: 6px; }
        .sidebar-skeleton { height: 36px; border-radius: var(--radius-sm); }
        .sidebar-empty { font-size: var(--text-sm); color: var(--text-muted); text-align: center; padding: 1rem 0; }

        .sidebar-divider { height: 1px; background: var(--border-subtle); margin: 0.25rem 0; }

        .sidebar-quick { display: flex; flex-direction: column; gap: 2px; }
        .sidebar-quick-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .sidebar-quick-icon { flex-shrink: 0; color: var(--text-muted); }
        .sidebar-quick-link:hover,
        .sidebar-quick-link.active { color: var(--color-crimson); background: var(--color-crimson-subtle); }
        .sidebar-quick-link:hover .sidebar-quick-icon,
        .sidebar-quick-link.active .sidebar-quick-icon { color: var(--color-crimson); }

        .sidebar-quick-link.admin { font-family: var(--font-display); font-size: var(--text-xs); letter-spacing: 0.04em; }
        .sidebar-quick-link.admin:hover,
        .sidebar-quick-link.admin.active { color: #fbbf24; background: rgba(251,191,36,0.06); }
        .admin-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #fbbf24;
          box-shadow: 0 0 6px rgba(251,191,36,0.5);
          flex-shrink: 0;
        }

        @media (max-width: 768px) { .sidebar { display: none; } }
      `}</style>
    </aside>
  )
}