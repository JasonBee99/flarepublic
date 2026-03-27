'use client'
// src/app/(frontend)/county/[slug]/new-post/NewCountyPostForm.tsx
// Client-side form for creating county posts.

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  countyId: string
  countySlug: string
  authorId: string
}

export function NewCountyPostForm({ countyId, countySlug, authorId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/county-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          excerpt: data.excerpt || undefined,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: data.content as string, version: 1 }],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          county: countyId,
          author: authorId,
          status: 'published',
          publishedAt: new Date().toISOString(),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json?.errors?.[0]?.message ?? json?.message ?? 'Failed to create post.')
        return
      }

      router.push(`/county/${countySlug}`)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-8">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Post title"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium">
          Excerpt <span className="text-xs text-muted-foreground">(optional — shown in listing)</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Short summary of this post…"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium">
          Content <span className="text-destructive">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          placeholder="Write your post here…"
        />
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition"
        >
          {loading ? 'Publishing…' : 'Publish Post'}
        </button>
        <a
          href={`/county/${countySlug}`}
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary/40 transition"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
