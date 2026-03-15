import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Profile, Room } from '@/types/database'
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline'
import MembersClient from './MembersClient'
import { getRoomMembers } from './memberactions'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('rooms').select('title').eq('slug', slug).single()
  return { title: `Miembros — ${data?.title ?? 'Sala'}` }
}

export default async function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: roomData } = await supabase
    .from('rooms').select('*').eq('slug', slug).is('deleted_at', null).single()
  if (!roomData) notFound()
  const room = roomData as Room

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const isOwner = user.id === room.owner_id
  const isAdmin = (profile as Profile)?.role === 'admin'
  const canManage = isOwner || isAdmin

  // Obtener owner
  const { data: ownerData } = await supabase
    .from('profiles').select('id, username, display_name, avatar_url, ultimo_acceso')
    .eq('id', room.owner_id!).single()

  const members = await getRoomMembers(room.id)

  return (
    <div className="members-page">
      {/* Nav */}
      <div className="members-nav animate-enter">
        <Link href={`/salas/${slug}`} className="sala-back">
          <ArrowLeftIcon style={{ width: 14, height: 14 }} />
          Volver a la sala
        </Link>
      </div>

      {/* Header */}
      <div className="members-header animate-enter border-ornament" style={{ animationDelay: '0.05s' }}>
        <div className="members-header-icon">
          <UsersIcon style={{ width: 22, height: 22 }} />
        </div>
        <div>
          <h1 className="members-title">Gestión de miembros</h1>
          <p className="members-subtitle">{room.title}</p>
        </div>
      </div>

      {/* Client component con toda la lógica interactiva */}
      <MembersClient
        room={room}
        owner={ownerData as Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'ultimo_acceso'>}
        members={members}
        currentUserId={user.id}
        canManage={canManage}
      />
    </div>
  )
}