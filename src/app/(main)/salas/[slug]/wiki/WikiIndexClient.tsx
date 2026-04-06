'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  TrashIcon,
  PencilIcon,
  TagIcon,
  CheckIcon,
  XMarkIcon,
  FolderArrowDownIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { deleteManyWikiPages, moveWikiPagesToCategory } from './wikiactions'

interface WikiPage {
  id: string
  slug: string
  title: string
  excerpt: string | null
  is_home: boolean
  categories: string[]
  updated_at: string
  profiles: { username: string; display_name: string | null } | null
}

interface Props {
  pages: WikiPage[]
  slug: string          // room slug
  roomId: string
  canModerate: boolean
  allCats: string[]
  initialQ?: string
  initialCat?: string
  homePage: WikiPage | null
}

export default function WikiIndexClient({
  pages,
  slug,
  roomId,
  canModerate,
  allCats,
  initialQ = '',
  initialCat = '',
  homePage,
}: Props) {
  const [q, setQ]                   = useState(initialQ)
  const [cat, setCat]               = useState(initialCat)
  const [selected, setSelected]     = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [moveTarget, setMoveTarget] = useState('')
  const [showMove, setShowMove]     = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // ── Filtrado local ────────────────────────────────────────
  const nonHomePages = pages.filter(p => !p.is_home)

  const filtered = nonHomePages.filter(p => {
    const matchQ   = !q   || p.title.toLowerCase().includes(q.toLowerCase()) || (p.excerpt ?? '').toLowerCase().includes(q.toLowerCase())
    const matchCat = !cat || p.categories.includes(cat)
    return matchQ && matchCat
  })

  // Agrupar por categoría (solo sin filtros activos)
  const grouped: Record<string, WikiPage[]> = {}
  if (!q && !cat) {
    for (const page of filtered) {
      // Cada página va solo al grupo de su PRIMERA categoría para evitar duplicados
      const primaryCat = page.categories?.length ? page.categories[0] : 'Sin categoría'
      if (!grouped[primaryCat]) grouped[primaryCat] = []
      grouped[primaryCat].push(page)
    }
  }
  const groupedKeys = Object.keys(grouped).sort((a, b) => {
    if (a === 'Sin categoría') return 1
    if (b === 'Sin categoría') return -1
    return a.localeCompare(b, 'es')
  })

  // ── Selección ─────────────────────────────────────────────
  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(filtered.map(p => p.id)))
  }

  function clearSelection() {
    setSelected(new Set())
  }

  function exitSelectMode() {
    setSelectMode(false)
    clearSelection()
    setShowMove(false)
  }

  // ── Acciones masivas ──────────────────────────────────────
  function handleDeleteSelected() {
    if (selected.size === 0) return
    if (!confirm(`¿Eliminar ${selected.size} página${selected.size > 1 ? 's' : ''}? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      const res = await deleteManyWikiPages([...selected], slug, roomId)
      if (res?.error) { setError(res.error); return }
      exitSelectMode()
    })
  }

  function handleMoveSelected() {
    if (selected.size === 0 || !moveTarget.trim()) return
    startTransition(async () => {
      const res = await moveWikiPagesToCategory([...selected], moveTarget.trim(), slug, roomId)
      if (res?.error) { setError(res.error); return }
      setShowMove(false)
      exitSelectMode()
    })
  }

  const isEmpty = filtered.length === 0 && !homePage

  return (
    <div className="wiki-client">

      {/* Barra de moderación (modo selección activo) */}
      {canModerate && selectMode && (
        <div className="wiki-mod-bar animate-enter">
          <div className="wiki-mod-bar-left">
            <span className="wiki-mod-count">
              {selected.size} seleccionada{selected.size !== 1 ? 's' : ''}
            </span>
            <button type="button" className="wiki-mod-btn" onClick={selectAll}>
              Seleccionar todo ({filtered.length})
            </button>
            <button type="button" className="wiki-mod-btn" onClick={clearSelection} disabled={selected.size === 0}>
              Deseleccionar
            </button>
          </div>
          <div className="wiki-mod-bar-right">
            {showMove ? (
              <div className="wiki-move-row">
                <input
                  type="text"
                  className="wiki-move-input"
                  placeholder="Nombre de categoría..."
                  value={moveTarget}
                  onChange={e => setMoveTarget(e.target.value)}
                  list="wiki-cats-datalist"
                />
                <datalist id="wiki-cats-datalist">
                  {allCats.map(c => <option key={c} value={c} />)}
                </datalist>
                <button
                  type="button"
                  className="wiki-mod-btn primary"
                  onClick={handleMoveSelected}
                  disabled={isPending || selected.size === 0 || !moveTarget.trim()}
                >
                  <FolderArrowDownIcon style={{ width: 14, height: 14 }} />
                  {isPending ? 'Moviendo...' : 'Mover'}
                </button>
                <button type="button" className="wiki-mod-btn" onClick={() => setShowMove(false)}>
                  <XMarkIcon style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="wiki-mod-btn"
                onClick={() => setShowMove(true)}
                disabled={selected.size === 0}
              >
                <FolderArrowDownIcon style={{ width: 14, height: 14 }} />
                Mover a categoría
              </button>
            )}
            <button
              type="button"
              className="wiki-mod-btn danger"
              onClick={handleDeleteSelected}
              disabled={isPending || selected.size === 0}
            >
              <TrashIcon style={{ width: 14, height: 14 }} />
              {isPending ? 'Eliminando...' : `Eliminar (${selected.size})`}
            </button>
            <button type="button" className="wiki-mod-btn" onClick={exitSelectMode}>
              <XMarkIcon style={{ width: 14, height: 14 }} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="wiki-error animate-enter">⚠ {error}</div>
      )}

      {/* Controles: buscador + filtros + botón modo selección */}
      <div className="wiki-controls animate-enter">
        <div className="wiki-search-wrap">
          <MagnifyingGlassIcon className="wiki-search-icon" />
          <input
            type="text"
            className="wiki-search"
            placeholder="Buscar en la wiki..."
            value={q}
            onChange={e => { setQ(e.target.value); setCat('') }}
          />
          {q && (
            <button type="button" className="wiki-search-clear" onClick={() => setQ('')}>
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        <div className="wiki-controls-row">
          {allCats.length > 0 && (
            <div className="wiki-cats">
              <button
                type="button"
                className={`wiki-cat-btn ${!cat ? 'active' : ''}`}
                onClick={() => setCat('')}
              >
                Todas
              </button>
              {allCats.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`wiki-cat-btn ${cat === c ? 'active' : ''}`}
                  onClick={() => setCat(cat === c ? '' : c)}
                >
                  <TagIcon style={{ width: 10, height: 10 }} /> {c}
                </button>
              ))}
            </div>
          )}

          {canModerate && !selectMode && (
            <button
              type="button"
              className="wiki-mod-toggle"
              onClick={() => setSelectMode(true)}
            >
              <CheckIcon style={{ width: 13, height: 13 }} /> Seleccionar páginas
            </button>
          )}
        </div>
      </div>

      {/* Portada */}
      {homePage && !q && !cat && (
        <div className="wiki-home-row animate-enter">
          <Link href={`/salas/${slug}/wiki/${homePage.slug}`} className="wiki-home-card">
            <HomeIcon style={{ width: 16, height: 16, flexShrink: 0, color: 'var(--color-crimson)' }} />
            <div className="wiki-home-info">
              <span className="wiki-home-title">{homePage.title}</span>
              {homePage.excerpt && <span className="wiki-home-excerpt">{homePage.excerpt}</span>}
            </div>
            <span className="wiki-home-badge">Portada</span>
          </Link>
          {canModerate && (
            <div className="wiki-home-actions">
              <Link href={`/salas/${slug}/wiki/${homePage.slug}/editar`} className="wiki-inline-btn">
                <PencilIcon style={{ width: 13, height: 13 }} /> Editar
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Lista de páginas */}
      {isEmpty ? (
        <div className="wiki-empty animate-enter">
          <p>{q || cat ? 'No se encontraron páginas.' : 'Esta wiki está vacía.'}</p>
        </div>
      ) : (q || cat) ? (
        <div className="wiki-pages-list animate-enter">
          <div className="wiki-results-label">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            {q && <> para "<strong>{q}</strong>"</>}
            {cat && <> en <strong>{cat}</strong></>}
          </div>
          {filtered.map((page, i) => (
            <WikiRow
              key={page.id}
              page={page}
              slug={slug}
              canModerate={canModerate}
              selectMode={selectMode}
              selected={selected.has(page.id)}
              onToggle={() => toggleSelect(page.id)}
              i={i}
            />
          ))}
        </div>
      ) : (
        <div className="wiki-grouped animate-enter">
          {groupedKeys.map((category, gi) => (
            <div key={category} className="wiki-category-group animate-enter" style={{ animationDelay: `${gi * 0.04}s` }}>
              <div className="wiki-category-heading">
                <TagIcon style={{ width: 12, height: 12 }} />
                <span>{category}</span>
                <span className="wiki-category-count">{grouped[category].length}</span>
                {canModerate && selectMode && (
                  <button
                    type="button"
                    className="wiki-cat-select-all"
                    onClick={() => {
                      const ids = grouped[category].map(p => p.id)
                      setSelected(prev => {
                        const next = new Set(prev)
                        ids.forEach(id => next.add(id))
                        return next
                      })
                    }}
                  >
                    Seleccionar categoría
                  </button>
                )}
              </div>
              <div className="wiki-pages-list">
                {grouped[category].map((page, i) => (
                  <WikiRow
                    key={page.id}
                    page={page}
                    slug={slug}
                    canModerate={canModerate}
                    selectMode={selectMode}
                    selected={selected.has(page.id)}
                    onToggle={() => toggleSelect(page.id)}
                    i={i}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .wiki-client { display: flex; flex-direction: column; gap: var(--space-5); }

        /* Barra de moderación */
        .wiki-mod-bar {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);
          background: var(--bg-elevated); border: 1px solid var(--color-crimson-glow);
          border-radius: var(--radius-md); padding: var(--space-3) var(--space-4);
          position: sticky; top: var(--space-4); z-index: 10;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .wiki-mod-bar-left, .wiki-mod-bar-right { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
        .wiki-mod-count { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.06em; color: var(--color-crimson); min-width: 80px; }
        .wiki-mod-btn {
          display: inline-flex; align-items: center; gap: var(--space-1);
          background: transparent; border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm); padding: 0.3rem 0.7rem;
          font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.04em;
          color: var(--text-secondary); cursor: pointer; transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .wiki-mod-btn:hover:not(:disabled) { color: var(--text-primary); border-color: var(--border-medium); background: var(--bg-card); }
        .wiki-mod-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .wiki-mod-btn.primary { color: var(--color-crimson); border-color: var(--color-crimson-glow); background: var(--color-crimson-subtle); }
        .wiki-mod-btn.primary:hover:not(:disabled) { background: rgba(193,6,6,0.15); }
        .wiki-mod-btn.danger { color: #ef4444; border-color: rgba(239,68,68,0.3); }
        .wiki-mod-btn.danger:hover:not(:disabled) { background: rgba(239,68,68,0.1); }

        .wiki-move-row { display: flex; align-items: center; gap: var(--space-2); }
        .wiki-move-input {
          background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-sm);
          padding: 0.3rem 0.65rem; font-size: var(--text-xs); font-family: var(--font-display);
          color: var(--text-primary); outline: none; width: 180px;
        }
        .wiki-move-input:focus { border-color: var(--color-crimson); }

        /* Controles */
        .wiki-controls { display: flex; flex-direction: column; gap: var(--space-3); }
        .wiki-search-wrap { position: relative; }
        .wiki-search-icon { position: absolute; left: var(--space-3); top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--text-muted); pointer-events: none; }
        .wiki-search-clear { position: absolute; right: var(--space-3); top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; display: flex; }
        .wiki-search-clear:hover { color: var(--text-primary); }
        .wiki-search {
          width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm); padding: 0.6rem var(--space-8) 0.6rem 2.4rem;
          color: var(--text-primary); font-family: var(--font-body); font-size: var(--text-sm);
          outline: none; transition: border-color var(--transition-base); box-sizing: border-box;
        }
        .wiki-search:focus { border-color: var(--color-crimson); box-shadow: 0 0 0 3px var(--color-crimson-glow); }
        .wiki-search::placeholder { color: var(--text-muted); }

        .wiki-controls-row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; }
        .wiki-cats { display: flex; gap: var(--space-2); flex-wrap: wrap; flex: 1; }
        .wiki-cat-btn {
          display: inline-flex; align-items: center; gap: var(--space-1);
          background: transparent; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);
          padding: 0.25rem 0.65rem; font-size: var(--text-xs); font-family: var(--font-display);
          letter-spacing: 0.05em; color: var(--text-muted); cursor: pointer; text-decoration: none;
          transition: all var(--transition-fast);
        }
        .wiki-cat-btn:hover { color: var(--text-primary); border-color: var(--border-medium); }
        .wiki-cat-btn.active { color: var(--color-crimson); border-color: var(--color-crimson); background: var(--color-crimson-subtle); }

        .wiki-mod-toggle {
          display: inline-flex; align-items: center; gap: var(--space-1); flex-shrink: 0;
          background: transparent; border: 1px dashed var(--border-medium); border-radius: var(--radius-sm);
          padding: 0.25rem 0.65rem; font-size: var(--text-xs); font-family: var(--font-display);
          letter-spacing: 0.05em; color: var(--text-muted); cursor: pointer; transition: all var(--transition-fast);
        }
        .wiki-mod-toggle:hover { color: var(--color-crimson); border-color: var(--color-crimson-glow); }

        /* Portada */
        .wiki-home-row {align-items: center; gap: var(--space-3); }
        .wiki-home-card {
          flex: 1; display: flex; align-items: center; gap: var(--space-4);
          background: var(--color-crimson-subtle); border: 1px solid var(--color-crimson-glow);
          border-radius: var(--radius-md); padding: var(--space-4) var(--space-5);
          text-decoration: none; color: var(--text-primary); transition: all var(--transition-base);
        }
        .wiki-home-card:hover { border-color: var(--color-crimson); box-shadow: var(--shadow-crimson); }
        .wiki-home-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .wiki-home-title { font-family: var(--font-display); font-size: var(--text-base); font-weight: 600; letter-spacing: 0.03em; }
        .wiki-home-excerpt { font-size: var(--text-xs); color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .wiki-home-badge { font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.06em; color: var(--color-crimson); border: 1px solid var(--color-crimson-glow); border-radius: var(--radius-sm); padding: 0.15rem 0.5rem; flex-shrink: 0; }
        .wiki-home-actions { display: flex; gap: var(--space-2); flex-shrink: 0; }

        /* Resultados de búsqueda */
        .wiki-results-label { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.04em; padding-bottom: var(--space-2); }
        .wiki-results-label strong { color: var(--text-secondary); }

        /* Grupos */
        .wiki-grouped { display: flex; flex-direction: column; gap: var(--space-6); }
        .wiki-category-group { display: flex; flex-direction: column; gap: var(--space-2); }
        .wiki-category-heading {
          display: flex; align-items: center; gap: var(--space-2);
          padding-bottom: var(--space-2); border-bottom: 1px solid var(--border-subtle); position: relative;
        }
        .wiki-category-heading::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 40px; height: 1px; background: var(--color-crimson); }
        .wiki-category-heading > svg { color: var(--color-crimson); flex-shrink: 0; }
        .wiki-category-heading > span:first-of-type { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-secondary); }
        .wiki-category-count { font-family: var(--font-display); font-size: var(--text-xs); color: var(--text-muted); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.1rem 0.4rem; }
        .wiki-cat-select-all { margin-left: auto; font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.04em; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: 0; transition: color var(--transition-fast); }
        .wiki-cat-select-all:hover { color: var(--color-crimson); }

        /* Filas */
        .wiki-pages-list { display: flex; flex-direction: column; gap: var(--space-2); }

        /* Botones inline */
        .wiki-inline-btn {
          display: inline-flex; align-items: center; gap: 4px;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);
          padding: 0.3rem 0.65rem; font-size: var(--text-xs); font-family: var(--font-display);
          letter-spacing: 0.04em; color: var(--text-muted); cursor: pointer; text-decoration: none;
          transition: all var(--transition-fast); white-space: nowrap;
        }
        .wiki-inline-btn:hover { color: var(--color-crimson); border-color: var(--color-crimson-glow); }
        .wiki-inline-btn.danger:hover { color: #ef4444; border-color: rgba(239,68,68,0.3); }

        .wiki-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-sm); padding: var(--space-3) var(--space-4); color: #ef4444; font-size: var(--text-sm); }
        .wiki-empty { display: flex; flex-direction: column; align-items: center; padding: var(--space-16); background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-muted); }
      `}</style>
    </div>
  )
}

// ── Fila de página ────────────────────────────────────────────────────────────

function WikiRow({
  page, slug, canModerate, selectMode, selected, onToggle, i,
}: {
  page: WikiPage
  slug: string
  canModerate: boolean
  selectMode: boolean
  selected: boolean
  onToggle: () => void
  i: number
}) {
  return (
    <div
      className={`wiki-row-wrapper animate-enter ${selected ? 'wiki-row-selected' : ''}`}
      style={{ animationDelay: `${i * 0.03}s` }}
    >
      {/* Checkbox de selección */}
      {selectMode && (
        <button
          type="button"
          className={`wiki-row-check ${selected ? 'checked' : ''}`}
          onClick={onToggle}
          aria-label={selected ? 'Deseleccionar' : 'Seleccionar'}
        >
          {selected && <CheckIcon style={{ width: 12, height: 12 }} />}
        </button>
      )}

      <Link
        href={`/salas/${slug}/wiki/${page.slug}`}
        className="wiki-page-row"
        onClick={selectMode ? (e) => { e.preventDefault(); onToggle() } : undefined}
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
          {!selectMode && <span className="wiki-page-arrow">→</span>}
        </div>
      </Link>

      {/* Acciones de moderación inline (solo cuando no se está en modo selección) */}
      {canModerate && !selectMode && (
        <div className="wiki-row-actions">
          <Link href={`/salas/${slug}/wiki/${page.slug}/editar`} className="wiki-inline-btn">
            <PencilIcon style={{ width: 12, height: 12 }} /> Editar
          </Link>
        </div>
      )}

      <style>{`
        .wiki-row-wrapper { display: flex; align-items: center; gap: var(--space-2); }
        .wiki-row-wrapper.wiki-row-selected .wiki-page-row { border-color: var(--color-crimson); background: var(--color-crimson-subtle); }
        .wiki-row-check {
          flex-shrink: 0; width: 22px; height: 22px;
          background: var(--bg-card); border: 2px solid var(--border-medium); border-radius: 4px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all var(--transition-fast); color: #fff;
        }
        .wiki-row-check.checked { background: var(--color-crimson); border-color: var(--color-crimson); }
        .wiki-row-check:hover { border-color: var(--color-crimson); }
        .wiki-page-row {
          flex: 1; display: flex; align-items: center; gap: var(--space-4);
          background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
          padding: var(--space-4) var(--space-5); text-decoration: none; transition: all var(--transition-base);
          position: relative; overflow: hidden;
        }
        .wiki-page-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--color-crimson); opacity: 0; transition: opacity var(--transition-base); }
        .wiki-page-row:hover { border-color: var(--border-medium); transform: translateX(2px); }
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
        .wiki-row-actions { display: flex; gap: var(--space-2); flex-shrink: 0; }
      `}</style>
    </div>
  )
}