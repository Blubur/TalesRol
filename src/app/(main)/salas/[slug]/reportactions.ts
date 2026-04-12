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

  // Comprobar bloqueo automático por número de reportes
  const { data: maxRow } = await service
    .from('site_config').select('value').eq('key', 'max_reports_auto_block').single()
  const maxReports = parseInt(maxRow?.value ?? '0', 10)

  if (maxReports > 0) {
    const { count } = await service
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('target_post_id', postId)
      .eq('status', 'pending')

    if ((count ?? 0) >= maxReports) {
      // Bloquear automáticamente
      await service
        .from('posts')
        .update({ blocked_at: new Date().toISOString(), blocked_by: null })
        .eq('id', postId)

      // Notificar a moderadores
      const { data: staff } = await service
        .from('profiles').select('id').in('role', ['admin', 'master'])

      if (staff && staff.length > 0) {
        await service.from('notifications').insert(
          staff.map((s: { id: string }) => ({
            user_id: s.id,
            type:    'report',
            title:   '🔒 Post bloqueado automáticamente',
            body:    `Un post ha sido bloqueado al alcanzar ${maxReports} reportes. Revísalo en el panel.`,
            link:    `/salas/${slug}/${topicId}`,
          }))
        )
      }
    }
  }

  // Notificar a moderadores del nuevo reporte
  const { data: staff } = await service
    .from('profiles').select('id').in('role', ['admin', 'master'])

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

// ── BLOQUEAR POST ──────────────────────────────────────

export async function blockPost(postId: string, topicId: string, slug: string, roomId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const { data: room } = await supabase
    .from('rooms').select('owner_id').eq('id', roomId).single()

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

  await service.from('reports').insert({
    reporter_id:    user.id,
    target_post_id: postId,
    reason:         'Bloqueado por director/moderador',
    status:         'pending',
  })

  const { data: staff } = await service
    .from('profiles').select('id').in('role', ['admin', 'master'])

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

// ── DESBLOQUEAR POST ───────────────────────────────────

export async function unblockPost(postId: string, topicId: string, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

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

// ── REPORTAR USUARIO ───────────────────────────────────

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

  const { data: staff } = await service
    .from('profiles').select('id').in('role', ['admin', 'master'])

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
    .from('profiles').select('id').in('role', ['admin', 'master'])

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