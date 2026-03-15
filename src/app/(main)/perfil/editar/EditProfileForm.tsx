'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateProfile, updatePassword } from './actions'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile
}

export default function EditProfileForm({ profile }: Props) {
  const [error, setError]         = useState<string | null>(null)
  const [success, setSuccess]     = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const [pwError, setPwError]     = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url ?? '')
  const [bannerPreview, setBannerPreview] = useState(profile.banner_url ?? '')

  async function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    if (result?.error) { setError(result.error); setLoading(false) }
    // Si no hay error, updateProfile hace redirect automático
  }

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPwLoading(true)
    setPwError(null)
    setPwSuccess(false)
    const formData = new FormData(e.currentTarget)
    const result = await updatePassword(formData)
    setPwLoading(false)
    if (result?.error) { setPwError(result.error) }
    else { setPwSuccess(true); (e.target as HTMLFormElement).reset() }
  }

  const avatarUrl = avatarPreview || `https://api.dicebear.com/7.x/gothic/svg?seed=${profile.username}`

  return (
    <div className="edit-page">

      {/* Breadcrumb */}
      <div className="edit-breadcrumb">
        <Link href={`/perfil/${profile.username}`} className="bc-link">← Volver al perfil</Link>
      </div>

      <h1 className="edit-title">✎ Editar perfil</h1>

      {/* FORMULARIO PRINCIPAL */}
      <form onSubmit={handleProfile} className="edit-card">
        <h2 className="card-title">Información personal</h2>

        {/* Preview */}
        <div className="preview-section">
          <div className="banner-preview" style={{ backgroundImage: bannerPreview ? `url(${bannerPreview})` : undefined }} />
          <div className="avatar-preview-wrap">
            <img src={avatarUrl} alt="avatar" className="avatar-preview" />
          </div>
        </div>

        <div className="fields-grid">

          {/* Display name */}
          <div className="form-group">
            <label htmlFor="display_name">Nombre visible</label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              className="input-base"
              defaultValue={profile.display_name ?? ''}
              placeholder={profile.username}
              maxLength={40}
            />
            <span className="field-hint">Si lo dejas vacío se usará tu nombre de usuario.</span>
          </div>

          {/* Avatar URL */}
          <div className="form-group">
            <label htmlFor="avatar_url">URL del avatar</label>
            <input
              id="avatar_url"
              name="avatar_url"
              type="url"
              className="input-base"
              value={avatarPreview}
              onChange={e => setAvatarPreview(e.target.value)}
              placeholder="https://..."
            />
            <span className="field-hint">Enlace directo a una imagen (jpg, png, webp).</span>
          </div>

          {/* Banner URL */}
          <div className="form-group full-width">
            <label htmlFor="banner_url">URL del banner</label>
            <input
              id="banner_url"
              name="banner_url"
              type="url"
              className="input-base"
              value={bannerPreview}
              onChange={e => setBannerPreview(e.target.value)}
              placeholder="https://..."
            />
            <span className="field-hint">Imagen horizontal para la cabecera de tu perfil (recomendado 1200×300).</span>
          </div>

          {/* Bio */}
          <div className="form-group full-width">
            <label htmlFor="bio">Biografía</label>
            <textarea
              id="bio"
              name="bio"
              className="input-base"
              defaultValue={profile.bio ?? ''}
              placeholder="Cuéntanos algo sobre ti..."
              rows={4}
              maxLength={500}
            />
            <span className="field-hint">Máximo 500 caracteres.</span>
          </div>

        </div>

        {error && <div className="form-error"><span>⚠</span> {error}</div>}
        {success && <div className="form-success"><span>✓</span> {success}</div>}

        <div className="form-actions">
          <Link href={`/perfil/${profile.username}`} className="btn-ghost">Cancelar</Link>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {/* CAMBIO DE CONTRASEÑA */}
      <form onSubmit={handlePassword} className="edit-card">
        <h2 className="card-title">Cambiar contraseña</h2>

        <div className="fields-grid">
          <div className="form-group">
            <label htmlFor="password">Nueva contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input-base"
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_confirm">Confirmar contraseña</label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              className="input-base"
              placeholder="Repite la contraseña"
              autoComplete="new-password"
            />
          </div>
        </div>

        {pwError && <div className="form-error"><span>⚠</span> {pwError}</div>}
        {pwSuccess && <div className="form-success"><span>✓</span> Contraseña actualizada correctamente.</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={pwLoading}>
            {pwLoading ? 'Actualizando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>

      <style>{`
        .edit-page { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .edit-breadcrumb { font-size: 0.8rem; }
        .bc-link { color: var(--text-muted); text-decoration: none; font-family: var(--font-cinzel); letter-spacing: 0.04em; transition: color 0.2s; }
        .bc-link:hover { color: var(--color-crimson); }
        .edit-title { font-family: var(--font-cinzel); font-size: 1.3rem; font-weight: 700; letter-spacing: 0.06em; margin: 0; }

        /* Card */
        .edit-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .card-title { font-family: var(--font-cinzel); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-crimson); margin: 0; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle); }

        /* Preview */
        .preview-section { position: relative; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-subtle); }
        .banner-preview { height: 100px; background: linear-gradient(135deg, #1a0a0a 0%, #2d0d0d 50%, #1a0a0a 100%); background-size: cover; background-position: center; }
        .avatar-preview-wrap { position: absolute; bottom: -24px; left: 1rem; }
        .avatar-preview { width: 64px; height: 64px; border-radius: 50%; border: 3px solid var(--bg-card); object-fit: cover; background: var(--bg-secondary); display: block; }

        /* Fields */
        .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group label { font-family: var(--font-cinzel); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); }
        .field-hint { font-size: 0.72rem; color: var(--text-muted); font-style: italic; }
        textarea.input-base { resize: vertical; min-height: 100px; }

        /* Feedback */
        .form-error { background: rgba(193,6,6,0.12); border: 1px solid rgba(193,6,6,0.3); border-radius: 4px; padding: 0.6rem 1rem; color: #ff6b6b; font-size: 0.88rem; display: flex; gap: 0.5rem; }
        .form-success { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); border-radius: 4px; padding: 0.6rem 1rem; color: #34d399; font-size: 0.88rem; display: flex; gap: 0.5rem; }

        /* Actions */
        .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }

        @media (max-width: 560px) {
          .fields-grid { grid-template-columns: 1fr; }
          .form-group.full-width { grid-column: 1; }
        }
      `}</style>
    </div>
  )
}