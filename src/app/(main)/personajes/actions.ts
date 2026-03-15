'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCharacter(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const name        = formData.get('name') as string
  const description = formData.get('description') as string
  const avatar_url  = formData.get('avatar_url') as string

  if (!name || name.trim().length < 2) {
    return { error: 'El nombre debe tener al menos 2 caracteres.' }
  }

  // Parsear campos de ficha dinámica
  const sheetKeys   = formData.getAll('sheet_key') as string[]
  const sheetValues = formData.getAll('sheet_value') as string[]
  const sheet: Record<string, string> = {}
  sheetKeys.forEach((k, i) => {
    if (k.trim()) sheet[k.trim()] = sheetValues[i] ?? ''
  })

  const { data, error } = await supabase
    .from('characters')
    .insert({
      user_id:     user.id,
      name:        name.trim(),
      description: description?.trim() || null,
      avatar_url:  avatar_url?.trim() || null,
      sheet,
      is_active:   true,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/personajes')
  redirect(`/personajes/${data.id}`)
}

export async function updateCharacter(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const id          = formData.get('id') as string
  const name        = formData.get('name') as string
  const description = formData.get('description') as string
  const avatar_url  = formData.get('avatar_url') as string

  if (!name || name.trim().length < 2) {
    return { error: 'El nombre debe tener al menos 2 caracteres.' }
  }

  // Verificar que el personaje pertenece al usuario
  const { data: existing } = await supabase
    .from('characters')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!existing || existing.user_id !== user.id) {
    return { error: 'No tienes permiso para editar este personaje.' }
  }

  const sheetKeys   = formData.getAll('sheet_key') as string[]
  const sheetValues = formData.getAll('sheet_value') as string[]
  const sheet: Record<string, string> = {}
  sheetKeys.forEach((k, i) => {
    if (k.trim()) sheet[k.trim()] = sheetValues[i] ?? ''
  })

  const { error } = await supabase
    .from('characters')
    .update({
      name:        name.trim(),
      description: description?.trim() || null,
      avatar_url:  avatar_url?.trim() || null,
      sheet,
      updated_at:  new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/personajes/${id}`)
  revalidatePath('/personajes')
  redirect(`/personajes/${id}`)
}

export async function deleteCharacter(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: existing } = await supabase
    .from('characters')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!existing || existing.user_id !== user.id) {
    return { error: 'No tienes permiso para eliminar este personaje.' }
  }

  // Soft delete
  const { error } = await supabase
    .from('characters')
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/personajes')
  redirect('/personajes')
}

export async function toggleCharacterActive(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { error } = await supabase
    .from('characters')
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/personajes')
  return { success: true }
}