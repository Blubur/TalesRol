'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

// ── Crear evento ──────────────────────────────────────────────
export async function createEvent(data: {
  room_id: string
  slug: string
  title: string
  description?: string
  starts_at: string
  ends_at?: string
  topic_id?: string
}) {
  const supabase = createServiceClient()
  const { data: { user } } = await (await createClient()).auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { error } = await supabase.from('session_events').insert({
    room_id: data.room_id,
    created_by: user.id,
    title: data.title,
    description: data.description ?? null,
    starts_at: data.starts_at,
    ends_at: data.ends_at ?? null,
    topic_id: data.topic_id ?? null,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/salas/${data.slug}/calendario`)
}

// ── Editar evento ─────────────────────────────────────────────
export async function updateEvent(data: {
  id: string
  slug: string
  title: string
  description?: string
  starts_at: string
  ends_at?: string
  topic_id?: string
}) {
  const supabase = createServiceClient()

  const { error } = await supabase.from('session_events').update({
    title: data.title,
    description: data.description ?? null,
    starts_at: data.starts_at,
    ends_at: data.ends_at ?? null,
    topic_id: data.topic_id ?? null,
    updated_at: new Date().toISOString(),
  }).eq('id', data.id)

  if (error) throw new Error(error.message)
  revalidatePath(`/salas/${data.slug}/calendario`)
}

// ── Eliminar evento ───────────────────────────────────────────
export async function deleteEvent(id: string, slug: string) {
  const supabase = createServiceClient()

  const { error } = await supabase.from('session_events').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath(`/salas/${data.slug}/calendario`)
}

// ── RSVP ─────────────────────────────────────────────────────
export async function upsertRsvp(
  event_id: string,
  slug: string,
  status: 'yes' | 'no' | 'maybe'
) {
  const supabase = createServiceClient()
  const { data: { user } } = await (await createClient()).auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { error } = await supabase.from('session_rsvps').upsert({
    event_id,
    user_id: user.id,
    status,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'event_id,user_id' })

  if (error) throw new Error(error.message)
  revalidatePath(`/salas/${slug}/calendario`)
}