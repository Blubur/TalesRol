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

/**
 * Obtener badges de un usuario.
 * user_badges.badge_id puede ser:
 *   - condition_key (ej: "posts_gte_1") para badges automáticas
 *   - UUID para badges manuales
 * Por eso no hacemos join directo — cargamos por separado y unimos en JS.
 */
export async function getUserBadges(userId: string) {
  const db = service()

  const { data: userBadges } = await db
    .from('user_badges')
    .select('badge_id, is_visible, unlocked_at, earned_at')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: true })

  if (!userBadges || userBadges.length === 0) return []

  const { data: allBadges } = await db
    .from('badges')
    .select('id, name, description, icon_url, category, color, is_manual, condition_key')

  if (!allBadges) return []

  return userBadges.map(ub => {
    const badge = allBadges.find(
      b => b.condition_key === ub.badge_id || b.id === ub.badge_id
    )
    return {
      badge_id:    ub.badge_id,
      is_visible:  ub.is_visible,
      unlocked_at: ub.unlocked_at ?? ub.earned_at,
      badges:      badge ?? null,
    }
}).filter(ub => ub.badges != null) as {
    badge_id: string
    is_visible: boolean
    unlocked_at: string
    badges: {
      id: string
      name: string
      description: string
      icon_url: string | null
      category: string
      color: string
      is_manual: boolean
      condition_key: string
    }
  }[]}

/** Obtener badges visibles (para perfil público) */
export async function getVisibleBadges(userId: string) {
  const all = await getUserBadges(userId)
  return all.filter(b => b.is_visible)
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