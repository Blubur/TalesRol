'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import DOMPurify from 'isomorphic-dompurify'

// En topicactions.ts, reemplaza la función sanitize por esta:

function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr', 'span', 'div', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'style', 'target', 'data-verified', 'data-total', 'data-dice'],
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: false,
  })
}

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── TEMAS ──────────────────────────────────────────────

export async function createTopic(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const room_id      = formData.get('room_id') as string
  const title        = formData.get('title') as string
  const starterRaw   = formData.get('starter') as string
  const character_id = formData.get('character_id') as string || null

  if (!title || title.trim().length < 3) {
    return { error: 'El título debe tener al menos 3 caracteres.' }
  }

  const starter = starterRaw ? sanitize(starterRaw) : null

  const { data, error } = await supabase
    .from('topics')
    .insert({
      room_id,
      title:        title.trim(),
      starter,
      author_id:    user.id,
      character_id: character_id || null,
    })
    .select('*, rooms(slug)')
    .single()

  if (error) return { error: error.message }

  const slug = (data.rooms as { slug: string } | null)?.slug
  revalidatePath(`/salas/${slug}`)
  redirect(`/salas/${slug}/${data.id}`)
}

export async function updateTopic(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const id         = formData.get('id') as string
  const title      = formData.get('title') as string
  const starterRaw = formData.get('starter') as string
  const slug       = formData.get('slug') as string

  const { data: topic } = await supabase
    .from('topics')
    .select('author_id')
    .eq('id', id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (topic?.author_id !== user.id && profile?.role !== 'admin') {
    return { error: 'No tienes permiso para editar este tema.' }
  }

  const starter = starterRaw ? sanitize(starterRaw) : null

  await supabase
    .from('topics')
    .update({ title: title.trim(), starter, updated_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath(`/salas/${slug}/${id}`)
  redirect(`/salas/${slug}/${id}`)
}

export async function deleteTopic(id: string, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: topic } = await supabase.from('topics').select('author_id').eq('id', id).single()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (topic?.author_id !== user.id && profile?.role !== 'admin') {
    return { error: 'No tienes permiso.' }
  }

  await supabase.from('topics').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(`/salas/${slug}`)
  redirect(`/salas/${slug}`)
}

// ── POSTS ──────────────────────────────────────────────

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const topic_id     = formData.get('topic_id') as string
  const contentRaw   = formData.get('content') as string
  const character_id = formData.get('character_id') as string || null
  const slug         = formData.get('slug') as string

  if (!contentRaw || contentRaw.trim() === '<p><br></p>' || contentRaw.replace(/<[^>]*>/g, '').trim().length < 1) {
    return { error: 'El post no puede estar vacío.' }
  }

  const content = sanitize(contentRaw)

  const { error } = await supabase
    .from('posts')
    .insert({
      topic_id,
      author_id:    user.id,
      character_id: character_id || null,
      content,
    })

  if (error) return { error: error.message }

  revalidatePath(`/salas/${slug}/${topic_id}`)
  return { success: true, redirect: `/salas/${slug}/${topic_id}` }
}

export async function updatePost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const id         = formData.get('id') as string
  const contentRaw = formData.get('content') as string
  const topic_id   = formData.get('topic_id') as string
  const slug       = formData.get('slug') as string

  const { data: post } = await supabase.from('posts').select('author_id').eq('id', id).single()
  if (post?.author_id !== user.id) return { error: 'No tienes permiso.' }

  const content = sanitize(contentRaw)

  const service = getServiceClient()
  const { error } = await service
    .from('posts')
    .update({ content, edited_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${slug}/${topic_id}`)
  return { success: true, redirect: `/salas/${slug}/${topic_id}` }
}

export async function deletePost(id: string, topic_id: string, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: post } = await supabase.from('posts').select('author_id').eq('id', id).single()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (post?.author_id !== user.id && profile?.role !== 'admin') {
    return { error: 'No tienes permiso.' }
  }

  const service = getServiceClient()
  const { error } = await service
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${slug}/${topic_id}`)
  return { success: true }
}

// ── SALA: actualizar descripción con HTML ──────────────

export async function updateRoomDescription(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const id          = formData.get('id') as string
  const slug        = formData.get('slug') as string
  const title       = formData.get('title') as string
  const descRaw     = formData.get('description') as string
  const cover_url   = formData.get('cover_url') as string
  const tagsRaw     = formData.get('tags') as string
  const status      = formData.get('status') as string

  const { data: room } = await supabase.from('rooms').select('owner_id').eq('id', id).single()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (room?.owner_id !== user.id && profile?.role !== 'admin') {
    return { error: 'No tienes permiso.' }
  }

  const description = descRaw ? sanitize(descRaw) : null
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []

  const service = getServiceClient()
  const { error } = await service
    .from('rooms')
    .update({ title: title?.trim(), description, cover_url: cover_url?.trim() || null, tags, status: status || 'active', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${slug}`)
  revalidatePath('/salas')
  redirect(`/salas/${slug}`)
}