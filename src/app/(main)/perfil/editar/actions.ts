'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const display_name = (formData.get('display_name') as string)?.trim() || null
  const bio          = (formData.get('bio') as string)?.trim() || null
  const avatar_url   = (formData.get('avatar_url') as string)?.trim() || null
  const banner_url   = (formData.get('banner_url') as string)?.trim() || null

  const { error } = await supabase
    .from('profiles')
    .update({ display_name, bio, avatar_url, banner_url, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }

  // Obtener username para redirigir al perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  revalidatePath(`/perfil/${profile?.username}`)
  redirect(`/perfil/${profile?.username}`)
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const password        = formData.get('password') as string
  const passwordConfirm = formData.get('password_confirm') as string

  if (!password || password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }
  if (password !== passwordConfirm) {
    return { error: 'Las contraseñas no coinciden.' }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  return { success: true }
}