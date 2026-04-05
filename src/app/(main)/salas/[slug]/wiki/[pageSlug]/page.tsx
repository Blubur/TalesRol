import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import WikiDeleteButton from '../WikiDeleteButton'
import WikiTOC from '../WikiTOC'
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  ClockIcon,
  TagIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; pageSlug: string }> }) {
  const { pageSlug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('wiki_pages').select('title').eq('slug', pageSlug).single()
  return { title: `${data?.title ?? 'Wiki'} — Wiki` }
}

function buildTOC(html: string): { id: string; level: number; text: string }[] {
  const toc: { id: string; level: number; text: string }[] = []
  const regex = /<h([123])[^>]*>(.*?)<\/h[123]>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]*>/g, '').trim()
    const id = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').slice(0, 50)
    toc.push({ id, level, text })
  }
  return toc
}

function injectHeadingIds(html: string): string {
  return html.replace(/<h([123])([^>]*)>(.*?)<\/h[123]>/gi, (_, level, attrs, inner) => {
    const text = inner.replace(/<[^>]*>/g, '').trim()
    const id = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').slice(0, 50)
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
  })
}

export default async function WikiPageDetail({ params }: {
  params: Promise<{ slug: string; pageSlug: string }>
}) {
  const { slug, pageSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: roomData } = await supabase
    .from('rooms').select('id, title, owner_id').eq('slug', slug).is('deleted_at', null).single()
  if (!roomData) notFound()

  const { data: page } = await supabase
    .from('wiki_pages')
    .select('*, author:profiles!wiki_pages_author_id_fkey(username, display_name), editor:profiles!wiki_pages_last_editor_id_fkey(username, display_name)')
    .eq('room_id', roomData.id)
    .eq('slug', pageSlug)
    .is('deleted_at', null)
    .single()

  if (!page) notFound()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  const isOwner = user?.id === roomData.owner_id
  const isAdmin = profile?.role === 'admin'
  const { data: memberData } = user
    ? await supabase.from('room_members').select('rank').eq('room_id', roomData.id).eq('user_id', user!.id).single()
    : { data: null }
  const canEdit = isOwner || isAdmin || memberData?.rank === 'codirector'

  // Otras páginas de la wiki para el sidebar
  const { data: allPages } = await supabase
    .from('wiki_pages')
    .select('slug, title')
    .eq('room_id', roomData.id)
    .is('deleted_at', null)
    .neq('slug', pageSlug)
    .order('title', { ascending: true })

  // Historial (últimas 5 versiones)
  const { data: versions } = await supabase
    .from('wiki_page_versions')
    .select('id, title, created_at, profiles!wiki_page_versions_editor_id_fkey(username, display_name)')
    .eq('page_id', page.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const toc = buildTOC(page.content)
  const contentWithIds = injectHeadingIds(page.content)
  const hasSidebar = (allPages ?? []).length > 0 || (versions ?? []).length > 0

  return (
    <div className="wiki-detail-page">

      {/* Header */}
      <div className="wiki-detail-header animate-enter">
        <div className="wiki-detail-header-left">
          <Link href={`/salas/${slug}/wiki`} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Wiki
          </Link>
          {page.is_home && <span className="wiki-home-pill">Portada</span>}
        </div>
        {canEdit && (
          <div className="wiki-detail-actions">
            <Link href={`/salas/${slug}/wiki/${pageSlug}/editar`} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <PencilSquareIcon style={{ width: 14, height: 14 }} /> Editar
            </Link>
            <WikiDeleteButton pageId={page.id} roomSlug={slug} roomId={roomData.id} />
          </div>
        )}
      </div>

      <div className={`wiki-detail-layout ${!hasSidebar ? 'no-sidebar' : ''}`}>

        {/* Contenido principal */}
        <div className="wiki-detail-main">
          <h1 className="wiki-detail-title animate-enter">{page.title}</h1>

          {/* Meta */}
          <div className="wiki-detail-meta animate-enter" style={{ animationDelay: '0.05s' }}>
            <span className="wiki-meta-item">
              <ClockIcon style={{ width: 12, height: 12 }} />
              Editado {new Date(page.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              {page.editor && ` por ${page.editor.display_name || page.editor.username}`}
            </span>
            {page.categories?.length > 0 && (
              <div className="wiki-meta-cats">
                {page.categories.map((c: string) => (
                  <Link key={c} href={`/salas/${slug}/wiki?cat=${encodeURIComponent(c)}`} className="wiki-meta-cat">
                    <TagIcon style={{ width: 10, height: 10 }} /> {c}
                  </Link>
                ))}
              </div>
            )}
          </div>

          

          {/* Contenido de la página */}
          <div
            className="wiki-content animate-enter"
            style={{ animationDelay: '0.1s' }}
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />
        </div>

        {/* Sidebar */}
        {hasSidebar && (
          <aside className="wiki-detail-sidebar">

            {/* TOC flotante del sidebar (componente cliente con scroll spy, solo si hay 3+ headings) */}
            {toc.length >= 3 && (
              <WikiTOC content={page.content} />
            )}

            {/* Otras páginas */}
            {(allPages ?? []).length > 0 && (
              <div className="wiki-sidebar-block animate-enter" style={{ animationDelay: '0.15s' }}>
                <h3 className="wiki-sidebar-title">Otras páginas</h3>
                <div className="wiki-sidebar-links">
                  {(allPages ?? []).map((p: any) => (
                    <Link key={p.slug} href={`/salas/${slug}/wiki/${p.slug}`} className="wiki-sidebar-link">
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Historial */}
            {(versions ?? []).length > 0 && (
              <div className="wiki-sidebar-block animate-enter" style={{ animationDelay: '0.2s' }}>
                <h3 className="wiki-sidebar-title">Historial</h3>
                <div className="wiki-sidebar-versions">
                  {(versions ?? []).map((v: any, i: number) => (
                    <div key={v.id} className={`wiki-version ${i === 0 ? 'current' : ''}`}>
                      <span className="wiki-version-title">{v.title}</span>
                      <span className="wiki-version-meta">
                        {v.profiles?.display_name || v.profiles?.username} · {new Date(v.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                      {i === 0 && <span className="wiki-version-badge">Actual</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      <style>{`
        .wiki-detail-page { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-5); }

        .wiki-detail-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); }
        .wiki-detail-header-left { display: flex; align-items: center; gap: var(--space-3); }
        .wiki-detail-actions { display: flex; gap: var(--space-2); align-items: center; }
        .wiki-home-pill { font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.06em; color: var(--color-crimson); border: 1px solid var(--color-crimson-glow); border-radius: var(--radius-sm); padding: 0.15rem 0.5rem; }

        .wiki-detail-layout { display: grid; grid-template-columns: 1fr 240px; gap: var(--space-8); align-items: start; }
        .wiki-detail-layout.no-sidebar { grid-template-columns: 1fr; }

        .wiki-detail-title { font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 700; letter-spacing: 0.06em; margin: 0 0 var(--space-3); color: var(--text-primary); }

        .wiki-detail-meta { display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-3); padding-bottom: var(--space-4); border-bottom: 1px solid var(--border-subtle); margin-bottom: var(--space-5); }
        .wiki-meta-item { display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.03em; }
        .wiki-meta-cats { display: flex; gap: var(--space-1); flex-wrap: wrap; }
        .wiki-meta-cat { display: flex; align-items: center; gap: 3px; font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.05em; color: var(--text-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.1rem 0.4rem; text-decoration: none; transition: all var(--transition-fast); }
        .wiki-meta-cat:hover { color: var(--color-crimson); border-color: var(--color-crimson-glow); }

        .wiki-toc { background: var(--bg-card); border: 1px solid var(--border-subtle); border-left: 3px solid var(--color-crimson); border-radius: var(--radius-md); padding: var(--space-4) var(--space-5); margin-bottom: var(--space-5); }
        .wiki-toc-title { display: flex; align-items: center; gap: var(--space-2); font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: var(--space-3); }
        .wiki-toc-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: var(--space-1); }
        .wiki-toc-item { padding: 0; }
        .wiki-toc-item.level-2 { padding-left: var(--space-4); }
        .wiki-toc-item.level-3 { padding-left: var(--space-8); }
        .wiki-toc-link { font-size: var(--text-sm); color: var(--text-secondary); text-decoration: none; transition: color var(--transition-fast); font-family: var(--font-body); }
        .wiki-toc-link:hover { color: var(--color-crimson); }

        .wiki-content { font-family: var(--font-body); font-size: var(--text-md); line-height: 1.8; color: var(--text-primary); }
        .wiki-content h1 { font-family: var(--font-display); font-size: var(--text-2xl); color: var(--color-crimson); margin: 1.5em 0 0.5em; letter-spacing: 0.05em; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.3em; }
        .wiki-content h2 { font-family: var(--font-display); font-size: var(--text-xl); color: var(--color-warning); margin: 1.3em 0 0.4em; letter-spacing: 0.04em; }
        .wiki-content h3 { font-family: var(--font-display); font-size: var(--text-lg); margin: 1.1em 0 0.3em; }
        .wiki-content p { margin: 0 0 1em; }
        .wiki-content ul, .wiki-content ol { padding-left: 1.5em; margin: 0 0 1em; }
        .wiki-content li { margin-bottom: 0.3em; }
        .wiki-content blockquote { border-left: 3px solid var(--color-crimson); padding-left: 1em; color: var(--text-secondary); font-style: italic; margin: 1em 0; }
        .wiki-content a { color: var(--color-crimson); text-decoration: underline; text-underline-offset: 3px; }
        .wiki-content img { max-width: 100%; border-radius: var(--radius-md); margin: 1em 0; }
        .wiki-content hr { border: none; border-top: 1px solid var(--border-subtle); margin: 1.5em 0; }
        .wiki-content strong { color: var(--text-primary); }

        .wiki-detail-sidebar { display: flex; flex-direction: column; gap: var(--space-4); position: sticky; top: var(--space-8); }
        .wiki-sidebar-block { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-4); }
        .wiki-sidebar-title { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); margin: 0 0 var(--space-3); }
        .wiki-sidebar-links { display: flex; flex-direction: column; gap: var(--space-1); }
        .wiki-sidebar-link { font-size: var(--text-sm); color: var(--text-secondary); text-decoration: none; padding: 0.3rem 0.5rem; border-radius: var(--radius-sm); transition: all var(--transition-fast); border-left: 2px solid transparent; }
        .wiki-sidebar-link:hover { color: var(--color-crimson); border-left-color: var(--color-crimson); background: var(--color-crimson-subtle); padding-left: 0.75rem; }

        .wiki-sidebar-versions { display: flex; flex-direction: column; gap: var(--space-2); }
        .wiki-version { display: flex; flex-direction: column; gap: 2px; padding: var(--space-2) 0; border-bottom: 1px solid var(--border-subtle); position: relative; }
        .wiki-version:last-child { border-bottom: none; }
        .wiki-version-title { font-size: var(--text-xs); color: var(--text-primary); font-family: var(--font-display); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .wiki-version-meta { font-size: 0.65rem; color: var(--text-muted); }
        .wiki-version-badge { font-size: 0.6rem; font-family: var(--font-display); letter-spacing: 0.05em; color: var(--color-success); border: 1px solid var(--color-success-border); border-radius: var(--radius-sm); padding: 0.1rem 0.3rem; width: fit-content; }

        @media (max-width: 768px) {
          .wiki-detail-layout { grid-template-columns: 1fr; }
          .wiki-detail-sidebar { position: static; }
        }
      `}</style>
    </div>
  )
}