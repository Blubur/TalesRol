'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

export interface QuillEditorHandle {
  insertHTML: (html: string) => void
  getHTML: () => string
  clear: () => void
}

interface QuillEditorProps {
  name: string
  defaultValue?: string
  placeholder?: string
  height?: number
  onChange?: (value: string) => void
  initialHtmlMode?: boolean
}

interface MentionUser {
  username: string
  display_name: string | null
  avatar_url: string | null
}

interface MentionState {
  open: boolean
  query: string
  users: MentionUser[]
  loading: boolean
  top: number
  left: number
  selectedIndex: number
  atIndex: number
}

const MENTION_INITIAL: MentionState = {
  open: false, query: '', users: [], loading: false,
  top: 0, left: 0, selectedIndex: 0, atIndex: -1,
}

const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(function QuillEditor(
  { name, defaultValue = '', placeholder = 'Escribe aquí...', height = 300, onChange, initialHtmlMode = false },
  ref
) {
  const htmlValueRef  = useRef(defaultValue)
  const htmlModeRef   = useRef(initialHtmlMode)
  const wrapperRef    = useRef<HTMLDivElement>(null)
  const dropdownRef   = useRef<HTMLDivElement>(null)

  const [htmlMode, setHtmlMode]   = useState(initialHtmlMode)
  const [htmlValue, setHtmlValue] = useState(defaultValue)
  const [mention, setMention]     = useState<MentionState>(MENTION_INITIAL)
  const mentionRef = useRef<MentionState>(MENTION_INITIAL)

  function syncMention(next: Partial<MentionState>) {
    mentionRef.current = { ...mentionRef.current, ...next }
    setMention(prev => ({ ...prev, ...next }))
  }

  function updateValue(val: string) {
    htmlValueRef.current = val
    setHtmlValue(val)
    onChange?.(val)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'tiptap-link' },
      }),
    ],
    // Si arranca en modo HTML no pasamos el contenido a TipTap —
    // TipTap sanearía el HTML eliminando divs, clases, etc.
    // El contenido se carga solo cuando el usuario cambia a modo Visual.
    content: initialHtmlMode ? '' : defaultValue,
    onUpdate({ editor }) {
      // Solo sincronizar cuando estamos en modo Visual.
      // En modo HTML el valor lo gestiona el textarea directamente.
      if (!htmlModeRef.current) {
        updateValue(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: 'tte-editor',
        style: `min-height: ${height}px`,
      },
    },
  })

  useImperativeHandle(ref, () => ({
    insertHTML(html: string) {
      if (editor && !htmlModeRef.current) {
        editor.chain().focus().insertContent(html).run()
        updateValue(editor.getHTML())
      } else {
        const next = (htmlValueRef.current || '') + html
        updateValue(next)
        setHtmlValue(next)
      }
    },
    getHTML() { return htmlValueRef.current },
    clear() {
      if (editor) editor.chain().focus().clearContent().run()
      updateValue('')
    },
  }))

  function switchToHtml() {
    htmlModeRef.current = true
    if (editor) updateValue(editor.getHTML())
    setHtmlMode(true)
  }

  function switchToVisual() {
    htmlModeRef.current = false
    setHtmlMode(false)
    setTimeout(() => {
      if (editor) {
        // Aquí sí pasamos por TipTap — el usuario es consciente de que
        // el editor visual puede simplificar algunos elementos HTML complejos
        editor.commands.setContent(htmlValueRef.current, false)
      }
    }, 30)
  }

  function handleHtmlChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    updateValue(e.target.value)
  }

  // ── Buscar usuarios ───────────────────────────────────────────────────────
  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 1) { syncMention({ users: [], loading: false }); return }
    syncMention({ loading: true })
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)
      if (!res.ok) throw new Error()
      const data: MentionUser[] = await res.json()
      syncMention({ users: data, loading: false, selectedIndex: 0 })
    } catch {
      syncMention({ users: [], loading: false })
    }
  }, [])

  // ── Insertar mención ──────────────────────────────────────────────────────
  function insertMention(user: MentionUser) {
    if (!editor) return
    const mentionHtml = `<a class="mention" href="/perfil/${user.username}">@${user.username}</a> `
    editor.chain().focus().insertContent(mentionHtml).run()
    updateValue(editor.getHTML())
    syncMention(MENTION_INITIAL)
  }

  // ── Click fuera del dropdown ──────────────────────────────────────────────
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        syncMention(MENTION_INITIAL)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // ── Detectar @ mientras se escribe ───────────────────────────────────────
  useEffect(() => {
    if (!editor) return
    const handler = () => {
      if (htmlModeRef.current) return
      const { state } = editor
      const { selection } = state
      const { $from } = selection
      const textBefore = $from.parent.textContent.slice(0, $from.parentOffset)
      const match = textBefore.match(/@([a-zA-Z0-9_]*)$/)
      if (match) {
        const query = match[1]
        const domSel = window.getSelection()
        if (domSel && domSel.rangeCount > 0) {
          const range = domSel.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          const wrapRect = wrapperRef.current?.getBoundingClientRect() ?? { top: 0, left: 0 }
          syncMention({
            open: true,
            query,
            atIndex: $from.parentOffset - match[0].length,
            top: rect.bottom - wrapRect.top + 4,
            left: rect.left - wrapRect.left,
            selectedIndex: 0,
          })
          searchUsers(query)
        }
      } else {
        if (mentionRef.current.open) syncMention(MENTION_INITIAL)
      }
    }
    editor.on('selectionUpdate', handler)
    editor.on('update', handler)
    return () => {
      editor.off('selectionUpdate', handler)
      editor.off('update', handler)
    }
  }, [editor, searchUsers])

  // ── Teclado mention ───────────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const m = mentionRef.current
      if (!m.open || m.users.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        syncMention({ selectedIndex: (m.selectedIndex + 1) % m.users.length })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        syncMention({ selectedIndex: (m.selectedIndex - 1 + m.users.length) % m.users.length })
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        const user = m.users[m.selectedIndex]
        if (user) insertMention(user)
      } else if (e.key === 'Escape') {
        syncMention(MENTION_INITIAL)
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  return (
    <div className="tte-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>

      {/* Barra de modo */}
      <div className="tte-modebar">
        <button type="button" className={`tte-mode-btn ${!htmlMode ? 'active' : ''}`} onClick={switchToVisual}>✦ Visual</button>
        <button type="button" className={`tte-mode-btn ${htmlMode ? 'active' : ''}`} onClick={switchToHtml}>&lt;/&gt; HTML</button>
      </div>

      {/* Barra de herramientas visual */}
      {!htmlMode && editor && (
        <div className="tte-toolbar">
          <select
            className="tte-select"
            value={
              editor.isActive('heading', { level: 1 }) ? '1' :
              editor.isActive('heading', { level: 2 }) ? '2' :
              editor.isActive('heading', { level: 3 }) ? '3' : ''
            }
            onChange={e => {
              const val = e.target.value
              if (val === '') editor.chain().focus().setParagraph().run()
              else editor.chain().focus().toggleHeading({ level: Number(val) as 1|2|3 }).run()
            }}
          >
            <option value="">Párrafo</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
          </select>
          <div className="tte-sep" />
          <button type="button" className={`tte-btn ${editor.isActive('bold') ? 'active' : ''}`} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita"><strong>B</strong></button>
          <button type="button" className={`tte-btn ${editor.isActive('italic') ? 'active' : ''}`} onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva"><em>I</em></button>
          <button type="button" className={`tte-btn ${editor.isActive('underline') ? 'active' : ''}`} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Subrayado"><u>U</u></button>
          <button type="button" className={`tte-btn ${editor.isActive('strike') ? 'active' : ''}`} onClick={() => editor.chain().focus().toggleStrike().run()} title="Tachado"><s>S</s></button>
          <div className="tte-sep" />
          <button type="button" className={`tte-btn ${editor.isActive('bulletList') ? 'active' : ''}`} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista">☰</button>
          <button type="button" className={`tte-btn ${editor.isActive('orderedList') ? 'active' : ''}`} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">①</button>
          <div className="tte-sep" />
          <button type="button" className={`tte-btn ${editor.isActive('blockquote') ? 'active' : ''}`} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Cita">❝</button>
          <button type="button" className="tte-btn" onClick={() => {
            const url = window.prompt('URL del enlace:')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }} title="Enlace">🔗</button>
          <button type="button" className="tte-btn" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Separador">—</button>
          <div className="tte-sep" />
          <button type="button" className="tte-btn" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Limpiar formato">✕</button>
        </div>
      )}

      {/* Editor visual TipTap */}
      <div style={{ display: htmlMode ? 'none' : 'block' }}>
        <EditorContent editor={editor} />
      </div>

      {/* Editor HTML — el contenido se guarda tal cual, sin pasar por TipTap */}
      {htmlMode && (
        <textarea
          className="tte-html-textarea"
          style={{ minHeight: height }}
          value={htmlValue}
          onChange={handleHtmlChange}
          placeholder="<p>Escribe HTML aquí...</p>"
          spellCheck={false}
          autoComplete="off"
        />
      )}

      <input type="hidden" name={name} value={htmlValue} onChange={() => {}} />

      {/* Dropdown menciones */}
      {mention.open && (
        <div ref={dropdownRef} className="mention-dropdown" style={{ top: mention.top, left: mention.left }}>
          {mention.loading && <div className="mention-loading">Buscando…</div>}
          {!mention.loading && mention.users.length === 0 && mention.query.length > 0 && (
            <div className="mention-empty">Sin resultados</div>
          )}
          {!mention.loading && mention.users.map((u, i) => (
            <button
              key={u.username}
              type="button"
              className={`mention-item ${i === mention.selectedIndex ? 'active' : ''}`}
              onMouseDown={e => { e.preventDefault(); insertMention(u) }}
              onMouseEnter={() => syncMention({ selectedIndex: i })}
            >
              <img
                src={u.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${u.username}`}
                alt={u.username}
                className="mention-avatar"
              />
              <div className="mention-info">
                <span className="mention-display">{u.display_name || u.username}</span>
                <span className="mention-username">@{u.username}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .tte-wrapper { display: flex; flex-direction: column; border-radius: 4px; overflow: visible; border: 1px solid var(--border-subtle); transition: border-color 0.2s; }
        .tte-wrapper:focus-within { border-color: var(--color-crimson); box-shadow: 0 0 0 3px rgba(193,6,6,0.12); }

        .tte-modebar { display: flex; background: var(--bg-secondary); border-bottom: 1px solid var(--border-subtle); padding: 0.25rem 0.5rem; gap: 0.25rem; }
        .tte-mode-btn { background: transparent; border: 1px solid transparent; border-radius: 3px; color: var(--text-muted); font-family: var(--font-cinzel); font-size: 0.68rem; letter-spacing: 0.08em; padding: 0.2rem 0.6rem; cursor: pointer; transition: all 0.15s; }
        .tte-mode-btn:hover { color: var(--text-secondary); border-color: var(--border-medium); }
        .tte-mode-btn.active { color: var(--color-crimson); border-color: rgba(193,6,6,0.3); background: rgba(193,6,6,0.08); }

        .tte-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 0.15rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border-subtle); padding: 0.35rem 0.5rem; }
        .tte-btn { background: transparent; border: 1px solid transparent; border-radius: 3px; color: var(--text-secondary); font-size: 0.85rem; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
        .tte-btn:hover { color: var(--text-primary); border-color: var(--border-medium); background: var(--bg-card); }
        .tte-btn.active { color: var(--color-crimson); border-color: rgba(193,6,6,0.3); background: rgba(193,6,6,0.08); }
        .tte-select { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 3px; color: var(--text-secondary); font-size: 0.75rem; padding: 0.15rem 0.35rem; cursor: pointer; font-family: var(--font-display); }
        .tte-select:focus { outline: none; border-color: var(--color-crimson); }
        .tte-sep { width: 1px; height: 16px; background: var(--border-subtle); margin: 0 0.15rem; }

        .tte-wrapper .tiptap { outline: none; }
        .tte-editor { padding: 1rem; background: var(--bg-secondary); color: var(--text-primary); font-family: var(--font-body); font-size: 1.05rem; line-height: 1.75; }
        .tte-editor p { margin: 0.4em 0; }
        .tte-editor h1 { font-family: var(--font-cinzel); font-size: 1.5rem; color: var(--color-crimson); margin: 0.8em 0 0.4em; }
        .tte-editor h2 { font-family: var(--font-cinzel); font-size: 1.2rem; color: #d4820a; margin: 0.7em 0 0.3em; }
        .tte-editor h3 { font-family: var(--font-cinzel); font-size: 1rem; margin: 0.6em 0 0.3em; }
        .tte-editor blockquote { border-left: 3px solid var(--color-crimson); padding-left: 1em; color: var(--text-secondary); font-style: italic; margin: 0.8em 0; }
        .tte-editor ul, .tte-editor ol { padding-left: 1.5em; margin: 0.4em 0; }
        .tte-editor hr { border: none; border-top: 1px solid var(--border-subtle); margin: 1em 0; }
        .tte-editor a, .tiptap-link { color: var(--color-crimson); text-decoration: underline; }
        .tte-editor a.mention { color: var(--color-crimson); font-weight: 600; background: rgba(193,6,6,0.08); border-radius: 3px; padding: 0 3px; text-decoration: none; }
        .tte-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--text-muted); font-style: italic; float: left; pointer-events: none; height: 0; }

        .tte-html-textarea { width: 100%; background: #0d1117; color: #a8d8a8; border: none; padding: 1rem; font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.6; resize: vertical; box-sizing: border-box; display: block; }
        .tte-html-textarea:focus { outline: none; }

        .mention-dropdown { position: absolute; z-index: 9999; min-width: 220px; max-width: 300px; background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); overflow: hidden; }
        .mention-loading, .mention-empty { padding: 0.6rem 1rem; font-size: 0.78rem; color: var(--text-muted); font-style: italic; }
        .mention-item { display: flex; align-items: center; gap: 0.6rem; width: 100%; background: transparent; border: none; padding: 0.5rem 0.75rem; cursor: pointer; text-align: left; transition: background 0.1s; }
        .mention-item:hover, .mention-item.active { background: var(--bg-card); }
        .mention-item.active { background: rgba(193,6,6,0.08); }
        .mention-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-subtle); flex-shrink: 0; }
        .mention-info { display: flex; flex-direction: column; gap: 0.05rem; min-width: 0; }
        .mention-display { font-size: 0.82rem; font-family: var(--font-cinzel); letter-spacing: 0.02em; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mention-username { font-size: 0.7rem; color: var(--text-muted); }
      `}</style>
    </div>
  )
})

export default QuillEditor