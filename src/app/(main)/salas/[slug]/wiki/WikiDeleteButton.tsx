'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { TrashIcon } from '@heroicons/react/24/outline'
import { deleteWikiPage } from './wikiactions'

interface Props {
  pageId: string
  roomSlug: string
  roomId: string
}

export default function WikiDeleteButton({ pageId, roomSlug, roomId }: Props) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteWikiPage(pageId, roomSlug, roomId)
      if (res.success) router.push(`/salas/${roomSlug}/wiki`)
    })
  }

  if (confirm) {
    return (
      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>¿Eliminar?</span>
        <button className="btn-ghost btn-sm" onClick={() => setConfirm(false)} disabled={isPending}>No</button>
        <button
          className="btn-sm"
          style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid var(--color-error-border)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.65rem', cursor: 'pointer', fontSize: 'var(--text-xs)' }}
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
      </div>
    )
  }

  return (
    <button
      className="btn-ghost btn-sm"
      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}
      onClick={() => setConfirm(true)}
    >
      <TrashIcon style={{ width: 14, height: 14 }} /> Eliminar
    </button>
  )
}