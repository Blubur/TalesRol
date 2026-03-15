import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersClient from './UsersClient'

export const metadata = { title: 'Usuarios — TalesRol' }

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: usersData } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, role, level, points, status, created_at, ultimo_acceso')
    .order('ultimo_acceso', { ascending: false })

  // Contar posts por usuario
  const { data: postCounts } = await supabase
    .from('posts')
    .select('author_id')
    .is('deleted_at', null)

  const postCountMap: Record<string, number> = {}
  postCounts?.forEach((p: any) => {
    postCountMap[p.author_id] = (postCountMap[p.author_id] ?? 0) + 1
  })

  // Contar badges por usuario
  const { data: badgeCounts } = await supabase
    .from('user_badges')
    .select('user_id')

  const badgeCountMap: Record<string, number> = {}
  badgeCounts?.forEach((b: any) => {
    badgeCountMap[b.user_id] = (badgeCountMap[b.user_id] ?? 0) + 1
  })

  const users = (usersData ?? []).map(u => ({
    ...u,
    post_count: postCountMap[u.id] ?? 0,
    badge_count: badgeCountMap[u.id] ?? 0,
  }))

  return <UsersClient users={users} currentUserId={user.id} />
}