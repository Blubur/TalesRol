'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'   // igual que en otras actions
import { revalidatePath } from 'next/cache'

// Lee el CSS activo (para el editor en el PA)
export async function getCustomCss(): Promise<string> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('custom_css')
    .select('css')
    .eq('id', 1)
    .single()
  return data?.css ?? ''
}

// Lee las últimas 20 versiones
export async function getCssVersions() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('custom_css_versions')
    .select('id, css, saved_at, saved_by')
    .order('saved_at', { ascending: false })
    .limit(20)
  return data ?? []
}

// Guarda el CSS y crea una versión
export async function saveCustomCss(css: string) {
  const supabase = await createClient()

  // Verificar que es admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Sin permisos' }

  const service = createServiceClient()

  // Guardar versión anterior antes de sobreescribir
  const { data: current } = await service
    .from('custom_css')
    .select('css')
    .eq('id', 1)
    .single()

  if (current?.css) {
    await service.from('custom_css_versions').insert({
      css: current.css,
      saved_by: user.id,
    })
    // Mantener solo las últimas 20 versiones
    const { data: versions } = await service
      .from('custom_css_versions')
      .select('id')
      .order('saved_at', { ascending: false })
    if (versions && versions.length > 20) {
      const toDelete = versions.slice(20).map((v) => v.id)
      await service.from('custom_css_versions').delete().in('id', toDelete)
    }
  }

  // Actualizar CSS activo
  const { error } = await service
    .from('custom_css')
    .update({ css, updated_at: new Date().toISOString(), updated_by: user.id })
    .eq('id', 1)

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')   // invalida toda la app para que el nuevo CSS se aplique
  return { ok: true }
}