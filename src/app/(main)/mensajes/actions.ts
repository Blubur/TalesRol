'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { CONDITION_OPTIONS } from './puntosConstants'

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

export async function getBadges() {
  const { data } = await service()
    .from('badges').select('*').order('is_manual', { ascending: true }).order('name')
  return data ?? []
}

export async function saveBadge(badge: {
  id?: string
  name: string
  description: string
  icon_url: string
  condition_key: string
  is_manual: boolean
}) {
  try {
    await assertAdmin()
    const payload = {
      name:          badge.name,
      description:   badge.description,
      icon_url:      badge.icon_url || null,
      condition_key: badge.is_manual ? 'manual' : badge.condition_key,
      is_manual:     badge.is_manual,
    }
    if (badge.id) {
      const { error } = await service().from('badges').update(payload).eq('id', badge.id)
      if (error) return { error: error.message }
    } else {
      const { error } = await service().from('badges').insert(payload)
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
    await service().from('user_badges').delete().eq('badge_id', id)
    const { error } = await service().from('badges').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/config/puntos')
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

// ─── BADGES MANUALES — ASIGNACIÓN ───────────────────────────────────────────

export async function getManualBadges() {
  const { data } = await service()
    .from('badges')
    .select('id, name, description, icon_url')
    .eq('is_manual', true)
    .order('name')
  return data ?? []
}

export async function assignBadgeToUser(userId: string, badgeId: string) {
  try {
    await assertAdmin()
    const { data: existing } = await service()
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single()
    if (existing) return { error: 'El usuario ya tiene esta insignia.' }
    const { error } = await service().from('user_badges').insert({
      user_id:     userId,
      badge_id:    badgeId,
      earned_at:   new Date().toISOString(),
      unlocked_at: new Date().toISOString(),
      is_visible:  true,
    })
    if (error) return { error: error.message }
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function revokeBadgeFromUser(userId: string, badgeId: string) {
  try {
    await assertAdmin()
    const { error } = await service()
      .from('user_badges')
      .delete()
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
    if (error) return { error: error.message }
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function searchUsersForBadge(query: string) {
  if (!query || query.trim().length < 2) return []
  const { data } = await service()
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(10)
  return data ?? []
}

export async function getUserBadges(userId: string) {
  const { data } = await service()
    .from('user_badges')
    .select('badge_id, earned_at, badges(id, name, description, icon_url, is_manual)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
  return data ?? []
}

// ─── LÓGICA DE ASIGNACIÓN AUTOMÁTICA ────────────────────────────────────────

export async function awardPointsAndBadges(userId: string) {
  const db = service()

  // Comprobar si las insignias están habilitadas globalmente
  const { data: badgesEnabledRow } = await db
    .from('site_config').select('value').eq('key', 'badges_enabled').single()
  if (badgesEnabledRow?.value === 'false') return

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
  const newLevel = (levels ?? []).find((l: any) => currentPoints >= l.min_points)

  await db.from('profiles').update({
    points: currentPoints,
    ...(newLevel ? { level: newLevel.id } : {}),
  }).eq('id', userId)

  // 3. Comprobar badges automáticas únicamente
  const { data: allBadges } = await db
    .from('badges').select('*').eq('is_manual', false)
  const { data: earned } = await db
    .from('user_badges').select('badge_id').eq('user_id', userId)
  const earnedKeys = new Set((earned ?? []).map((b: any) => b.badge_id))

  const { count: postCount } = await db
    .from('posts').select('*', { count: 'exact', head: true })
    .eq('author_id', userId).is('deleted_at', null)
  const { count: charCount } = await db
    .from('characters').select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  const { count: roomCount } = await db
    .from('room_participants').select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  const { data: profileData } = await db
    .from('profiles').select('created_at').eq('id', userId).single()
  const daysInPlatform = profileData
    ? Math.floor((Date.now() - new Date(profileData.created_at).getTime()) / 86400000)
    : 0

  function meetsCondition(key: string): boolean {
    if (!key || key === 'manual') return false
    const parts = key.split('_')
    const n = parseInt(parts[parts.length - 1], 10)
    if (key.startsWith('posts_gte_'))      return (postCount ?? 0) >= n
    if (key.startsWith('characters_gte_')) return (charCount ?? 0) >= n
    if (key.startsWith('rooms_gte_'))      return (roomCount ?? 0) >= n
    if (key.startsWith('days_gte_'))       return daysInPlatform >= n
    if (key.startsWith('points_gte_'))     return currentPoints >= n
    return false
  }

  const toAward = (allBadges ?? []).filter(
    (b: any) => !earnedKeys.has(b.condition_key) && meetsCondition(b.condition_key)
  )

  if (toAward.length > 0) {
    await db.from('user_badges').insert(
      toAward.map((b: any) => ({
        user_id:     userId,
        badge_id:    b.condition_key,
        earned_at:   new Date().toISOString(),
        unlocked_at: new Date().toISOString(),
        is_visible:  true,
      }))
    )
  }
}