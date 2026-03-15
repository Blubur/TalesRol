import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  MegaphoneIcon,
  MapPinIcon,
  Squares2X2Icon,
  SpeakerWaveIcon,
  BookOpenIcon,
  UserIcon,
  UserPlusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export const revalidate = 0

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const { data: pinnedAnnouncements } = await supabase
    .from('announcements')
    .select('id, title, content, created_at')
    .eq('is_pinned', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const pinned = pinnedAnnouncements ?? []

  return (
    <div className="home-page">

      {pinned.length > 0 && (
        <div className="home-pinned animate-enter">
          <div className="home-pinned-header">
            <MegaphoneIcon className="home-pinned-icon" />
            <span className="home-pinned-label">Anuncios</span>
            <Link href="/anuncios" className="home-pinned-all">Ver todos →</Link>
          </div>
          <div className="home-pinned-list">
            {pinned.map((ann, i) => (
              <Link
                key={ann.id}
                href={`/anuncios#anuncio-${ann.id}`}
                className="home-pinned-item animate-enter"
                style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              >
                <MapPinIcon className="home-pinned-item-icon" />
                <div className="home-pinned-item-body">
                  <span className="home-pinned-item-title">{ann.title}</span>
                  <span className="home-pinned-item-preview">
                    {ann.content.slice(0, 100)}{ann.content.length > 100 ? '…' : ''}
                  </span>
                </div>
                <span className="home-pinned-item-date">
                  {new Date(ann.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="home-hero animate-enter">
        <div className="home-hero-bg" />
        <div className="home-hero-symbol">✦</div>
        <h1 className="home-hero-title">
          {profile
            ? `Bienvenido, ${profile.display_name || profile.username}`
            : 'Bienvenido a TalesRol'
          }
        </h1>
        <p className="home-hero-sub">
          Plataforma de roleplay escrito — Crea personajes, únete a salas y vive tus historias
        </p>
        {!profile && (
          <div className="home-hero-btns">
            <Link href="/auth/register" className="btn-primary">Empezar ahora</Link>
            <Link href="/salas" className="btn-ghost">Ver salas</Link>
          </div>
        )}
      </div>

      <div className="home-grid">
        <Link href="/salas" className="home-card animate-enter" style={{ animationDelay: '0.1s' }}>
          <div className="home-card-icon"><Squares2X2Icon /></div>
          <div className="home-card-content">
            <h3>Salas de Rol</h3>
            <p>Explora mundos creados por nuestros directores</p>
          </div>
          <span className="home-card-arrow">→</span>
        </Link>

        <Link href="/anuncios" className="home-card animate-enter" style={{ animationDelay: '0.15s' }}>
          <div className="home-card-icon"><SpeakerWaveIcon /></div>
          <div className="home-card-content">
            <h3>Anuncios</h3>
            <p>Noticias y novedades de la comunidad</p>
          </div>
          <span className="home-card-arrow">→</span>
        </Link>

        <Link href="/personajes" className="home-card animate-enter" style={{ animationDelay: '0.2s' }}>
          <div className="home-card-icon"><BookOpenIcon /></div>
          <div className="home-card-content">
            <h3>Personajes</h3>
            <p>Crea y gestiona tus personajes</p>
          </div>
          <span className="home-card-arrow">→</span>
        </Link>

        {profile ? (
          <Link href={`/perfil/${profile.username}`} className="home-card animate-enter" style={{ animationDelay: '0.25s' }}>
            <div className="home-card-icon"><UserIcon /></div>
            <div className="home-card-content">
              <h3>Mi Perfil</h3>
              <p>Gestiona tu cuenta y tus estadísticas</p>
            </div>
            <span className="home-card-arrow">→</span>
          </Link>
        ) : (
          <Link href="/auth/register" className="home-card home-card-cta animate-enter" style={{ animationDelay: '0.25s' }}>
            <div className="home-card-icon"><UserPlusIcon /></div>
            <div className="home-card-content">
              <h3>Únete gratis</h3>
              <p>Regístrate y empieza tu aventura</p>
            </div>
            <span className="home-card-arrow">→</span>
          </Link>
        )}
      </div>
    </div>
  )
}