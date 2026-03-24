'use client'
// src/app/(frontend)/forum/[category]/[thread]/ForumReplyForm.tsx
// Client component — handles reply submission via Payload REST API.

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  threadId: string
  userId: string
  categorySlug: string
}

export function ForumReplyForm({ threadId, userId, categorySlug }: Props) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/forum-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          thread: threadId,
          author: userId,
          status: 'approved',
          body: {
            root: {
              type: 'root',
              children: body.trim().split('\n\n').map((para) => ({
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: para, version: 1 }],
              })),
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.errors?.[0]?.message ?? 'Failed to post reply')
      }

      setBody('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border p-5">
      <h2 className="mb-4 text-lg font-semibold">Post a Reply</h2>

      {error && (
        <div className="mb-4 rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your reply here…"
        rows={5}
        required
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? 'Posting…' : 'Post Reply'}
        </button>
      </div>
    </form>
  )
}
