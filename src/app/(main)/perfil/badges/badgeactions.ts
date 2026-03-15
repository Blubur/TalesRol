'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/** Llamar tras crear un post, sala o personaje */
export async function awardPoints(action: 'post' | 'sala' | 'personaje') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.rpc('award_points_and_badges', {
    p_user_id: user.id,
    p_action: action,
  })
}

/** Obtener badges desbloqueados por un usuario */
export async function getUserBadges(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_badges')
    .select('*, badge_definitions(*)')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: true })
  return data ?? []
}

/** Obtener badges visibles (para perfil público) */
export async function getVisibleBadges(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_badges')
    .select('*, badge_definitions(*)')
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

  const { error } = await supabase
    .from('user_badges')
    .update({ is_visible: visible })
    .eq('user_id', user.id)
    .eq('badge_id', badgeId)

  if (error) return { error: error.message }

  revalidatePath(`/perfil/${user.id}`)
  revalidatePath('/perfil/badges')
  return { success: true }
}