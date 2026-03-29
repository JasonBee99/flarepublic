// src/app/(frontend)/county/[slug]/page.tsx
// County hub page — shows county-specific posts + forum threads.
// Access is enforced by middleware; this page does a secondary server-side check.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight, PenSquare, MessageSquare, Calendar, AlertCircle, Users } from 'lucide-react'
import { ForumRichText } from '@/components/ForumRichText'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ wrong_county?: string }>
}

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
  const { slug } = await params
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} County | FlaRepublic`,
    description: `County-specific news, posts, and forum discussions.`,
  }
}

export default async function CountyPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { wrong_county } = await searchParams

  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  // Fetch the county by slug
  const countyResult = await payload.find({
    collection: 'counties',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const county = countyResult.docs[0]
  if (!county) return notFound()

  // Secondary access check — non-admins must belong to this county
  if (!user.role === 'siteAdmin') {
    const userCountyId = typeof user.county === 'object' ? user.county?.id : user.county
    if (userCountyId !== county.id) {
      // Middleware should have caught this, but belt-and-suspenders
      redirect('/member')
    }
  }

  // Fetch county posts (published only)
  const postsResult = await payload.find({
    collection: 'county-posts',
    where: {
      and: [
        { county: { equals: county.id } },
        { status: { equals: 'published' } },
      ],
    },
    sort: '-publishedAt',
    limit: 10,
  })

  // Fetch forum category for this county (matched by county relationship)
  const forumCatResult = await payload.find({
    collection: 'forum-categories',
    where: { county: { equals: county.id } },
    limit: 1,
  })
  const forumCategory = forumCatResult.docs[0]

  // Fetch recent forum threads for this county's forum
  const threadsResult = forumCategory
    ? await payload.find({
        collection: 'forum-threads',
        where: {
          and: [
            { category: { equals: forumCategory.id } },
            { status: { equals: 'approved' } },
          ],
        },
        sort: '-createdAt',
        limit: 5,
      })
    : { docs: [] }

  const posts = postsResult.docs
  const threads = threadsResult.docs

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{county.name}</span>
      </div>

      {/* Wrong county notice */}
      {wrong_county && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            That page is for members of a different county. You&apos;ve been redirected to your county page.
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{county.name}</h1>
        {county.description && (
          <p className="mt-3 text-lg text-muted-foreground">{county.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/county/${slug}/new-post`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            <PenSquare className="h-4 w-4" />
            New Post
          </Link>
          {forumCategory && (
            <Link
              href={`/forum/${forumCategory.slug}`}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary/40 transition"
            >
              <MessageSquare className="h-4 w-4" />
              County Forum
            </Link>
          )}
          {(user.role === 'countyOrganizer' || user.role === 'siteAdmin') && (
            <Link
              href={`/county/${slug}/dashboard`}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary/40 transition"
            >
              <Users className="h-4 w-4" />
              Organizer Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Posts — main column */}
        <div className="lg:col-span-3">
          <h2 className="mb-5 text-xl font-semibold">County Posts</h2>
          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
              <PenSquare className="mx-auto mb-3 h-8 w-8 opacity-40" />
              <p className="text-sm">No posts yet for {county.name}.</p>
              {(user.role === 'siteAdmin') && (
                <Link
                  href={`/county/${slug}/new-post`}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Create the first post →
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post: any) => (
                <article key={post.id} className="rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition">
                  <Link href={`/county/${slug}/post/${post.id}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition">{post.title}</h3>
                  </Link>
                  {post.excerpt && (
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Draft'}
                    </span>
                    {post.author && (
                      <span>by {typeof post.author === 'object' ? post.author.name : 'Member'}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Forum threads — sidebar */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Recent Forum Activity</h2>
            {forumCategory && (
              <Link href={`/forum/${forumCategory.slug}`} className="text-xs text-primary hover:underline">
                View all →
              </Link>
            )}
          </div>
          {!forumCategory ? (
            <p className="text-sm text-muted-foreground">No forum set up for this county yet.</p>
          ) : threads.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No forum threads yet.{' '}
              <Link href={`/forum/new`} className="text-primary hover:underline">Start one →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map((thread: any) => (
                <Link
                  key={thread.id}
                  href={`/forum/${forumCategory.slug}/${thread.id}`}
                  className="block rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition"
                >
                  <p className="font-medium text-sm line-clamp-2">{thread.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {thread.createdAt
                      ? new Date(thread.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : ''}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
