import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CalendarView from './CalendarView'

export default async function CalendarioPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()

  // Sala
  const { data: room } = await supabase
    .from('rooms')
    .select('id, name, slug')
    .eq('slug', params.slug)
    .single()

  if (!room) notFound()

  // Usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  // Perfil + rol
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  // Eventos con RSVP y temas enlazados
  const { data: events } = await supabase
    .from('session_events')
    .select(`
      id, title, description, starts_at, ends_at, topic_id, created_by,
      profiles!created_by (username),
      topics (id, title, slug),
      session_rsvps (user_id, status)
    `)
    .eq('room_id', room.id)
    .order('starts_at', { ascending: true })

  // Temas de la sala para el selector del modal
  const { data: topics } = await supabase
    .from('topics')
    .select('id, title, slug')
    .eq('room_id', room.id)
    .order('created_at', { ascending: false })

  const canManage = profile?.role === 'admin' ||
    profile?.role === 'master' ||
    profile?.role === 'director'

  return (
    <CalendarView
      events={events ?? []}
      topics={topics ?? []}
      room={room}
      profile={profile}
      canManage={canManage}
      slug={params.slug}
    />
  )
}