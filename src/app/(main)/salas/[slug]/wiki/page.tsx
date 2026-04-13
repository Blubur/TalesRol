import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpenIcon, ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import WikiIndexClient from './WikiIndexClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('rooms').select('title').eq('slug', slug).single()
  return { title: `Wiki — ${data?.title ?? 'Sala'}` }
}

export default async function WikiIndexPage({ params, searchParams }: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; cat?: string }>
}) {
  const { slug }   = await params
  const { q, cat } = await searchParams

  // Comprobar si la wiki está habilitada globalmente
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: configRow } = await db
    .from('site_config').select('value').eq('key', 'wiki_enabled').single()
  if (configRow?.value === 'false') redirect(`/salas/${slug}`)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: roomData } = await supabase
    .from('rooms').select('id, title, owner_id').eq('slug', slug).is('deleted_at', null).single()
  if (!roomData) notFound()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  const isOwner  = user?.id === roomData.owner_id
  const isAdmin  = profile?.role === 'admin'
  const isMaster = profile?.role === 'master'

  const { data: memberData } = user
    ? await supabase.from('room_members').select('rank').eq('room_id', roomData.id).eq('user_id', user.id).single()
    : { data: null }

  const canEdit     = isOwner || isAdmin || memberData?.rank === 'codirector'
  const canModerate = isOwner || isAdmin || isMaster

  const { data: pagesData } = await supabase
    .from('wiki_pages')
    .select('id, slug, title, excerpt, is_home, categories, updated_at, profiles!wiki_pages_last_editor_id_fkey(username, display_name)')
    .eq('room_id', roomData.id)
    .is('deleted_at', null)
    .order('is_home', { ascending: false })
    .order('updated_at', { ascending: false })

  const pages    = (pagesData ?? []) as any[]
  const homePage = pages.find(p => p.is_home) ?? null
  const allCats  = [...new Set(pages.flatMap((p: any) => p.categories ?? []))].sort() as string[]

  return (
    <div className="wiki-index-page">
      <div className="wiki-header animate-enter">
        <div className="wiki-header-left">
          <BookOpenIcon className="wiki-header-icon" />
          <div>
            <h1 className="wiki-title">Wiki</h1>
            <p className="wiki-sub">{roomData.title}</p>
          </div>
        </div>
        <div className="wiki-header-actions">
          <Link href={`/salas/${slug}`} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Volver a la sala
          </Link>
          {canEdit && (
            <Link href={`/salas/${slug}/wiki/nueva`} className="btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <PlusIcon style={{ width: 14, height: 14 }} /> Nueva página
            </Link>
          )}
        </div>
      </div>

      <WikiIndexClient
        pages={pages}
        slug={slug}
        roomId={roomData.id}
        canModerate={canModerate}
        allCats={allCats}
        initialQ={q ?? ''}
        initialCat={cat ?? ''}
        homePage={homePage}
      />

      <style>{`
        .wiki-index-page { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-5); }
        .wiki-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4); padding-bottom: var(--space-5); border-bottom: 1px solid var(--border-subtle); position: relative; }
        .wiki-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: var(--color-crimson); }
        .wiki-header-left { display: flex; align-items: center; gap: var(--space-4); }
        .wiki-header-icon { width: 28px; height: 28px; color: var(--color-crimson); }
        .wiki-header-actions { display: flex; gap: var(--space-2); align-items: center; }
        .wiki-title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; letter-spacing: 0.08em; margin: 0; }
        .wiki-sub { color: var(--text-muted); font-size: var(--text-sm); margin: var(--space-1) 0 0; }
      `}</style>
    </div>
  )
}