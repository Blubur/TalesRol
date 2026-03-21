import { createClient } from '@/lib/supabase/server'
import { MegaphoneIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline'
import AnnouncementCard from './AnnouncementCard'

export const metadata = { title: 'Anuncios — TalesRol' }

export default async function AnunciosPage() {
  const supabase = await createClient()

  const { data: announcementsData } = await supabase
    .from('announcements')
    .select('*, profiles!announcements_author_id_fkey(username, display_name, avatar_url)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const announcements = announcementsData ?? []
  const pinned  = announcements.filter(a => a.is_pinned)
  const regular = announcements.filter(a => !a.is_pinned)

  return (
    <div className="ann-page">

      <div className="ann-header animate-enter">
        <div className="ann-header-left">
          <MegaphoneIcon className="ann-header-icon" />
          <div>
            <h1 className="ann-title">Anuncios</h1>
            <p className="ann-sub">Noticias y novedades de la comunidad</p>
          </div>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="ann-empty animate-enter">
          <MegaphoneIcon className="ann-empty-icon" />
          <p>No hay anuncios publicados todavía.</p>
        </div>
      ) : (
        <div className="ann-sections">
          {pinned.length > 0 && (
            <div className="ann-section animate-enter" style={{ animationDelay: '0.05s' }}>
              <h2 className="ann-section-title">
                <MapPinIcon className="ann-section-icon" /> Fijados
              </h2>
              <div className="ann-list">
                {pinned.map((ann, i) => (
                  <AnnouncementCard key={ann.id} ann={ann} pinned delay={0.05 + i * 0.04} />
                ))}
              </div>
            </div>
          )}
          {regular.length > 0 && (
            <div className="ann-section animate-enter" style={{ animationDelay: '0.1s' }}>
              {pinned.length > 0 && (
                <h2 className="ann-section-title">
                  <CalendarIcon className="ann-section-icon" /> Anteriores
                </h2>
              )}
              <div className="ann-list">
                {regular.map((ann, i) => (
                  <AnnouncementCard key={ann.id} ann={ann} pinned={false} delay={0.1 + i * 0.04} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .ann-page { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
        .ann-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); position: relative; }
        .ann-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: var(--color-crimson); }
        .ann-header-left { display: flex; align-items: center; gap: 1rem; }
        .ann-header-icon { width: 28px; height: 28px; color: var(--color-crimson); }
        .ann-title { font-family: var(--font-cinzel); font-size: 1.6rem; font-weight: 700; letter-spacing: 0.08em; margin: 0; }
        .ann-sub { color: var(--text-muted); font-size: 0.85rem; margin: 0.2rem 0 0; }
        .ann-empty { text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .ann-empty-icon { width: 40px; height: 40px; color: var(--border-medium); }
        .ann-sections { display: flex; flex-direction: column; gap: 2rem; }
        .ann-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .ann-section-title { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-cinzel); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin: 0; }
        .ann-section-icon { width: 14px; height: 14px; flex-shrink: 0; }
        .ann-list { display: flex; flex-direction: column; gap: 0.5rem; }
      `}</style>
    </div>
  )
}