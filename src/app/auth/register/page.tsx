'use client'

import { useState } from 'react'
import Link from 'next/link'
import { register } from '../actions'

export default function RegisterPage() {
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')

  // Validación en tiempo real del username
  const usernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(username)
  const usernameHint  = username.length > 0 && !usernameValid

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-overlay" />

      {/* Logo */}
      <Link href="/" className="auth-logo animate-enter" style={{ animationDelay: '0s' }}>
        <div className="auth-logo-symbol">✦</div>
        <h1 className="auth-logo-text">TalesRol</h1>
        <p className="auth-logo-sub">Plataforma de Roleplay</p>
      </Link>

      {/* Card */}
      <div className="auth-card animate-enter border-ornament" style={{ animationDelay: '0.1s' }}>
        <div className="auth-card-header">
          <h2>Crear Cuenta</h2>
          <p>Comienza tu historia hoy</p>
        </div>

        <form action={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">
              Nombre de usuario
              {username.length > 0 && (
                <span className={usernameValid ? 'field-ok' : 'field-err'}>
                  {usernameValid ? ' ✓' : ' ✗'}
                </span>
              )}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="aventurero_oscuro"
              className={`input-base ${usernameHint ? 'input-error' : ''}`}
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={20}
              required
              autoComplete="username"
            />
            {usernameHint && (
              <span className="field-hint">
                3–20 caracteres, solo letras, números y guiones bajos
              </span>
            )}
          </div>

          {/* Display name */}
          <div className="form-group">
            <label htmlFor="display_name">Nombre visible <span className="optional">(opcional)</span></label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="El Cronista"
              className="input-base"
              maxLength={40}
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              className="input-base"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="input-base"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading || (username.length > 0 && !usernameValid)}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Creando cuenta...
              </>
            ) : (
              'Unirse a TalesRol'
            )}
          </button>

          <p className="auth-terms">
            Al registrarte aceptas las{' '}
            <Link href="/normas">normas de la comunidad</Link>.
          </p>
        </form>

        <div className="divider-ornament">
          <span>✦</span>
        </div>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login">Iniciar sesión</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }
        .auth-bg-overlay {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(193,6,6,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 20% 80%, rgba(193,6,6,0.06) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .auth-logo {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .auth-logo-symbol {
          font-size: 2rem;
          color: var(--color-crimson);
          display: block;
          margin-bottom: 0.5rem;
          animation: flicker 3s infinite;
        }
        .auth-logo-text {
          font-family: var(--font-cinzel);
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #ff4444 0%, #C10606 50%, #8a0404 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1;
        }
        .auth-logo-sub {
          color: var(--text-muted);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: 0.4rem;
          font-family: var(--font-cinzel);
        }
        .auth-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 2.5rem;
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(193,6,6,0.06);
        }
        .auth-card-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-card-header h2 {
          font-family: var(--font-cinzel);
          font-size: 1.4rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--text-primary);
          margin: 0 0 0.4rem;
        }
        .auth-card-header p { color: var(--text-muted); font-size: 0.9rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
        .form-group label {
          font-family: var(--font-cinzel);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .input-error { border-color: rgba(193,6,6,0.5) !important; }
        .field-ok  { color: #4caf50; font-weight: 700; }
        .field-err { color: var(--color-crimson); font-weight: 700; }
        .field-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: -0.1rem;
        }
        .optional {
          text-transform: none;
          font-weight: 400;
          color: var(--text-muted);
          font-family: var(--font-crimson-pro);
          letter-spacing: 0;
          font-size: 0.8rem;
        }
        .auth-error {
          background: rgba(193,6,6,0.12);
          border: 1px solid rgba(193,6,6,0.3);
          border-radius: 4px;
          padding: 0.65rem 1rem;
          color: #ff6b6b;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .auth-submit { width: 100%; padding: 0.8rem; margin-top: 0.5rem; }
        .auth-terms {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.82rem;
          margin: -0.5rem 0 0;
        }
        .auth-terms a { color: var(--text-secondary); }
        .auth-terms a:hover { color: var(--color-crimson); }
        .auth-switch {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
        }
        .auth-switch a { color: var(--color-crimson); font-weight: 600; }
        .auth-switch a:hover { color: #ff4444; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes flicker {
          0%,100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
      `}</style>
    </div>
  )
}