'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updatePrivacy } from './actions'
import {
  UserGroupIcon,
  BookOpenIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'

interface Props {
  username: string
  privacyCharacters: boolean
  privacyRooms: boolean
  privacyPosts: boolean
}

interface ToggleRowProps {
  icon: React.ReactNode
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ icon, label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className={`toggle-row ${value ? 'public' : 'private'}`}>
      <div className="toggle-icon">{icon}</div>
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        <span className="toggle-desc">{description}</span>
      </div>
      <button
        type="button"
        className={`toggle-btn ${value ? 'on' : 'off'}`}
        onClick={() => onChange(!value)}
        aria-label={value ? 'Hacer privado' : 'Hacer público'}
      >
        <span className="toggle-thumb" />
      </button>
      <span className={`toggle-status ${value ? 'public' : 'private'}`}>
        {value
          ? <><EyeIcon style={{ width: 12, height: 12 }} /> Público</>
          : <><EyeSlashIcon style={{ width: 12, height: 12 }} /> Privado</>
        }
      </span>
    </div>
  )
}

export default function PrivacyForm({ username, privacyCharacters, privacyRooms, privacyPosts }: Props) {
  const [characters, setCharacters] = useState(privacyCharacters)
  const [rooms, setRooms]           = useState(privacyRooms)
  const [posts, setPosts]           = useState(privacyPosts)
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  async function handleSave() {
    setLoading(true)
    setError(null)
    setSuccess(false)
    const result = await updatePrivacy({ characters, rooms, posts })
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else { setSuccess(true); setTimeout(() => setSuccess(false), 3000) }
  }

  return (
    <div className="privacy-card">
      <h2 className="privacy-card-title">Visibilidad en tu perfil</h2>
      <p className="privacy-card-desc">
        Los administradores siempre pueden ver toda la información independientemente de esta configuración.
      </p>

      <div className="toggles-list">
        <ToggleRow
          icon={<UserGroupIcon style={{ width: 16, height: 16 }} />}
          label="Personajes"
          description="Muestra tus personajes activos en tu perfil público."
          value={characters}
          onChange={setCharacters}
        />
        <ToggleRow
          icon={<BookOpenIcon style={{ width: 16, height: 16 }} />}
          label="Salas"
          description="Muestra las salas de rol en las que participas."
          value={rooms}
          onChange={setRooms}
        />
        <ToggleRow
          icon={<PencilIcon style={{ width: 16, height: 16 }} />}
          label="Posts recientes"
          description="Muestra tus últimas intervenciones en los temas."
          value={posts}
          onChange={setPosts}
        />
      </div>

      {error && (
        <div className="privacy-error">{error}</div>
      )}
      {success && (
        <div className="privacy-success">Preferencias guardadas correctamente.</div>
      )}

      <div className="privacy-actions">
        <Link href={`/perfil/${username}`} className="btn-ghost btn-sm">Cancelar</Link>
        <button className="btn-primary btn-sm" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar preferencias'}
        </button>
      </div>

      <style>{`
        .privacy-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-5); }
        .privacy-card-title { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-crimson); margin: 0; padding-bottom: var(--space-2); border-bottom: 1px solid var(--border-subtle); }
        .privacy-card-desc { font-size: var(--text-sm); color: var(--text-muted); margin: 0; line-height: 1.5; }

        .toggles-list { display: flex; flex-direction: column; gap: var(--space-3); }

        .toggle-row { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); transition: border-color var(--transition-base); }
        .toggle-row.public  { border-color: var(--color-success-border); }
        .toggle-row.private { border-color: var(--border-subtle); }

        .toggle-icon { color: var(--color-crimson); flex-shrink: 0; display: flex; }
        .toggle-info { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
        .toggle-label { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); letter-spacing: 0.03em; }
        .toggle-desc { font-size: var(--text-xs); color: var(--text-muted); line-height: 1.4; }

        .toggle-btn { position: relative; width: 40px; height: 22px; border-radius: var(--radius-full); border: none; cursor: pointer; transition: background var(--transition-base); flex-shrink: 0; }
        .toggle-btn.on  { background: var(--color-success); }
        .toggle-btn.off { background: var(--text-muted); }
        .toggle-thumb { position: absolute; top: 3px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: left var(--transition-base); }
        .toggle-btn.on  .toggle-thumb { left: 21px; }
        .toggle-btn.off .toggle-thumb { left: 3px; }

        .toggle-status { display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); font-family: var(--font-display); letter-spacing: 0.05em; white-space: nowrap; flex-shrink: 0; }
        .toggle-status.public  { color: var(--color-success); }
        .toggle-status.private { color: var(--text-muted); }

        .privacy-error   { background: var(--color-error-bg); border: 1px solid var(--color-error-border); border-radius: var(--radius-sm); padding: var(--space-3) var(--space-4); color: var(--color-error); font-size: var(--text-sm); }
        .privacy-success { background: var(--color-success-bg); border: 1px solid var(--color-success-border); border-radius: var(--radius-sm); padding: var(--space-3) var(--space-4); color: var(--color-success); font-size: var(--text-sm); }

        .privacy-actions { display: flex; justify-content: flex-end; gap: var(--space-3); }
      `}</style>
    </div>
  )
}