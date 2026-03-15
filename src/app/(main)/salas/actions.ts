'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createRoom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  // Solo admins y directores pueden crear salas
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'director'].includes(profile.role)) {
    return { error: 'No tienes permiso para crear salas.' }
  }

  const title       = formData.get('title') as string
  const description = formData.get('description') as string
  const cover_url   = formData.get('cover_url') as string
  const tagsRaw     = formData.get('tags') as string

  if (!title || title.trim().length < 3) {
    return { error: 'El título debe tener al menos 3 caracteres.' }
  }

  // Generar slug desde el título
  const slug = title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  // Verificar slug único
  const { data: existing } = await supabase
    .from('rooms')
    .select('slug')
    .eq('slug', slug)
    .single()

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : []

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      title:       title.trim(),
      slug:        finalSlug,
      description: description?.trim() || null,
      cover_url:   cover_url?.trim() || null,
      owner_id:    user.id,
      tags,
      status:      'active',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/salas')
  redirect(`/salas/${data.slug}`)
}

export async function updateRoom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const id          = formData.get('id') as string
  const title       = formData.get('title') as string
  const description = formData.get('description') as string
  const cover_url   = formData.get('cover_url') as string
  const tagsRaw     = formData.get('tags') as string
  const status      = formData.get('status') as string

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id, slug')
    .eq('id', id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isOwner = room?.owner_id === user.id
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) {
    return { error: 'No tienes permiso para editar esta sala.' }
  }

  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : []

  const { error } = await supabase
    .from('rooms')
    .update({
      title:       title.trim(),
      description: description?.trim() || null,
      cover_url:   cover_url?.trim() || null,
      tags,
      status:      status || 'active',
      updated_at:  new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${room?.slug}`)
  revalidatePath('/salas')
  redirect(`/salas/${room?.slug}`)
}

export async function deleteRoom(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id, slug')
    .eq('id', id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (room?.owner_id !== user.id && profile?.role !== 'admin') {
    return { error: 'No tienes permiso.' }
  }

  await supabase
    .from('rooms')
    .update({ deleted_at: new Date().toISOString(), status: 'archived' })
    .eq('id', id)

  revalidatePath('/salas')
  redirect('/salas')
}

export async function changeRoomStatus(roomId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id, slug')
    .eq('id', roomId)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (room?.owner_id !== user.id && profile?.role !== 'admin') {
    return { error: 'No tienes permiso.' }
  }

  const { error } = await supabase
    .from('rooms')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', roomId)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${room?.slug}`)
  revalidatePath('/salas')
  return { success: true }
}