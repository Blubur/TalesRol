'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function extractExcerpt(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim().slice(0, 200)
}

async function canEditWiki(supabase: any, roomId: string, userId: string): Promise<boolean> {
  const { data: room } = await supabase.from('rooms').select('owner_id').eq('id', roomId).single()
  if (room?.owner_id === userId) return true
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
  if (profile?.role === 'admin' || profile?.role === 'master') return true
  const { data: member } = await supabase
    .from('room_members')
    .select('rank')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .single()
  return member?.rank === 'codirector'
}

// ── Crear página ────────────────────────────────────────────

export async function createWikiPage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const roomId        = formData.get('room_id') as string
  const slug_param    = formData.get('slug') as string
  const title         = (formData.get('title') as string)?.trim()
  const contentRaw    = formData.get('content') as string
  const categoriesRaw = formData.get('categories') as string
  const isHome        = formData.get('is_home') === 'true'
  const roomSlug      = formData.get('room_slug') as string

  if (!title || title.length < 2) return { error: 'El título debe tener al menos 2 caracteres.' }

  const allowed = await canEditWiki(supabase, roomId, user.id)
  if (!allowed) return { error: 'Sin permiso para editar la wiki.' }

  const service    = getServiceClient()
  const content    = contentRaw || ''
  const excerpt    = extractExcerpt(content)
  const pageSlug   = slug_param?.trim() || toSlug(title)
  const categories = categoriesRaw
    ? categoriesRaw.split(',').map(c => c.trim()).filter(Boolean)
    : []

  if (isHome) {
    await service.from('wiki_pages').update({ is_home: false }).eq('room_id', roomId)
  }

  const { data: page, error } = await service
    .from('wiki_pages')
    .insert({
      room_id:        roomId,
      slug:           pageSlug,
      title,
      content,
      excerpt,
      is_home:        isHome,
      categories,
      author_id:      user.id,
      last_editor_id: user.id,
    })
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe una página con ese slug. Elige otro título.' }
    return { error: error.message }
  }

  await service.from('wiki_page_versions').insert({
    page_id:   page.id,
    content,
    title,
    editor_id: user.id,
  })

  revalidatePath(`/salas/${roomSlug}/wiki`)
  redirect(`/salas/${roomSlug}/wiki/${page.slug}`)
}

// ── Actualizar página ───────────────────────────────────────

export async function updateWikiPage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const pageId        = formData.get('page_id') as string
  const title         = (formData.get('title') as string)?.trim()
  const contentRaw    = formData.get('content') as string
  const categoriesRaw = formData.get('categories') as string
  const isHome        = formData.get('is_home') === 'true'
  const roomSlug      = formData.get('room_slug') as string
  const pageSlug      = formData.get('page_slug') as string

  if (!title || title.length < 2) return { error: 'El título debe tener al menos 2 caracteres.' }

  const { data: existingPage } = await supabase
    .from('wiki_pages').select('room_id, content, title').eq('id', pageId).single()
  if (!existingPage) return { error: 'Página no encontrada.' }

  const allowed = await canEditWiki(supabase, existingPage.room_id, user.id)
  if (!allowed) return { error: 'Sin permiso.' }

  const service    = getServiceClient()
  const content    = contentRaw || ''
  const excerpt    = extractExcerpt(content)
  const categories = categoriesRaw
    ? categoriesRaw.split(',').map(c => c.trim()).filter(Boolean)
    : []

  if (isHome) {
    await service.from('wiki_pages').update({ is_home: false }).eq('room_id', existingPage.room_id)
  }

  await service.from('wiki_pages').update({
    title,
    content,
    excerpt,
    is_home:        isHome,
    categories,
    last_editor_id: user.id,
    updated_at:     new Date().toISOString(),
  }).eq('id', pageId)

  if (content !== existingPage.content || title !== existingPage.title) {
    await service.from('wiki_page_versions').insert({
      page_id:   pageId,
      content,
      title,
      editor_id: user.id,
    })
  }

  revalidatePath(`/salas/${roomSlug}/wiki`)
  revalidatePath(`/salas/${roomSlug}/wiki/${pageSlug}`)
  redirect(`/salas/${roomSlug}/wiki/${pageSlug}`)
}

// ── Eliminar página (soft delete) ──────────────────────────

export async function deleteWikiPage(pageId: string, roomSlug: string, roomId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const allowed = await canEditWiki(supabase, roomId, user.id)
  if (!allowed) return { error: 'Sin permiso.' }

  const service = getServiceClient()
  await service.from('wiki_pages')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', pageId)

  revalidatePath(`/salas/${roomSlug}/wiki`)
  return { success: true }
}

// ── Eliminar múltiples páginas ──────────────────────────────

export async function deleteManyWikiPages(pageIds: string[], roomSlug: string, roomId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const allowed = await canEditWiki(supabase, roomId, user.id)
  if (!allowed) return { error: 'Sin permiso.' }

  if (!pageIds.length) return { error: 'No hay páginas seleccionadas.' }

  const service = getServiceClient()
  const { error } = await service.from('wiki_pages')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', pageIds)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${roomSlug}/wiki`)
  return { success: true, count: pageIds.length }
}

// ── Mover páginas de categoría ──────────────────────────────

export async function moveWikiPagesToCategory(
  pageIds: string[],
  newCategory: string,
  roomSlug: string,
  roomId: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const allowed = await canEditWiki(supabase, roomId, user.id)
  if (!allowed) return { error: 'Sin permiso.' }

  if (!pageIds.length) return { error: 'No hay páginas seleccionadas.' }

  const service = getServiceClient()
  const { error } = await service.from('wiki_pages')
    .update({
      categories: newCategory ? [newCategory] : [],
      updated_at: new Date().toISOString(),
    })
    .in('id', pageIds)

  if (error) return { error: error.message }

  revalidatePath(`/salas/${roomSlug}/wiki`)
  return { success: true }
}