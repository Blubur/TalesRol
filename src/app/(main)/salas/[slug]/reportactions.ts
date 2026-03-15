'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── REPORTAR POST ──────────────────────────────────────

export async function reportPost(postId: string, reason: string, topicId: string, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const service = getServiceClient()

  const { error: reportError } = await service
    .from('reports')
    .insert({
      reporter_id:    user.id,
      target_post_id: postId,
      reason,
      status:         'pending',
    })

  if (reportError) return { error: reportError.message }

  // Notificar a moderadores y admins
  const { data: staff } = await service
    .from('profiles')
    .select('id')
    .in('role', ['admin', 'master'])

  if (staff && staff.length > 0) {
    await service.from('notifications').insert(
      staff.map((s: { id: string }) => ({
        user_id: s.id,
        type:    'report',
        title:   '⚠ Nuevo reporte de post',
        body:    `Un usuario ha reportado un post. Motivo: ${reason}`,
        link:    `/salas/${slug}/${topicId}`,
      }))
    )
  }

  return { success: true }
}

// ── BLOQUEAR POST (director de sala, moderador, admin) ─

export async function blockPost(postId: string, topicId: string, slug: string, roomId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Comprobar si es owner de la sala o moderador/admin
  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id')
    .eq('id', roomId)
    .single()

  const isRoomOwner = room?.owner_id === user.id
  const isModerator = ['master', 'admin'].includes(profile?.role ?? '')

  if (!isRoomOwner && !isModerator) {
    return { error: 'No tienes permiso para bloquear posts.' }
  }

  const service = getServiceClient()

  const { error } = await service
    .from('posts')
    .update({ blocked_at: new Date().toISOString(), blocked_by: user.id })
    .eq('id', postId)

  if (error) return { error: error.message }

  // Reporte automático para que moderación lo revise
  await service.from('reports').insert({
    reporter_id:    user.id,
    target_post_id: postId,
    reason:         'Bloqueado por director/moderador',
    status:         'pending',
  })

  // Notificar a moderadores y admins
  const { data: staff } = await service
    .from('profiles')
    .select('id')
    .in('role', ['admin', 'master'])

  if (staff && staff.length > 0) {
    await service.from('notifications').insert(
      staff.map((s: { id: string }) => ({
        user_id: s.id,
        type:    'report',
        title:   '🔒 Post bloqueado en sala',
        body:    `Un director/moderador ha bloqueado un post para revisión.`,
        link:    `/salas/${slug}/${topicId}`,
      }))
    )
  }

  return { success: true }
}

// ── DESBLOQUEAR POST (moderador, admin) ────────────────

export async function unblockPost(postId: string, topicId: string, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!['master', 'admin'].includes(profile?.role ?? '')) {
    return { error: 'No tienes permiso para desbloquear posts.' }
  }

  const service = getServiceClient()

  const { error } = await service
    .from('posts')
    .update({ blocked_at: null, blocked_by: null })
    .eq('id', postId)

  if (error) return { error: error.message }

  return { success: true }
}


// ── REPORTAR USUARIO ──────────────────────────────────────

export async function reportUser(targetUserId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }
  if (user.id === targetUserId) return { error: 'No puedes reportarte a ti mismo.' }

  const service = getServiceClient()

  const { error: reportError } = await service
    .from('reports')
    .insert({
      reporter_id:    user.id,
      target_user_id: targetUserId,
      reason,
      status:         'pending',
    })

  if (reportError) return { error: reportError.message }

  // Notificar a moderadores y admins
  const { data: staff } = await service
    .from('profiles')
    .select('id')
    .in('role', ['admin', 'master'])

  if (staff && staff.length > 0) {
    await service.from('notifications').insert(
      staff.map((s: { id: string }) => ({
        user_id: s.id,
        type:    'report',
        title:   '⚠ Nuevo reporte de usuario',
        body:    `Un usuario ha sido reportado. Motivo: ${reason}`,
        link:    `/admin#reportes`,
      }))
    )
  }

  return { success: true }
}


// ── REPORTAR SALA ──────────────────────────────────────

export async function reportRoom(roomId: string, slug: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const service = getServiceClient()

  const { error: reportError } = await service
    .from('reports')
    .insert({
      reporter_id:    user.id,
      target_room_id: roomId,
      reason,
      status:         'pending',
    })

  if (reportError) return { error: reportError.message }

  const { data: staff } = await service
    .from('profiles')
    .select('id')
    .in('role', ['admin', 'master'])

  if (staff && staff.length > 0) {
    await service.from('notifications').insert(
      staff.map((s: { id: string }) => ({
        user_id: s.id,
        type:    'report',
        title:   '⚠ Nuevo reporte de sala',
        body:    `Una sala ha sido reportada. Motivo: ${reason}`,
        link:    `/salas/${slug}`,
      }))
    )
  }

  return { success: true }
}