'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { Room, Profile } from '@/types/database'
import {
  UserPlusIcon,
  TrashIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  UserIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { addRoomMember, updateMemberRank, removeRoomMember } from './memberactions'
import { useRouter } from 'next/navigation'

type MemberRank = 'espectador' | 'jugador' | 'codirector'

type MemberRow = {
  room_id: string
  user_id: string
  rank: MemberRank
  joined_at: string
  profiles: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'ultimo_acceso'> | null
}

const RANK_CONFIG: Record<MemberRank, { label: string; color: string; icon: React.ReactNode }> = {
  codirector: {
    label: 'Codirector',
    color: 'var(--color-role-director)',
    icon: <ShieldCheckIcon style={{ width: 13, height: 13 }} />,
  },
  jugador: {
    label: 'Jugador',
    color: 'var(--color-role-jugador)',
    icon: <UserIcon style={{ width: 13, height: 13 }} />,
  },
  espectador: {
    label: 'Espectador',
    color: 'var(--color-role-miembro)',
    icon: <EyeIcon style={{ width: 13, height: 13 }} />,
  },
}

function isOnline(ultimoAcceso: string | null | undefined) {
  if (!ultimoAcceso) return false
  return Date.now() - new Date(ultimoAcceso).getTime() < 5 * 60 * 1000
}

function RankBadge({ rank }: { rank: MemberRank }) {
  const cfg = RANK_CONFIG[rank]
  return (
    <span
      className="member-rank-badge"
      style={{ color: cfg.color, borderColor: `${cfg.color}55`, background: `${cfg.color}18` }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function RankSelector({
  current,
  userId,
  roomId,
  onDone,
  onRankChanged,
}: {
  current: MemberRank
  userId: string
  roomId: string
  onDone: () => void
  onRankChanged: (userId: string, rank: MemberRank) => void
}) {
  const [pending, startTransition] = useTransition()
  const ranks: MemberRank[] = ['codirector', 'jugador', 'espectador']

  return (
    <div className="rank-selector">
      {ranks.map(r => (
        <button
          key={r}
          className={`rank-option ${current === r ? 'active' : ''}`}
          disabled={pending}
          onClick={() => {
            if (r === current) { onDone(); return }
            startTransition(async () => {
              await updateMemberRank(roomId, userId, r)
              onRankChanged(userId, r)
              onDone()
            })
          }}
        >
          {RANK_CONFIG[r].icon}
          {RANK_CONFIG[r].label}
          {current === r && <CheckIcon style={{ width: 11, height: 11, marginLeft: 'auto' }} />}
        </button>
      ))}
    </div>
  )
}

export default function MembersClient({
  room,
  owner,
  members,
  currentUserId,
  canManage,
}: {
  room: Room
  owner: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'ultimo_acceso'>
  members: MemberRow[]
  currentUserId: string
  canManage: boolean
}) {
  const [addUsername, setAddUsername] = useState('')
  const [addRank, setAddRank] = useState<MemberRank>('jugador')
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')
  const [openRankFor, setOpenRankFor] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [localMembers, setLocalMembers] = useState<MemberRow[]>(members)

  

const handleAdd = () => {
  if (!addUsername.trim()) return
  setAddError('')
  setAddSuccess('')
  const usernameToAdd = addUsername.trim()
  const rankToAdd = addRank
  startTransition(async () => {
    const res = await addRoomMember(room.id, usernameToAdd, rankToAdd)
    console.log('RES:', JSON.stringify(res))
    if (res?.error) {
      setAddError(res.error)
    } else if (res?.member) {
      setLocalMembers(prev => [...prev, res.member as MemberRow])
      setAddUsername('')
      setAddSuccess(`${usernameToAdd} añadido como ${RANK_CONFIG[rankToAdd].label}.`)
    }
  })
}

  const handleRemove = (userId: string, username: string) => {
    if (!confirm(`¿Expulsar a ${username} de la sala?`)) return
    startTransition(async () => {
      const res = await removeRoomMember(room.id, userId)
      if (!res?.error) {
        setLocalMembers(prev => prev.filter(m => m.user_id !== userId))
        router.refresh()
      }
    })
  }

  const handleRankChanged = (userId: string, rank: MemberRank) => {
    setLocalMembers(prev =>
      prev.map(m => m.user_id === userId ? { ...m, rank } : m)
    )
  }

  return (
    <div className="members-body animate-enter" style={{ animationDelay: '0.1s' }}>

      {canManage && (
        <div className="members-add-panel border-ornament">
          <h2 className="members-section-title">Añadir miembro</h2>
          <div className="members-add-form">
            <input
              className="input-base"
              placeholder="Nombre de usuario..."
              value={addUsername}
              onChange={e => setAddUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              style={{ flex: 1 }}
            />
            <select
              className="select-base"
              value={addRank}
              onChange={e => setAddRank(e.target.value as MemberRank)}
              style={{ width: 160 }}
            >
              {(Object.keys(RANK_CONFIG) as MemberRank[]).map(r => (
                <option key={r} value={r}>{RANK_CONFIG[r].label}</option>
              ))}
            </select>
            <button
              className="btn-primary"
              onClick={handleAdd}
              disabled={isPending || !addUsername.trim()}
            >
              <UserPlusIcon style={{ width: 15, height: 15 }} />
              Añadir
            </button>
          </div>
          {addError   && <p className="members-add-error">{addError}</p>}
          {addSuccess && <p className="members-add-success">{addSuccess}</p>}
        </div>
      )}

      <div className="members-list-wrap">
        <div className="members-list-header">
          <h2 className="members-section-title">
            Miembros
            <span className="members-count">{localMembers.length + 1}</span>
          </h2>
        </div>

        <div className="members-list">

          {/* Owner siempre primero */}
          <div className="member-row owner-row">
            <div className="member-left">
              <div className="member-avatar-wrap">
                <img
                  src={owner.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${owner.username}`}
                  alt={owner.username}
                  className="member-avatar"
                />
                <span className={`member-online-dot ${isOnline(owner.ultimo_acceso) ? 'online' : ''}`} />
              </div>
              <div className="member-info">
                <Link href={`/perfil/${owner.username}`} className="member-name">
                  {owner.display_name || owner.username}
                </Link>
                <span className="member-username">@{owner.username}</span>
              </div>
            </div>
            <div className="member-right">
              <span className="member-rank-badge director-badge">
                <ShieldCheckIcon style={{ width: 13, height: 13 }} />
                Director
              </span>
            </div>
          </div>

          {/* Resto de miembros */}
          {localMembers.length === 0 ? (
            <div className="members-empty">
              <UserIcon style={{ width: 32, height: 32 }} />
              <p>Aún no hay miembros en esta sala.</p>
              {canManage && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  Usa el formulario de arriba para añadir jugadores.
                </p>
              )}
            </div>
          ) : (
            localMembers.map(m => {
              const p = m.profiles
              if (!p) return null
              const isSelf = m.user_id === currentUserId
              const showActions = canManage || isSelf

              return (
                <div key={m.user_id} className="member-row">
                  <div className="member-left">
                    <div className="member-avatar-wrap">
                      <img
                        src={p.avatar_url ?? `https://api.dicebear.com/7.x/gothic/svg?seed=${p.username}`}
                        alt={p.username}
                        className="member-avatar"
                      />
                      <span className={`member-online-dot ${isOnline(p.ultimo_acceso) ? 'online' : ''}`} />
                    </div>
                    <div className="member-info">
                      <Link href={`/perfil/${p.username}`} className="member-name">
                        {p.display_name || p.username}
                        {isSelf && <span className="member-self-badge">Tú</span>}
                      </Link>
                      <span className="member-username">@{p.username}</span>
                    </div>
                  </div>

                  <div className="member-right">
                    {canManage ? (
                      <div className="rank-selector-wrap">
                        <button
                          className="rank-trigger"
                          onClick={() => setOpenRankFor(openRankFor === m.user_id ? null : m.user_id)}
                        >
                          <RankBadge rank={m.rank} />
                          <ChevronDownIcon
                            style={{
                              width: 12, height: 12,
                              transform: openRankFor === m.user_id ? 'rotate(180deg)' : '',
                              transition: 'transform 0.15s',
                              color: 'var(--text-muted)',
                            }}
                          />
                        </button>
                        {openRankFor === m.user_id && (
                          <RankSelector
                            current={m.rank}
                            userId={m.user_id}
                            roomId={room.id}
                            onDone={() => setOpenRankFor(null)}
                            onRankChanged={handleRankChanged}
                          />
                        )}
                      </div>
                    ) : (
                      <RankBadge rank={m.rank} />
                    )}

                    {showActions && (
                      <div className="member-actions">
                        {(canManage || isSelf) && (
                          <button
                            className="member-action-btn danger"
                            title={isSelf && !canManage ? 'Salir de la sala' : 'Expulsar'}
                            onClick={() => handleRemove(m.user_id, p.username)}
                            disabled={isPending}
                          >
                            {isSelf && !canManage
                              ? <XMarkIcon style={{ width: 13, height: 13 }} />
                              : <TrashIcon style={{ width: 13, height: 13 }} />
                            }
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {!canManage && localMembers.some(m => m.user_id === currentUserId) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
          <button
            className="btn-ghost btn-sm"
            onClick={() => handleRemove(currentUserId, 'ti')}
            disabled={isPending}
          >
            <XMarkIcon style={{ width: 13, height: 13 }} />
            Salir de la sala
          </button>
        </div>
      )}
    </div>
  )
}