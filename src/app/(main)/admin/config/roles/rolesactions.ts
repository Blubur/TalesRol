'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { invalidatePermCache } from '@/lib/permissions'

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

export async function getRolePermissions(): Promise<Record<string, string[]>> {
  const { data } = await service()
    .from('site_config')
    .select('key, value')
    .like('key', 'perm_%')

  const result: Record<string, string[]> = {}
  for (const row of data ?? []) {
    try {
      result[row.key] = JSON.parse(row.value)
    } catch {
      result[row.key] = []
    }
  }
  return result
}

export async function saveRolePermissions(permissions: Record<string, string[]>) {
  try {
    await assertAdmin()

    const rows = Object.entries(permissions).map(([key, roles]) => ({
      key,
      value: JSON.stringify(roles),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await service()
      .from('site_config')
      .upsert(rows, { onConflict: 'key' })

    if (error) return { error: error.message }

    invalidatePermCache()
    revalidatePath('/admin/config/roles')
    return { ok: true }
  } catch (e: any) {
    return { error: e.message }
  }
}