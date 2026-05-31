'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { deleteTopicOnly } from './topicactions'

interface TopicActionsProps {
  topicId: string
  slug: string
  topicTitle: string
}

export default function TopicActions({ topicId, slug, topicTitle }: TopicActionsProps) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteTopicOnly(topicId, slug)
      if (result?.error) {
        setError(result.error)
      } else {
        setShowConfirm(false)
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="topic-actions-btns" onClick={e => e.preventDefault()}>
        <Link
          href={`/salas/${slug}/${topicId}/editar`}
          className="topic-action-btn topic-action-edit"
          title="Editar tema"
          onClick={e => e.stopPropagation()}
        >
          <PencilIcon style={{ width: 12, height: 12 }} />
        </Link>
        <button
          className="topic-action-btn topic-action-delete"
          title="Eliminar tema"
          onClick={e => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true) }}
          type="button"
        >
          <TrashIcon style={{ width: 12, height: 12 }} />
        </button>
      </div>

      {showConfirm && (
        <div
          className="topic-delete-overlay"
          onClick={e => { e.preventDefault(); e.stopPropagation(); if (!isPending) setShowConfirm(false) }}
        >
          <div
            className="topic-delete-modal"
            onClick={e => { e.preventDefault(); e.stopPropagation() }}
          >
            <button
              className="topic-delete-close"
              onClick={() => setShowConfirm(false)}
              type="button"
              disabled={isPending}
            >
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
            <div className="topic-delete-icon">
              <TrashIcon style={{ width: 22, height: 22 }} />
            </div>
            <h3 className="topic-delete-title">¿Eliminar tema?</h3>
            <p className="topic-delete-body">
              <strong>"{topicTitle}"</strong> y todos sus posts serán eliminados permanentemente.
              Esta acción no se puede deshacer.
            </p>
            {error && <p className="topic-delete-error">{error}</p>}
            <div className="topic-delete-footer">
              <button
                className="btn-ghost btn-sm"
                onClick={() => setShowConfirm(false)}
                type="button"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                className="btn-danger btn-sm"
                onClick={handleDelete}
                type="button"
                disabled={isPending}
              >
                {isPending
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="topic-delete-spinner" /> Eliminando…
                    </span>
                  : 'Sí, eliminar'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .topic-actions-btns {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity var(--transition-fast);
          flex-shrink: 0;
        }
        .topic-row:hover .topic-actions-btns {
          opacity: 1;
        }
        .topic-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: var(--bg-elevated);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-decoration: none;
        }
        .topic-action-edit:hover {
          border-color: var(--color-crimson);
          color: var(--color-crimson);
          background: var(--color-crimson-subtle);
        }
        .topic-action-delete:hover {
          border-color: var(--color-error-border);
          color: var(--color-error);
          background: var(--color-error-bg);
        }
        .topic-delete-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg-overlay);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.15s ease;
        }
        .topic-delete-modal {
          position: relative;
          background: var(--bg-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 2rem 1.75rem 1.5rem;
          max-width: 400px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
          box-shadow: var(--shadow-lg);
          animation: modalIn 0.2s ease;
        }
        .topic-delete-close {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .topic-delete-close:hover { background: var(--bg-card); color: var(--text-primary); }
        .topic-delete-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-error-bg);
          border: 1px solid var(--color-error-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-error);
        }
        .topic-delete-title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 700;
          margin: 0;
          letter-spacing: 0.04em;
        }
        .topic-delete-body {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }
        .topic-delete-error {
          font-size: var(--text-sm);
          color: var(--color-error);
          background: var(--color-error-bg);
          border: 1px solid var(--color-error-border);
          border-radius: var(--radius-sm);
          padding: 0.4rem 0.75rem;
          margin: 0;
          width: 100%;
        }
        .topic-delete-footer {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 0.25rem;
          width: 100%;
        }
        .topic-delete-footer .btn-ghost,
        .topic-delete-footer .btn-danger { flex: 1; justify-content: center; }
        .topic-delete-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
      `}</style>
    </>
  )
}