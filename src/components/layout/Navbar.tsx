'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logout } from '@/app/auth/actions'
import type { Profile } from '@/types/database'
import {
  HomeIcon,
  Squares2X2Icon,
  BellIcon,
  EnvelopeIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  SpeakerWaveIcon,
  BookOpenIcon,
  CheckIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

interface NavbarProps {
  siteName?: string
}

export default function Navbar({ siteName = 'TalesRol' }: NavbarProps) {
  const [profile, setProfile]               = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen]             = useState(false)
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [notifOpen, setNotifOpen]           = useState(false)
  const [notifications, setNotifications]   = useState<Notification[]>([])
  const [unreadCount, setUnreadCount]       = useState(0)
  const [userId, setUserId]                 = useState<string | null>(null)
  const [theme, setTheme]                   = useState<'dark' | 'light'>('dark')

  const menuRef  = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const saved = localStorage.getItem('talesrol-theme') as 'dark' | 'light' | null
    const initial = saved ?? 'dark'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('talesrol-theme', next)
  }

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) setProfile(data)
      await loadNotifications(user.id)
    }
    loadProfile()
  }, [])

  async function loadNotifications(uid: string) {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(15)
    setNotifications(data ?? [])
    setUnreadCount((data ?? []).filter((n: Notification) => !n.read_at).length)
  }

  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          const newNotif = payload.new as Notification
          setNotifications(prev => [newNotif, ...prev].slice(0, 15))
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setNotifOpen(false)
    setMenuOpen(false)
  }, [pathname])

  async function markAllRead() {
    if (!userId) return
    await supabase.from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId).is('read_at', null)
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
    setUnreadCount(0)
  }

  async function markOneRead(notifId: string, link: string | null) {
    await supabase.from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notifId).is('read_at', null)
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read_at: new Date().toISOString() } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    setNotifOpen(false)
    if (link) window.location.href = link
  }

  const navLinks = [
    { href: '/',         label: 'Inicio',   Icon: HomeIcon },
    { href: '/salas',    label: 'Salas',    Icon: Squares2X2Icon },
    { href: '/anuncios', label: 'Anuncios', Icon: SpeakerWaveIcon },
  ]

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'ahora'
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    return `${Math.floor(hrs / 24)}d`
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-top-line" />
        <div className="navbar-inner">

          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-symbol">✦</span>
            <span className="navbar-logo-text">{siteName}</span>
          </Link>

          {/* Links desktop */}
          <div className="navbar-links">
            {navLinks.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className={`navbar-link ${isActive(href) ? 'active' : ''}`}>
                <Icon width={14} height={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Derecha */}
          <div className="navbar-right">

            <button
              className="navbar-icon-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark'
                ? <SunIcon width={16} height={16} />
                : <MoonIcon width={16} height={16} />
              }
            </button>

            {profile ? (
              <>
                <div className="navbar-user" ref={notifRef}>
                  <button className="navbar-icon-btn" onClick={() => setNotifOpen(v => !v)} title="Notificaciones">
                    <BellIcon width={16} height={16} />
                    {unreadCount > 0 && (
                      <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="notif-dropdown">
                      <div className="notif-header">
                        <span className="notif-header-title">Notificaciones</span>
                        {unreadCount > 0 && (
                          <button className="mark-all-btn" onClick={markAllRead}>
                            <CheckIcon width={12} height={12} /> Marcar todas
                          </button>
                        )}
                      </div>
                      <div className="notif-list">
                        {notifications.length === 0 ? (
                          <div className="notif-empty">Sin notificaciones.</div>
                        ) : (
                          notifications.map(n => (
                            <button
                              key={n.id}
                              className={`notif-item ${!n.read_at ? 'unread' : ''}`}
                              onClick={() => markOneRead(n.id, n.link)}
                            >
                              <div className="notif-dot-wrap">
                                {!n.read_at && <span className="notif-dot" />}
                              </div>
                              <div className="notif-content">
                                <span className="notif-title">{n.title}</span>
                                {n.body && <span className="notif-body">{n.body}</span>}
                              </div>
                              <span className="notif-time">{timeAgo(n.created_at)}</span>
                            </button>
                          ))
                        )}
                      </div>
                      <Link href="/notificaciones" className="notif-footer" onClick={() => setNotifOpen(false)}>
                        Ver todas
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/mensajes" className="navbar-icon-btn" title="Mensajes">
                  <EnvelopeIcon width={16} height={16} />
                </Link>

                <div className="navbar-user" ref={menuRef}>
                  <button className="navbar-avatar-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    <img
                      src={profile.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${profile.id}`}
                      alt={profile.username}
                      className="navbar-avatar"
                    />
                    <span className="navbar-username">{profile.display_name || profile.username}</span>
                    <ChevronDownIcon width={12} height={12} className={`navbar-caret ${menuOpen ? 'open' : ''}`} />
                  </button>

                  {menuOpen && (
                    <div className="navbar-dropdown">
                      <div className="dropdown-header">
                        <img
                          src={profile.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${profile.id}`}
                          alt={profile.username}
                          className="dropdown-avatar"
                        />
                        <div>
                          <div className="dropdown-name">{profile.display_name || profile.username}</div>
                          <div className="dropdown-username">@{profile.username}</div>
                          <div className={`dropdown-role role-badge ${profile.role}`}>{profile.role}</div>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <Link href={`/perfil/${profile.username}`} className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <UserIcon width={14} height={14} /> Mi Perfil
                      </Link>
                      <Link href="/personajes" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <BookOpenIcon width={14} height={14} /> Mis Personajes
                      </Link>
                      <Link href="/mensajes" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <EnvelopeIcon width={14} height={14} /> Mensajes
                      </Link>
                      <Link href="/notificaciones" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <BellIcon width={14} height={14} /> Notificaciones
                        {unreadCount > 0 && <span className="dropdown-badge">{unreadCount}</span>}
                      </Link>
                      {(profile.role === 'admin' || profile.role === 'master' || profile.role === 'director') && (
                        <>
                          <div className="dropdown-divider" />
                          {profile.role === 'admin' && (
                            <Link href="/admin" className="dropdown-item admin" onClick={() => setMenuOpen(false)}>
                              <Cog6ToothIcon width={14} height={14} /> Panel Admin
                            </Link>
                          )}
                          <Link href="/salas/nueva" className="dropdown-item director" onClick={() => setMenuOpen(false)}>
                            <PlusIcon width={14} height={14} /> Nueva Sala
                          </Link>
                        </>
                      )}
                      <div className="dropdown-divider" />
                      <form action={logout}>
                        <button type="submit" className="dropdown-item logout">
                          <ArrowRightOnRectangleIcon width={14} height={14} /> Cerrar Sesión
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="navbar-auth-btns">
                <Link href="/auth/login" className="btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Entrar</Link>
                <Link href="/auth/register" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Registrarse</Link>
              </div>
            )}

            <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menú">
              {mobileOpen
                ? <XMarkIcon width={18} height={18} />
                : <Bars3Icon width={18} height={18} />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={`mobile-link ${isActive(href) ? 'active' : ''}`}>
              <Icon width={15} height={15} /> {label}
            </Link>
          ))}
          {profile && (
            <>
              <div className="mobile-divider" />
              <Link href={`/perfil/${profile.username}`} className="mobile-link">
                <UserIcon width={15} height={15} /> Mi Perfil
              </Link>
              <Link href="/personajes" className="mobile-link">
                <BookOpenIcon width={15} height={15} /> Mis Personajes
              </Link>
              <Link href="/mensajes" className="mobile-link">
                <EnvelopeIcon width={15} height={15} /> Mensajes
              </Link>
              <Link href="/notificaciones" className="mobile-link">
                <BellIcon width={15} height={15} /> Notificaciones
                {unreadCount > 0 && <span className="mobile-badge">{unreadCount}</span>}
              </Link>
              <div className="mobile-divider" />
              <button className="mobile-link" onClick={toggleTheme}>
                {theme === 'dark'
                  ? <><SunIcon width={15} height={15} /> Modo claro</>
                  : <><MoonIcon width={15} height={15} /> Modo oscuro</>
                }
              </button>
              <div className="mobile-divider" />
              <form action={logout}>
                <button type="submit" className="mobile-link logout-btn">
                  <ArrowRightOnRectangleIcon width={15} height={15} /> Cerrar Sesión
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <style>{`
        .navbar { position: sticky; top: 0; z-index: 100; background: rgba(10,10,10,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-subtle); }
        [data-theme="light"] .navbar { background: rgba(245,240,235,0.92); }
        .navbar-top-line { height: 2px; background: linear-gradient(to right, transparent, var(--color-crimson), transparent); }
        .navbar-inner { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; height: 60px; display: flex; align-items: center; gap: 2rem; }
        .navbar-logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; flex-shrink: 0; }
        .navbar-logo-symbol { color: var(--color-crimson); font-size: 1.1rem; animation: flicker 3s infinite; }
        .navbar-logo-text { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; background: linear-gradient(135deg, #ff4444 0%, var(--color-crimson) 60%, var(--color-crimson-dim) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .navbar-links { display: flex; align-items: center; gap: 0.25rem; flex: 1; }
        .navbar-link { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.85rem; border-radius: var(--radius-sm); font-family: var(--font-display); font-size: var(--text-xs); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); text-decoration: none; transition: all var(--transition-base); border: 1px solid transparent; }
        .navbar-link:hover { color: var(--text-primary); background: var(--color-crimson-subtle); border-color: var(--border-subtle); }
        .navbar-link.active { color: var(--color-crimson); background: rgba(193,6,6,0.1); border-color: var(--border-medium); }
        .navbar-right { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
        .navbar-auth-btns { display: flex; gap: 0.5rem; align-items: center; }
        .navbar-icon-btn { position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--radius-sm); color: var(--text-secondary); text-decoration: none; font-size: 1rem; transition: all var(--transition-base); border: 1px solid transparent; background: transparent; cursor: pointer; }
        .navbar-icon-btn:hover { color: var(--text-primary); background: var(--color-crimson-subtle); border-color: var(--border-subtle); }
        .notif-badge { position: absolute; top: 2px; right: 2px; background: var(--color-crimson); color: #fff; font-size: 0.6rem; font-weight: 700; font-family: var(--font-display); min-width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }
        .navbar-user { position: relative; }
        .navbar-avatar-btn { display: flex; align-items: center; gap: 0.5rem; background: transparent; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.3rem 0.6rem 0.3rem 0.3rem; cursor: pointer; transition: all var(--transition-base); color: var(--text-secondary); }
        .navbar-avatar-btn:hover { border-color: var(--border-medium); background: var(--color-crimson-subtle); color: var(--text-primary); }
        .navbar-avatar { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-medium); object-fit: cover; }
        .navbar-username { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 500; letter-spacing: 0.05em; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .navbar-caret { transition: transform var(--transition-base); }
        .navbar-caret.open { transform: rotate(180deg); }

        .navbar-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); min-width: 220px; box-shadow: var(--shadow-lg); animation: dropdownIn 0.15s ease-out forwards; overflow: hidden; z-index: 200; }
        @keyframes dropdownIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .dropdown-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: rgba(193,6,6,0.05); }
        .dropdown-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-medium); object-fit: cover; flex-shrink: 0; }
        .dropdown-name { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }
        .dropdown-username { font-size: var(--text-xs); color: var(--text-muted); margin-top: 0.1rem; }
        .dropdown-role { margin-top: 0.3rem; display: inline-flex; }
        .dropdown-divider { height: 1px; background: var(--border-subtle); margin: 0.25rem 0; }
        .dropdown-item { display: flex; align-items: center; gap: 0.6rem; width: 100%; padding: 0.6rem 1rem; color: var(--text-secondary); font-size: var(--text-sm); text-decoration: none; background: transparent; border: none; cursor: pointer; transition: all var(--transition-fast); font-family: var(--font-body); }
        .dropdown-item:hover { background: var(--color-crimson-subtle); color: var(--text-primary); }
        .dropdown-item.admin:hover { color: var(--color-role-admin); }
        .dropdown-item.director:hover { color: var(--color-role-director); }
        .dropdown-item.logout { color: var(--text-muted); }
        .dropdown-item.logout:hover { color: var(--color-error); background: var(--color-error-bg); }
        .dropdown-badge { margin-left: auto; background: var(--color-crimson); color: #fff; font-size: var(--text-xs); font-weight: 700; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }

        .notif-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); width: 320px; box-shadow: var(--shadow-lg); animation: dropdownIn 0.15s ease-out forwards; overflow: hidden; z-index: 200; }
        .notif-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-subtle); }
        .notif-header-title { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); }
        .mark-all-btn { display: flex; align-items: center; gap: 0.3rem; background: none; border: none; color: var(--text-muted); font-size: var(--text-xs); cursor: pointer; font-family: var(--font-display); letter-spacing: 0.04em; transition: color var(--transition-fast); }
        .mark-all-btn:hover { color: var(--color-crimson); }
        .notif-list { max-height: 340px; overflow-y: auto; }
        .notif-empty { padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: var(--text-sm); font-style: italic; }
        .notif-item { display: flex; align-items: flex-start; gap: 0.6rem; width: 100%; padding: 0.75rem 1rem; background: transparent; border: none; border-bottom: 1px solid var(--border-subtle); cursor: pointer; transition: background var(--transition-fast); text-align: left; }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: var(--color-crimson-subtle); }
        .notif-item.unread { background: rgba(193,6,6,0.04); }
        .notif-dot-wrap { width: 10px; flex-shrink: 0; padding-top: 4px; }
        .notif-dot { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--color-crimson); }
        .notif-content { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
        .notif-title { font-size: var(--text-sm); color: var(--text-primary); font-family: var(--font-display); letter-spacing: 0.03em; font-weight: 500; }
        .notif-body { font-size: var(--text-xs); color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .notif-time { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); flex-shrink: 0; }
        .notif-footer { display: block; text-align: center; padding: 0.6rem; font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.06em; color: var(--color-crimson); text-decoration: none; border-top: 1px solid var(--border-subtle); transition: background var(--transition-fast); }
        .notif-footer:hover { background: var(--color-crimson-subtle); }

        .navbar-hamburger { display: none; align-items: center; justify-content: center; width: 36px; height: 36px; background: transparent; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary); transition: all var(--transition-base); }
        .navbar-hamburger:hover { color: var(--text-primary); border-color: var(--border-medium); }

        .mobile-menu { display: none; flex-direction: column; background: var(--bg-secondary); border-bottom: 1px solid var(--border-subtle); padding: 0.5rem 0; }
        .mobile-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; color: var(--text-secondary); text-decoration: none; font-size: var(--text-base); transition: all var(--transition-fast); background: transparent; border: none; cursor: pointer; width: 100%; font-family: var(--font-body); }
        .mobile-link:hover, .mobile-link.active { color: var(--color-crimson); background: var(--color-crimson-subtle); }
        .mobile-divider { height: 1px; background: var(--border-subtle); margin: 0.25rem 0; }
        .logout-btn { color: var(--text-muted); }
        .logout-btn:hover { color: var(--color-error); }
        .mobile-badge { margin-left: auto; background: var(--color-crimson); color: #fff; font-size: var(--text-xs); font-weight: 700; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .navbar-username { display: none; }
          .navbar-hamburger { display: flex; }
          .mobile-menu { display: flex; }
          .navbar-auth-btns .btn-ghost { display: none; }
        }
      `}</style>
    </>
  )
}