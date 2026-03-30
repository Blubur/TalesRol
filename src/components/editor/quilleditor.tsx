'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'

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
  { name, defaultValue = '', placeholder = 'Escribe aquí...', height = 300, onChange },
  ref
) {
  const toolbarRef   = useRef<HTMLDivElement>(null)
  const editorElRef  = useRef<HTMLDivElement>(null)
  const hiddenRef    = useRef<HTMLInputElement>(null)
  const quillRef     = useRef<any>(null)
  const destroyedRef = useRef(false)
  const htmlValueRef = useRef(defaultValue)
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const dropdownRef  = useRef<HTMLDivElement>(null)

  const [htmlMode, setHtmlMode]   = useState(false)
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
    if (hiddenRef.current) hiddenRef.current.value = val
    onChange?.(val)
  }

  useImperativeHandle(ref, () => ({
    insertHTML(html: string) {
      if (quillRef.current) {
        const q = quillRef.current
        const len = q.getLength()
        if (len > 1) q.insertText(len - 1, '\n')
        const range = q.getSelection(true) ?? { index: q.getLength(), length: 0 }
        q.clipboard.dangerouslyPasteHTML(range.index, html)
        updateValue(q.root.innerHTML)
      } else {
        const next = (htmlValueRef.current || '') + html
        updateValue(next)
        setHtmlValue(next)
      }
    },
    getHTML() { return htmlValueRef.current },
    clear() {
      if (quillRef.current) { quillRef.current.setText(''); updateValue('') }
    },
  }))

  // ── Buscar usuarios por query ─────────────────────────────────────────────
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

  // ── Insertar mención en Quill ─────────────────────────────────────────────
  function insertMention(user: MentionUser) {
    const q = quillRef.current
    if (!q) return

    const { atIndex } = mentionRef.current
    const range = q.getSelection()
    const cursorIndex = range?.index ?? q.getLength()

    const deleteLen = cursorIndex - atIndex
    if (deleteLen > 0) q.deleteText(atIndex, deleteLen)

    const mentionText = `@${user.username}`
    q.insertText(atIndex, mentionText, { link: `/perfil/${user.username}`, 'mention-user': user.username })
    q.insertText(atIndex + mentionText.length, ' ')
    q.setSelection(atIndex + mentionText.length + 1)

    setTimeout(() => {
      if (!q) return
      const html = q.root.innerHTML
      const fixed = html.replace(
        /(<a[^>]+href="\/perfil\/([^"]+)"[^>]*>)(@[^<]+)(<\/a>)/g,
        (_, open, uname, text, close) => {
          if (open.includes('class=')) return open.replace(/class="[^"]*"/, 'class="mention"') + text + close
          return `<a class="mention" href="/perfil/${uname}">${text}</a>`
        }
      )
      q.root.innerHTML = fixed
      updateValue(q.root.innerHTML)
      q.setSelection(q.getLength())
    }, 0)

    syncMention(MENTION_INITIAL)
  }

  // ── Inicializar Quill ─────────────────────────────────────────────────────
  useEffect(() => {
    destroyedRef.current = false

    async function init() {
      if (!document.querySelector('link[data-quill-css]')) {
        await new Promise<void>(resolve => {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css'
          link.setAttribute('data-quill-css', '1')
          link.onload = () => resolve()
          document.head.appendChild(link)
        })
      }
      if (destroyedRef.current) return
      if (!editorElRef.current || !toolbarRef.current) return

      const { default: Quill } = await import('quill')
      if (destroyedRef.current) return

      const q = new Quill(editorElRef.current, {
        theme: 'snow',
        placeholder,
        modules: { toolbar: toolbarRef.current },
      })

      // FIX: usar updateValue() en lugar de asignar directamente al DOM y al hidden
      // por separado. Así htmlValueRef, htmlValue state y el input hidden quedan
      // sincronizados desde el principio, incluso si el usuario no toca el editor.
      if (defaultValue) {
        q.root.innerHTML = defaultValue
        updateValue(defaultValue)
      }

      q.on('text-change', () => {
        if (destroyedRef.current) return
        updateValue(q.root.innerHTML)
        checkMentionTrigger(q)
      })

      quillRef.current = q
    }

    init()

    return () => {
      destroyedRef.current = true
      if (quillRef.current) {
        try { const s = quillRef.current.scroll; if (s?.observer) s.observer.disconnect() } catch {}
        quillRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Detectar @ en el texto ────────────────────────────────────────────────
  function checkMentionTrigger(q: any) {
    const range = q.getSelection()
    if (!range) return

    const cursorIndex = range.index
    const text = q.getText(0, cursorIndex)
    const match = text.match(/@([a-zA-Z0-9_]*)$/)

    if (match) {
      const atIndex = cursorIndex - match[0].length
      const query   = match[1]

      const cursorBounds = q.getBounds(cursorIndex)
      const wrapRect  = wrapperRef.current?.getBoundingClientRect()  ?? { top: 0, left: 0 }
      const editorRect = editorElRef.current?.getBoundingClientRect() ?? { top: 0, left: 0 }

      const top  = (editorRect.top - wrapRect.top) + cursorBounds.top + cursorBounds.height + 4
      const left = (editorRect.left - wrapRect.left) + cursorBounds.left

      syncMention({ open: true, query, atIndex, top, left, selectedIndex: 0 })
      searchUsers(query)
    } else {
      if (mentionRef.current.open) syncMention(MENTION_INITIAL)
    }
  }

  // ── Teclado: navegar y seleccionar en dropdown ────────────────────────────
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
  }, [])

  // ── Cerrar dropdown al hacer click fuera ─────────────────────────────────
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        syncMention(MENTION_INITIAL)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function switchToHtml() {
    if (quillRef.current) updateValue(quillRef.current.root.innerHTML)
    setHtmlMode(true)
  }

  function switchToVisual() {
    setHtmlMode(false)
    setTimeout(() => {
      if (quillRef.current) quillRef.current.root.innerHTML = htmlValueRef.current
    }, 50)
  }

  function handleHtmlChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    updateValue(e.target.value)
  }

  return (
    <div className="qe-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
      <div className="qe-modebar">
        <button type="button" className={`qe-mode-btn ${!htmlMode ? 'active' : ''}`} onClick={switchToVisual}>✦ Visual</button>
        <button type="button" className={`qe-mode-btn ${htmlMode ? 'active' : ''}`} onClick={switchToHtml}>&lt;/&gt; HTML</button>
      </div>

      <div ref={toolbarRef} className="qe-toolbar" style={{ display: htmlMode ? 'none' : undefined }}>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1" /><option value="2" /><option value="3" /><option value="" />
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" /><button className="ql-italic" />
          <button className="ql-underline" /><button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" /><button className="ql-list" value="bullet" />
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote" /><button className="ql-link" />
        </span>
        <span className="ql-formats"><button className="ql-clean" /></span>
      </div>

      <div ref={editorElRef} className="qe-editor" style={{ display: htmlMode ? 'none' : 'block', minHeight: height }} />

      {htmlMode && (
        <textarea
          className="qe-html-textarea"
          style={{ height }}
          value={htmlValue}
          onChange={handleHtmlChange}
          placeholder="<p>Escribe HTML aquí...</p>"
          spellCheck={false}
          autoComplete="off"
        />
      )}

      <input ref={hiddenRef} type="hidden" name={name} value={htmlValue} onChange={() => {}} />

      {mention.open && (
        <div
          ref={dropdownRef}
          className="mention-dropdown"
          style={{ top: mention.top, left: mention.left }}
        >
          {mention.loading && (
            <div className="mention-loading">Buscando…</div>
          )}
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
        .qe-wrapper { display: flex; flex-direction: column; border-radius: 4px; overflow: visible; border: 1px solid var(--border-subtle); transition: border-color 0.2s; }
        .qe-wrapper:focus-within { border-color: var(--color-crimson); box-shadow: 0 0 0 3px rgba(193,6,6,0.12); }
        .qe-modebar { display: flex; background: var(--bg-secondary); border-bottom: 1px solid var(--border-subtle); padding: 0.25rem 0.5rem; gap: 0.25rem; }
        .qe-mode-btn { background: transparent; border: 1px solid transparent; border-radius: 3px; color: var(--text-muted); font-family: var(--font-cinzel); font-size: 0.68rem; letter-spacing: 0.08em; padding: 0.2rem 0.6rem; cursor: pointer; transition: all 0.15s; }
        .qe-mode-btn:hover { color: var(--text-secondary); border-color: var(--border-medium); }
        .qe-mode-btn.active { color: var(--color-crimson); border-color: rgba(193,6,6,0.3); background: rgba(193,6,6,0.08); }
        .qe-toolbar { background: var(--bg-secondary) !important; border: none !important; border-bottom: 1px solid var(--border-subtle) !important; padding: 0.35rem 0.5rem !important; }
        .qe-toolbar .ql-stroke { stroke: var(--text-secondary) !important; }
        .qe-toolbar .ql-fill { fill: var(--text-secondary) !important; }
        .qe-toolbar .ql-picker-label { color: var(--text-secondary) !important; }
        .qe-toolbar button:hover .ql-stroke, .qe-toolbar .ql-active .ql-stroke { stroke: var(--color-crimson) !important; }
        .qe-toolbar button:hover .ql-fill, .qe-toolbar .ql-active .ql-fill { fill: var(--color-crimson) !important; }
        .qe-toolbar .ql-picker-options { background: var(--bg-elevated) !important; border: 1px solid var(--border-medium) !important; }
        .qe-toolbar .ql-picker-item { color: var(--text-secondary) !important; }
        .qe-toolbar .ql-picker-item:hover { color: var(--color-crimson) !important; }
        .qe-wrapper .ql-container { background: var(--bg-secondary) !important; border: none !important; font-family: var(--font-crimson-pro) !important; font-size: 1.05rem !important; color: var(--text-primary) !important; }
        .qe-wrapper .ql-editor { color: var(--text-primary) !important; line-height: 1.75 !important; min-height: ${height}px; }
        .qe-wrapper .ql-editor.ql-blank::before { color: var(--text-muted) !important; font-style: italic; }
        .qe-wrapper .ql-editor h1 { font-family: var(--font-cinzel); font-size: 1.5rem; color: var(--color-crimson); margin: 0.8em 0 0.4em; }
        .qe-wrapper .ql-editor h2 { font-family: var(--font-cinzel); font-size: 1.2rem; color: #d4820a; margin: 0.7em 0 0.3em; }
        .qe-wrapper .ql-editor h3 { font-family: var(--font-cinzel); font-size: 1rem; margin: 0.6em 0 0.3em; }
        .qe-wrapper .ql-editor blockquote { border-left: 3px solid var(--color-crimson); padding-left: 1em; color: var(--text-secondary); font-style: italic; margin: 0.8em 0; }
        .qe-wrapper .ql-editor a { color: var(--color-crimson); }
        .qe-wrapper .ql-editor a.mention { color: var(--color-crimson); font-weight: 600; background: rgba(193,6,6,0.08); border-radius: 3px; padding: 0 3px; text-decoration: none; }
        .qe-html-textarea { width: 100%; background: #0d1117; color: #a8d8a8; border: none; padding: 1rem; font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.6; resize: vertical; box-sizing: border-box; display: block; }
        .qe-html-textarea:focus { outline: none; }
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