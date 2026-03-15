'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleCharacterActive, deleteCharacter } from '../actions'

export default function CharacterActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    setLoading(true)
    await toggleCharacterActive(id, !isActive)
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este personaje? Esta acción no se puede deshacer.')) return
    setLoading(true)
    await deleteCharacter(id)
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={loading}
        className="btn-ghost"
        style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
      >
        {isActive ? '○ Desactivar' : '● Activar'}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="btn-ghost"
        style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
      >
        ✕ Eliminar
      </button>
    </>
  )
}