'use client'

import { useState, useTransition } from 'react'
import { toggleBadgeVisibility } from './badgeactions'
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
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'

const ICON_MAP: Record<string, React.ReactNode> = {
  PencilIcon:           <PencilIcon style={{ width: 16, height: 16 }} />,
  DocumentTextIcon:     <DocumentTextIcon style={{ width: 16, height: 16 }} />,
  BookOpenIcon:         <BookOpenIcon style={{ width: 16, height: 16 }} />,
  ArchiveBoxIcon:       <ArchiveBoxIcon style={{ width: 16, height: 16 }} />,
  SparklesIcon:         <SparklesIcon style={{ width: 16, height: 16 }} />,
  MapIcon:              <MapIcon style={{ width: 16, height: 16 }} />,
  BuildingLibraryIcon:  <BuildingLibraryIcon style={{ width: 16, height: 16 }} />,
  GlobeAltIcon:         <GlobeAltIcon style={{ width: 16, height: 16 }} />,
  UserIcon:             <UserIcon style={{ width: 16, height: 16 }} />,
  UsersIcon:            <UsersIcon style={{ width: 16, height: 16 }} />,
  UserGroupIcon:        <UserGroupIcon style={{ width: 16, height: 16 }} />,
  ClockIcon:            <ClockIcon style={{ width: 16, height: 16 }} />,
  CalendarIcon:         <CalendarIcon style={{ width: 16, height: 16 }} />,
  ShieldCheckIcon:      <ShieldCheckIcon style={{ width: 16, height: 16 }} />,
}

const CATEGORY_LABELS: Record<string, string> = {
  posts:      'Escritura',
  salas:      'Salas de rol',
  personajes: 'Personajes',
  antiguedad: 'Antigüedad',
  especial:   'Especiales',
}

const COLOR_STYLES: Record<string, React.CSSProperties> = {
  default: { color: 'var(--text-secondary)',    borderColor: 'var(--border-subtle)',          background: 'var(--bg-secondary)' },
  gold:    { color: '#fbbf24',                  borderColor: 'rgba(251,191,36,0.4)',          background: 'rgba(251,191,36,0.06)' },
  purple:  { color: '#a78bfa',                  borderColor: 'rgba(167,139,250,0.4)',         background: 'rgba(167,139,250,0.06)' },
  crimson: { color: 'var(--color-crimson)',     borderColor: 'var(--border-medium)',          background: 'var(--color-crimson-subtle)' },
}

type BadgeRow = {
  badge_id: string
  is_visible: boolean
  unlocked_at: string
  badge_definitions: {
    id: string
    name: string
    description: string
    icon: string
    category: string
    color: string
    points_reward: number
  }
}

export default function BadgesClient({ badges }: { badges: BadgeRow[] }) {
  const [localBadges, setLocalBadges] = useState(badges)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (badgeId: string, current: boolean) => {
    setLocalBadges(prev =>
      prev.map(b => b.badge_id === badgeId ? { ...b, is_visible: !current } : b)
    )
    startTransition(async () => {
      await toggleBadgeVisibility(badgeId, !current)
    })
  }

  // Agrupar por categoría
  const grouped = localBadges.reduce((acc, b) => {
    const cat = b.badge_definitions?.category ?? 'especial'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(b)
    return acc
  }, {} as Record<string, BadgeRow[]>)

  const categoryOrder = ['posts', 'salas', 'personajes', 'antiguedad', 'especial']
  const visibleCount = localBadges.filter(b => b.is_visible).length

  if (localBadges.length === 0) {
    return (
      <div className="badges-empty animate-enter">
        <TrophyIcon style={{ width: 40, height: 40 }} />
        <p>Aún no has desbloqueado ninguna insignia.</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Publica posts, crea salas o personajes para empezar a conseguirlas.
        </p>
      </div>
    )
  }

  return (
    <div className="badges-body animate-enter" style={{ animationDelay: '0.1s' }}>

      {/* Resumen */}
      <div className="badges-summary">
        <span className="badges-summary-stat">
          <TrophyIcon style={{ width: 14, height: 14 }} />
          {localBadges.length} insignia{localBadges.length !== 1 ? 's' : ''} desbloqueada{localBadges.length !== 1 ? 's' : ''}
        </span>
        <span className="badges-summary-sep">·</span>
        <span className="badges-summary-stat">
          <EyeIcon style={{ width: 14, height: 14 }} />
          {visibleCount} visible{visibleCount !== 1 ? 's' : ''} en tu perfil
        </span>
      </div>

      {/* Por categoría */}
      {categoryOrder.map(cat => {
        const items = grouped[cat]
        if (!items?.length) return null
        return (
          <div key={cat} className="badges-category">
            <h2 className="badges-category-title">{CATEGORY_LABELS[cat] ?? cat}</h2>
            <div className="badges-grid">
              {items.map(b => {
                const def = b.badge_definitions
                if (!def) return null
                const colorStyle = COLOR_STYLES[def.color] ?? COLOR_STYLES.default
                return (
                  <div
                    key={b.badge_id}
                    className={`badge-card ${b.is_visible ? 'visible' : 'hidden'}`}
                    style={{ borderColor: colorStyle.borderColor }}
                  >
                    <div className="badge-card-icon" style={{ color: colorStyle.color, background: colorStyle.background }}>
                      {ICON_MAP[def.icon] ?? <TrophyIcon style={{ width: 16, height: 16 }} />}
                    </div>
                    <div className="badge-card-info">
                      <span className="badge-card-name" style={{ color: colorStyle.color }}>{def.name}</span>
                      <span className="badge-card-desc">{def.description}</span>
                      <span className="badge-card-date">
                        {new Date(b.unlocked_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <button
                      className={`badge-toggle-btn ${b.is_visible ? 'active' : ''}`}
                      onClick={() => handleToggle(b.badge_id, b.is_visible)}
                      disabled={isPending}
                      title={b.is_visible ? 'Ocultar del perfil' : 'Mostrar en perfil'}
                    >
                      {b.is_visible
                        ? <EyeIcon style={{ width: 14, height: 14 }} />
                        : <EyeSlashIcon style={{ width: 14, height: 14 }} />
                      }
                    </button>
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