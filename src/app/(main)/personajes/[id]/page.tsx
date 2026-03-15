import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Character, Profile } from '@/types/database'
import CharacterActions from './CharacterActions'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('characters').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Personaje' }
}

export default async function PersonajeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: char } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!char) notFound()

  const character = char as Character
  const isOwner   = user?.id === character.user_id

  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url')
    .eq('id', character.user_id)
    .single()

  const owner  = ownerProfile as Pick<Profile, 'username' | 'display_name' | 'avatar_url'> | null
  const avatar = character.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${character.id}`
  const sheet  = character.sheet as Record<string, string>

  return (
    <div className="char-detail-page">
      <div className="char-detail-nav animate-enter">
        <Link href="/personajes" className="char-back">← Mis Personajes</Link>
        {isOwner && (
          <div className="char-owner-actions">
            <Link href={`/personajes/${id}/editar`} className="btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
              ✎ Editar
            </Link>
            <CharacterActions id={id} isActive={character.is_active} />
          </div>
        )}
      </div>

      <div className="char-detail-card animate-enter border-ornament" style={{ animationDelay: '0.1s' }}>
        <div className="char-detail-header">
          <div className="char-detail-avatar-wrap">
            <img src={avatar} alt={character.name} className="char-detail-avatar" />
            <span className={`char-detail-status ${character.is_active ? 'active' : ''}`}>
              {character.is_active ? '● Activo' : '○ Inactivo'}
            </span>
          </div>
          <div className="char-detail-meta">
            <h1 className="char-detail-name">{character.name}</h1>
            {owner && (
              <Link href={`/perfil/${owner.username}`} className="char-detail-owner">
                <img src={owner.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${owner.username}`} alt={owner.username} className="char-owner-avatar" />
                <span>Creado por <strong>{owner.display_name || owner.username}</strong></span>
              </Link>
            )}
            <p className="char-detail-date">
              Creado el {new Date(character.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {character.description && (
          <div className="char-detail-section">
            <h2 className="char-section-title">Descripción</h2>
            <p className="char-detail-desc">{character.description}</p>
          </div>
        )}

        {Object.keys(sheet).length > 0 && (
          <div className="char-detail-section">
            <h2 className="char-section-title">Ficha del Personaje</h2>
            <div className="char-detail-sheet">
              {Object.entries(sheet).map(([key, val]) => (
                <div key={key} className="char-sheet-entry">
                  <span className="char-sheet-entry-key">{key}</span>
                  <span className="char-sheet-entry-val">{String(val) || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(sheet).length === 0 && !character.description && (
          <div className="char-detail-empty">
            <p>Este personaje aún no tiene descripción ni ficha.</p>
            {isOwner && <Link href={`/personajes/${id}/editar`} className="btn-primary" style={{ marginTop: '1rem' }}>Añadir información</Link>}
          </div>
        )}
      </div>

      <style>{`
        .char-detail-page { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .char-detail-nav { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .char-back { color: var(--text-muted); font-family: var(--font-cinzel); font-size: 0.78rem; letter-spacing: 0.06em; text-decoration: none; transition: color 0.2s; }
        .char-back:hover { color: var(--color-crimson); }
        .char-owner-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .char-detail-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 2rem; display: flex; flex-direction: column; gap: 1.75rem; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .char-detail-header { display: flex; gap: 1.5rem; align-items: flex-start; }
        .char-detail-avatar-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; flex-shrink: 0; }
        .char-detail-avatar { width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--border-medium); object-fit: cover; background: var(--bg-secondary); }
        .char-detail-status { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.06em; white-space: nowrap; }
        .char-detail-status.active { color: var(--color-crimson); }
        .char-detail-meta { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .char-detail-name { font-family: var(--font-cinzel); font-size: 1.8rem; font-weight: 700; margin: 0; letter-spacing: 0.05em; }
        .char-detail-owner { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: var(--text-secondary); font-size: 0.88rem; transition: color 0.2s; }
        .char-detail-owner:hover { color: var(--color-crimson); }
        .char-detail-owner strong { color: var(--text-primary); }
        .char-owner-avatar { width: 22px; height: 22px; border-radius: 50%; border: 1px solid var(--border-subtle); }
        .char-detail-date { font-size: 0.78rem; color: var(--text-muted); margin: 0; }
        .char-detail-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .char-section-title { font-family: var(--font-cinzel); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin: 0; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle); }
        .char-detail-desc { color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin: 0; white-space: pre-wrap; }
        .char-detail-sheet { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem; }
        .char-sheet-entry { display: flex; flex-direction: column; gap: 0.2rem; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 0.6rem 0.85rem; }
        .char-sheet-entry-key { font-family: var(--font-cinzel); font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-crimson); }
        .char-sheet-entry-val { font-size: 0.95rem; color: var(--text-primary); }
        .char-detail-empty { text-align: center; padding: 2rem; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; }
        @media (max-width: 560px) { .char-detail-header { flex-direction: column; align-items: center; text-align: center; } .char-detail-owner { justify-content: center; } .char-detail-name { font-size: 1.4rem; } }
      `}</style>
    </div>
  )
}