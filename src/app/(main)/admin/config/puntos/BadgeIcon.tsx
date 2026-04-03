/**
 * BadgeIcon — detecta el tipo de icono y lo renderiza:
 *   - "ra-sword"  → RPG Awesome  <i class="ra ra-sword">
 *   - emoji       → <span>🏅</span>
 *   - URL http    → <img src="...">
 */

interface BadgeIconProps {
  icon: string | null
  size?: number
  className?: string
}

export default function BadgeIcon({ icon, size = 20, className = '' }: BadgeIconProps) {
  if (!icon || icon.trim() === '') {
    return <span style={{ fontSize: size, lineHeight: 1 }} className={className}>🏅</span>
  }

  const trimmed = icon.trim()

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