'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import type { Room } from '@/types/database'
import {
  changeRoomStatusFromAdmin, deleteRoomFromAdmin,
  lockTopicFromAdmin, unlockTopicFromAdmin,
  pinTopicFromAdmin, deleteTopicFromAdmin,
  deleteWikiPageFromAdmin,
} from './actions'
import {
  ArrowTopRightOnSquareIcon, TrashIcon,
  ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon,
  ChevronRightIcon, LockClosedIcon, LockOpenIcon,
  MapPinIcon, BookOpenIcon, ChatBubbleLeftEllipsisIcon,
  UsersIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

const STATUSES = [
  { value: 'pending',  label: 'Próximamente', color: '#60a5fa' },
  { value: 'active',   label: 'Activa',       color: '#34d399' },
  { value: 'paused',   label: 'En pausa',     color: '#d4820a' },
  { value: 'finished', label: 'Finalizada',   color: '#a78bfa' },
  { value: 'closed',   label: 'Cerrada',      color: '#9ca3af' },
  { value: 'archived', label: 'Archivada',    color: '#6b7280' },
]
const STATUS_COLORS: Record<string, string> = Object.fromEntries(STATUSES.map(s => [s.value, s.color]))

type SortField = 'title' | 'created_at'
type SortDir   = 'asc' | 'desc'

type RoomWithOwner = Room & {
  owner: { username: string; display_name: string | null; avatar_url: string | null } | null
}

interface Topic {
  id: string
  title: string
  is_locked: boolean
  is_pinned: boolean
  created_at: string
  post_count?: number
  has_blocked_posts?: boolean
  author?: { username: string; display_name: string | null } | null
  last_post?: { created_at: string; author?: { username: string; display_name: string | null } | null } | null
}

interface WikiPage {
  id: string
  title: string
  slug: string
  updated_at: string
  is_home: boolean
  author?: { username: string; display_name: string | null } | null
}

interface RoomDetail {
  topics: Topic[]
  wikis: WikiPage[]
  memberCount: number
}

export default function AdminRoomsTable({ rooms }: { rooms: RoomWithOwner[] }) {
  const [loading, setLoading]           = useState<string | null>(null)
  const [localRooms, setLocalRooms]     = useState(rooms)
  const [expanded, setExpanded]         = useState<string | null>(null)
  const [roomDetails, setRoomDetails]   = useState<Record<string, RoomDetail>>({})
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null)
  const [error, setError]               = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch]             = useState('')
  const [dateFrom, setDateFrom]         = useState('')
  const [dateTo, setDateTo]             = useState('')
  const [sortField, setSortField]       = useState<SortField>('created_at')
  const [sortDir, setSortDir]           = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    let result = Array.isArray(localRooms) ? [...localRooms] : []
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r => r.title.toLowerCase().includes(q) || (r.owner?.username ?? '').toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter)
    if (dateFrom) result = result.filter(r => new Date(r.created_at) >= new Date(dateFrom))
    if (dateTo) result = result.filter(r => new Date(r.created_at) <= new Date(dateTo + 'T23:59:59'))
    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'title') cmp = a.title.localeCompare(b.title)
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [localRooms, search, statusFilter, dateFrom, dateTo, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUpDownIcon className="sort-icon muted" />
    return sortDir === 'asc' ? <ChevronUpIcon className="sort-icon active" /> : <ChevronDownIcon className="sort-icon active" />
  }

  function clearFilters() { setSearch(''); setStatusFilter('all'); setDateFrom(''); setDateTo('') }
  const hasActiveFilters = search || statusFilter !== 'all' || dateFrom || dateTo

  async function loadRoomDetail(roomId: string, slug: string) {
    if (roomDetails[roomId]) return
    setLoadingDetail(roomId)
    try {
      const res = await fetch(`/api/admin/room-detail?roomId=${roomId}&slug=${encodeURIComponent(slug)}`)
      if (res.ok) {
        const data = await res.json()
        setRoomDetails(prev => ({ ...prev, [roomId]: data }))
      }
    } catch {}
    setLoadingDetail(null)
  }

  async function toggleExpand(roomId: string, slug: string) {
    if (expanded === roomId) { setExpanded(null); return }
    setExpanded(roomId)
    await loadRoomDetail(roomId, slug)
  }

  async function handleStatus(roomId: string, status: string) {
    setLoading(roomId + '_status')
    const result = await changeRoomStatusFromAdmin(roomId, status)
    if (!result?.error) setLocalRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: status as any } : r))
    setLoading(null)
  }

  async function handleDelete(roomId: string) {
    if (!confirm('¿Eliminar esta sala permanentemente?')) return
    setLoading(roomId + '_del')
    await deleteRoomFromAdmin(roomId)
    setLocalRooms(prev => prev.filter(r => r.id !== roomId))
    setLoading(null)
  }

  async function handleLockTopic(topicId: string, isLocked: boolean, roomId: string, slug: string) {
    setLoading('topic_' + topicId)
    const result = isLocked
      ? await unlockTopicFromAdmin(topicId, slug)
      : await lockTopicFromAdmin(topicId, slug)
    if (result?.error) { setError(result.error) }
    else {
      setRoomDetails(prev => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          topics: prev[roomId].topics.map(t => t.id === topicId ? { ...t, is_locked: !isLocked } : t)
        }
      }))
    }
    setLoading(null)
  }

  async function handlePinTopic(topicId: string, isPinned: boolean, roomId: string, slug: string) {
    setLoading('pin_' + topicId)
    const result = await pinTopicFromAdmin(topicId, !isPinned, slug)
    if (result?.error) { setError(result.error) }
    else {
      setRoomDetails(prev => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          topics: prev[roomId].topics.map(t => t.id === topicId ? { ...t, is_pinned: !isPinned } : t)
        }
      }))
    }
    setLoading(null)
  }

  async function handleDeleteTopic(topicId: string, roomId: string, slug: string) {
    if (!confirm('¿Eliminar este tema?')) return
    setLoading('del_topic_' + topicId)
    const result = await deleteTopicFromAdmin(topicId, slug)
    if (result?.error) { setError(result.error) }
    else {
      setRoomDetails(prev => ({
        ...prev,
        [roomId]: { ...prev[roomId], topics: prev[roomId].topics.filter(t => t.id !== topicId) }
      }))
    }
    setLoading(null)
  }

  async function handleDeleteWiki(pageId: string, roomId: string, slug: string) {
    if (!confirm('¿Eliminar esta página de la wiki?')) return
    setLoading('del_wiki_' + pageId)
    const result = await deleteWikiPageFromAdmin(pageId, slug)
    if (result?.error) { setError(result.error) }
    else {
      setRoomDetails(prev => ({
        ...prev,
        [roomId]: { ...prev[roomId], wikis: prev[roomId].wikis.filter(w => w.id !== pageId) }
      }))
    }
    setLoading(null)
  }

  return (
    <div className="admin-table-wrap">
      {error && <p style={{ color: '#ff6b6b', fontSize: '0.82rem', margin: '0 0 0.5rem' }}>{error}</p>}

      <div className="users-toolbar">
        <input
          type="text" placeholder="Buscar por título o creador..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="admin-search" style={{ paddingLeft: '0.75rem' }}
        />
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Estado</span>
          <div className="filter-btns">
            <button className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>Todos</button>
            {STATUSES.map(s => (
              <button key={s.value} className={`filter-btn ${statusFilter === s.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(s.value)}
                style={statusFilter === s.value ? { color: s.color, borderColor: s.color + '88', background: s.color + '18' } : {}}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Creación</span>
          <div className="filter-dates">
            <input type="date" className="filter-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span className="filter-date-sep">—</span>
            <input type="date" className="filter-date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>
        {hasActiveFilters && <button className="filter-clear-btn" onClick={clearFilters}>Limpiar filtros</button>}
        <span className="filter-count">{filtered.length} de {localRooms.length}</span>
      </div>

      <div className="rooms-list-admin">
        {filtered.map(room => {
          const isExpanded = expanded === room.id
          const detail = roomDetails[room.id]
          const isLoadingDetail = loadingDetail === room.id
          const hasBlockedPosts = detail?.topics.some(t => t.has_blocked_posts)

          return (
            <div key={room.id} className={`room-admin-card ${isExpanded ? 'expanded' : ''}`}>
              {/* Cabecera de la sala */}
              <div className="room-admin-header">
                <button className="room-expand-btn" onClick={() => toggleExpand(room.id, room.slug)}>
                  <ChevronRightIcon className={`expand-icon ${isExpanded ? 'rotated' : ''}`} />
                </button>

                <div className="room-admin-cover">
                  {room.cover_url
                    ? <img src={room.cover_url} alt={room.title} className="room-thumb" />
                    : <div className="room-thumb-placeholder" />
                  }
                </div>

                <div className="room-admin-info">
                  <div className="room-admin-title-row">
                    <span className="room-cell-title">{room.title}</span>
                    {hasBlockedPosts && (
                      <span className="room-blocked-indicator" title="Tiene posts bloqueados">
                        <ExclamationTriangleIcon style={{ width: 12, height: 12 }} />
                      </span>
                    )}
                  </div>
                  {room.owner && (
                    <span className="room-admin-owner">
                      {room.owner.display_name || room.owner.username}
                    </span>
                  )}
                </div>

                <div className="room-admin-tags">
                  {(Array.isArray(room.tags) ? room.tags.slice(0, 3) : []).map(tag => (
                    <span key={String(tag)} className="tag-pill">{String(tag)}</span>
                  ))}
                </div>

                <select
                  className="role-select"
                  value={room.status}
                  disabled={loading === room.id + '_status'}
                  onChange={e => handleStatus(room.id, e.target.value)}
                  style={{ color: STATUS_COLORS[room.status] ?? '#9ca3af', borderColor: STATUS_COLORS[room.status] ?? '#9ca3af' }}
                >
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>

                <span className="date-cell">
                  {new Date(room.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}
                </span>

                <div className="action-btns">
                  <Link href={`/salas/${room.slug}/miembros`} className="action-btn neutral" title="Miembros" target="_blank">
                    <UsersIcon className="action-btn-icon" /> Miembros
                  </Link>
                  <Link href={`/salas/${room.slug}`} className="action-btn neutral" title="Ver sala" target="_blank">
                    <ArrowTopRightOnSquareIcon className="action-btn-icon" /> Ver
                  </Link>
                  <button className="action-btn danger" onClick={() => handleDelete(room.id)} disabled={loading === room.id + '_del'}>
                    <TrashIcon className="action-btn-icon" /> Eliminar
                  </button>
                </div>
              </div>

              {/* Desplegable */}
              {isExpanded && (
                <div className="room-admin-detail">
                  {isLoadingDetail ? (
                    <p className="detail-loading">Cargando contenido...</p>
                  ) : detail ? (
                    <div className="detail-sections">

                      {/* Temas */}
                      <div className="detail-section">
                        <div className="detail-section-header">
                          <ChatBubbleLeftEllipsisIcon style={{ width: 14, height: 14 }} />
                          <span>Temas ({detail.topics.length})</span>
                          <Link href={`/salas/${room.slug}`} className="detail-link" target="_blank">
                            Ver sala →
                          </Link>
                        </div>
                        {detail.topics.length === 0 ? (
                          <p className="detail-empty">Sin temas.</p>
                        ) : (
                          <div className="detail-list">
                            {detail.topics.map(topic => (
                              <div key={topic.id} className={`detail-item ${topic.is_locked ? 'locked' : ''}`}>
                                <div className="detail-item-info">
                                  <div className="detail-item-title-row">
                                    {topic.is_pinned && <MapPinIcon style={{ width: 11, height: 11, color: 'var(--color-crimson)', flexShrink: 0 }} />}
                                    {topic.is_locked && <LockClosedIcon style={{ width: 11, height: 11, color: '#fbbf24', flexShrink: 0 }} />}
                                    {topic.has_blocked_posts && <ExclamationTriangleIcon style={{ width: 11, height: 11, color: '#ff6b6b', flexShrink: 0 }} title="Tiene posts bloqueados" />}
                                    <Link href={`/salas/${room.slug}/${topic.id}`} className="detail-item-name" target="_blank">
                                      {topic.title}
                                    </Link>
                                  </div>
                                  <div className="detail-item-meta">
                                    <span>{topic.post_count ?? 0} posts</span>
                                    {topic.author && <span>por {topic.author.display_name || topic.author.username}</span>}
                                    {topic.last_post && (
                                      <span>
                                        último: {topic.last_post.author?.display_name || topic.last_post.author?.username ?? '—'}
                                        {' · '}{new Date(topic.last_post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="detail-item-actions">
                                  <button
                                    className={`detail-btn ${topic.is_pinned ? 'active' : ''}`}
                                    onClick={() => handlePinTopic(topic.id, topic.is_pinned, room.id, room.slug)}
                                    disabled={loading === 'pin_' + topic.id}
                                    title={topic.is_pinned ? 'Desfijar' : 'Fijar'}
                                  >
                                    <MapPinIcon style={{ width: 11, height: 11 }} />
                                  </button>
                                  <button
                                    className={`detail-btn ${topic.is_locked ? 'warn' : ''}`}
                                    onClick={() => handleLockTopic(topic.id, topic.is_locked, room.id, room.slug)}
                                    disabled={loading === 'topic_' + topic.id}
                                    title={topic.is_locked ? 'Desbloquear' : 'Bloquear'}
                                  >
                                    {topic.is_locked
                                      ? <LockOpenIcon style={{ width: 11, height: 11 }} />
                                      : <LockClosedIcon style={{ width: 11, height: 11 }} />
                                    }
                                  </button>
                                  <button
                                    className="detail-btn danger"
                                    onClick={() => handleDeleteTopic(topic.id, room.id, room.slug)}
                                    disabled={loading === 'del_topic_' + topic.id}
                                    title="Eliminar tema"
                                  >
                                    <TrashIcon style={{ width: 11, height: 11 }} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Wiki */}
                      <div className="detail-section">
                        <div className="detail-section-header">
                          <BookOpenIcon style={{ width: 14, height: 14 }} />
                          <span>Wiki ({detail.wikis.length})</span>
                          <Link href={`/salas/${room.slug}/wiki`} className="detail-link" target="_blank">
                            Ver wiki →
                          </Link>
                        </div>
                        {detail.wikis.length === 0 ? (
                          <p className="detail-empty">Sin páginas wiki.</p>
                        ) : (
                          <div className="detail-list">
                            {detail.wikis.map(wiki => (
                              <div key={wiki.id} className="detail-item">
                                <div className="detail-item-info">
                                  <div className="detail-item-title-row">
                                    {wiki.is_home && <span className="wiki-home-dot" title="Portada" />}
                                    <Link href={`/salas/${room.slug}/wiki/${wiki.slug}`} className="detail-item-name" target="_blank">
                                      {wiki.title}
                                    </Link>
                                  </div>
                                  <div className="detail-item-meta">
                                    {wiki.author && <span>por {wiki.author.display_name || wiki.author.username}</span>}
                                    <span>editado {new Date(wiki.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                  </div>
                                </div>
                                <div className="detail-item-actions">
                                  <Link href={`/salas/${room.slug}/wiki/${wiki.slug}/editar`} className="detail-btn" target="_blank" title="Editar">
                                    ✎
                                  </Link>
                                  <button
                                    className="detail-btn danger"
                                    onClick={() => handleDeleteWiki(wiki.id, room.id, room.slug)}
                                    disabled={loading === 'del_wiki_' + wiki.id}
                                    title="Eliminar página"
                                  >
                                    <TrashIcon style={{ width: 11, height: 11 }} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="detail-stats">
                        <span><UsersIcon style={{ width: 12, height: 12 }} /> {detail.memberCount} miembros</span>
                      </div>

                    </div>
                  ) : (
                    <p className="detail-empty">No se pudo cargar el contenido.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <p className="empty-row" style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No hay salas.</p>}
      </div>

      <style>{`
        .rooms-list-admin { display: flex; flex-direction: column; gap: 0.4rem; }

        .room-admin-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; overflow: hidden; transition: border-color 0.2s; }
        .room-admin-card.expanded { border-color: var(--color-crimson); }

        .room-admin-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; flex-wrap: wrap; }
        .room-expand-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0.2rem; display: flex; align-items: center; flex-shrink: 0; }
        .expand-icon { width: 14px; height: 14px; transition: transform 0.2s; }
        .expand-icon.rotated { transform: rotate(90deg); }

        .room-admin-cover { flex-shrink: 0; }
        .room-thumb { width: 36px; height: 36px; object-fit: cover; border-radius: 4px; }
        .room-thumb-placeholder { width: 36px; height: 36px; background: var(--bg-elevated); border-radius: 4px; border: 1px solid var(--border-subtle); }

        .room-admin-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
        .room-admin-title-row { display: flex; align-items: center; gap: 0.4rem; }
        .room-cell-title { font-family: var(--font-cinzel); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .room-blocked-indicator { color: #ff6b6b; display: flex; align-items: center; flex-shrink: 0; }
        .room-admin-owner { font-size: 0.72rem; color: var(--text-muted); }
        .room-admin-tags { display: flex; gap: 0.25rem; flex-wrap: wrap; }

        .room-admin-detail { border-top: 1px solid var(--border-subtle); padding: 1rem; background: var(--bg-secondary); }
        .detail-loading { color: var(--text-muted); font-size: 0.82rem; font-style: italic; margin: 0; }
        .detail-sections { display: flex; flex-direction: column; gap: 1.25rem; }

        .detail-section { display: flex; flex-direction: column; gap: 0.5rem; }
        .detail-section-header { display: flex; align-items: center; gap: 0.4rem; font-family: var(--font-cinzel); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); }
        .detail-link { margin-left: auto; font-size: 0.7rem; color: var(--color-crimson); text-decoration: none; font-family: var(--font-cinzel); letter-spacing: 0.04em; }
        .detail-link:hover { text-decoration: underline; }
        .detail-empty { color: var(--text-muted); font-style: italic; font-size: 0.8rem; margin: 0; }

        .detail-list { display: flex; flex-direction: column; gap: 0.3rem; }
        .detail-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 4px; }
        .detail-item.locked { border-left: 2px solid #fbbf24; opacity: 0.85; }

        .detail-item-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
        .detail-item-title-row { display: flex; align-items: center; gap: 0.3rem; }
        .detail-item-name { font-size: 0.82rem; color: var(--text-primary); text-decoration: none; font-family: var(--font-cinzel); letter-spacing: 0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .detail-item-name:hover { color: var(--color-crimson); }
        .detail-item-meta { display: flex; gap: 0.75rem; font-size: 0.68rem; color: var(--text-muted); flex-wrap: wrap; }

        .detail-item-actions { display: flex; gap: 0.3rem; flex-shrink: 0; }
        .detail-btn { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: transparent; border: 1px solid var(--border-subtle); border-radius: 3px; cursor: pointer; color: var(--text-muted); font-size: 0.75rem; text-decoration: none; transition: all 0.15s; }
        .detail-btn:hover { color: var(--text-primary); border-color: var(--border-medium); background: var(--bg-elevated); }
        .detail-btn.active { color: var(--color-crimson); border-color: rgba(193,6,6,0.4); background: rgba(193,6,6,0.06); }
        .detail-btn.warn { color: #fbbf24; border-color: rgba(251,191,36,0.4); }
        .detail-btn.danger { color: #ff6b6b; border-color: rgba(255,107,107,0.3); }
        .detail-btn.danger:hover { background: rgba(255,107,107,0.1); }
        .detail-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .wiki-home-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-crimson); flex-shrink: 0; }

        .detail-stats { display: flex; gap: 1rem; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle); }
        .detail-stats span { display: flex; align-items: center; gap: 0.3rem; font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-cinzel); letter-spacing: 0.04em; }
      `}</style>
    </div>
  )
}