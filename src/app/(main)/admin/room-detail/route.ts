import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })

  const roomId = req.nextUrl.searchParams.get('roomId')
  if (!roomId) return NextResponse.json({ error: 'roomId requerido' }, { status: 400 })

  // Temas
  const { data: topicsData } = await supabase
    .from('topics')
    .select('id, title, is_locked, is_pinned, created_at, author:profiles!topics_author_id_fkey(username, display_name)')
    .eq('room_id', roomId)
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const topics = topicsData ?? []
  const topicIds = topics.map((t: any) => t.id)

  // Contar posts por tema
  const postCountMap: Record<string, number> = {}
  const hasBlockedMap: Record<string, boolean> = {}
  const lastPostMap: Record<string, any> = {}

  if (topicIds.length > 0) {
    const { data: postsData } = await supabase
      .from('posts')
      .select('id, topic_id, created_at, blocked_at, profiles!posts_author_id_fkey(username, display_name)')
      .in('topic_id', topicIds)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    ;(postsData ?? []).forEach((p: any) => {
      postCountMap[p.topic_id] = (postCountMap[p.topic_id] ?? 0) + 1
      if (p.blocked_at) hasBlockedMap[p.topic_id] = true
      if (!lastPostMap[p.topic_id]) {
        lastPostMap[p.topic_id] = { created_at: p.created_at, author: p.profiles }
      }
    })
  }

  const topicsWithData = topics.map((t: any) => ({
    ...t,
    post_count: postCountMap[t.id] ?? 0,
    has_blocked_posts: hasBlockedMap[t.id] ?? false,
    last_post: lastPostMap[t.id] ?? null,
  }))

  // Wikis
  const { data: wikisData } = await supabase
    .from('wiki_pages')
    .select('id, title, slug, updated_at, is_home, author:profiles!wiki_pages_author_id_fkey(username, display_name)')
    .eq('room_id', roomId)
    .is('deleted_at', null)
    .order('is_home', { ascending: false })
    .order('title', { ascending: true })

  // Miembros
  const { count: memberCount } = await supabase
    .from('room_participants')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId)

  return NextResponse.json({
    topics: topicsWithData,
    wikis: wikisData ?? [],
    memberCount: memberCount ?? 0,
  })
}