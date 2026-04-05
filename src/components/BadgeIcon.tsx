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
} from '@heroicons/react/24/outline'

const HEROICON_MAP: Record<string, React.ComponentType<{ style?: React.CSSProperties; className?: string }>> = {
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
}

interface BadgeIconProps {
  icon: string | null
  size?: number
  className?: string
}

export default function BadgeIcon({ icon, size = 20, className = '' }: BadgeIconProps) {
  if (!icon || icon.trim() === '') {
    return <TrophyIcon style={{ width: size, height: size }} className={className} />
  }

  const trimmed = icon.trim()

  // Heroicon por nombre (ej: "PencilIcon", "CalendarIcon")
  if (trimmed in HEROICON_MAP) {
    const Icon = HEROICON_MAP[trimmed]
    return <Icon style={{ width: size, height: size }} className={className} />
  }

  // RPG Awesome: empieza por "ra-"
  if (trimmed.startsWith('ra-')) {
    return (
      <i
        className={`ra ra-${trimmed.replace(/^ra-/, '')} ${className}`}
        style={{ fontSize: size, lineHeight: 1 }}
        aria-hidden="true"
      />
    )
  }

  // URL de imagen
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return (
      <img
        src={trimmed}
        alt="badge"
        style={{ width: size, height: size, objectFit: 'contain' }}
        className={className}
      />
    )
  }

  // Emoji u otro texto
  return (
    <span style={{ fontSize: size, lineHeight: 1 }} className={className}>
      {trimmed}
    </span>
  )
}