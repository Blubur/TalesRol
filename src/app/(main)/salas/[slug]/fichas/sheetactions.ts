'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const BASE_FIELDS = [
  { label: 'Nombre del personaje', type: 'text_short',    is_base: true,  position: 0 },
  { label: 'Avatar',               type: 'image_avatar',  is_base: true,  position: 1 },
  { label: 'Imagen de cabecera',   type: 'image_header',  is_base: true,  position: 2 },
  { label: 'Raza / Especie',       type: 'text_short',    is_base: true,  position: 3 },
  { label: 'Descripción',          type: 'text_long',     is_base: true,  position: 4 },
  { label: 'Historia',             type: 'text_long',     is_base: true,  position: 5 },
  { label: 'Vida',                 type: 'number',        is_base: true,  position: 6, min_value: 0, max_value: 100 },
]

async function isOwnerOrAdmin(supabase: any, roomId: string, userId: string) {
  const { data: room } = await supabase.from('rooms').select('owner_id').eq('id', roomId).single()
  if (room?.owner_id === userId) return true
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
  return profile?.role === 'admin'
}

export async function getOrCreateTemplate(roomId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: existing } = await supabase
    .from('room_sheet_templates')
    .select('id')
    .eq('room_id', roomId)
    .single()

  if (existing) return { templateId: existing.id }

  const allowed = await isOwnerOrAdmin(supabase, roomId, user.id)
  if (!allowed) return { error: 'Sin permiso para crear plantilla.' }

  const { data: template, error } = await supabase
    .from('room_sheet_templates')
    .insert({ room_id: roomId })
    .select('id')
    .single()

  if (error || !template) return { error: error?.message ?? 'Error al crear plantilla.' }

  await supabase.from('room_sheet_fields').insert(
    BASE_FIELDS.map(f => ({ ...f, template_id: template.id }))
  )

  return { templateId: template.id }
}

export async function addField(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const templateId = formData.get('template_id') as string
  const label      = (formData.get('label') as string)?.trim()
  const type       = formData.get('type') as string
  const slug       = formData.get('slug') as string
  const minValue   = formData.get('min_value') ? Number(formData.get('min_value')) : null
  const maxValue   = formData.get('max_value') ? Number(formData.get('max_value')) : null

  if (!label || label.length < 1) return { error: 'El campo necesita un nombre.' }

  const { data: template } = await supabase
    .from('room_sheet_templates')
    .select('room_id')
    .eq('id', templateId)
    .single()

  if (!template) return { error: 'Plantilla no encontrada.' }

  const allowed = await isOwnerOrAdmin(supabase, template.room_id, user.id)
  if (!allowed) return { error: 'Sin permiso.' }

  const { count } = await supabase
    .from('room_sheet_fields')
    .select('*', { count: 'exact', head: true })
    .eq('template_id', templateId)

  const { data: newField, error } = await supabase
    .from('room_sheet_fields')
    .insert({
      template_id: templateId,
      label,
      type,
      is_base:   false,
      position:  (count ?? 0),
      min_value: type === 'number' ? minValue : null,
      max_value: type === 'number' ? maxValue : null,
    })
    .select('id')
    .single()

  if (error || !newField) return { error: error?.message ?? 'Error al crear campo.' }

  revalidatePath(`/salas/${slug}/fichas/plantilla`)
  // Devolvemos el ID real para que el cliente lo use
  return { success: true, fieldId: newField.id }
}

export async function deleteField(fieldId: string, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: field } = await supabase
    .from('room_sheet_fields')
    .select('template_id')
    .eq('id', fieldId)
    .single()

  if (!field) return { error: 'Campo no encontrado.' }

  const { data: template } = await supabase
    .from('room_sheet_templates')
    .select('room_id')
    .eq('id', field.template_id)
    .single()

  if (!template) return { error: 'Plantilla no encontrada.' }

  const allowed = await isOwnerOrAdmin(supabase, template.room_id, user.id)
  if (!allowed) return { error: 'Sin permiso.' }

  await supabase.from('room_sheet_fields').delete().eq('id', fieldId)

  revalidatePath(`/salas/${slug}/fichas/plantilla`)
  return { success: true }
}

export async function saveSheetValues(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const roomId     = formData.get('room_id') as string
  const targetUser = formData.get('target_user_id') as string
  const slug       = formData.get('slug') as string

  const isSelf = user.id === targetUser
  const isPriv = await isOwnerOrAdmin(supabase, roomId, user.id)
  if (!isSelf && !isPriv) return { error: 'Sin permiso para editar esta ficha.' }

  let sheetId: string
  const { data: existing } = await supabase
    .from('room_sheets')
    .select('id')
    .eq('room_id', roomId)
    .eq('user_id', targetUser)
    .single()

  if (existing) {
    sheetId = existing.id
    await supabase.from('room_sheets').update({ updated_at: new Date().toISOString() }).eq('id', sheetId)
  } else {
    const { data: created, error } = await supabase
      .from('room_sheets')
      .insert({ room_id: roomId, user_id: targetUser })
      .select('id')
      .single()
    if (error || !created) return { error: error?.message ?? 'Error al crear ficha.' }
    sheetId = created.id
  }

  const entries = Array.from(formData.entries())
  const fieldMap: Record<string, { value_text?: string; value_num?: number; value_list?: any }> = {}

  for (const [key, val] of entries) {
    const matchText = key.match(/^field_([^_]+)_text$/)
    const matchNum  = key.match(/^field_([^_]+)_num$/)
    const matchList = key.match(/^field_([^_]+)_list$/)

    if (matchText) {
      fieldMap[matchText[1]] = { ...fieldMap[matchText[1]], value_text: val as string }
    } else if (matchNum) {
      fieldMap[matchNum[1]] = { ...fieldMap[matchNum[1]], value_num: Number(val) }
    } else if (matchList) {
      try { fieldMap[matchList[1]] = { ...fieldMap[matchList[1]], value_list: JSON.parse(val as string) } }
      catch {}
    }
  }

  for (const [fieldId, vals] of Object.entries(fieldMap)) {
    await supabase.from('room_sheet_values').upsert(
      { sheet_id: sheetId, field_id: fieldId, ...vals, updated_at: new Date().toISOString() },
      { onConflict: 'sheet_id,field_id' }
    )
  }

  revalidatePath(`/salas/${slug}/fichas`)
  revalidatePath(`/salas/${slug}/fichas/${targetUser}`)
  return { success: true }
}

export async function getSheet(roomId: string, userId: string) {
  const supabase = await createClient()

  const { data: sheet } = await supabase
    .from('room_sheets')
    .select('id, updated_at')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .single()

  if (!sheet) return { sheet: null, values: [] }

  const { data: values } = await supabase
    .from('room_sheet_values')
    .select('field_id, value_text, value_num, value_list')
    .eq('sheet_id', sheet.id)

  return { sheet, values: values ?? [] }
}