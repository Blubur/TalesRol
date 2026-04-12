'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type MemberRank = 'espectador' | 'jugador' | 'codirector'

export async function addRoomMember(roomId: string, username: string, rank: MemberRank = 'jugador') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: room } = await supabase
    .from('rooms').select('owner_id, slug').eq('id', roomId).single()
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const isOwner = room?.owner_id === user.id
  const isAdmin = profile?.role === 'admin'
  if (!isOwner && !isAdmin) return { error: 'Sin permiso.' }

  const { data: target } = await supabase
    .from('profiles').select('id').ilike('username', username).single()
  if (!target) return { error: `No se encontró el usuario "${username}".` }

  if (target.id === room?.owner_id) return { error: 'El director ya gestiona la sala.' }

  // Comprobar límite de salas por participante
  const db = service()
  const { data: maxRow } = await db
    .from('site_config').select('value').eq('key', 'max_rooms_joined').single()
  const maxRooms = parseInt(maxRow?.value ?? '0', 10)

  if (maxRooms > 0) {
    const { count } = await db
      .from('room_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', target.id)

    if ((count ?? 0) >= maxRooms) {
      return { error: `El usuario ya participa en el máximo de salas permitido (${maxRooms}).` }
    }
  }

  const { error } = await supabase.from('room_members').upsert(
    { room_id: roomId, user_id: target.id, rank, invited_by: user.id },
    { onConflict: 'room_id,user_id' }
  )
  if (error) return { error: error.message }

  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, ultimo_acceso')
    .eq('id', target.id)
    .single()

  revalidatePath(`/salas/${room?.slug}/miembros`)
  revalidatePath(`/salas/${room?.slug}`)
  return {
    success: true,
    member: {
      room_id:    roomId,
      user_id:    target.id,
      rank,
      joined_at:  new Date().toISOString(),
      profiles:   targetProfile ?? null,
    }
  }
}

export async function updateMemberRank(roomId: string, memberId: string, rank: MemberRank) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: room } = await supabase
    .from('rooms').select('owner_id, slug').eq('id', roomId).single()
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (room?.owner_id !== user.id && profile?.role !== 'admin') return { error: 'Sin permiso.' }

  const { error } = await supabase
    .from('room_members')
    .update({ rank, updated_at: new Date().toISOString() })
    .eq('room_id', roomId)
    .eq('user_id', memberId)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${room?.slug}/miembros`)
  return { success: true }
}

export async function removeRoomMember(roomId: string, memberId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: room } = await supabase
    .from('rooms').select('owner_id, slug').eq('id', roomId).single()
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const isOwner = room?.owner_id === user.id
  const isAdmin = profile?.role === 'admin'
  const isSelf  = memberId === user.id

  if (!isOwner && !isAdmin && !isSelf) return { error: 'Sin permiso.' }

  const { error } = await supabase
    .from('room_members')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', memberId)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${room?.slug}/miembros`)
  revalidatePath(`/salas/${room?.slug}`)
  return { success: true }
}

export async function getRoomMembers(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('room_members')
    .select('*, profiles(id, username, display_name, avatar_url, role, ultimo_acceso)')
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true })

  if (error) return []
  return data ?? []
}