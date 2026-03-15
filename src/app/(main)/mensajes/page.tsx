import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Mensajes — TalesRol' }

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Cargar conversaciones del usuario con último mensaje
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id,
      user_a, user_b,
      profiles_user_a:profiles!conversations_user_a_fkey(id, username, display_name, avatar_url),
      profiles_user_b:profiles!conversations_user_b_fkey(id, username, display_name, avatar_url)
    `)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order('created_at', { ascending: false })

  // Para cada conversación, obtener último mensaje y no leídos
  const convWithMessages = await Promise.all(
    (conversations ?? []).map(async (conv: any) => {
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('content, image_url, created_at, sender_id, read_at')
        .eq('conversation_id', conv.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const { count: unread } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .neq('sender_id', user.id)
        .is('read_at', null)
        .is('deleted_at', null)

      const other = conv.user_a === user.id ? conv.profiles_user_b : conv.profiles_user_a

      return { ...conv, other, lastMsg, unread: unread ?? 0 }
    })
  )

  // Ordenar por último mensaje más reciente
  convWithMessages.sort((a, b) => {
    const aTime = a.lastMsg?.created_at ?? a.created_at
    const bTime = b.lastMsg?.created_at ?? b.created_at
    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h1 className="messages-title">✉ Mensajes</h1>
      </div>

      {convWithMessages.length === 0 ? (
        <div className="messages-empty">
          <p>No tienes conversaciones aún.</p>
          <p className="empty-hint">Visita el perfil de otro usuario para enviarle un mensaje.</p>
        </div>
      ) : (
        <div className="conv-list">
          {convWithMessages.map((conv: any) => {
            const other = conv.other
            const avatarUrl = other?.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${other?.username}`
            const preview = conv.lastMsg
              ? (conv.lastMsg.image_url && !conv.lastMsg.content ? '📷 Imagen' : conv.lastMsg.content?.slice(0, 60) + (conv.lastMsg.content?.length > 60 ? '…' : ''))
              : 'Sin mensajes aún'
            const timeAgo = conv.lastMsg
              ? new Date(conv.lastMsg.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
              : ''

            return (
              <Link key={conv.id} href={`/mensajes/${other?.username}`} className={`conv-item ${conv.unread > 0 ? 'unread' : ''}`}>
                <div className="conv-avatar-wrap">
                  <img src={avatarUrl} alt={other?.username} className="conv-avatar" />
                  {conv.unread > 0 && <span className="unread-dot">{conv.unread}</span>}
                </div>
                <div className="conv-info">
                  <div className="conv-top">
                    <span className="conv-name">{other?.display_name || other?.username}</span>
                    <span className="conv-time">{timeAgo}</span>
                  </div>
                  <span className="conv-preview">{preview}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <style>{`
        .messages-page { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
        .messages-header { display: flex; align-items: center; justify-content: space-between; }
        .messages-title { font-family: var(--font-cinzel); font-size: 1.3rem; font-weight: 700; letter-spacing: 0.06em; margin: 0; }
        .messages-empty { text-align: center; padding: 3rem 1rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; color: var(--text-muted); }
        .messages-empty p { margin: 0.25rem 0; }
        .empty-hint { font-size: 0.85rem; font-style: italic; }
        .conv-list { display: flex; flex-direction: column; gap: 2px; }
        .conv-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.85rem 1rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; text-decoration: none; transition: border-color 0.2s; }
        .conv-item:hover { border-color: var(--border-medium); }
        .conv-item.unread { border-left: 3px solid var(--color-crimson); }
        .conv-avatar-wrap { position: relative; flex-shrink: 0; }
        .conv-avatar { width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--border-subtle); object-fit: cover; display: block; }
        .unread-dot { position: absolute; top: -2px; right: -2px; background: var(--color-crimson); color: white; font-size: 0.6rem; font-family: var(--font-cinzel); font-weight: 700; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }
        .conv-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
        .conv-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .conv-name { font-family: var(--font-cinzel); font-size: 0.88rem; font-weight: 600; color: var(--text-primary); letter-spacing: 0.03em; }
        .conv-time { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-cinzel); flex-shrink: 0; }
        .conv-preview { font-size: 0.82rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .conv-item.unread .conv-preview { color: var(--text-secondary); font-weight: 500; }
      `}</style>
    </div>
  )
}