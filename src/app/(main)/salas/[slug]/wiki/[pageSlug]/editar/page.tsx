import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import WikiPageForm from '../../WikiPageForm'
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

export default async function EditarWikiPage({ params }: {
  params: Promise<{ slug: string; pageSlug: string }>
}) {
  const { slug, pageSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: roomData } = await supabase
    .from('rooms').select('id, title, owner_id').eq('slug', slug).is('deleted_at', null).single()
  if (!roomData) notFound()

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isOwner = user.id === roomData.owner_id
  const isAdmin = profile?.role === 'admin'
  const { data: memberData } = await supabase
    .from('room_members').select('rank').eq('room_id', roomData.id).eq('user_id', user.id).single()
  const canEdit = isOwner || isAdmin || memberData?.rank === 'codirector'
  if (!canEdit) redirect(`/salas/${slug}/wiki/${pageSlug}`)

  const { data: page } = await supabase
    .from('wiki_pages')
    .select('id, slug, title, content, categories, is_home')
    .eq('room_id', roomData.id)
    .eq('slug', pageSlug)
    .is('deleted_at', null)
    .single()
  if (!page) notFound()

  const { data: otherPages } = await supabase
    .from('wiki_pages')
    .select('slug, title')
    .eq('room_id', roomData.id)
    .is('deleted_at', null)
    .neq('slug', pageSlug)

  return (
    <div className="wiki-form-page">
      <div className="wiki-form-header animate-enter">
        <div className="wiki-form-header-left">
          <PencilSquareIcon className="wiki-form-header-icon" />
          <div>
            <h1 className="wiki-form-title">Editar página</h1>
            <p className="wiki-form-sub">{page.title}</p>
          </div>
        </div>
        <Link href={`/salas/${slug}/wiki/${pageSlug}`} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Cancelar
        </Link>
      </div>

      <WikiPageForm
        roomId={roomData.id}
        roomSlug={slug}
        page={page}
        otherPages={otherPages ?? []}
      />

      <style>{`
        .wiki-form-page { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6); }
        .wiki-form-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4); padding-bottom: var(--space-5); border-bottom: 1px solid var(--border-subtle); position: relative; }
        .wiki-form-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: var(--color-crimson); }
        .wiki-form-header-left { display: flex; align-items: center; gap: var(--space-4); }
        .wiki-form-header-icon { width: 28px; height: 28px; color: var(--color-crimson); }
        .wiki-form-title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; letter-spacing: 0.08em; margin: 0; }
        .wiki-form-sub { color: var(--text-muted); font-size: var(--text-sm); margin: var(--space-1) 0 0; }
      `}</style>
    </div>
  )
}