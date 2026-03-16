import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Profile, Room } from '@/types/database'
import AdminUsersTable from './AdminUsersTable'
import AdminRoomsTable from './AdminRoomsTable'
import AdminReportsTable from './AdminReportsTable'
import AdminDiceTable from './AdminDiceTable'
import AdminTagsTable from './AdminTagsTable'
import AdminAnnouncementsTable from './AdminAnnouncementsTable'
import {
  UsersIcon,
  BookOpenIcon,
  ChatBubbleLeftEllipsisIcon,
  FlagIcon,
  ShieldCheckIcon,
  CubeIcon,
  TagIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline'

export const metadata = { title: 'Panel de Administración — TalesRol' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (myProfile?.role !== 'admin') redirect('/')

  const [
    { count: totalUsers },
    { count: totalRooms },
    { count: totalPosts },
    { count: pendingReports },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('rooms').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('posts').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const { data: roleColorsData } = await supabase
    .from('role_colors')
    .select('role, color')

  const roleColors = Object.fromEntries(
    (roleColorsData ?? []).map(r => [r.role, r.color])
  )

  const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  const users = (usersData ?? []) as Profile[]

  const { data: roomsData } = await supabase.from('rooms').select('*').is('deleted_at', null).order('created_at', { ascending: false })
  const rooms = (roomsData ?? []) as Room[]

  const { data: reportsData } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reports_reporter_id_fkey(username, display_name, avatar_url),
      target_user:profiles!reports_target_user_id_fkey(username, display_name, avatar_url),
      target_post:posts!reports_target_post_id_fkey(content, topic_id),
      target_room:rooms!reports_target_room_id_fkey(title, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(50)
  const reports = reportsData ?? []

  const { data: dice } = await supabase.from('dice_types').select('*').order('faces', { ascending: true })
  const { data: tags } = await supabase.from('tags').select('*').order('name', { ascending: true })
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, profiles!announcements_author_id_fkey(username, display_name)')
    .order('created_at', { ascending: false })

  const stats = [
    { label: 'Usuarios',  value: totalUsers  ?? 0, icon: UsersIcon,                  color: '#60a5fa' },
    { label: 'Salas',     value: totalRooms  ?? 0, icon: BookOpenIcon,               color: '#34d399' },
    { label: 'Posts',     value: totalPosts  ?? 0, icon: ChatBubbleLeftEllipsisIcon, color: '#c1c1c1' },
    { label: 'Reportes pendientes', value: pendingReports ?? 0, icon: FlagIcon, color: (pendingReports ?? 0) > 0 ? '#ff6b6b' : '#9ca3af' },
  ]

  const navSections = [
    { id: 'reportes',  label: 'Reportes',  icon: FlagIcon },
    { id: 'usuarios',  label: 'Usuarios',  icon: UsersIcon },
    { id: 'salas',     label: 'Salas',     icon: BookOpenIcon },
    { id: 'dados',     label: 'Dados',     icon: CubeIcon },
    { id: 'etiquetas', label: 'Etiquetas', icon: TagIcon },
    { id: 'anuncios',  label: 'Anuncios',  icon: SpeakerWaveIcon },
  ]

  return (
    <div className="admin-page">

      <div className="admin-header animate-enter">
        <div className="admin-header-left">
          <ShieldCheckIcon className="admin-header-icon" />
          <div>
            <h1 className="admin-title">Panel de Administración</h1>
            <p className="admin-sub">Control total del sistema</p>
          </div>
        </div>
        <Link href="/" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
          ← Volver al inicio
        </Link>
      </div>

      <div className="admin-stats animate-enter" style={{ animationDelay: '0.05s' }}>
        {stats.map((stat, i) => (
          <div key={stat.label} className="admin-stat-card" style={{ animationDelay: `${0.05 + i * 0.05}s` }}>
            <stat.icon className="admin-stat-icon" style={{ color: stat.color }} />
            <div className="admin-stat-body">
              <span className="admin-stat-value" style={{ color: stat.color }}>{stat.value}</span>
              <span className="admin-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <nav className="admin-nav animate-enter" style={{ animationDelay: '0.1s' }}>
        {navSections.map(s => (
          <a key={s.id} href={`#${s.id}`} className="admin-nav-link">
            <s.icon className="admin-nav-icon" />
            {s.label}
          </a>
        ))}
      </nav>

      <section id="reportes" className="admin-section animate-enter" style={{ animationDelay: '0.15s' }}>
        <div className="admin-section-header">
          <FlagIcon className="admin-section-icon" />
          <h2 className="admin-section-title">
            Reportes
            {(pendingReports ?? 0) > 0 && (
              <span className="admin-badge-danger">{pendingReports} pendiente{pendingReports !== 1 ? 's' : ''}</span>
            )}
          </h2>
        </div>
        <AdminReportsTable reports={reports} />
      </section>

      <section id="usuarios" className="admin-section animate-enter" style={{ animationDelay: '0.2s' }}>
        <div className="admin-section-header">
          <UsersIcon className="admin-section-icon" />
          <h2 className="admin-section-title">Usuarios <span className="admin-count">({users.length})</span></h2>
        </div>
        <AdminUsersTable users={users} currentUserId={user.id} roleColors={roleColors} />
      </section>

      <section id="salas" className="admin-section animate-enter" style={{ animationDelay: '0.25s' }}>
        <div className="admin-section-header">
          <BookOpenIcon className="admin-section-icon" />
          <h2 className="admin-section-title">Salas <span className="admin-count">({rooms.length})</span></h2>
        </div>
        <AdminRoomsTable rooms={rooms} />
      </section>

      <section id="dados" className="admin-section animate-enter" style={{ animationDelay: '0.3s' }}>
        <div className="admin-section-header">
          <CubeIcon className="admin-section-icon" />
          <h2 className="admin-section-title">Tipos de Dado <span className="admin-count">({(dice ?? []).length})</span></h2>
        </div>
        <AdminDiceTable dice={dice ?? []} />
      </section>

      <section id="etiquetas" className="admin-section animate-enter" style={{ animationDelay: '0.35s' }}>
        <div className="admin-section-header">
          <TagIcon className="admin-section-icon" />
          <h2 className="admin-section-title">Etiquetas <span className="admin-count">({(tags ?? []).length})</span></h2>
        </div>
        <AdminTagsTable tags={tags ?? []} />
      </section>

      <section id="anuncios" className="admin-section animate-enter" style={{ animationDelay: '0.4s' }}>
        <div className="admin-section-header">
          <SpeakerWaveIcon className="admin-section-icon" />
          <h2 className="admin-section-title">Anuncios <span className="admin-count">({(announcements ?? []).length})</span></h2>
        </div>
        <AdminAnnouncementsTable announcements={announcements ?? []} currentUserId={user.id} />
      </section>

      <style>{`
        .admin-page { max-width: 100%; display: flex; flex-direction: column; gap: 2rem; background: var(--bg-elevated); border: 8px solid var(--color-crimson-glow); padding: var(--space-10); }

        .admin-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); position: relative; }
        .admin-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: var(--color-crimson); }
        .admin-header-left { display: flex; align-items: center; gap: 1rem; }
        .admin-header-icon { width: 32px; height: 32px; color: var(--color-crimson); }
        .admin-title { font-family: var(--font-cinzel); font-size: 1.6rem; font-weight: 700; letter-spacing: 0.08em; margin: 0; }
        .admin-sub { color: var(--text-muted); font-size: 0.85rem; margin: 0.2rem 0 0; }

        .admin-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .admin-stat-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1.1rem 1.25rem; }
        .admin-stat-icon { width: 28px; height: 28px; flex-shrink: 0; }
        .admin-stat-body { display: flex; flex-direction: column; gap: 0.1rem; }
        .admin-stat-value { font-family: var(--font-cinzel); font-size: 1.6rem; font-weight: 700; line-height: 1; }
        .admin-stat-label { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.06em; text-transform: uppercase; }

        .admin-nav { display: flex; gap: 0.35rem; flex-wrap: wrap; padding: 0.6rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; position: sticky; top: 70px; z-index: 40; }
        .admin-nav-link { display: flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; color: var(--text-muted); text-decoration: none; border: 1px solid transparent; transition: all 0.15s; }
        .admin-nav-link:hover { color: var(--text-primary); border-color: var(--border-medium); background: var(--bg-elevated); }
        .admin-nav-icon { width: 13px; height: 13px; flex-shrink: 0; }

        .admin-section { display: flex; flex-direction: column; gap: 0.75rem; scroll-margin-top: 130px; }
        .admin-section-header { display: flex; align-items: center; gap: 0.6rem; }
        .admin-section-icon { width: 18px; height: 18px; color: var(--color-crimson); flex-shrink: 0; }
        .admin-section-title { font-family: var(--font-cinzel); font-size: 0.9rem; font-weight: 600; letter-spacing: 0.08em; margin: 0; display: flex; align-items: center; gap: 0.6rem; }
        .admin-count { color: var(--text-muted); font-weight: 400; }
        .admin-badge-danger { font-size: 0.68rem; background: rgba(255,107,107,0.15); border: 1px solid rgba(255,107,107,0.4); color: #ff6b6b; border-radius: 2px; padding: 0.1rem 0.5rem; font-family: var(--font-cinzel); letter-spacing: 0.06em; }

        @media (max-width: 700px) { .admin-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 400px) { .admin-stats { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}