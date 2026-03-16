'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.', supabase: null, user: null }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Sin permisos.', supabase: null, user: null }
  return { error: null, supabase, user }
}

// ── USUARIOS ──────────────────────────────────────────────

export async function changeUserRole(userId: string, role: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  
  console.log('Cambiando rol:', userId, role) // añadir
  
  const { error: dbError, data } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select() // añadir
    
  console.log('Resultado:', data, dbError) // añadir
  
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}


export async function banUser(userId: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('profiles').update({ status: 'banned', updated_at: new Date().toISOString() }).eq('id', userId)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}

export async function unbanUser(userId: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('profiles').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', userId)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}

// ── REPORTES ──────────────────────────────────────────────
export async function resolveReport(reportId: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('reports').update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString() }).eq('id', reportId)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}

export async function dismissReport(reportId: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('reports').update({ status: 'dismissed', resolved_by: user!.id, updated_at: new Date().toISOString() }).eq('id', reportId)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}

// ── DADOS ─────────────────────────────────────────────────
export async function createDice(name: string, faces: number, description: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { data, error: dbError } = await supabase.from('dice_types').insert({ name, faces, description: description || null }).select().single()
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { data }
}

export async function updateDice(id: string, name: string, faces: number, description: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('dice_types').update({ name, faces, description: description || null }).eq('id', id)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteDice(id: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('dice_types').delete().eq('id', id)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}

// ── ETIQUETAS ─────────────────────────────────────────────
export async function createTag(name: string, color: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { data, error: dbError } = await supabase.from('tags').insert({ name: name.trim(), color }).select().single()
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { data }
}

export async function updateTag(id: string, name: string, color: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('tags').update({ name: name.trim(), color }).eq('id', id)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteTag(id: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('tags').delete().eq('id', id)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}

// ── ANUNCIOS ──────────────────────────────────────────────
export async function createAnnouncement(title: string, content: string, authorId: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { data, error: dbError } = await supabase
    .from('announcements')
    .insert({ title: title.trim(), content: content.trim(), author_id: authorId })
    .select('*, profiles!announcements_author_id_fkey(username, display_name)')
    .single()
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  revalidatePath('/anuncios')
  return { data }
}

export async function updateAnnouncement(id: string, title: string, content: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase
    .from('announcements')
    .update({ title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() })
    .eq('id', id)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  revalidatePath('/anuncios')
  return { success: true }
}

export async function deleteAnnouncement(id: string) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('announcements').delete().eq('id', id)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  revalidatePath('/anuncios')
  return { success: true }
}

export async function togglePinAnnouncement(id: string, pinned: boolean) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }
  const { error: dbError } = await supabase.from('announcements').update({ is_pinned: pinned }).eq('id', id)
  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  revalidatePath('/anuncios')
  return { success: true }
}


// ── Añadir estas funciones al final de src/app/(main)/admin/actions.ts ──

export async function warnUser(userId: string, reportId: string, reason: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }

  // Enviar notificación de aviso al usuario
  const { error: notifError } = await supabase.from('notifications').insert({
    user_id: userId,
    type:    'warning',
    title:   '⚠ Has recibido un aviso',
    body:    `Un moderador te ha enviado un aviso. Motivo: ${reason}`,
    link:    '/normas',
  })
  if (notifError) return { error: notifError.message }

  // Marcar el reporte como resuelto
  const { error: repError } = await supabase
    .from('reports')
    .update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString(), notes: `Aviso enviado: ${reason}` })
    .eq('id', reportId)
  if (repError) return { error: repError.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function banUserFromReport(userId: string, reportId: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }

  // Banear usuario
  const { error: banError } = await supabase
    .from('profiles')
    .update({ status: 'banned', updated_at: new Date().toISOString() })
    .eq('id', userId)
  if (banError) return { error: banError.message }

  // Notificar al usuario
  await supabase.from('notifications').insert({
    user_id: userId,
    type:    'warning',
    title:   '🔨 Tu cuenta ha sido suspendida',
    body:    'Tu cuenta ha sido suspendida por un administrador. Contacta con el equipo si crees que es un error.',
    link:    '/normas',
  })

  // Resolver el reporte
  const { error: repError } = await supabase
    .from('reports')
    .update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString(), notes: 'Usuario baneado.' })
    .eq('id', reportId)
  if (repError) return { error: repError.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function banIpFromReport(userId: string, reportId: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }

  // Obtener la IP del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('last_ip, status')
    .eq('id', userId)
    .single()

  if (!profile?.last_ip) return { error: 'No hay IP registrada para este usuario.' }

  // Insertar en banned_ips
  const { error: ipError } = await supabase
    .from('banned_ips')
    .upsert({ ip_address: profile.last_ip, banned_by: user!.id, reason: 'Baneo desde panel de reportes' })
  if (ipError) return { error: ipError.message }

  // Banear también la cuenta
  await supabase
    .from('profiles')
    .update({ status: 'banned', updated_at: new Date().toISOString() })
    .eq('id', userId)

  // Resolver el reporte
  const { error: repError } = await supabase
    .from('reports')
    .update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString(), notes: `IP baneada: ${profile.last_ip}` })
    .eq('id', reportId)
  if (repError) return { error: repError.message }

  revalidatePath('/admin')
  return { success: true }
}


// ── MODERACIÓN DE SALAS ───────────────────────────────────

export async function warnRoomOwner(roomId: string, reportId: string, reason: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id, title')
    .eq('id', roomId)
    .single()

  if (!room) return { error: 'Sala no encontrada.' }

  await supabase.from('notifications').insert({
    user_id: room.owner_id,
    type:    'warning',
    title:   '⚠ Aviso sobre tu sala',
    body:    `Tu sala "${room.title}" ha recibido un aviso de moderación. Motivo: ${reason}`,
    link:    `/admin#reportes`,
  })

  await supabase
    .from('reports')
    .update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString(), notes: `Aviso enviado al director: ${reason}` })
    .eq('id', reportId)

  revalidatePath('/admin')
  return { success: true }
}

export async function closeRoomTemporarily(roomId: string, reportId: string, message: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id, title, slug')
    .eq('id', roomId)
    .single()

  if (!room) return { error: 'Sala no encontrada.' }

  await supabase
    .from('rooms')
    .update({
      status:             'paused',
      moderation_status:  'temp_closed',
      moderation_message: message || 'Esta sala ha sido cerrada temporalmente por el equipo de moderación.',
      moderated_by:       user!.id,
      moderated_at:       new Date().toISOString(),
    })
    .eq('id', roomId)

  await supabase.from('notifications').insert({
    user_id: room.owner_id,
    type:    'warning',
    title:   '🔒 Tu sala ha sido cerrada temporalmente',
    body:    `Tu sala "${room.title}" ha sido cerrada temporalmente. Motivo: ${message}`,
    link:    `/salas/${room.slug}`,
  })

  await supabase
    .from('reports')
    .update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString(), notes: `Sala cerrada temporalmente: ${message}` })
    .eq('id', reportId)

  revalidatePath('/admin')
  revalidatePath(`/salas/${room.slug}`)
  return { success: true }
}

export async function closeRoomPermanently(roomId: string, reportId: string, message: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id, title, slug')
    .eq('id', roomId)
    .single()

  if (!room) return { error: 'Sala no encontrada.' }

  await supabase
    .from('rooms')
    .update({
      status:             'closed',
      moderation_status:  'perm_closed',
      moderation_message: message || 'Esta sala ha sido cerrada permanentemente por el equipo de moderación.',
      moderated_by:       user!.id,
      moderated_at:       new Date().toISOString(),
    })
    .eq('id', roomId)

  await supabase.from('notifications').insert({
    user_id: room.owner_id,
    type:    'warning',
    title:   '🚫 Tu sala ha sido cerrada permanentemente',
    body:    `Tu sala "${room.title}" ha sido cerrada de forma permanente. Motivo: ${message}`,
    link:    `/salas/${room.slug}`,
  })

  await supabase
    .from('reports')
    .update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString(), notes: `Sala cerrada permanentemente: ${message}` })
    .eq('id', reportId)

  revalidatePath('/admin')
  revalidatePath(`/salas/${room.slug}`)
  return { success: true }
}

export async function deleteRoomFromReport(roomId: string, reportId: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id, title, slug')
    .eq('id', roomId)
    .single()

  if (!room) return { error: 'Sala no encontrada.' }

  await supabase
    .from('rooms')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', roomId)

  await supabase.from('notifications').insert({
    user_id: room.owner_id,
    type:    'warning',
    title:   '🗑 Tu sala ha sido eliminada',
    body:    `Tu sala "${room.title}" ha sido eliminada por el equipo de moderación.`,
    link:    '/salas',
  })

  await supabase
    .from('reports')
    .update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString(), notes: 'Sala eliminada.' })
    .eq('id', reportId)

  revalidatePath('/admin')
  revalidatePath('/salas')
  return { success: true }
}

export async function transferRoomOwnership(roomId: string, reportId: string, newOwnerUsername: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error || !supabase) return { error }

  const { data: newOwner } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', newOwnerUsername.trim())
    .single()

  if (!newOwner) return { error: `No se encontró el usuario "${newOwnerUsername}".` }

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id, title, slug')
    .eq('id', roomId)
    .single()

  if (!room) return { error: 'Sala no encontrada.' }

  await supabase
    .from('rooms')
    .update({ owner_id: newOwner.id })
    .eq('id', roomId)

  await supabase.from('notifications').insert([
    {
      user_id: newOwner.id,
      type:    'info',
      title:   '🎭 Ahora eres director de una sala',
      body:    `Se te ha transferido la dirección de la sala "${room.title}".`,
      link:    `/salas/${room.slug}`,
    },
    {
      user_id: room.owner_id,
      type:    'warning',
      title:   '⚠ Has perdido la dirección de tu sala',
      body:    `La dirección de tu sala "${room.title}" ha sido transferida a otro usuario por moderación.`,
      link:    `/salas/${room.slug}`,
    },
  ])

  await supabase
    .from('reports')
    .update({ status: 'resolved', resolved_by: user!.id, updated_at: new Date().toISOString(), notes: `Dirección transferida a: ${newOwnerUsername}` })
    .eq('id', reportId)

  revalidatePath('/admin')
  revalidatePath(`/salas/${room.slug}`)
  return { success: true }
}

export async function updateRoleColors(colors: Record<string, string>) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return { error }

  const rows = Object.entries(colors).map(([role, color]) => ({ role, color }))
  const { error: dbError } = await supabase
    .from('role_colors')
    .upsert(rows, { onConflict: 'role' })

  if (dbError) return { error: dbError.message }
  revalidatePath('/admin')
  return { success: true }
}