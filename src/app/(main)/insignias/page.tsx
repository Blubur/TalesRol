import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  PencilIcon,
  DocumentTextIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  SparklesIcon,
  MapIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  UserIcon,
  UsersIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
  ShieldCheckIcon,
  TrophyIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

export const metadata = { title: 'Insignias — TalesRol' }

const ICON_MAP: Record<string, React.ReactNode> = {
  PencilIcon:           <PencilIcon style={{ width: 20, height: 20 }} />,
  DocumentTextIcon:     <DocumentTextIcon style={{ width: 20, height: 20 }} />,
  BookOpenIcon:         <BookOpenIcon style={{ width: 20, height: 20 }} />,
  ArchiveBoxIcon:       <ArchiveBoxIcon style={{ width: 20, height: 20 }} />,
  SparklesIcon:         <SparklesIcon style={{ width: 20, height: 20 }} />,
  MapIcon:              <MapIcon style={{ width: 20, height: 20 }} />,
  BuildingLibraryIcon:  <BuildingLibraryIcon style={{ width: 20, height: 20 }} />,
  GlobeAltIcon:         <GlobeAltIcon style={{ width: 20, height: 20 }} />,
  UserIcon:             <UserIcon style={{ width: 20, height: 20 }} />,
  UsersIcon:            <UsersIcon style={{ width: 20, height: 20 }} />,
  UserGroupIcon:        <UserGroupIcon style={{ width: 20, height: 20 }} />,
  ClockIcon:            <ClockIcon style={{ width: 20, height: 20 }} />,
  CalendarIcon:         <CalendarIcon style={{ width: 20, height: 20 }} />,
  ShieldCheckIcon:      <ShieldCheckIcon style={{ width: 20, height: 20 }} />,
}

const CATEGORY_LABELS: Record<string, string> = {
  posts:      'Escritura',
  salas:      'Salas de rol',
  personajes: 'Personajes',
  antiguedad: 'Antigüedad',
  especial:   'Especiales',
}

const COLOR_STYLES: Record<string, { color: string; border: string; bg: string }> = {
  default: { color: 'var(--text-secondary)',  border: 'var(--border-subtle)',       bg: 'var(--bg-secondary)' },
  gold:    { color: '#fbbf24',                border: 'rgba(251,191,36,0.4)',       bg: 'rgba(251,191,36,0.06)' },
  purple:  { color: '#a78bfa',                border: 'rgba(167,139,250,0.4)',      bg: 'rgba(167,139,250,0.06)' },
  crimson: { color: 'var(--color-crimson)',   border: 'var(--border-medium)',       bg: 'var(--color-crimson-subtle)' },
}

const CATEGORY_ORDER = ['posts', 'salas', 'personajes', 'antiguedad', 'especial']

export default async function InsigniasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: allBadges } = await supabase
    .from('badge_definitions')
    .select('*')
    .order('threshold', { ascending: true })

  // Badges desbloqueadas por el usuario actual
  const unlockedIds = new Set<string>()
  if (user) {
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', user.id)
    userBadges?.forEach(b => unlockedIds.add(b.badge_id))
  }

  const badges = allBadges ?? []
  const unlockedCount = badges.filter(b => unlockedIds.has(b.id)).length

  // Agrupar por categoría
  const grouped = badges.reduce((acc, b) => {
    if (!acc[b.category]) acc[b.category] = []
    acc[b.category].push(b)
    return acc
  }, {} as Record<string, typeof badges>)

  return (
    <div className="insignias-page">

      {/* Header */}
      <div className="insignias-hero animate-enter border-ornament">
        <div className="insignias-hero-icon">
          <TrophyIcon style={{ width: 28, height: 28 }} />
        </div>
        <div className="insignias-hero-text">
          <h1 className="insignias-hero-title">Insignias</h1>
          <p className="insignias-hero-sub">
            Desbloquea insignias participando en la comunidad. Hay {badges.length} insignias disponibles.
          </p>
        </div>
        {user && (
          <div className="insignias-hero-progress">
            <span className="insignias-progress-nums">
              {unlockedCount}<span style={{ color: 'var(--text-muted)' }}>/{badges.length}</span>
            </span>
            <span className="insignias-progress-label">desbloqueadas</span>
            <div className="insignias-progress-bar">
              <div
                className="insignias-progress-fill"
                style={{ width: `${Math.round((unlockedCount / badges.length) * 100)}%` }}
              />
            </div>
            <Link href="/perfil/badges" className="btn-ghost btn-sm" style={{ marginTop: '0.5rem' }}>
              Gestionar visibilidad
            </Link>
          </div>
        )}
      </div>

      {/* Categorías */}
      {CATEGORY_ORDER.map(cat => {
        const items = grouped[cat]
        if (!items?.length) return null
        const catUnlocked = items.filter(b => unlockedIds.has(b.id)).length
        return (
          <div key={cat} className="insignias-category animate-enter">
            <div className="insignias-category-header">
              <h2 className="insignias-category-title">{CATEGORY_LABELS[cat] ?? cat}</h2>
              {user && (
                <span className="insignias-category-count">
                  {catUnlocked}/{items.length}
                </span>
              )}
            </div>
            <div className="insignias-grid">
              {items.map(b => {
                const unlocked = unlockedIds.has(b.id)
                const style = COLOR_STYLES[b.color] ?? COLOR_STYLES.default
                return (
                  <div
                    key={b.id}
                    className={`insignia-card ${unlocked ? 'unlocked' : 'locked'}`}
                    style={unlocked ? { borderColor: style.border } : {}}
                  >
                    <div
                      className="insignia-icon"
                      style={unlocked
                        ? { color: style.color, background: style.bg }
                        : { color: 'var(--text-muted)', background: 'var(--bg-elevated)' }
                      }
                    >
                      {unlocked
                        ? (ICON_MAP[b.icon] ?? <TrophyIcon style={{ width: 20, height: 20 }} />)
                        : <LockClosedIcon style={{ width: 20, height: 20 }} />
                      }
                    </div>
                    <div className="insignia-info">
                      <span
                        className="insignia-name"
                        style={{ color: unlocked ? style.color : 'var(--text-muted)' }}
                      >
                        {b.name}
                      </span>
                      <span className="insignia-desc">{b.description}</span>
                      {b.points_reward > 0 && (
                        <span className="insignia-points">+{b.points_reward} pts</span>
                      )}
                    </div>
                    {unlocked && (
                      <span className="insignia-unlocked-dot" title="Desbloqueada" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

    </div>
  )
}