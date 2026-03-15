'use server'

import { createClient } from '@/lib/supabase/server'

export async function updatePrivacy({
  characters,
  rooms,
  posts,
}: {
  characters: boolean
  rooms: boolean
  posts: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      privacy_characters: characters,
      privacy_rooms:      rooms,
      privacy_posts:      posts,
      updated_at:         new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}