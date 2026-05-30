'use client'

import { useState } from 'react'
import { resetPassword } from '../actions'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await resetPassword(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // Si no hay error, la action hace redirect a /
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-overlay" />

      <div className="auth-logo animate-enter" style={{ animationDelay: '0s' }}>
        <div className="auth-logo-symbol">✦</div>
        <h1 className="auth-logo-text">TalesRol</h1>
        <p className="auth-logo-sub">Plataforma de Roleplay</p>
      </div>

      <div className="auth-card animate-enter border-ornament" style={{ animationDelay: '0.1s' }}>
        <div className="auth-card-header">
          <h2>Nueva contraseña</h2>
          <p>Elige una contraseña segura para tu cuenta</p>
        </div>

        <form action={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">Nueva contraseña</label>
            <div className="input-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-base"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            <span className="field-hint">Mínimo 6 caracteres</span>
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirmar contraseña</label>
            <div className="input-password-wrap">
              <input
                id="confirm"
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-base"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Guardando...
              </>
            ) : (
              'Guardar nueva contraseña'
            )}
          </button>
        </form>
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
            radial-gradient(ellipse 40% 60% at 80% 80%, rgba(193,6,6,0.06) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .auth-logo {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
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
          max-width: 420px;
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
        .auth-card-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-family: var(--font-cinzel);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .input-password-wrap {
          position: relative;
        }
        .input-password-wrap .input-base {
          width: 100%;
          padding-right: 2.8rem;
          box-sizing: border-box;
        }
        .toggle-pw {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .toggle-pw:hover { opacity: 1; }
        .field-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          opacity: 0.7;
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
        .auth-submit {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.8rem;
        }
        .spinner {
          width: 16px;
          height: 16px;
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