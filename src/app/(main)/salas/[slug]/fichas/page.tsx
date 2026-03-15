import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getOrCreateTemplate } from './sheetactions'
import {
  ArrowLeftIcon,
  UserIcon,
  PlusIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('rooms').select('title').eq('slug', slug).single()
  return { title: `Fichas — ${data?.title ?? 'Sala'}` }
}

export default async function FichasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: roomData } = await supabase
    .from('rooms')
    .select('id, title, owner_id, status')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (!roomData) notFound()

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const isOwner = user.id === roomData.owner_id
  const isAdmin = profile?.role === 'admin'
  const canManage = isOwner || isAdmin

  // Obtener o crear plantilla
  if (canManage) {
    await getOrCreateTemplate(roomData.id)
  }

  const { data: template } = await supabase
    .from('room_sheet_templates')
    .select('id')
    .eq('room_id', roomData.id)
    .single()

  // Miembros de la sala con sus fichas
  const { data: members } = await supabase
    .from('room_members')
    .select('user_id, rank, profiles(id, username, display_name, avatar_url)')
    .eq('room_id', roomData.id)

  // Añadir owner si no está
  const memberIds = (members ?? []).map((m: any) => m.user_id)
  const allUsers: { user_id: string; rank: string; profiles: any }[] = [...(members ?? [])]
  if (!memberIds.includes(roomData.owner_id)) {
    const { data: ownerProfile } = await supabase
      .from('profiles').select('id, username, display_name, avatar_url').eq('id', roomData.owner_id).single()
    if (ownerProfile) allUsers.unshift({ user_id: roomData.owner_id, rank: 'owner', profiles: ownerProfile })
  }

  // Fichas existentes
  const { data: sheets } = await supabase
    .from('room_sheets')
    .select('user_id, updated_at')
    .eq('room_id', roomData.id)

  const sheetMap: Record<string, string> = {}
  sheets?.forEach((s: any) => { sheetMap[s.user_id] = s.updated_at })

  const RANK_LABEL: Record<string, string> = {
    owner: 'Director', codirector: 'Codirector', player: 'Jugador',
    spectator: 'Espectador',
  }

  return (
    <div className="fichas-page">

      {/* Header */}
      <div className="fichas-header animate-enter">
        <div className="fichas-header-left">
          <IdentificationIcon className="fichas-header-icon" />
          <div>
            <h1 className="fichas-title">Fichas de Personaje</h1>
            <p className="fichas-sub">{roomData.title}</p>
          </div>
        </div>
        <div className="fichas-header-actions">
          <Link href={`/salas/${slug}`} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Volver a la sala
          </Link>
          {canManage && template && (
            <Link href={`/salas/${slug}/fichas/plantilla`} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <PlusIcon style={{ width: 14, height: 14 }} /> Editar plantilla
            </Link>
          )}
        </div>
      </div>

      {/* Lista de miembros con fichas */}
      {allUsers.length === 0 ? (
        <div className="fichas-empty animate-enter">
          <IdentificationIcon className="fichas-empty-icon" />
          <p>Aún no hay miembros en esta sala.</p>
        </div>
      ) : (
        <div className="fichas-grid animate-enter" style={{ animationDelay: '0.1s' }}>
          {allUsers.map((m, i) => {
            const p = m.profiles
            const avatar = p?.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${p?.username}`
            const hasSheet = !!sheetMap[m.user_id]
            const isMe = m.user_id === user.id
            const canView = canManage || isMe

            return (
              <div
                key={m.user_id}
                className={`ficha-card animate-enter ${!canView ? 'ficha-card-locked' : ''}`}
                style={{ animationDelay: `${0.1 + i * 0.04}s` }}
              >
                <div className="ficha-card-top">
                  <img src={avatar} alt={p?.username} className="ficha-avatar" />
                  <div className="ficha-card-info">
                    <span className="ficha-name">{p?.display_name || p?.username}</span>
                    <span className="ficha-username">@{p?.username}</span>
                    <span className="ficha-rank">{RANK_LABEL[m.rank] ?? m.rank}</span>
                  </div>
                  <div className={`ficha-status ${hasSheet ? 'filled' : 'empty'}`}>
                    {hasSheet ? 'Ficha rellena' : 'Sin ficha'}
                  </div>
                </div>
                {canView && (
                  <Link
                    href={`/salas/${slug}/fichas/${p?.username}`}
                    className={`ficha-btn ${hasSheet ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                  >
                    {hasSheet
                      ? (isMe ? 'Ver / editar mi ficha' : `Ver ficha de ${p?.username}`)
                      : (isMe ? 'Crear mi ficha' : `Crear ficha para ${p?.username}`)
                    }
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}


    </div>
  )
}