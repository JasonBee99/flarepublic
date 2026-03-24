'use client'
// src/app/(frontend)/forum/new/NewThreadForm.tsx
// Client form — submits new thread via Payload REST API, then redirects.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Category = { id: string; title: string; slug: string }

type Props = {
  categories: Category[]
  defaultCategorySlug: string
  userId: string
}

export function NewThreadForm({ categories, defaultCategorySlug, userId }: Props) {
  const router = useRouter()

  const defaultCat = categories.find((c) => c.slug === defaultCategorySlug) ?? categories[0]

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [categoryId, setCategoryId] = useState(defaultCat?.id ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim() || !categoryId) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/forum-threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          category: categoryId,
          author: userId,
          status: 'approved',
          pinned: false,
          locked: false,
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
        throw new Error(data?.errors?.[0]?.message ?? 'Failed to create thread')
      }

      const data = await res.json()
      const threadId = data?.doc?.id ?? data?.id
      const cat = categories.find((c) => c.id === categoryId)

      if (threadId && cat) {
        router.push(`/forum/${cat.slug}/${threadId}`)
      } else {
        router.push('/forum')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
      )}

      {/* Category */}
      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
          Forum Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="" disabled>
            Select a forum…
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
          Thread Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a clear, descriptive title"
          required
          maxLength={200}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className="mb-1.5 block text-sm font-medium">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post here. Separate paragraphs with a blank line."
          rows={10}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Separate paragraphs with a blank line for clean formatting.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/forum" className="text-sm text-muted-foreground hover:text-foreground">
          ← Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting || !title.trim() || !body.trim() || !categoryId}
          className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? 'Posting…' : 'Post Thread'}
        </button>
      </div>
    </form>
  )
}
