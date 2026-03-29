'use client'
// src/app/(frontend)/county/[slug]/focus-groups/new/page.tsx
// County Organizer creates a new focus group.

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

// This needs to be a client component since it's a form with state.
// County/user data is passed via search params or we fetch on mount.

export default function NewFocusGroupPage({ params }: { params: any }) {
  return <NewFocusGroupForm slug={params.slug} />
}

function NewFocusGroupForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [maxMembers, setMaxMembers] = useState(6)
  const [stage, setStage] = useState('forming')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    setError(null)
    try {
      // Get current user + county
      const meRes = await fetch('/api/users/me', { credentials: 'include' })
      const meData = await meRes.json()
      const user = meData?.user
      if (!user) { setError('You must be logged in.'); return }

      const countyId = typeof user.county === 'object' ? user.county?.id : user.county

      // Fetch county by slug to get id if user has no county (siteAdmin)
      let finalCountyId = countyId
      if (!finalCountyId) {
        const cRes = await fetch(`/api/counties?where[slug][equals]=${slug}&limit=1`, { credentials: 'include' })
        const cData = await cRes.json()
        finalCountyId = cData?.docs?.[0]?.id
      }

      if (!finalCountyId) { setError('Could not determine county.'); return }

      const res = await fetch('/api/focus-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          county: finalCountyId,
          stage,
          maxMembers,
          isActive: true,
          organizer: user.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.errors?.[0]?.message ?? 'Failed to create group.')
        return
      }

      router.push(`/county/${slug}/focus-groups/${data.doc.id}`)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/county/${slug}`} className="hover:text-foreground capitalize">{slug} County</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/county/${slug}/focus-groups`} className="hover:text-foreground">Focus Groups</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">New Group</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Focus Group</h1>
        <p className="mt-2 text-muted-foreground">
          Focus groups have a maximum of 6 active members by default. Overflow goes to a waitlist.
          Cholerics must be placed manually.
        </p>
      </div>

      <div className="space-y-5">
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Group title <span className="text-destructive-foreground">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Election Integrity Working Group"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="What will this group focus on?"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Stage</label>
            <select
              value={stage}
              onChange={e => setStage(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="forming">Forming</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          {/* Max members */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Max members</label>
            <input
              type="number"
              min={2}
              max={20}
              value={maxMembers}
              onChange={e => setMaxMembers(parseInt(e.target.value) || 6)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <p className="text-xs text-muted-foreground mt-1">Default is 6. Overflow goes to waitlist.</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Group'}
          </button>
          <Link
            href={`/county/${slug}/focus-groups`}
            className="inline-flex items-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition"
          >
            Cancel
          </Link>
        </div>
      </div>
    </main>
  )
}
