'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateRoomDescription } from '../topicactions'
import QuillEditor from '@/components/editor/quilleditor'
import type { Room } from '@/types/database'

export default function EditarSalaPage() {
  const { slug } = useParams<{ slug: string }>()
  const supabase = createClient()

  const [room, setRoom]       = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [cover, setCover]     = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('rooms').select('*').eq('slug', slug).single()
      if (data) {
        setRoom(data as Room)
        setCover(data.cover_url ?? '')
      }
      setLoading(false)
    }
    load()
  }, [slug])

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    setError(null)
    if (room) {
      formData.set('id', room.id)
      formData.set('slug', slug)
    }
    const result = await updateRoomDescription(formData)
    if (result?.error) { setError(result.error); setSaving(false) }
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-crimson)' }}>✦</div>
      Cargando sala...
    </div>
  )

  if (!room) return null

  return (
    <div className="sala-form-page">
      <div className="sala-form-header animate-enter">
        <Link href={`/salas/${slug}`} className="sala-form-back">← Volver a la Sala</Link>
        <h1 className="sala-form-title">Editar Sala</h1>
      </div>

      <form action={handleSubmit} className="sala-form animate-enter border-ornament" style={{ animationDelay: '0.1s' }}>

        {cover && (
          <div className="sala-cover-preview">
            <img src={cover} alt="Cover" />
            <div className="sala-cover-overlay" />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input id="title" name="title" type="text" className="input-base" defaultValue={room.title} required maxLength={80} />
        </div>

        <div className="form-group">
          <label>Descripción <span className="optional">(HTML permitido)</span></label>
          <QuillEditor
            name="description"
            defaultValue={room.description ?? ''}
            placeholder="Describe el mundo, la ambientación..."
            height={320}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cover_url">URL del Banner <span className="optional">(opcional)</span></label>
          <input
            id="cover_url"
            name="cover_url"
            type="url"
            placeholder="https://ejemplo.com/banner.jpg"
            className="input-base"
            value={cover}
            onChange={e => setCover(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Etiquetas <span className="optional">(separadas por comas)</span></label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="input-base"
            defaultValue={room.tags?.join(', ') ?? ''}
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Estado de la Sala</label>
          <select id="status" name="status" className="input-base" defaultValue={room.status}>
            <option value="active">● Activa</option>
            <option value="paused">⏸ En Pausa</option>
            <option value="closed">✕ Cerrada</option>
          </select>
        </div>

        {error && <div className="auth-error"><span>⚠</span> {error}</div>}

        <div className="sala-form-actions">
          <Link href={`/salas/${slug}`} className="btn-ghost">Cancelar</Link>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <><span className="spinner" /> Guardando...</> : 'Guardar Cambios'}
          </button>
        </div>
      </form>

      <style>{`
        .sala-form-page { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .sala-form-header { display: flex; align-items: center; gap: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle); position: relative; }
        .sala-form-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 60px; height: 2px; background: var(--color-crimson); }
        .sala-form-back { color: var(--text-muted); font-family: var(--font-cinzel); font-size: 0.78rem; letter-spacing: 0.06em; text-decoration: none; transition: color 0.2s; white-space: nowrap; }
        .sala-form-back:hover { color: var(--color-crimson); }
        .sala-form-title { font-family: var(--font-cinzel); font-size: 1.6rem; font-weight: 700; margin: 0; }
        .sala-form { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; overflow: hidden; }
        .sala-cover-preview { height: 140px; border-radius: 4px; overflow: hidden; position: relative; }
        .sala-cover-preview img { width: 100%; height: 100%; object-fit: cover; }
        .sala-cover-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.7)); }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-family: var(--font-cinzel); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); }
        .optional { text-transform: none; font-weight: 400; color: var(--text-muted); font-family: var(--font-crimson-pro); letter-spacing: 0; font-size: 0.8rem; }
        .auth-error { background: rgba(193,6,6,0.12); border: 1px solid rgba(193,6,6,0.3); border-radius: 4px; padding: 0.65rem 1rem; color: #ff6b6b; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; }
        .sala-form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}