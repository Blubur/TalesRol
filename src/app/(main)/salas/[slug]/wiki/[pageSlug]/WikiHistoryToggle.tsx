'use client'

import { useState, useRef, useEffect } from 'react'

export default function WikiHistoryToggle({ versions }: { versions: any[] }) {
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [versions, open])

  if (!versions?.length) return null

  return (
    <div className="wiki-sidebar-block animate-enter" style={{ animationDelay: '0.2s' }}>
      
      <h3
        className="wiki-sidebar-title"
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
        onClick={() => setOpen(!open)}
      >
        Historial
        <span style={{ fontSize: '0.7rem' }}>{open ? '▾' : '▸'}</span>
      </h3>

      <div
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.25s ease',
          maxHeight: open ? `${height}px` : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="wiki-sidebar-versions">
          {versions.map((v, i) => (
            <div key={v.id} className={`wiki-version ${i === 0 ? 'current' : ''}`}>
              
              <span className="wiki-version-title">{v.title}</span>

              <span className="wiki-version-meta">
                {v.profiles?.display_name || v.profiles?.username} ·{' '}
                {new Date(v.created_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>

              {i === 0 && <span className="wiki-version-badge">Actual</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}