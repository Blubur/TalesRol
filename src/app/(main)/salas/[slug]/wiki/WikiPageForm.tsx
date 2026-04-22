'use client'

import { useState, useRef, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { createWikiPage, updateWikiPage } from './wikiactions'
import type { QuillEditorHandle } from '@/components/editor/quilleditor'
import { BookOpenIcon, LinkIcon, TagIcon, HomeIcon } from '@heroicons/react/24/outline'

const QuillEditor = dynamic(() => import('@/components/editor/quilleditor'), { ssr: false })

interface WikiPage {
  id: string
  slug: string
  title: string
  content: string
  categories: string[]
  is_home: boolean
}

interface Props {
  roomId: string
  roomSlug: string
  page?: WikiPage
  otherPages?: { slug: string; title: string }[]
}

const HTML_REFERENCE = [
  {
    tag: 'Título H1',
    code: '<h1>Texto</h1>',
    preview: <span style={{ fontSize: '1.3em', fontWeight: 700, color: 'var(--color-crimson)' }}>Título principal</span>,
  },
  {
    tag: 'Título H2',
    code: '<h2>Texto</h2>',
    preview: <span style={{ fontSize: '1.1em', fontWeight: 600, color: 'var(--color-warning)' }}>Subtítulo</span>,
  },
  {
    tag: 'Negrita',
    code: '<strong>Texto</strong>',
    preview: <strong>texto en negrita</strong>,
  },
  {
    tag: 'Cursiva',
    code: '<em>Texto</em>',
    preview: <em>texto en cursiva</em>,
  },
  {
    tag: 'Cita',
    code: '<blockquote>Texto</blockquote>',
    preview: (
      <span style={{ borderLeft: '3px solid var(--color-crimson)', paddingLeft: '0.5rem', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'block' }}>
        Una cita memorable
      </span>
    ),
  },
  {
    tag: 'Lista',
    code: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
    preview: (
      <ul style={{ paddingLeft: '1.2em', margin: 0 }}>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    ),
  },
  {
    tag: 'Enlace',
    code: '<a href="/salas/slug/wiki/pagina">Título</a>',
    preview: <a style={{ color: 'var(--color-crimson)', textDecoration: 'underline' }}>Enlace a otra página</a>,
  },
  {
    tag: 'Separador',
    code: '<hr>',
    preview: <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.25rem 0' }} />,
  },
]

export default function WikiPageForm({ roomId, roomSlug, page, otherPages = [] }: Props) {
  const [title, setTitle]           = useState(page?.title ?? '')
  const [categories, setCategories] = useState(page?.categories?.join(', ') ?? '')
  const [isHome, setIsHome]         = useState(page?.is_home ?? false)
  const [error, setError]           = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const editorRef = useRef<QuillEditorHandle>(null)

  function insertPageLink(linkedSlug: string, linkedTitle: string) {
    const html = `<a href="/salas/${roomSlug}/wiki/${linkedSlug}">${linkedTitle}</a>`
    editorRef.current?.insertHTML(html)
  }

  async function handleSubmit() {
    setError(null)
    const content = editorRef.current?.getHTML() ?? ''
    const fd = new FormData()
    fd.set('room_id', roomId)
    fd.set('room_slug', roomSlug)
    fd.set('title', title)
    fd.set('content', content)
    fd.set('categories', categories)
    fd.set('is_home', String(isHome))
    if (page) {
      fd.set('page_id', page.id)
      fd.set('page_slug', page.slug)
    }
    startTransition(async () => {
      const res = page ? await updateWikiPage(fd) : await createWikiPage(fd)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <div className="wpf-outer">

      {/* Formulario principal */}
      <div className="wpf-wrap">

        {/* Título de página — clase wiki-form-title para los tests */}
        <h1 className="wiki-form-title">
          {page ? 'Editar página' : 'Nueva página wiki'}
        </h1>

        <div className="wpf-field">
          <label className="wpf-label">Título de la página</label>
          <input
            className="wpf-input wpf-input-title"
            type="text"
            name="title"
            placeholder="Ej: Historia del reino, PNJs importantes..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="wpf-field">
          <label className="wpf-label">Contenido</label>
          <QuillEditor
            ref={editorRef}
            name="content"
            defaultValue={page?.content ?? ''}
            placeholder="Escribe el contenido de esta página de la wiki..."
            height={420}
          />
        </div>

        {otherPages.length > 0 && (
          <div className="wpf-field">
            <label className="wpf-label">
              <LinkIcon style={{ width: 12, height: 12 }} /> Insertar enlace a otra página
            </label>
            <div className="wpf-page-links">
              {otherPages.map(p => (
                <button
                  key={p.slug}
                  type="button"
                  className="wpf-page-link-btn"
                  onClick={() => insertPageLink(p.slug, p.title)}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="wpf-field">
          <label className="wpf-label">
            <TagIcon style={{ width: 12, height: 12 }} /> Categorías (separadas por coma)
          </label>
          <input
            className="wpf-input wpf-input-categories"
            type="text"
            name="categories"
            placeholder="Ej: Lore, Personajes, Reglas"
            value={categories}
            onChange={e => setCategories(e.target.value)}
          />
        </div>

        <label className="wpf-check-row">
          <input
            type="checkbox"
            className="wpf-checkbox"
            name="is_home"
            checked={isHome}
            onChange={e => setIsHome(e.target.checked)}
          />
          <HomeIcon style={{ width: 14, height: 14, color: 'var(--color-crimson)' }} />
          <span className="wpf-check-label">Establecer como portada de la wiki</span>
        </label>

        {error && <p className="wpf-error">{error}</p>}

        <div className="wpf-actions">
          <a href={`/salas/${roomSlug}/wiki`} className="btn-ghost">Cancelar</a>
          {/* clase btn-save añadida para los tests */}
          <button className="btn-primary btn-save" onClick={handleSubmit} disabled={isPending}>
            <BookOpenIcon style={{ width: 14, height: 14 }} />
            {isPending ? 'Guardando...' : page ? 'Guardar cambios' : 'Crear página'}
          </button>
        </div>
      </div>

      {/* Panel de referencia HTML */}
      <aside className="wpf-ref-panel">
        <div className="wpf-ref-header">
          <span className="wpf-ref-title">Referencia rápida</span>
          <span className="wpf-ref-sub">Etiquetas HTML disponibles</span>
        </div>
        <div className="wpf-ref-list">
          {HTML_REFERENCE.map(item => (
            <div key={item.tag} className="wpf-ref-item">
              <div className="wpf-ref-item-header">
                <span className="wpf-ref-tag">{item.tag}</span>
              </div>
              <code className="wpf-ref-code">{item.code}</code>
              <div className="wpf-ref-preview">{item.preview}</div>
            </div>
          ))}
        </div>
        <p className="wpf-ref-note">
          El editor Quill aplica estos estilos automáticamente. También puedes escribir HTML directamente usando el botón <strong>&lt;/&gt;</strong> de la barra del editor.
        </p>
      </aside>

      <style>{`
        .wiki-form-title {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.03em;
          margin: 0 0 var(--space-2);
        }

        .wpf-outer {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: var(--space-8);
          align-items: start;
        }
        @media (max-width: 900px) {
          .wpf-outer { grid-template-columns: 1fr; }
          .wpf-ref-panel { position: static; }
        }

        .wpf-wrap { display: flex; flex-direction: column; gap: var(--space-5); }
        .wpf-field { display: flex; flex-direction: column; gap: var(--space-2); }
        .wpf-label { display: flex; align-items: center; gap: var(--space-1); font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; color: var(--text-secondary); text-transform: uppercase; }
        .wpf-input { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem var(--space-4); color: var(--text-primary); font-family: var(--font-body); font-size: var(--text-base); outline: none; transition: border-color var(--transition-base); width: 100%; box-sizing: border-box; }
        .wpf-input:focus { border-color: var(--color-crimson); box-shadow: 0 0 0 3px var(--color-crimson-glow); }
        .wpf-input::placeholder { color: var(--text-muted); }
        .wpf-page-links { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .wpf-page-link-btn { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.25rem 0.65rem; font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.04em; color: var(--text-secondary); cursor: pointer; transition: all var(--transition-fast); }
        .wpf-page-link-btn:hover { color: var(--color-crimson); border-color: var(--color-crimson-glow); background: var(--color-crimson-subtle); }
        .wpf-check-row { display: flex; align-items: center; gap: var(--space-2); cursor: pointer; }
        .wpf-checkbox { width: 15px; height: 15px; accent-color: var(--color-crimson); cursor: pointer; }
        .wpf-check-label { font-size: var(--text-sm); color: var(--text-secondary); font-family: var(--font-display); letter-spacing: 0.03em; }
        .wpf-error { color: var(--color-error); font-size: var(--text-xs); margin: 0; }
        .wpf-actions { display: flex; gap: var(--space-3); justify-content: flex-end; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle); }
        .wpf-actions .btn-primary { display: flex; align-items: center; gap: var(--space-2); }

        /* Panel referencia */
        .wpf-ref-panel {
          position: sticky;
          top: var(--space-8);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .wpf-ref-header {
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-elevated);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .wpf-ref-title {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-crimson);
        }
        .wpf-ref-sub {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-family: var(--font-display);
          letter-spacing: 0.04em;
        }
        .wpf-ref-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .wpf-ref-item {
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .wpf-ref-item:last-child { border-bottom: none; }
        .wpf-ref-item-header { display: flex; align-items: center; justify-content: space-between; }
        .wpf-ref-tag {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .wpf-ref-code {
          font-family: monospace;
          font-size: 0.7rem;
          color: var(--text-secondary);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.2rem 0.4rem;
          white-space: pre;
          overflow-x: auto;
          display: block;
        }
        .wpf-ref-preview {
          font-size: var(--text-sm);
          color: var(--text-primary);
          font-family: var(--font-body);
          padding: var(--space-1) 0;
        }
        .wpf-ref-note {
          padding: var(--space-3) var(--space-4);
          font-size: 0.68rem;
          color: var(--text-muted);
          font-family: var(--font-display);
          letter-spacing: 0.02em;
          line-height: 1.5;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-elevated);
        }
        .wpf-ref-note strong { color: var(--text-secondary); }
      `}</style>
    </div>
  )
}