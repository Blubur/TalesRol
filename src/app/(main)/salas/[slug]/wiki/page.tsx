import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

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
  const { slug } = await params
  const { q, cat } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: roomData } = await supabase
    .from('rooms').select('id, title, owner_id').eq('slug', slug).is('deleted_at', null).single()
  if (!roomData) notFound()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  const isOwner = user?.id === roomData.owner_id
  const isAdmin = profile?.role === 'admin'
  const { data: memberData } = user
    ? await supabase.from('room_members').select('rank').eq('room_id', roomData.id).eq('user_id', user.id).single()
    : { data: null }
  const canEdit = isOwner || isAdmin || memberData?.rank === 'codirector'

  // Buscar páginas
  let query = supabase
    .from('wiki_pages')
    .select('id, slug, title, excerpt, is_home, categories, updated_at, profiles!wiki_pages_last_editor_id_fkey(username, display_name)')
    .eq('room_id', roomData.id)
    .is('deleted_at', null)
    .order('is_home', { ascending: false })
    .order('updated_at', { ascending: false })

  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
  if (cat) query = query.contains('categories', [cat])

  const { data: pages } = await query

  // Todas las categorías únicas
  const allCats = [...new Set((pages ?? []).flatMap((p: any) => p.categories ?? []))].sort()

  // Página de inicio
  const homePage = (pages ?? []).find((p: any) => p.is_home)

  // Páginas sin portada
  const nonHomePages = (pages ?? []).filter((p: any) => !p.is_home || q || cat)

  // Agrupar por categoría (solo cuando no hay búsqueda activa)
  const grouped: Record<string, any[]> = {}
  if (!q && !cat) {
    for (const page of nonHomePages) {
      const cats: string[] = page.categories?.length ? page.categories : ['Sin categoría']
      for (const c of cats) {
        if (!grouped[c]) grouped[c] = []
        grouped[c].push(page)
      }
    }
    // Ordenar: primero categorías con nombre, luego "Sin categoría"
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (a === 'Sin categoría') return 1
      if (b === 'Sin categoría') return -1
      return a.localeCompare(b, 'es')
    })
    const sortedGrouped: Record<string, any[]> = {}
    for (const k of sortedKeys) sortedGrouped[k] = grouped[k]
    Object.assign(grouped, sortedGrouped)
  }

  const isEmpty = nonHomePages.length === 0 && !homePage

  return (
    <div className="wiki-index-page">

      {/* Header */}
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

      {/* Portada si existe */}
      {homePage && !q && !cat && (
        <Link href={`/salas/${slug}/wiki/${homePage.slug}`} className="wiki-home-card animate-enter" style={{ animationDelay: '0.05s' }}>
          <HomeIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
          <div className="wiki-home-info">
            <span className="wiki-home-title">{homePage.title}</span>
            {homePage.excerpt && <span className="wiki-home-excerpt">{homePage.excerpt}</span>}
          </div>
          <span className="wiki-home-badge">Portada</span>
        </Link>
      )}

      {/* Controles */}
      <div className="wiki-controls animate-enter" style={{ animationDelay: '0.08s' }}>
        <form className="wiki-search-wrap" method="get">
          <MagnifyingGlassIcon className="wiki-search-icon" />
          <input
            name="q"
            type="text"
            className="wiki-search"
            placeholder="Buscar en la wiki..."
            defaultValue={q ?? ''}
          />
          {cat && <input type="hidden" name="cat" value={cat} />}
        </form>

        {allCats.length > 0 && (
          <div className="wiki-cats">
            <Link href={`/salas/${slug}/wiki`} className={`wiki-cat-btn ${!cat ? 'active' : ''}`}>
              Todas
            </Link>
            {allCats.map(c => (
              <Link
                key={c}
                href={`/salas/${slug}/wiki?cat=${encodeURIComponent(c)}${q ? `&q=${q}` : ''}`}
                className={`wiki-cat-btn ${cat === c ? 'active' : ''}`}
              >
                <TagIcon style={{ width: 10, height: 10 }} /> {c}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      {isEmpty ? (
        <div className="wiki-empty animate-enter">
          <BookOpenIcon className="wiki-empty-icon" />
          <p>{q || cat ? 'No se encontraron páginas.' : 'Esta wiki está vacía.'}</p>
          {canEdit && !q && !cat && (
            <Link href={`/salas/${slug}/wiki/nueva`} className="btn-primary" style={{ marginTop: '1rem' }}>
              Crear la primera página
            </Link>
          )}
        </div>
      ) : (q || cat) ? (
        /* Vista plana para búsqueda/filtro por categoría */
        <div className="wiki-pages-list animate-enter" style={{ animationDelay: '0.12s' }}>
          {nonHomePages.map((page: any, i: number) => (
            <WikiPageRow key={page.id} page={page} slug={slug} i={i} />
          ))}
        </div>
      ) : (
        /* Vista agrupada por categoría */
        <div className="wiki-grouped animate-enter" style={{ animationDelay: '0.12s' }}>
          {Object.entries(grouped).map(([category, catPages], gi) => (
            <div key={category} className="wiki-category-group animate-enter" style={{ animationDelay: `${0.12 + gi * 0.04}s` }}>
              <div className="wiki-category-heading">
                <TagIcon style={{ width: 12, height: 12 }} />
                <span>{category}</span>
                <span className="wiki-category-count">{catPages.length}</span>
              </div>
              <div className="wiki-pages-list">
                {catPages.map((page: any, i: number) => (
                  <WikiPageRow key={page.id} page={page} slug={slug} i={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .wiki-index-page { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-5); }

        .wiki-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4); padding-bottom: var(--space-5); border-bottom: 1px solid var(--border-subtle); position: relative; }
        .wiki-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: var(--color-crimson); }
        .wiki-header-left { display: flex; align-items: center; gap: var(--space-4); }
        .wiki-header-icon { width: 28px; height: 28px; color: var(--color-crimson); }
        .wiki-header-actions { display: flex; gap: var(--space-2); align-items: center; }
        .wiki-title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; letter-spacing: 0.08em; margin: 0; }
        .wiki-sub { color: var(--text-muted); font-size: var(--text-sm); margin: var(--space-1) 0 0; }

        .wiki-home-card { display: flex; align-items: center; gap: var(--space-4); background: var(--color-crimson-subtle); border: 1px solid var(--color-crimson-glow); border-radius: var(--radius-md); padding: var(--space-4) var(--space-5); text-decoration: none; color: var(--text-primary); transition: all var(--transition-base); }
        .wiki-home-card:hover { border-color: var(--color-crimson); box-shadow: var(--shadow-crimson); }
        .wiki-home-card svg { color: var(--color-crimson); }
        .wiki-home-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .wiki-home-title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 600; letter-spacing: 0.03em; }
        .wiki-home-excerpt { font-size: var(--text-xs); color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .wiki-home-badge { font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.06em; color: var(--color-crimson); border: 1px solid var(--color-crimson-glow); border-radius: var(--radius-sm); padding: 0.15rem 0.5rem; flex-shrink: 0; }

        .wiki-controls { display: flex; flex-direction: column; gap: var(--space-3); }
        .wiki-search-wrap { position: relative; }
        .wiki-search-icon { position: absolute; left: var(--space-3); top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--text-muted); pointer-events: none; }
        .wiki-search { width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.6rem var(--space-4) 0.6rem 2.4rem; color: var(--text-primary); font-family: var(--font-body); font-size: var(--text-sm); outline: none; transition: border-color var(--transition-base); box-sizing: border-box; }
        .wiki-search:focus { border-color: var(--color-crimson); box-shadow: 0 0 0 3px var(--color-crimson-glow); }
        .wiki-search::placeholder { color: var(--text-muted); }

        .wiki-cats { display: flex; gap: var(--space-2); flex-wrap: wrap; }
        .wiki-cat-btn { display: flex; align-items: center; gap: var(--space-1); background: transparent; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.25rem 0.65rem; font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.05em; color: var(--text-muted); cursor: pointer; text-decoration: none; transition: all var(--transition-fast); }
        .wiki-cat-btn:hover { color: var(--text-primary); border-color: var(--border-medium); }
        .wiki-cat-btn.active { color: var(--color-crimson); border-color: var(--color-crimson); background: var(--color-crimson-subtle); }

        .wiki-empty { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); padding: var(--space-16); background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-muted); }
        .wiki-empty-icon { width: 40px; height: 40px; color: var(--border-medium); }
        .wiki-empty p { margin: 0; }

        /* Grupos por categoría */
        .wiki-grouped { display: flex; flex-direction: column; gap: var(--space-6); }
        .wiki-category-group { display: flex; flex-direction: column; gap: var(--space-2); }
        .wiki-category-heading { display: flex; align-items: center; gap: var(--space-2); padding-bottom: var(--space-2); border-bottom: 1px solid var(--border-subtle); position: relative; }
        .wiki-category-heading::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 40px; height: 1px; background: var(--color-crimson); }
        .wiki-category-heading svg { color: var(--color-crimson); flex-shrink: 0; }
        .wiki-category-heading span { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-secondary); }
        .wiki-category-count { font-family: var(--font-display); font-size: var(--text-xs); color: var(--text-muted); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.1rem 0.4rem; margin-left: auto; }

        /* Filas de páginas */
        .wiki-pages-list { display: flex; flex-direction: column; gap: var(--space-2); }
        .wiki-page-row { display: flex; align-items: center; gap: var(--space-4); background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-4) var(--space-5); text-decoration: none; transition: all var(--transition-base); position: relative; overflow: hidden; }
        .wiki-page-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--color-crimson); opacity: 0; transition: opacity var(--transition-base); }
        .wiki-page-row:hover { border-color: var(--border-medium); transform: translateX(3px); }
        .wiki-page-row:hover::before { opacity: 1; }
        .wiki-page-row-main { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
        .wiki-page-title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 600; color: var(--text-primary); letter-spacing: 0.03em; }
        .wiki-page-excerpt { font-size: var(--text-xs); color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .wiki-page-cats { display: flex; gap: var(--space-1); flex-wrap: wrap; margin-top: 2px; }
        .wiki-page-cat { font-size: 0.62rem; font-family: var(--font-display); letter-spacing: 0.05em; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.1rem 0.4rem; color: var(--text-muted); }
        .wiki-page-row-meta { display: flex; align-items: center; gap: var(--space-3); flex-shrink: 0; }
        .wiki-page-meta-item { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.03em; white-space: nowrap; }
        .wiki-page-arrow { color: var(--color-crimson); font-size: var(--text-sm); opacity: 0; transition: opacity var(--transition-base); }
        .wiki-page-row:hover .wiki-page-arrow { opacity: 1; }
      `}</style>
    </div>
  )
}

// Componente auxiliar para reutilizar la fila de página
function WikiPageRow({ page, slug, i }: { page: any; slug: string; i: number }) {
  return (
    <Link
      key={page.id}
      href={`/salas/${slug}/wiki/${page.slug}`}
      className="wiki-page-row animate-enter"
      style={{ animationDelay: `${0.12 + i * 0.03}s` }}
    >
      <div className="wiki-page-row-main">
        <span className="wiki-page-title">{page.title}</span>
        {page.excerpt && <span className="wiki-page-excerpt">{page.excerpt}</span>}
        {page.categories?.length > 0 && (
          <div className="wiki-page-cats">
            {page.categories.map((c: string) => (
              <span key={c} className="wiki-page-cat">{c}</span>
            ))}
          </div>
        )}
      </div>
      <div className="wiki-page-row-meta">
        <span className="wiki-page-meta-item">
          {page.profiles?.display_name || page.profiles?.username || '—'}
        </span>
        <span className="wiki-page-meta-item">
          {new Date(page.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className="wiki-page-arrow">→</span>
      </div>
    </Link>
  )
}