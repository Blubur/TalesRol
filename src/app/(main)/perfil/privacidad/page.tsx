import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrivacyForm from './PrivacyForm'
import { LockClosedIcon } from '@heroicons/react/24/outline'

export const metadata = { title: 'Privacidad — TalesRol' }

export default async function PrivacyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, privacy_characters, privacy_rooms, privacy_posts')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  return (
    <div className="privacy-page">
      <div className="privacy-breadcrumb">
        <Link href={`/perfil/${profile.username}`} className="bc-link">← Volver al perfil</Link>
      </div>

      <div className="privacy-header">
        <LockClosedIcon className="privacy-header-icon" />
        <div>
          <h1 className="privacy-title">Privacidad</h1>
          <p className="privacy-sub">Controla qué información es visible para otros usuarios.</p>
        </div>
      </div>

      <PrivacyForm
        username={profile.username}
        privacyCharacters={profile.privacy_characters ?? true}
        privacyRooms={profile.privacy_rooms ?? true}
        privacyPosts={profile.privacy_posts ?? true}
      />

      <style>{`
        .privacy-page { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6); }
        .privacy-breadcrumb { font-size: var(--text-sm); }
        .bc-link { color: var(--text-muted); text-decoration: none; font-family: var(--font-display); letter-spacing: 0.04em; transition: color var(--transition-base); }
        .bc-link:hover { color: var(--color-crimson); }
        .privacy-header { display: flex; align-items: center; gap: var(--space-4); }
        .privacy-header-icon { width: 28px; height: 28px; color: var(--color-crimson); flex-shrink: 0; }
        .privacy-title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; letter-spacing: 0.06em; margin: 0; }
        .privacy-sub { color: var(--text-muted); font-size: var(--text-sm); margin: var(--space-1) 0 0; }
      `}</style>
    </div>
  )
}