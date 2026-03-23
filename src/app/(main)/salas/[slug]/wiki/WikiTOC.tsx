'use client'

import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function WikiTOC({ content }: { content: string }) {
  const [items, setItems] = useState<TOCItem[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3'))

    const toc: TOCItem[] = headings.map((h, i) => ({
      id: `heading-${i}`,
      text: h.textContent ?? '',
      level: parseInt(h.tagName[1]),
    }))
    setItems(toc)

    // Inyectar IDs en los headings reales del DOM
    document.querySelectorAll('.wiki-content h1, .wiki-content h2, .wiki-content h3')
      .forEach((el, i) => { el.id = `heading-${i}` })

    // Scroll spy
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    document.querySelectorAll('.wiki-content h1, .wiki-content h2, .wiki-content h3')
      .forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [content])

  if (items.length < 2) return null

  return (
    <nav className="wiki-toc">
      <span className="wiki-toc-title">Contenido</span>
      <ul className="wiki-toc-list">
        {items.map(item => (
          <li key={item.id} className={`wiki-toc-item level-${item.level}`}>
            <a
              href={`#${item.id}`}
              className={`wiki-toc-link ${active === item.id ? 'active' : ''}`}
              onClick={e => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
      <style>{`
        .wiki-toc {
          position: sticky;
          top: var(--space-8);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          min-width: 200px;
          max-width: 220px;
        }
        .wiki-toc-title {
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-crimson);
          display: block;
          margin-bottom: var(--space-3);
        }
        .wiki-toc-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .wiki-toc-item.level-1 { padding-left: 0; }
        .wiki-toc-item.level-2 { padding-left: var(--space-3); }
        .wiki-toc-item.level-3 { padding-left: var(--space-5); }
        .wiki-toc-link {
          font-size: var(--text-xs);
          font-family: var(--font-display);
          color: var(--text-muted);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color var(--transition-fast);
          display: block;
          padding: 2px var(--space-2);
          border-left: 2px solid transparent;
        }
        .wiki-toc-link:hover { color: var(--text-primary); }
        .wiki-toc-link.active {
          color: var(--color-crimson);
          border-left-color: var(--color-crimson);
        }
      `}</style>
    </nav>
  )
}