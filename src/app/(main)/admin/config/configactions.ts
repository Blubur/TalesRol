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

// Lee todos los valores de config como objeto plano
export async function getAllConfig(): Promise<Record<string, string>> {
  const { data } = await service()
    .from('site_config')
    .select('key, value')
  return Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
}

// Guarda uno o varios valores
export async function saveConfig(entries: Record<string, string>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { error: 'Sin permisos' }

  const rows = Object.entries(entries).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  }))

  const { error } = await service()
    .from('site_config')
    .upsert(rows, { onConflict: 'key' })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}