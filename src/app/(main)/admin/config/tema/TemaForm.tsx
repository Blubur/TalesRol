'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

interface Props {
  config: Record<string, string>
}

const FONT_PRESETS = [
  'Cinzel', 'Crimson Pro', 'Playfair Display', 'Lora', 'Merriweather',
  'Raleway', 'Oswald', 'Montserrat', 'Open Sans', 'Roboto',
  'IM Fell English', 'MedievalSharp', 'UnifrakturMaguntia',
]

function ColorField({
  label, name, value, onChange,
}: { label: string; name: string; value: string; onChange: (k: string, v: string) => void }) {
  return (
    <div className="theme-field">
      <label>{label}</label>
      <div className="theme-color-row">
        <input
          type="color"
          value={value}
          onChange={e => onChange(name, e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

function FontField({
  label, name, value, onChange,
}: { label: string; name: string; value: string; onChange: (k: string, v: string) => void }) {
  return (
    <div className="theme-field">
      <label>{label}</label>
      <div className="theme-font-row">
        <input
          type="text"
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder="Ej: Cinzel"
          list={`list-${name}`}
        />
        <datalist id={`list-${name}`}>
          {FONT_PRESETS.map(f => <option key={f} value={f} />)}
        </datalist>
        {value && (
          <span
            className="theme-font-preview"
            style={{ fontFamily: `'${value}', serif` }}
          >
            AaBbCc
          </span>
        )}
      </div>
    </div>
  )
}

export default function TemaForm({ config }: Props) {
  const [values, setValues] = useState<Record<string, string>>({
    theme_bg_base:        config.theme_bg_base        ?? '#0f0f1a',
    theme_bg_card:        config.theme_bg_card        ?? '#1a1a2e',
    theme_accent:         config.theme_accent         ?? '#c9a84c',
    theme_text_primary:   config.theme_text_primary   ?? '#e0e0e0',
    theme_text_muted:     config.theme_text_muted     ?? '#888888',
    theme_navbar_bg:      config.theme_navbar_bg      ?? '#0a0a14',
    theme_footer_bg:      config.theme_footer_bg      ?? '#0a0a14',
    theme_font_headings:  config.theme_font_headings  ?? 'Cinzel',
    theme_font_body:      config.theme_font_body      ?? 'Crimson Pro',
    theme_font_size_base: config.theme_font_size_base ?? '16',
    theme_font_size_h1:   config.theme_font_size_h1   ?? '2',
    theme_font_extra_links: config.theme_font_extra_links ?? '',
  })

  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  function set(key: string, val: string) {
    setValues(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      for (const [key, value] of Object.entries(values)) {
        await saveConfig(key, value)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Error al guardar. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  // Build live preview CSS
  const headingFont = values.theme_font_headings
  const bodyFont    = values.theme_font_body
  const gFonts = [...new Set([headingFont, bodyFont])]
    .filter(Boolean)
    .map(f => f.replace(/ /g, '+'))
    .join('&family=')
  const googleUrl = gFonts
    ? `https://fonts.googleapis.com/css2?family=${gFonts}&display=swap`
    : null

  const previewStyle: React.CSSProperties = {
    background:   values.theme_bg_base,
    color:        values.theme_text_primary,
    fontFamily:   `'${bodyFont}', serif`,
    borderRadius: '8px',
    padding:      '1.5rem',
    marginTop:    '1.5rem',
    border:       '1px solid #333',
  }

  return (
    <div className="admin-config-content">
      {googleUrl && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={googleUrl} />
      )}
      {values.theme_font_extra_links && (
        <div
          dangerouslySetInnerHTML={{
            __html: values.theme_font_extra_links
              .split('\n')
              .filter(l => l.trim().startsWith('<link'))
              .join('\n'),
          }}
        />
      )}

      <div className="admin-config-header">
        <h2>Tema visual</h2>
        <p className="admin-config-subtitle">
          Personaliza colores, fuentes y tamaños. Los cambios se aplican en toda la web.
        </p>
      </div>

      {/* ── COLORES ───────────────────────────────────────────── */}
      <section className="theme-section">
        <h3>Colores</h3>
        <div className="theme-grid">
          <ColorField label="Fondo principal"        name="theme_bg_base"      value={values.theme_bg_base}      onChange={set} />
          <ColorField label="Fondo tarjetas/paneles" name="theme_bg_card"      value={values.theme_bg_card}      onChange={set} />
          <ColorField label="Acento / Botones"       name="theme_accent"       value={values.theme_accent}       onChange={set} />
          <ColorField label="Texto principal"        name="theme_text_primary" value={values.theme_text_primary} onChange={set} />
          <ColorField label="Texto secundario"       name="theme_text_muted"   value={values.theme_text_muted}   onChange={set} />
          <ColorField label="Fondo Navbar"           name="theme_navbar_bg"    value={values.theme_navbar_bg}    onChange={set} />
          <ColorField label="Fondo Footer"           name="theme_footer_bg"    value={values.theme_footer_bg}    onChange={set} />
        </div>
      </section>

      {/* ── FUENTES ───────────────────────────────────────────── */}
      <section className="theme-section">
        <h3>Fuentes</h3>
        <p className="theme-hint">
          Escribe el nombre exacto de cualquier fuente de{' '}
          <a href="https://fonts.google.com" target="_blank" rel="noreferrer">Google Fonts</a>.
          Se cargará automáticamente.
        </p>
        <div className="theme-grid">
          <FontField label="Fuente de títulos"  name="theme_font_headings" value={values.theme_font_headings} onChange={set} />
          <FontField label="Fuente del cuerpo"  name="theme_font_body"     value={values.theme_font_body}     onChange={set} />
        </div>

        <div className="theme-field" style={{ marginTop: '1rem' }}>
          <label>Links externos adicionales (una etiqueta &lt;link&gt; por línea)</label>
          <textarea
            rows={3}
            value={values.theme_font_extra_links}
            onChange={e => set('theme_font_extra_links', e.target.value)}
            placeholder={'<link href="https://fonts.googleapis.com/css2?family=MiTipografia&display=swap" rel="stylesheet">'}
            style={{ fontFamily: 'monospace', fontSize: '0.8rem', width: '100%', resize: 'vertical' }}
          />
        </div>
      </section>

      {/* ── TAMAÑOS ───────────────────────────────────────────── */}
      <section className="theme-section">
        <h3>Tamaños de fuente</h3>
        <div className="theme-grid">
          <div className="theme-field">
            <label>Tamaño base del cuerpo (px)</label>
            <div className="theme-size-row">
              <input
                type="range" min="12" max="24" step="1"
                value={values.theme_font_size_base}
                onChange={e => set('theme_font_size_base', e.target.value)}
              />
              <span>{values.theme_font_size_base}px</span>
            </div>
          </div>
          <div className="theme-field">
            <label>Tamaño H1 (rem)</label>
            <div className="theme-size-row">
              <input
                type="range" min="1" max="4" step="0.1"
                value={values.theme_font_size_h1}
                onChange={e => set('theme_font_size_h1', e.target.value)}
              />
              <span>{values.theme_font_size_h1}rem</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PREVIEW ───────────────────────────────────────────── */}
      <section className="theme-section">
        <h3>Vista previa</h3>
        <div style={previewStyle}>
          <div style={{ background: values.theme_navbar_bg, padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            ▸ Navbar
          </div>
          <h1 style={{
            fontFamily: `'${headingFont}', serif`,
            fontSize: `${values.theme_font_size_h1}rem`,
            color: values.theme_text_primary,
            marginBottom: '0.5rem',
          }}>
            Título de ejemplo
          </h1>
          <p style={{ color: values.theme_text_muted, marginBottom: '1rem' }}>
            Texto secundario — descripción o subtítulo.
          </p>
          <div style={{
            background: values.theme_bg_card,
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <p style={{ margin: 0 }}>
              Contenido de una tarjeta. Este es el texto principal de la plataforma con la fuente del cuerpo.
            </p>
          </div>
          <button style={{
            background: values.theme_accent,
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1.2rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: `'${headingFont}', serif`,
          }}>
            Botón de acento
          </button>
          <div style={{ background: values.theme_footer_bg, padding: '0.5rem 1rem', borderRadius: '4px', marginTop: '1rem', fontSize: '0.8rem', color: values.theme_text_muted }}>
            ▸ Footer
          </div>
        </div>
      </section>

      {/* ── GUARDAR ───────────────────────────────────────────── */}
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-config-actions">
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary"
        >
          {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar tema'}
        </button>
      </div>

      <style>{`
        .theme-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border, #2a2a3e);
        }
        .theme-section h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-primary, #e0e0e0);
        }
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
        }
        .theme-field label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted, #888);
          margin-bottom: 0.4rem;
        }
        .theme-color-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .theme-color-row input[type="color"] {
          width: 40px;
          height: 36px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          padding: 2px;
          background: transparent;
        }
        .theme-color-row input[type="text"] {
          flex: 1;
          font-family: monospace;
          font-size: 0.85rem;
        }
        .theme-font-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .theme-font-row input {
          flex: 1;
        }
        .theme-font-preview {
          font-size: 1rem;
          white-space: nowrap;
          color: var(--text-muted, #888);
        }
        .theme-size-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .theme-size-row input[type="range"] {
          flex: 1;
        }
        .theme-size-row span {
          font-size: 0.85rem;
          font-family: monospace;
          min-width: 40px;
          text-align: right;
          color: var(--text-muted, #888);
        }
        .theme-hint {
          font-size: 0.8rem;
          color: var(--text-muted, #888);
          margin-bottom: 0.75rem;
        }
        .theme-hint a {
          color: var(--accent, #c9a84c);
        }
      `}</style>
    </div>
  )
}