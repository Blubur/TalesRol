'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email o contraseña incorrectos.' }
    }
    return { error: error.message }
  }

  // Actualizar ultimo_acceso
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase
      .from('profiles')
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq('id', user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email       = formData.get('email') as string
  const password    = formData.get('password') as string
  const username    = formData.get('username') as string
  const displayName = formData.get('display_name') as string

  if (!email || !password || !username) {
    return { error: 'Email, nombre de usuario y contraseña son requeridos.' }
  }

  if (username.length < 3 || username.length > 20) {
    return { error: 'El nombre de usuario debe tener entre 3 y 20 caracteres.' }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: 'El nombre de usuario solo puede contener letras, números y guiones bajos.' }
  }

  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }

  // Verificar si el username ya existe
  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existing) {
    return { error: 'Ese nombre de usuario ya está en uso.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName || username,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Ese email ya está registrado.' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}