'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Crear evento ──────────────────────────────────────────────────────────────

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'master'].includes(profile.role))
    return { error: 'Sin permisos' }

  const title       = formData.get('title') as string
  const description = formData.get('description') as string | null
  const type        = formData.get('type') as string
  const starts_at   = formData.get('starts_at') as string
  const ends_at     = formData.get('ends_at') as string | null
  const room_id     = formData.get('room_id') as string | null

  if (!title?.trim()) return { error: 'El título es obligatorio' }
  if (!starts_at)     return { error: 'La fecha de inicio es obligatoria' }

  const { error } = await supabase.from('events').insert({
    title:       title.trim(),
    description: description?.trim() || null,
    type:        type || 'sesion',
    starts_at,
    ends_at:     ends_at || null,
    room_id:     room_id || null,
    created_by:  user.id,
    status:      'programado',
  })

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

// ── Editar evento ─────────────────────────────────────────────────────────────

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'master'].includes(profile.role))
    return { error: 'Sin permisos' }

  const id          = formData.get('id') as string
  const title       = formData.get('title') as string
  const description = formData.get('description') as string | null
  const type        = formData.get('type') as string
  const status      = formData.get('status') as string
  const starts_at   = formData.get('starts_at') as string
  const ends_at     = formData.get('ends_at') as string | null
  const room_id     = formData.get('room_id') as string | null

  const { error } = await supabase.from('events').update({
    title:       title.trim(),
    description: description?.trim() || null,
    type,
    status,
    starts_at,
    ends_at:  ends_at || null,
    room_id:  room_id || null,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

// ── Eliminar evento (soft delete) ─────────────────────────────────────────────

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'master'].includes(profile.role))
    return { error: 'Sin permisos' }

  const { error } = await supabase
    .from('events')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

// ── Apuntarse / desapuntarse ──────────────────────────────────────────────────

export async function joinEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para apuntarte' }

  const { error } = await supabase
    .from('event_participants')
    .insert({ event_id: eventId, user_id: user.id })

  if (error?.code === '23505') return { error: 'Ya estás apuntado' }
  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function leaveEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('event_participants')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true }
}