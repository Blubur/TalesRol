'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createTopic } from '../topicactions'
import QuillEditor, { type QuillEditorHandle } from '@/components/editor/quilleditor'
import type { Character, Room } from '@/types/database'

export default function NuevoTemaPage() {
  const { slug } = useParams<{ slug: string }>()
  const supabase  = createClient()
  const starterRef = useRef<QuillEditorHandle>(null)
  const formRef    = useRef<HTMLFormElement>(null)

  const [room, setRoom]        = useState<Room | null>(null)
  const [characters, setChars] = useState<Character[]>([])
  const [error, setError]      = useState<string | null>(null)
  const [loading, setLoading]  = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: roomData }, { data: { user } }] = await Promise.all([
        supabase.from('rooms').select('*').eq('slug', slug).single(),
        supabase.auth.getUser(),
      ])
      if (roomData) setRoom(roomData as Room)
      if (user) {
        const { data: chars } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .is('deleted_at', null)
        setChars((chars ?? []) as Character[])
      }
    }
    load()
  }, [slug])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    if (room) formData.set('room_id', room.id)

    // Leer HTML del editor: ref primero, luego input hidden como fallback
    const fromRef    = starterRef.current?.getHTML() ?? ''
    const fromHidden = (formRef.current?.elements.namedItem('starter') as HTMLInputElement | null)?.value ?? ''
    formData.set('starter', fromRef || fromHidden)

    const result = await createTopic(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="topic-form-page">
      <div className="topic-form-header animate-enter">
        <Link href={`/salas/${slug}`} className="topic-form-back">← Volver a la Sala</Link>
        <h1 className="topic-form-title">Nuevo Tema</h1>
      </div>

      <form ref={formRef} action={handleSubmit} className="topic-form animate-enter border-ornament" style={{ animationDelay: '0.1s' }}>

        <div className="form-group">
          <label htmlFor="title">Título del Tema *</label>
          <input
            id="title" name="title" type="text"
            placeholder="Ej: El encuentro en la taberna"
            className="input-base" required maxLength={120} autoFocus
          />
        </div>

        {characters.length > 0 && (
          <div className="form-group">
            <label htmlFor="character_id">Publicar como personaje <span className="optional">(opcional)</span></label>
            <select id="character_id" name="character_id" className="input-base">
              <option value="">— Yo mismo —</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Entrada inicial <span className="optional">(opcional)</span></label>
          <QuillEditor
            ref={starterRef}
            name="starter"
            placeholder="Describe la escena inicial, el contexto del tema..."
            height={280}
          />
        </div>

        {error && <div className="auth-error"><span>⚠</span> {error}</div>}

        <div className="topic-form-actions">
          <Link href={`/salas/${slug}`} className="btn-ghost">Cancelar</Link>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Creando...</> : 'Crear Tema'}
          </button>
        </div>
      </form>

      <style>{`
        .topic-form-page { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .topic-form-header { display: flex; align-items: center; gap: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle); position: relative; }
        .topic-form-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 60px; height: 2px; background: var(--color-crimson); }
        .topic-form-back { color: var(--text-muted); font-family: var(--font-cinzel); font-size: 0.78rem; letter-spacing: 0.06em; text-decoration: none; transition: color 0.2s; white-space: nowrap; }
        .topic-form-back:hover { color: var(--color-crimson); }
        .topic-form-title { font-family: var(--font-cinzel); font-size: 1.6rem; font-weight: 700; margin: 0; }
        .topic-form { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-family: var(--font-cinzel); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); }
        .optional { text-transform: none; font-weight: 400; color: var(--text-muted); font-family: var(--font-crimson-pro); letter-spacing: 0; font-size: 0.8rem; }
        .auth-error { background: rgba(193,6,6,0.12); border: 1px solid rgba(193,6,6,0.3); border-radius: 4px; padding: 0.65rem 1rem; color: #ff6b6b; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; }
        .topic-form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}