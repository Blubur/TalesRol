import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Character } from '@/types/database'

export const metadata = { title: 'Mis Personajes' }

export default async function PersonajesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: characters } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  const chars = (characters ?? []) as Character[]
  const active   = chars.filter(c => c.is_active)
  const inactive = chars.filter(c => !c.is_active)

  return (
    <div className="chars-page">
      {/* Cabecera */}
      <div className="chars-header animate-enter">
        <div>
          <h1 className="chars-title">Mis Personajes</h1>
          <p className="chars-sub">{chars.length} personaje{chars.length !== 1 ? 's' : ''} creado{chars.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/personajes/nuevo" className="btn-primary">
          + Nuevo Personaje
        </Link>
      </div>

      {chars.length === 0 ? (
        /* Estado vacío */
        <div className="chars-empty animate-enter">
          <div className="chars-empty-icon">🎭</div>
          <h2>Aún no tienes personajes</h2>
          <p>Crea tu primer personaje para empezar a hacer rol</p>
          <Link href="/personajes/nuevo" className="btn-primary">
            Crear mi primer personaje
          </Link>
        </div>
      ) : (
        <>
          {/* Activos */}
          {active.length > 0 && (
            <div className="chars-section animate-enter" style={{ animationDelay: '0.1s' }}>
              <h2 className="chars-section-title">
                <span className="chars-section-dot active" />
                Activos ({active.length})
              </h2>
              <div className="chars-grid">
                {active.map((char, i) => (
                  <CharCard key={char.id} char={char} delay={i * 0.05} />
                ))}
              </div>
            </div>
          )}

          {/* Inactivos */}
          {inactive.length > 0 && (
            <div className="chars-section animate-enter" style={{ animationDelay: '0.2s' }}>
              <h2 className="chars-section-title">
                <span className="chars-section-dot" />
                Inactivos ({inactive.length})
              </h2>
              <div className="chars-grid">
                {inactive.map((char, i) => (
                  <CharCard key={char.id} char={char} delay={i * 0.05} inactive />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .chars-page {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .chars-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          position: relative;
        }
        .chars-header::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 80px; height: 2px;
          background: var(--color-crimson);
        }
        .chars-title {
          font-family: var(--font-cinzel);
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin: 0;
        }
        .chars-sub {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0.25rem 0 0;
        }

        .chars-empty {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .chars-empty-icon { font-size: 3rem; }
        .chars-empty h2 {
          font-family: var(--font-cinzel);
          font-size: 1.2rem;
          margin: 0;
        }
        .chars-empty p {
          color: var(--text-muted);
          margin: 0;
        }

        .chars-section { display: flex; flex-direction: column; gap: 1rem; }
        .chars-section-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-cinzel);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0;
        }
        .chars-section-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--text-muted);
          flex-shrink: 0;
        }
        .chars-section-dot.active {
          background: var(--color-crimson);
          box-shadow: 0 0 8px rgba(193,6,6,0.6);
        }

        .chars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .chars-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

function CharCard({ char, delay = 0, inactive = false }: {
  char: Character
  delay?: number
  inactive?: boolean
}) {
  const avatar = char.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${char.id}`
  const sheetEntries = Object.entries(char.sheet as Record<string, string>).slice(0, 3)

  return (
    <Link
      href={`/personajes/${char.id}`}
      className={`char-card animate-enter ${inactive ? 'inactive' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="char-card-top">
        <img src={avatar} alt={char.name} className="char-card-avatar" />
        <div className="char-card-info">
          <h3 className="char-card-name">{char.name}</h3>
          {char.description && (
            <p className="char-card-desc">{char.description.slice(0, 80)}{char.description.length > 80 ? '…' : ''}</p>
          )}
        </div>
      </div>

      {sheetEntries.length > 0 && (
        <div className="char-card-sheet">
          {sheetEntries.map(([key, val]) => (
            <div key={key} className="char-sheet-row">
              <span className="char-sheet-key">{key}</span>
              <span className="char-sheet-val">{String(val).slice(0, 30)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="char-card-footer">
        <span className={`char-status ${inactive ? '' : 'active'}`}>
          {inactive ? '○ Inactivo' : '● Activo'}
        </span>
        <span className="char-card-arrow">Ver personaje →</span>
      </div>

      <style>{`
        .char-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 1.25rem;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .char-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, var(--color-crimson), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .char-card:hover {
          border-color: var(--border-medium);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 0 16px rgba(193,6,6,0.06);
        }
        .char-card:hover::before { opacity: 1; }
        .char-card.inactive { opacity: 0.6; }
        .char-card.inactive:hover { opacity: 0.85; }

        .char-card-top {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .char-card-avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 2px solid var(--border-medium);
          object-fit: cover;
          flex-shrink: 0;
          background: var(--bg-secondary);
        }
        .char-card-info { flex: 1; overflow: hidden; }
        .char-card-name {
          font-family: var(--font-cinzel);
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.3rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .char-card-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
        }

        .char-card-sheet {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          background: var(--bg-secondary);
          border-radius: 4px;
          padding: 0.5rem 0.75rem;
        }
        .char-sheet-row {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          font-size: 0.78rem;
        }
        .char-sheet-key {
          color: var(--text-muted);
          font-family: var(--font-cinzel);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .char-sheet-val {
          color: var(--text-secondary);
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .char-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.25rem;
        }
        .char-status {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-family: var(--font-cinzel);
          letter-spacing: 0.06em;
        }
        .char-status.active { color: var(--color-crimson); }
        .char-card-arrow {
          font-size: 0.75rem;
          color: var(--text-muted);
          opacity: 0;
          transition: opacity 0.2s;
          font-family: var(--font-cinzel);
          letter-spacing: 0.05em;
        }
        .char-card:hover .char-card-arrow { opacity: 1; color: var(--color-crimson); }
      `}</style>
    </Link>
  )
}