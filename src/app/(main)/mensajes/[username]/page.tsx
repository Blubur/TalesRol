import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getOrCreateConversation } from '../actions'
import ConversationClient from './ConversationClient'

export default async function ConversationPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Obtener o crear conversación
  const result = await getOrCreateConversation(username)
  if (result.error) notFound()

  const conversationId = result.conversationId!

  // Cargar perfiles
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .eq('id', user.id)
    .single()

  const { data: otherProfile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .eq('username', username)
    .single()

  if (!currentProfile || !otherProfile) notFound()

  // Cargar mensajes iniciales
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(100)

  return (
    <ConversationClient
      conversationId={conversationId}
      currentUserId={user.id}
      currentProfile={currentProfile}
      otherProfile={otherProfile}
      initialMessages={messages ?? []}
    />
  )
}