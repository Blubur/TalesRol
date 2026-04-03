'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Sin permisos')
}

// ─── PUNTOS POR POST ────────────────────────────────────────────────────────

export async function getPointsPerPost(): Promise<number> {
  const { data } = await service()
    .from('site_config').select('value').eq('key', 'points_per_post').single()
  return parseInt(data?.value ?? '5', 10)
}

export async function savePointsPerPost(points: number) {
  try {
    await assertAdmin()
    const { error } = await service()
      .from('site_config')
      .upsert({ key: 'points_per_post', value: String(points) }, { onConflict: 'key' })
    if (error) return { error: error.message }
    revalidatePath('/admin/config/puntos')
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

// ─── NIVELES ────────────────────────────────────────────────────────────────

export async function getLevels() {
  const { data } = await service()
    .from('levels').select('*').order('min_points', { ascending: true })
  return data ?? []
}

export async function saveLevel(level: { id?: number; name: string; min_points: number; icon: string }) {
  try {
    await assertAdmin()
    if (level.id) {
      const { error } = await service()
        .from('levels')
        .update({ name: level.name, min_points: level.min_points, icon: level.icon })
        .eq('id', level.id)
      if (error) return { error: error.message }
    } else {
      const { error } = await service()
        .from('levels')
        .insert({ name: level.name, min_points: level.min_points, icon: level.icon })
      if (error) return { error: error.message }
    }
    revalidatePath('/admin/config/puntos')
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteLevel(id: number) {
  try {
    await assertAdmin()
    const { error } = await service().from('levels').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/config/puntos')
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

// ─── BADGES ─────────────────────────────────────────────────────────────────

export const CONDITION_OPTIONS = [
  { key: 'posts_gte_1',       label: 'Posts publicados ≥ 1' },
  { key: 'posts_gte_10',      label: 'Posts publicados ≥ 10' },
  { key: 'posts_gte_50',      label: 'Posts publicados ≥ 50' },
  { key: 'posts_gte_100',     label: 'Posts publicados ≥ 100' },
  { key: 'posts_gte_500',     label: 'Posts publicados ≥ 500' },
  { key: 'characters_gte_1',  label: 'Personajes creados ≥ 1' },
  { key: 'rooms_gte_1',       label: 'Salas unidas ≥ 1' },
  { key: 'days_gte_30',       label: 'Días en la plataforma ≥ 30' },
  { key: 'days_gte_365',      label: 'Días en la plataforma ≥ 365' },
  { key: 'points_gte_100',    label: 'Puntos totales ≥ 100' },
  { key: 'points_gte_1000',   label: 'Puntos totales ≥ 1000' },
]

export async function getBadges() {
  const { data } = await service()
    .from('badges').select('*').order('condition_key', { ascending: true })
  return data ?? []
}

export async function saveBadge(badge: {
  id?: string
  name: string
  description: string
  icon_url: string
  condition_key: string
}) {
  try {
    await assertAdmin()
    if (badge.id) {
      const { error } = await service()
        .from('badges')
        .update({
          name: badge.name,
          description: badge.description,
          icon_url: badge.icon_url || null,
          condition_key: badge.condition_key,
        })
        .eq('id', badge.id)
      if (error) return { error: error.message }
    } else {
      const { error } = await service()
        .from('badges')
        .insert({
          name: badge.name,
          description: badge.description,
          icon_url: badge.icon_url || null,
          condition_key: badge.condition_key,
        })
      if (error) return { error: error.message }
    }
    revalidatePath('/admin/config/puntos')
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteBadge(id: string) {
  try {
    await assertAdmin()
    const { error } = await service().from('badges').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/config/puntos')
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

// ─── LÓGICA DE ASIGNACIÓN ───────────────────────────────────────────────────
// Llamar esta función después de cada post publicado

export async function awardPointsAndBadges(userId: string) {
  const db = service()

  // 1. Puntos por post
  const { data: configRow } = await db
    .from('site_config').select('value').eq('key', 'points_per_post').single()
  const pts = parseInt(configRow?.value ?? '5', 10)

  const { data: profile } = await db
    .from('profiles').select('points').eq('id', userId).single()
  const currentPoints = (profile?.points ?? 0) + pts

  // 2. Calcular nivel nuevo
  const { data: levels } = await db
    .from('levels').select('*').order('min_points', { ascending: false })
  const newLevel = (levels ?? []).find(l => currentPoints >= l.min_points)

  await db.from('profiles').update({
    points: currentPoints,
    ...(newLevel ? { level: newLevel.id } : {}),
  }).eq('id', userId)

  // 3. Comprobar badges
  const { data: allBadges } = await db.from('badges').select('*')
  const { data: earned }    = await db
    .from('user_badges').select('badge_id').eq('user_id', userId)
  const earnedKeys = new Set((earned ?? []).map((b: any) => b.badge_id))

  // Estadísticas del usuario para evaluar condiciones
  const { count: postCount }      = await db
    .from('posts').select('*', { count: 'exact', head: true })
    .eq('author_id', userId).is('deleted_at', null)
  const { count: charCount }      = await db
    .from('characters').select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  const { count: roomCount }      = await db
    .from('room_participants').select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  const { data: profileData }     = await db
    .from('profiles').select('created_at').eq('id', userId).single()
  const daysInPlatform = profileData
    ? Math.floor((Date.now() - new Date(profileData.created_at).getTime()) / 86400000)
    : 0

  function meetsCondition(key: string): boolean {
    const [metric, , threshold] = key.split('_')
    const n = parseInt(threshold, 10)
    if (key.startsWith('posts_gte_'))      return (postCount ?? 0) >= n
    if (key.startsWith('characters_gte_')) return (charCount ?? 0) >= n
    if (key.startsWith('rooms_gte_'))      return (roomCount ?? 0) >= n
    if (key.startsWith('days_gte_'))       return daysInPlatform >= n
    if (key.startsWith('points_gte_'))     return currentPoints >= n
    return false
  }

  const toAward = (allBadges ?? []).filter(
    b => !earnedKeys.has(b.condition_key) && meetsCondition(b.condition_key)
  )

  if (toAward.length > 0) {
    await db.from('user_badges').insert(
      toAward.map(b => ({
        user_id:    userId,
        badge_id:   b.condition_key,
        earned_at:  new Date().toISOString(),
        unlocked_at: new Date().toISOString(),
        is_visible: true,
      }))
    )
  }
}