import { createClient } from '@supabase/supabase-js'

function service() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

let permCache: Record<string, string[]> | null = null
let permCacheTime = 0
const CACHE_TTL = 60_000 // 1 minuto

async function getPermissions(): Promise<Record<string, string[]>> {
  const now = Date.now()
  if (permCache && now - permCacheTime < CACHE_TTL) return permCache

  const { data } = await service()
    .from('site_config')
    .select('key, value')
    .like('key', 'perm_%')

  permCache = {}
  for (const row of data ?? []) {
    try {
      permCache[row.key] = JSON.parse(row.value)
    } catch {
      permCache[row.key] = []
    }
  }
  permCacheTime = now
  return permCache
}

export async function hasPermission(role: string, perm: string): Promise<boolean> {
  // admin siempre tiene todos los permisos
  if (role === 'admin') return true
  const perms = await getPermissions()
  const allowed = perms[perm] ?? []
  return allowed.includes(role)
}

export async function getAllPermissions(): Promise<Record<string, string[]>> {
  return getPermissions()
}

export function invalidatePermCache() {
  permCache = null
}