'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { sendMessage, deleteMessage, markAsRead } from '../actions'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  image_url: string | null
  deleted_at: string | null
  read_at: string | null
  created_at: string
}

interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
}

interface Props {
  conversationId: string
  currentUserId: string
  currentProfile: Profile
  otherProfile: Profile
  initialMessages: Message[]
}

export default function ConversationClient({ conversationId, currentUserId, currentProfile, otherProfile, initialMessages }: Props) {
  const [messages, setMessages]   = useState<Message[]>(initialMessages)
  const [content, setContent]     = useState('')
  const [imageUrl, setImageUrl]   = useState('')
  const [showImage, setShowImage] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const supabase                  = createClient()

  const otherAvatar = otherProfile.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${otherProfile.username}`
  const myAvatar    = currentProfile.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${currentProfile.username}`

  // Marcar como leídos al entrar
  useEffect(() => {
    markAsRead(conversationId)
  }, [conversationId])

  // Scroll al fondo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Message
            setMessages(prev => {
              if (prev.find(m => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
            markAsRead(conversationId)
          }
          if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() && !imageUrl.trim()) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.set('conversation_id', conversationId)
    formData.set('content', content.trim())
    if (imageUrl.trim()) formData.set('image_url', imageUrl.trim())

    const result = await sendMessage(formData)
    setLoading(false)
    if (result?.error) { setError(result.error) }
    else { setContent(''); setImageUrl(''); setShowImage(false) }
  }

  async function handleDelete(messageId: string) {
    if (!confirm('¿Eliminar este mensaje?')) return
    await deleteMessage(messageId)
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    const today = new Date()
    const isToday = d.toDateString() === today.toDateString()
    if (isToday) return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="conv-page">

      {/* Header */}
      <div className="conv-header">
        <Link href="/mensajes" className="back-btn">←</Link>
        <img src={otherAvatar} alt={otherProfile.username} className="header-avatar" />
        <div className="header-info">
          <span className="header-name">{otherProfile.display_name || otherProfile.username}</span>
          <Link href={`/perfil/${otherProfile.username}`} className="header-username">@{otherProfile.username}</Link>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-scroll">
        {messages.length === 0 && (
          <div className="messages-empty">Inicia la conversación con {otherProfile.display_name || otherProfile.username}.</div>
        )}
        {messages.map(msg => {
          const isMine   = msg.sender_id === currentUserId
          const isDeleted = !!msg.deleted_at
          const avatar   = isMine ? myAvatar : otherAvatar

          return (
            <div key={msg.id} className={`msg-row ${isMine ? 'mine' : 'theirs'}`}>
              {!isMine && <img src={avatar} alt="" className="msg-avatar" />}
              <div className="msg-bubble-wrap">
                <div className={`msg-bubble ${isMine ? 'mine' : 'theirs'} ${isDeleted ? 'deleted' : ''}`}>
                  {isDeleted ? (
                    <span className="msg-deleted">Mensaje eliminado</span>
                  ) : (
                    <>
                      {msg.content && <p className="msg-content">{msg.content}</p>}
                      {msg.image_url && (
                        <a href={msg.image_url} target="_blank" rel="noopener noreferrer">
                          <img src={msg.image_url} alt="imagen" className="msg-image" />
                        </a>
                      )}
                    </>
                  )}
                </div>
                <div className={`msg-meta ${isMine ? 'mine' : ''}`}>
                  <span className="msg-time">{formatTime(msg.created_at)}</span>
                  {isMine && !isDeleted && (
                    <button className="msg-delete-btn" onClick={() => handleDelete(msg.id)} title="Eliminar">✕</button>
                  )}
                  {isMine && msg.read_at && <span className="msg-read">✓✓</span>}
                </div>
              </div>
              {isMine && <img src={avatar} alt="" className="msg-avatar" />}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="msg-form">
        {showImage && (
          <div className="image-url-row">
            <input
              type="url"
              className="input-base"
              placeholder="URL de la imagen..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
            <button type="button" className="img-cancel" onClick={() => { setShowImage(false); setImageUrl('') }}>✕</button>
          </div>
        )}
        {error && <div className="msg-error">⚠ {error}</div>}
        <div className="input-row">
          <button
            type="button"
            className="img-btn"
            onClick={() => setShowImage(v => !v)}
            title="Adjuntar imagen (URL)"
          >📷</button>
          <input
            type="text"
            className="msg-input"
            placeholder="Escribe un mensaje..."
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any) } }}
            maxLength={2000}
            autoFocus
          />
          <button type="submit" className="send-btn" disabled={loading || (!content.trim() && !imageUrl.trim())}>
            {loading ? '…' : '➤'}
          </button>
        </div>
      </form>

      <style>{`
        .conv-page { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; height: calc(100vh - 120px); min-height: 500px; }

        /* Header */
        .conv-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; flex-shrink: 0; }
        .back-btn { color: var(--text-muted); text-decoration: none; font-size: 1.1rem; padding: 0.2rem 0.4rem; border-radius: 3px; transition: color 0.2s; }
        .back-btn:hover { color: var(--color-crimson); }
        .header-avatar { width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--border-subtle); object-fit: cover; }
        .header-info { display: flex; flex-direction: column; gap: 0.05rem; }
        .header-name { font-family: var(--font-cinzel); font-size: 0.9rem; font-weight: 600; color: var(--text-primary); letter-spacing: 0.04em; }
        .header-username { font-size: 0.72rem; color: var(--text-muted); text-decoration: none; }
        .header-username:hover { color: var(--color-crimson); }

        /* Scroll area */
        .messages-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem 0.5rem; }
        .messages-empty { text-align: center; color: var(--text-muted); font-style: italic; font-size: 0.88rem; padding: 2rem; }

        /* Messages */
        .msg-row { display: flex; align-items: flex-end; gap: 0.5rem; }
        .msg-row.mine { flex-direction: row-reverse; }
        .msg-avatar { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-subtle); object-fit: cover; flex-shrink: 0; }
        .msg-bubble-wrap { display: flex; flex-direction: column; gap: 0.15rem; max-width: 70%; }
        .msg-bubble { padding: 0.6rem 0.85rem; border-radius: 12px; word-break: break-word; }
        .msg-bubble.theirs { background: var(--bg-card); border: 1px solid var(--border-subtle); border-bottom-left-radius: 3px; }
        .msg-bubble.mine { background: rgba(193,6,6,0.15); border: 1px solid rgba(193,6,6,0.25); border-bottom-right-radius: 3px; }
        .msg-bubble.deleted { opacity: 0.5; }
        .msg-content { margin: 0; font-size: 0.92rem; line-height: 1.5; color: var(--text-primary); white-space: pre-wrap; }
        .msg-deleted { font-size: 0.8rem; color: var(--text-muted); font-style: italic; }
        .msg-image { max-width: 240px; max-height: 200px; border-radius: 6px; display: block; margin-top: 0.25rem; cursor: pointer; }
        .msg-meta { display: flex; align-items: center; gap: 0.4rem; }
        .msg-meta.mine { flex-direction: row-reverse; }
        .msg-time { font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-cinzel); }
        .msg-read { font-size: 0.65rem; color: #34d399; }
        .msg-delete-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.65rem; padding: 0; opacity: 0; transition: opacity 0.15s; }
        .msg-row:hover .msg-delete-btn { opacity: 1; }
        .msg-delete-btn:hover { color: #ff4444; }

        /* Form */
        .msg-form { flex-shrink: 0; display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); }
        .image-url-row { display: flex; gap: 0.5rem; align-items: center; }
        .img-cancel { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.9rem; padding: 0.25rem; }
        .img-cancel:hover { color: #ff4444; }
        .msg-error { font-size: 0.8rem; color: #ff6b6b; padding: 0.3rem 0; }
        .input-row { display: flex; gap: 0.5rem; align-items: center; }
        .img-btn { background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 6px; width: 36px; height: 36px; font-size: 1rem; cursor: pointer; flex-shrink: 0; transition: border-color 0.2s; display: flex; align-items: center; justify-content: center; }
        .img-btn:hover { border-color: var(--color-crimson); }
        .msg-input { flex: 1; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.55rem 0.85rem; color: var(--text-primary); font-size: 0.92rem; outline: none; transition: border-color 0.2s; font-family: var(--font-crimson-pro); }
        .msg-input:focus { border-color: var(--color-crimson); }
        .send-btn { background: var(--color-crimson); border: none; border-radius: 6px; width: 36px; height: 36px; color: white; font-size: 0.9rem; cursor: pointer; flex-shrink: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; }
        .send-btn:disabled { opacity: 0.4; cursor: default; }
        .send-btn:not(:disabled):hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}