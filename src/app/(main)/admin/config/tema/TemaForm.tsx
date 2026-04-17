'use client'

import { useState } from 'react'
import { saveConfig } from '../configactions'

interface Props {
  config: Record<string, string>
}

const FONT_PRESETS = [
  'Texturina', 'Cinzel', 'Lora', 'Crimson Pro', 'Playfair Display',
  'Merriweather', 'IM Fell English', 'UnifrakturMaguntia',
  'Radio Canada', 'Raleway', 'Oswald', 'Montserrat', 'Open Sans', 'Roboto',
]

const DARK_COLOR_GROUPS = [
  {
    title: 'Acento Crimson — oscuro',
    hint: 'Color principal: botones, bordes, brillos.',
    fields: [
      { label: 'Crimson principal', key: 'theme_color_crimson',       default: '#C10606' },
      { label: 'Crimson oscuro',    key: 'theme_color_crimson_dim',   default: '#8a0404' },
      { label: 'Crimson claro',     key: 'theme_color_crimson_light', default: '#e53535' },
    ],
  },
  {
    title: 'Fondos — oscuro',
    fields: [
      { label: 'Fondo principal',   key: 'theme_bg_primary',   default: '#0a0a0a' },
      { label: 'Fondo secundario',  key: 'theme_bg_secondary', default: '#111111' },
      { label: 'Tarjetas',          key: 'theme_bg_card',      default: '#161616' },
      { label: 'Elevado (modales)', key: 'theme_bg_elevated',  default: '#1e1e1e' },
    ],
  },
  {
    title: 'Textos — oscuro',
    fields: [
      { label: 'Texto principal',   key: 'theme_text_primary',   default: '#e8e0d0' },
      { label: 'Texto secundario',  key: 'theme_text_secondary', default: '#9a9080' },
      { label: 'Texto apagado',     key: 'theme_text_muted',     default: '#5a5248' },
    ],
  },
]

const LIGHT_COLOR_GROUPS = [
  {
    title: 'Acento Crimson — claro',
    hint: 'Color principal en modo claro.',
    fields: [
      { label: 'Crimson principal', key: 'theme_light_color_crimson',       default: '#a80505' },
      { label: 'Crimson oscuro',    key: 'theme_light_color_crimson_dim',   default: '#7a0303' },
      { label: 'Crimson claro',     key: 'theme_light_color_crimson_light', default: '#c52020' },
    ],
  },
  {
    title: 'Fondos — claro',
    fields: [
      { label: 'Fondo principal',   key: 'theme_light_bg_primary',   default: '#f5f0eb' },
      { label: 'Fondo secundario',  key: 'theme_light_bg_secondary', default: '#ede8e2' },
      { label: 'Tarjetas',          key: 'theme_light_bg_card',      default: '#faf7f4' },
      { label: 'Elevado (modales)', key: 'theme_light_bg_elevated',  default: '#ffffff' },
    ],
  },
  {
    title: 'Textos — claro',
    fields: [
      { label: 'Texto principal',   key: 'theme_light_text_primary',   default: '#1a1410' },
      { label: 'Texto secundario',  key: 'theme_light_text_secondary', default: '#5a4e44' },
      { label: 'Texto apagado',     key: 'theme_light_text_muted',     default: '#9a8e84' },
    ],
  },
]

const SHARED_COLOR_GROUPS = [
  {
    title: 'Colores de estado (ambos modos)',
    fields: [
      { label: 'Éxito',       key: 'theme_color_success', default: '#4a9e6b' },
      { label: 'Advertencia', key: 'theme_color_warning', default: '#d4820a' },
      { label: 'Error',       key: 'theme_color_error',   default: '#e53535' },
      { label: 'Info',        key: 'theme_color_info',    default: '#5b8fd4' },
    ],
  },
  {
    title: 'Colores de rol (ambos modos)',
    fields: [
      { label: 'Admin',    key: 'theme_role_admin',    default: '#ff4444' },
      { label: 'Director', key: 'theme_role_director', default: '#d4820a' },
      { label: 'Master',   key: 'theme_role_master',   default: '#7b9bda' },
      { label: 'Jugador',  key: 'theme_role_jugador',  default: '#6db56d' },
      { label: 'Miembro',  key: 'theme_role_miembro',  default: '#9a9080' },
    ],
  },
]

const ALL_GROUPS = [...DARK_COLOR_GROUPS, ...LIGHT_COLOR_GROUPS, ...SHARED_COLOR_GROUPS]

function buildDefaults(config: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const group of ALL_GROUPS)
    for (const f of group.fields)
      out[f.key] = config[f.key] ?? f.default
  out.theme_font_display     = config.theme_font_display     ?? 'Texturina'
  out.theme_font_body        = config.theme_font_body        ?? 'Radio Canada'
  out.theme_font_extra_links = config.theme_font_extra_links ?? ''
  return out
}

function ColorField({ label, name, value, onChange }: {
  label: string; name: string; value: string
  onChange: (k: string, v: string) => void
}) {
  return (
    <div className="theme-field">
      <label>{label}</label>
      <div className="theme-color-row">
        <input
          type="color"
          value={value.startsWith('#') ? value : '#000000'}
          onChange={e => onChange(name, e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder="#000000"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

function FontField({ label, name, value, onChange }: {
  label: string; name: string; value: string
  onChange: (k: string, v: string) => void
}) {
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
          spellCheck={false}
        />
        <datalist id={`list-${name}`}>
          {FONT_PRESETS.map(f => <option key={f} value={f} />)}
        </datalist>
        {value && (
          <span className="theme-font-preview" style={{ fontFamily: `'${value}', serif` }}>
            AaBbCc
          </span>
        )}
      </div>
    </div>
  )
}

type Tab = 'dark' | 'light' | 'shared' | 'fonts'

export default function TemaForm({ config }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => buildDefaults(config))
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')
  const [tab,    setTab]    = useState<Tab>('dark')

  function set(key: string, val: string) {
    setValues(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const result = await saveConfig(values)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError('Error al guardar. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const displayFont = values.theme_font_display
  const bodyFont    = values.theme_font_body
  const gFonts = [...new Set([displayFont, bodyFont])]
    .filter(Boolean).map(f => f.replace(/ /g, '+')).join('&family=')
  const googleUrl = gFonts
    ? `https://fonts.googleapis.com/css2?family=${gFonts}:wght@400;600;700&display=swap`
    : null

  const c = values

  // Grupos a mostrar según pestaña activa
  const visibleGroups =
    tab === 'dark'   ? DARK_COLOR_GROUPS :
    tab === 'light'  ? LIGHT_COLOR_GROUPS :
    tab === 'shared' ? SHARED_COLOR_GROUPS : []

  // Colores del preview según pestaña
  const isDarkPreview = tab !== 'light'
  const pc = {
    bg_primary:    isDarkPreview ? c.theme_bg_primary   : c.theme_light_bg_primary,
    bg_secondary:  isDarkPreview ? c.theme_bg_secondary : c.theme_light_bg_secondary,
    bg_card:       isDarkPreview ? c.theme_bg_card      : c.theme_light_bg_card,
    text_primary:  isDarkPreview ? c.theme_text_primary : c.theme_light_text_primary,
    text_secondary:isDarkPreview ? c.theme_text_secondary : c.theme_light_text_secondary,
    text_muted:    isDarkPreview ? c.theme_text_muted   : c.theme_light_text_muted,
    crimson:       isDarkPreview ? c.theme_color_crimson : c.theme_light_color_crimson,
    crimson_light: isDarkPreview ? c.theme_color_crimson_light : c.theme_light_color_crimson_light,
  }

  return (
    <div className="admin-config-content">
      {googleUrl && <link rel="stylesheet" href={googleUrl} />}

      <div className="admin-config-header">
        <h2>Tema visual</h2>
        <p className="admin-config-subtitle">
          Personaliza colores y fuentes para ambos modos. Los cambios se aplican al guardar.
        </p>
      </div>

      {/* ── PESTAÑAS ─────────────────────────────────────────── */}
      <div className="theme-tabs">
        {([
          ['dark',   '🌙 Modo oscuro'],
          ['light',  '☀️ Modo claro'],
          ['shared', '🎨 Estado y roles'],
          ['fonts',  '🔤 Fuentes'],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`theme-tab${tab === id ? ' theme-tab--active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── GRUPOS DE COLOR ──────────────────────────────────── */}
      {tab !== 'fonts' && (
        <>
          {visibleGroups.map(group => (
            <section key={group.title} className="theme-section">
              <h3>{group.title}</h3>
              {'hint' in group && group.hint && <p className="theme-hint">{group.hint}</p>}
              <div className="theme-grid">
                {group.fields.map(f => (
                  <ColorField
                    key={f.key}
                    label={f.label}
                    name={f.key}
                    value={values[f.key] ?? f.default}
                    onChange={set}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Preview */}
          <section className="theme-section">
            <h3>Vista previa</h3>
            <div style={{
              background: pc.bg_primary, color: pc.text_primary,
              fontFamily: `'${bodyFont}', sans-serif`,
              borderRadius: '8px', padding: '1.5rem',
              border: `1px solid ${pc.crimson}33`,
            }}>
              <div style={{
                background: pc.bg_secondary,
                borderBottom: `1px solid ${pc.crimson}40`,
                padding: '0.5rem 1rem', borderRadius: '4px',
                marginBottom: '1.25rem', fontSize: '0.8rem',
                display: 'flex', gap: '1rem', alignItems: 'center',
              }}>
                <span style={{ fontFamily: `'${displayFont}', serif`, color: pc.crimson, fontWeight: 700 }}>TalesRol</span>
                <span style={{ color: pc.text_secondary }}>Salas</span>
                <span style={{ color: pc.text_secondary }}>Personajes</span>
              </div>
              <h1 style={{
                fontFamily: `'${displayFont}', serif`, fontSize: '1.8rem',
                color: pc.text_primary, marginBottom: '0.25rem',
                borderBottom: `1px solid ${pc.crimson}40`, paddingBottom: '0.5rem',
              }}>
                Sala de ejemplo
              </h1>
              <p style={{ color: pc.text_secondary, fontSize: '0.85rem', marginBottom: '1rem' }}>
                Descripción o subtítulo de la sala.
              </p>
              <div style={{
                background: pc.bg_card, border: `1px solid ${pc.crimson}20`,
                borderRadius: '6px', padding: '1rem', marginBottom: '1rem',
              }}>
                <p style={{ margin: 0, color: pc.text_primary }}>Contenido de un post.</p>
                <p style={{ margin: '0.5rem 0 0', color: pc.text_muted, fontSize: '0.8rem' }}>Metadatos, fecha, autor.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button style={{
                  background: pc.crimson, color: '#fff', border: 'none',
                  padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer',
                  fontFamily: `'${displayFont}', serif`, fontSize: '0.85rem',
                }}>Botón principal</button>
                <button style={{
                  background: 'transparent', color: pc.crimson_light,
                  border: `1px solid ${pc.crimson}60`,
                  padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem',
                }}>Secundario</button>
                {[
                  { label: 'Admin',    color: c.theme_role_admin },
                  { label: 'Director', color: c.theme_role_director },
                  { label: 'Master',   color: c.theme_role_master },
                  { label: 'Jugador',  color: c.theme_role_jugador },
                ].map(r => (
                  <span key={r.label} style={{
                    background: `${r.color}22`, color: r.color, border: `1px solid ${r.color}50`,
                    padding: '0.2rem 0.6rem', borderRadius: '3px',
                    fontSize: '0.72rem', fontFamily: `'${displayFont}', serif`,
                  }}>{r.label}</span>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── FUENTES ──────────────────────────────────────────── */}
      {tab === 'fonts' && (
        <section className="theme-section">
          <h3>Fuentes</h3>
          <p className="theme-hint">
            Escribe el nombre exacto de cualquier fuente de{' '}
            <a href="https://fonts.google.com" target="_blank" rel="noreferrer">Google Fonts</a>.
            Las fuentes se aplican igual en modo oscuro y claro.
          </p>
          <div className="theme-grid">
            <FontField
              label="Fuente de títulos (--font-display / --font-cinzel)"
              name="theme_font_display"
              value={c.theme_font_display}
              onChange={set}
            />
            <FontField
              label="Fuente del cuerpo (--font-body)"
              name="theme_font_body"
              value={c.theme_font_body}
              onChange={set}
            />
          </div>
          <div className="theme-field" style={{ marginTop: '1rem' }}>
            <label>Links externos adicionales (una etiqueta &lt;link&gt; por línea)</label>
            <textarea
              rows={3}
              value={c.theme_font_extra_links}
              onChange={e => set('theme_font_extra_links', e.target.value)}
              placeholder='<link href="https://fonts.googleapis.com/css2?family=MiFuente&display=swap" rel="stylesheet">'
              style={{ fontFamily: 'monospace', fontSize: '0.8rem', width: '100%', resize: 'vertical' }}
            />
          </div>
          {/* Preview de fuentes */}
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontFamily: `'${displayFont}', serif`, fontSize: '1.6rem', margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
              {displayFont} — Títulos
            </p>
            <p style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: '1rem', margin: 0, color: 'var(--text-secondary)' }}>
              {bodyFont} — Este es el texto del cuerpo de la plataforma. Abcdefghijklmnopqrstuvwxyz 0123456789.
            </p>
          </div>
        </section>
      )}

      {/* ── GUARDAR ──────────────────────────────────────────── */}
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-config-actions">
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
          {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar tema'}
        </button>
      </div>

      <style>{`
        .theme-tabs {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0;
        }
        .theme-tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: -1px;
          transition: all 0.15s;
          font-family: var(--font-body);
        }
        .theme-tab:hover { color: var(--text-primary); }
        .theme-tab--active {
          color: var(--color-crimson) !important;
          border-bottom-color: var(--color-crimson);
        }
        .theme-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .theme-section h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .theme-field label {
          display: block;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 0.35rem;
        }
        .theme-color-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .theme-color-row input[type="color"] {
          width: 38px;
          height: 34px;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          cursor: pointer;
          padding: 2px;
          background: var(--bg-elevated);
          flex-shrink: 0;
        }
        .theme-color-row input[type="text"] {
          flex: 1;
          font-family: monospace;
          font-size: 0.82rem;
          min-width: 0;
        }
        .theme-font-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .theme-font-row input { flex: 1; min-width: 0; }
        .theme-font-preview {
          font-size: 0.95rem;
          white-space: nowrap;
          color: var(--text-secondary);
        }
        .theme-hint {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          margin-top: -0.25rem;
        }
        .theme-hint a { color: var(--color-crimson); }
      `}</style>
    </div>
  )
}