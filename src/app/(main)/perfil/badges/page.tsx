import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserBadges } from '@/app/(main)/perfil/badges/badgeactions'
import BadgesClient from './BadgesClient'
import Link from 'next/link'
import { ArrowLeftIcon, TrophyIcon } from '@heroicons/react/24/outline'

export const metadata = { title: 'Mis insignias — TalesRol' }

export default async function BadgesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('username').eq('id', user.id).single()

  const badges = await getUserBadges(user.id)

  return (
    <div className="badges-page">
      <div className="badges-nav animate-enter">
        <Link href={`/perfil/${profile?.username}`} className="sala-back">
          <ArrowLeftIcon style={{ width: 14, height: 14 }} />
          Volver al perfil
        </Link>
      </div>

      <div className="badges-header animate-enter border-ornament" style={{ animationDelay: '0.05s' }}>
        <div className="badges-header-icon">
          <TrophyIcon style={{ width: 22, height: 22 }} />
        </div>
        <div>
          <h1 className="badges-title">Mis insignias</h1>
          <p className="badges-subtitle">
            Elige cuáles mostrar en tu perfil público. Las insignias se desbloquean automáticamente por tu actividad.
          </p>
        </div>
      </div>

      <BadgesClient badges={badges} />
    </div>
  )
}