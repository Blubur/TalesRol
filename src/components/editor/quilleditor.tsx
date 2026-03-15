'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

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
  const [htmlMode, setHtmlMode] = useState(false)
  const [htmlValue, setHtmlValue] = useState(defaultValue)

  function updateValue(val: string) {
    htmlValueRef.current = val
    setHtmlValue(val)
    if (hiddenRef.current) hiddenRef.current.value = val
    onChange?.(val)
  }

  // Exponer métodos al padre
  useImperativeHandle(ref, () => ({
    insertHTML(html: string) {
      if (quillRef.current) {
        // Insertar al final del contenido actual
        const q = quillRef.current
        const len = q.getLength()
        // Insertar salto si hay contenido
        if (len > 1) {
          q.insertText(len - 1, '\n')
        }
        // Pegar como HTML usando clipboard
        const range = q.getSelection(true) ?? { index: q.getLength(), length: 0 }
        q.clipboard.dangerouslyPasteHTML(range.index, html)
        updateValue(q.root.innerHTML)
      } else {
        // Si quill no está listo, append al htmlValue
        const next = (htmlValueRef.current || '') + html
        updateValue(next)
        setHtmlValue(next)
      }
    },
    getHTML() {
      return htmlValueRef.current
    },
    clear() {
      if (quillRef.current) {
        quillRef.current.setText('')
        updateValue('')
      }
    },
  }))

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

      if (defaultValue) {
        q.root.innerHTML = defaultValue
      }

      if (hiddenRef.current) hiddenRef.current.value = defaultValue

      q.on('text-change', () => {
        if (destroyedRef.current) return
        updateValue(q.root.innerHTML)
      })

      quillRef.current = q
    }

    init()

    return () => {
      destroyedRef.current = true
      if (quillRef.current) {
        try {
          const scroll = quillRef.current.scroll
          if (scroll && scroll.observer) scroll.observer.disconnect()
        } catch (e) {}
        quillRef.current = null
      }
    }
  }, [])

  function switchToHtml() {
    if (quillRef.current) updateValue(quillRef.current.root.innerHTML)
    setHtmlMode(true)
  }

  function switchToVisual() {
    setHtmlMode(false)
    setTimeout(() => {
      if (quillRef.current) {
        quillRef.current.root.innerHTML = htmlValueRef.current
      }
    }, 50)
  }

  function handleHtmlChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    updateValue(e.target.value)
  }

  return (
    <div className="qe-wrapper">
      <div className="qe-modebar">
        <button type="button" className={`qe-mode-btn ${!htmlMode ? 'active' : ''}`} onClick={switchToVisual}>✦ Visual</button>
        <button type="button" className={`qe-mode-btn ${htmlMode ? 'active' : ''}`} onClick={switchToHtml}>&lt;/&gt; HTML</button>
      </div>

      <div ref={toolbarRef} className="qe-toolbar" style={{ display: htmlMode ? 'none' : undefined }}>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1" />
            <option value="2" />
            <option value="3" />
            <option value="" />
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote" />
          <button className="ql-link" />
        </span>
        <span className="ql-formats">
          <button className="ql-clean" />
        </span>
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
          autoCorrect="off"
          autoCapitalize="off"
        />
      )}

      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue} />

      <style>{`
        .qe-wrapper { display: flex; flex-direction: column; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-subtle); transition: border-color 0.2s; }
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
        .qe-html-textarea { width: 100%; background: #0d1117; color: #a8d8a8; border: none; padding: 1rem; font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.6; resize: vertical; box-sizing: border-box; display: block; }
        .qe-html-textarea:focus { outline: none; }
      `}</style>
    </div>
  )
})

export default QuillEditor