'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { hasPermission } from '@/lib/permissions'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function checkMessagesEnabled(): Promise<boolean> {
  const db = getServiceClient()
  const { data } = await db
    .from('site_config').select('value').eq('key', 'messages_enabled').single()
  return data?.value !== 'false'
}

export async function getOrCreateConversation(otherUsername: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  // Comprobar si los mensajes están habilitados globalmente
  if (!await checkMessagesEnabled()) {
    return { error: 'Los mensajes privados están desactivados temporalmente.' }
  }

  const { data: myProfile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!myProfile || !await hasPermission(myProfile.role, 'perm_messages')) {
    return { error: 'No tienes permiso para enviar mensajes privados.' }
  }

  const { data: otherProfile } = await supabase
    .from('profiles').select('id').eq('username', otherUsername).single()

  if (!otherProfile) return { error: 'Usuario no encontrado.' }
  if (otherProfile.id === user.id) return { error: 'No puedes enviarte mensajes a ti mismo.' }

  const service = getServiceClient()

  const { data: existing } = await service
    .from('conversations')
    .select('id')
    .or(`and(user_a.eq.${user.id},user_b.eq.${otherProfile.id}),and(user_a.eq.${otherProfile.id},user_b.eq.${user.id})`)
    .single()

  if (existing) return { conversationId: existing.id }

  const { data: newConv, error } = await service
    .from('conversations')
    .insert({ user_a: user.id, user_b: otherProfile.id })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { conversationId: newConv.id }
}

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  if (!await checkMessagesEnabled()) {
    return { error: 'Los mensajes privados están desactivados temporalmente.' }
  }

  const { data: myProfile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!myProfile || !await hasPermission(myProfile.role, 'perm_messages')) {
    return { error: 'No tienes permiso para enviar mensajes privados.' }
  }

  const conversation_id = formData.get('conversation_id') as string
  const content         = (formData.get('content') as string)?.trim()
  const image_url       = (formData.get('image_url') as string)?.trim() || null

  if (!content && !image_url) return { error: 'El mensaje no puede estar vacío.' }
  if (content && content.length > 2000) return { error: 'Mensaje demasiado largo (máx. 2000 caracteres).' }

  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id, sender_id: user.id, content: content || '', image_url })

  if (error) return { error: error.message }

  revalidatePath('/mensajes')
  return { success: true }
}

export async function deleteMessage(messageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const service = getServiceClient()
  const { error } = await service
    .from('messages')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', messageId)
    .eq('sender_id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function markAsRead(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id)
    .is('read_at', null)
}