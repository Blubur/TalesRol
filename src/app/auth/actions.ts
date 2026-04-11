'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

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
  const db = service()

  const email       = formData.get('email') as string
  const password    = formData.get('password') as string
  const username    = formData.get('username') as string
  const displayName = formData.get('display_name') as string
  const inviteCode  = (formData.get('invite_code') as string)?.trim() ?? ''

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

  // Comprobar si el registro está abierto
  const { data: regOpenRow } = await db
    .from('site_config').select('value').eq('key', 'registration_open').single()
  if (regOpenRow?.value === 'false') {
    return { error: 'El registro está cerrado temporalmente.' }
  }

  // Comprobar modo invitación
  const { data: inviteOnlyRow } = await db
    .from('site_config').select('value').eq('key', 'invite_only').single()
  if (inviteOnlyRow?.value === 'true') {
    const { data: inviteCodeRow } = await db
      .from('site_config').select('value').eq('key', 'invite_code').single()
    const validCode = inviteCodeRow?.value?.trim() ?? ''
    if (!validCode) {
      return { error: 'El registro con invitación está activo pero no hay código configurado. Contacta con un administrador.' }
    }
    if (inviteCode !== validCode) {
      return { error: 'Código de invitación incorrecto.' }
    }
  }

  // Verificar username único
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

  // Esperar a que el trigger de Supabase cree el perfil
  await new Promise(r => setTimeout(r, 800))

  // Enviar notificación de bienvenida según el rol
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await db
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (profile) {
      const roleKey = `welcome_msg_${profile.role}`
      const { data: configRow } = await db
        .from('site_config').select('value').eq('key', roleKey).single()

      const welcomeMsg = configRow?.value?.trim()
      if (welcomeMsg) {
        await db.from('notifications').insert({
          user_id: profile.id,
          type:    'sistema',
          title:   '¡Bienvenido a TalesRol!',
          body:    welcomeMsg,
          link:    null,
        })
      }
    }
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