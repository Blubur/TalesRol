'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** Obtener badges desbloqueados por un usuario */
export async function getUserBadges(userId: string) {
  const { data } = await service()
    .from('user_badges')
    .select(`
      badge_id,
      is_visible,
      unlocked_at,
      badges (
        id,
        name,
        description,
        icon_url,
        category,
        color,
        is_manual,
        condition_key
      )
    `)
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: true })
  return data ?? []
}

/** Obtener badges visibles (para perfil público) */
export async function getVisibleBadges(userId: string) {
  const { data } = await service()
    .from('user_badges')
    .select(`
      badge_id,
      is_visible,
      unlocked_at,
      badges (
        id,
        name,
        description,
        icon_url,
        category,
        color,
        is_manual,
        condition_key
      )
    `)
    .eq('user_id', userId)
    .eq('is_visible', true)
    .order('unlocked_at', { ascending: true })
  return data ?? []
}

/** Cambiar visibilidad de un badge */
export async function toggleBadgeVisibility(badgeId: string, visible: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { error } = await service()
    .from('user_badges')
    .update({ is_visible: visible })
    .eq('user_id', user.id)
    .eq('badge_id', badgeId)

  if (error) return { error: error.message }

  revalidatePath('/perfil/badges')
  return { success: true }
}