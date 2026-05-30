'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function login(formData: FormData) {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos.' }
  }

  let shouldRedirect = false

  try {
    const supabase = await createClient()

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
    shouldRedirect = true
  } catch (e: unknown) {
    // next/navigation redirect lanza una excepción interna — hay que dejarla pasar
    const msg = e instanceof Error ? e.message : ''
    if (msg === 'NEXT_REDIRECT' || (e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
      throw e
    }
    console.error('[login] unexpected error:', e)
    return { error: 'Error interno del servidor. Inténtalo de nuevo.' }
  }

  if (shouldRedirect) {
    redirect('/')
  }
}

export async function register(formData: FormData) {
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

  let shouldRedirect = false

  try {
    const supabase = await createClient()
    const db = service()

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
    shouldRedirect = true
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg === 'NEXT_REDIRECT' || (e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
      throw e
    }
    console.error('[register] unexpected error:', e)
    return { error: 'Error interno del servidor. Inténtalo de nuevo.' }
  }

  if (shouldRedirect) {
    redirect('/')
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg === 'NEXT_REDIRECT' || (e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
      throw e
    }
    console.error('[logout] unexpected error:', e)
  }
  redirect('/auth/login')
}




// ─── Recuperar contraseña (envía email) ───────────────────────────────────────
export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Introduce tu correo electrónico.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: 'No se pudo enviar el correo. Verifica la dirección e inténtalo de nuevo.' }
  }

  return { success: true }
}

// ─── Restablecer contraseña (con token del email) ─────────────────────────────
export async function resetPassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!password || password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  if (password !== confirm) {
    return { error: 'Las contraseñas no coinciden.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'No se pudo actualizar la contraseña. El enlace puede haber expirado.' }
  }

  redirect('/')
}