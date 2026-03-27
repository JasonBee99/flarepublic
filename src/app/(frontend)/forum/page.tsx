// src/app/(frontend)/forum/page.tsx
// Forum index — lists all active forum categories.
// Protected by middleware (login + approved required).

import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Forum | FlaRepublic',
  description: 'Discuss Florida Republic topics with approved members across all counties.',
}

export const revalidate = 60

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

export default async function ForumPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/forum')
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  const catResult = await payload.find({
    collection: 'forum-categories' as any,
    where: { isActive: { equals: true } },
    sort: 'title',
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })

  // Get thread counts per category
  const threadCounts: Record<string, number> = {}
  for (const cat of catResult.docs) {
    const count = await payload.count({
      collection: 'forum-threads' as any,
      where: {
        and: [
          { category: { equals: cat.id } },
          { status: { equals: 'approved' } },
        ],
      },
      overrideAccess: true,
    })
    threadCounts[cat.id as string] = count.totalDocs
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Forum</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            County and statewide discussion boards for approved members.
          </p>
        </div>
        <Link
          href="/forum/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          + New Thread
        </Link>
      </div>

      {catResult.docs.length === 0 ? (
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          No forum categories have been set up yet. Check back soon.
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {catResult.docs.map((cat) => {
            const slug = cat.slug as string

            return (
              <Link
                key={cat.id as string}
                href={`/forum/${slug}`}
                className="flex items-center justify-between px-6 py-5 transition hover:bg-muted/30"
              >
                <div>
                  <p className="font-semibold text-foreground">{cat.title as string}</p>
                  {cat.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {cat.description as string}
                    </p>
                  )}
                </div>
                <div className="ml-6 shrink-0 text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {threadCounts[cat.id as string] ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">threads</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
