'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateTopic, deleteTopic } from '../../topicactions'
import QuillEditor from '@/components/editor/quilleditor'
import type { Topic } from '@/types/database'

export default function EditarTemaPage() {
  const { slug, topicId } = useParams<{ slug: string; topicId: string }>()
  const supabase = createClient()

  const [topic, setTopic]     = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .is('deleted_at', null)
        .single()
      if (data) setTopic(data as Topic)
      setLoading(false)
    }
    load()
  }, [topicId])

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    setError(null)
    formData.set('id', topicId)
    formData.set('slug', slug)
    const result = await updateTopic(formData)
    if (result?.error) { setError(result.error); setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este tema y todos sus posts?')) return
    setSaving(true)
    await deleteTopic(topicId, slug)
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-crimson)' }}>✦</div>
      Cargando tema...
    </div>
  )

  if (!topic) return null

  return (
    <div className="topic-form-page">
      <div className="topic-form-header animate-enter">
        <Link href={`/salas/${slug}/${topicId}`} className="topic-form-back">← Volver al Tema</Link>
        <h1 className="topic-form-title">Editar Tema</h1>
      </div>

      <form action={handleSubmit} className="topic-form animate-enter border-ornament" style={{ animationDelay: '0.1s' }}>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            name="title"
            type="text"
            className="input-base"
            defaultValue={topic.title}
            required
            maxLength={120}
          />
        </div>

        <div className="form-group">
          <label>Entrada inicial <span className="optional">(opcional)</span></label>
          <QuillEditor
            name="starter"
            defaultValue={topic.starter ?? ''}
            placeholder="Descripción o entrada inicial del tema..."
            height={280}
          />
        </div>

        {error && <div className="auth-error"><span>⚠</span> {error}</div>}

        <div className="topic-form-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={handleDelete}
            disabled={saving}
            style={{ color: 'var(--text-muted)', marginRight: 'auto' }}
          >
            ✕ Eliminar Tema
          </button>
          <Link href={`/salas/${slug}/${topicId}`} className="btn-ghost">Cancelar</Link>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <><span className="spinner" /> Guardando...</> : 'Guardar Cambios'}
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
        .topic-form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); align-items: center; }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}