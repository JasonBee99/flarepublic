// src/app/(frontend)/forum/[category]/page.tsx
// Thread listing for a single forum category.

import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

type Props = { params: Promise<{ category: string }> }

async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.user ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'forum-categories',
    where: { slug: { equals: category } },
    limit: 1,
    overrideAccess: true,
  })
  const cat = result.docs[0]
  if (!cat) return { title: 'Forum | FlaRepublic' }
  return {
    title: `${cat.title} | Forum | FlaRepublic`,
    description: (cat.description as string | undefined) ?? undefined,
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?redirect=/forum/${category}`)
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  const catResult = await payload.find({
    collection: 'forum-categories',
    where: { slug: { equals: category } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const cat = catResult.docs[0]
  if (!cat || !cat.isActive) notFound()

  // Check if current user is a moderator of this category
  const moderatorIds = Array.isArray(cat.moderators)
    ? (cat.moderators as Array<{ id?: string } | string>).map((m) =>
        typeof m === 'object' ? m.id : m,
      )
    : []
  const isModerator = user.roles?.includes('admin') || moderatorIds.includes(user.id)

  // Fetch pinned threads first, then the rest
  const pinnedResult = await payload.find({
    collection: 'forum-threads',
    where: {
      and: [
        { category: { equals: cat.id } },
        { status: { equals: 'approved' } },
        { pinned: { equals: true } },
      ],
    },
    sort: '-createdAt',
    limit: 20,
    depth: 1,
    overrideAccess: true,
  })

  const threadResult = await payload.find({
    collection: 'forum-threads',
    where: {
      and: [
        { category: { equals: cat.id } },
        { status: { equals: 'approved' } },
        { pinned: { equals: false } },
      ],
    },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
    overrideAccess: true,
  })

  const allThreads = [...pinnedResult.docs, ...threadResult.docs]

  // Get reply counts
  const replyCounts: Record<string, number> = {}
  for (const t of allThreads) {
    const rc = await payload.count({
      collection: 'forum-replies',
      where: {
        and: [
          { thread: { equals: t.id } },
          { status: { equals: 'approved' } },
        ],
      },
      overrideAccess: true,
    })
    replyCounts[t.id as string] = rc.totalDocs
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/forum" className="hover:text-foreground">
          Forum
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{cat.title as string}</span>
      </nav>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{cat.title as string}</h1>
          {cat.description && (
            <p className="mt-1 text-muted-foreground">{cat.description as string}</p>
          )}
        </div>
        <Link
          href={`/forum/new?category=${cat.slug as string}`}
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          + New Thread
        </Link>
      </div>

      {allThreads.length === 0 ? (
        <div className="rounded-lg border border-border p-10 text-center text-muted-foreground">
          No threads yet. Be the first to start a discussion.
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {allThreads.map((thread) => {
            const authorName =
              typeof thread.author === 'object'
                ? ((thread.author as { name?: string }).name ?? 'Member')
                : 'Member'

            return (
              <div key={thread.id as string} className="flex items-center gap-4 px-5 py-4">
                {/* Status icons */}
                <div className="flex w-6 shrink-0 flex-col items-center gap-1">
                  {thread.pinned && (
                    <span title="Pinned" className="text-primary">
                      📌
                    </span>
                  )}
                  {thread.locked && (
                    <span title="Locked" className="text-muted-foreground">
                      🔒
                    </span>
                  )}
                </div>

                {/* Thread info */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/forum/${category}/${thread.id as string}`}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {thread.title as string}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    by {authorName} &middot;{' '}
                    {timeAgo((thread.createdAt as string) ?? '')}
                  </p>
                </div>

                {/* Reply count */}
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold text-foreground">
                    {replyCounts[thread.id as string] ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">replies</p>
                </div>

                {/* Moderator actions */}
                {isModerator && (
                  <div className="shrink-0 text-xs text-muted-foreground">
                    <Link
                      href={`/forum/${category}/${thread.id as string}?mod=1`}
                      className="rounded border border-border px-2 py-1 hover:bg-muted"
                    >
                      Manage
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
