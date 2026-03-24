'use client'
// src/app/(frontend)/forum/[category]/[thread]/ModActions.tsx
// Moderator / author action bar — pin, lock, delete thread.

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  threadId: string
  categorySlug: string
  pinned: boolean
  locked: boolean
  isModerator: boolean
  isAuthor: boolean
}

export function ModActions({ threadId, categorySlug, pinned, locked, isModerator, isAuthor }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function patch(data: Record<string, unknown>) {
    const res = await fetch(`/api/forum-threads/${threadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      throw new Error(json?.errors?.[0]?.message ?? 'Action failed')
    }
  }

  async function handlePin() {
    setBusy('pin')
    setError(null)
    try {
      await patch({ pinned: !pinned })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(null)
    }
  }

  async function handleLock() {
    setBusy('lock')
    setError(null)
    try {
      await patch({ locked: !locked })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(null)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this thread and all its replies? This cannot be undone.')) return
    setBusy('delete')
    setError(null)
    try {
      const res = await fetch(`/api/forum-threads/${threadId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Delete failed')
      router.push(`/forum/${categorySlug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
      setBusy(null)
    }
  }

  return (
    <div className="mt-5 border-t border-border pt-4">
      {error && (
        <p className="mb-3 text-sm text-red-500">{error}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {isModerator && (
          <>
            <button
              onClick={handlePin}
              disabled={busy === 'pin'}
              className="rounded border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
            >
              {busy === 'pin' ? '…' : pinned ? '📌 Unpin' : '📌 Pin'}
            </button>
            <button
              onClick={handleLock}
              disabled={busy === 'lock'}
              className="rounded border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
            >
              {busy === 'lock' ? '…' : locked ? '🔓 Unlock' : '🔒 Lock'}
            </button>
          </>
        )}
        {(isModerator || isAuthor) && (
          <button
            onClick={handleDelete}
            disabled={busy === 'delete'}
            className="rounded border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 disabled:opacity-50"
          >
            {busy === 'delete' ? 'Deleting…' : '🗑 Delete Thread'}
          </button>
        )}
      </div>
    </div>
  )
}
