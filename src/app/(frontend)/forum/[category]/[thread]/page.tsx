// src/app/(frontend)/forum/[category]/[thread]/page.tsx
// Thread detail — shows the OP body and reply chain.
// Reply submission is handled client-side via ForumReplyForm.

import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ForumReplyForm } from './ForumReplyForm'
import { ModActions } from './ModActions'

type Props = { params: Promise<{ category: string; thread: string }> }

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
  const { thread } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'forum-threads',
    where: { id: { equals: thread } },
    limit: 1,
    overrideAccess: true,
  })
  const t = result.docs[0]
  if (!t) return { title: 'Thread | Forum | FlaRepublic' }
  return { title: `${t.title} | Forum | FlaRepublic` }
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

// Render Payload rich text (Lexical) as plain paragraphs server-side.
// For production you'd use @payloadcms/richtext-lexical RichText component.
function renderRichText(body: unknown): string {
  if (!body) return ''
  if (typeof body === 'string') return body
  try {
    // Lexical root node
    const root = (body as { root?: { children?: Array<{ children?: Array<{ text?: string }> }> } }).root
    if (!root?.children) return ''
    return root.children
      .map((node) =>
        node.children?.map((child) => child.text ?? '').join('') ?? '',
      )
      .filter(Boolean)
      .join('\n\n')
  } catch {
    return ''
  }
}

export default async function ThreadPage({ params }: Props) {
  const { category, thread: threadId } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?redirect=/forum/${category}/${threadId}`)
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  // Load thread
  const threadResult = await payload.find({
    collection: 'forum-threads',
    where: {
      and: [
        { id: { equals: threadId } },
        { status: { equals: 'approved' } },
      ],
    },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  })
  const thread = threadResult.docs[0]
  if (!thread) notFound()

  // Load category for breadcrumb + mod check
  const catResult = await payload.find({
    collection: 'forum-categories',
    where: { slug: { equals: category } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const cat = catResult.docs[0]
  if (!cat) notFound()

  const moderatorIds = Array.isArray(cat.moderators)
    ? (cat.moderators as Array<{ id?: string } | string>).map((m) =>
        typeof m === 'object' ? m.id : m,
      )
    : []
  const isModerator = user.roles?.includes('admin') || moderatorIds.includes(user.id)
  const isAuthor = (typeof thread.author === 'object'
    ? (thread.author as { id?: string }).id
    : thread.author) === user.id

  // Load replies (approved only)
  const replyResult = await payload.find({
    collection: 'forum-replies',
    where: {
      and: [
        { thread: { equals: thread.id } },
        { status: { equals: 'approved' } },
      ],
    },
    sort: 'createdAt',
    limit: 200,
    depth: 2,
    overrideAccess: true,
  })

  const authorName =
    typeof thread.author === 'object'
      ? ((thread.author as { name?: string }).name ?? 'Member')
      : 'Member'

  const bodyText = renderRichText(thread.body)

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/forum" className="hover:text-foreground">
          Forum
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/forum/${category}`} className="hover:text-foreground">
          {cat.title as string}
        </Link>
        <span className="mx-2">/</span>
        <span className="truncate text-foreground">{thread.title as string}</span>
      </nav>

      {/* Thread OP */}
      <div className="mb-6 rounded-lg border border-border p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight">
            {thread.title as string}
          </h1>
          <div className="flex shrink-0 gap-2">
            {thread.pinned && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Pinned
              </span>
            )}
            {thread.locked && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Locked
              </span>
            )}
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          by <strong className="text-foreground">{authorName}</strong> &middot;{' '}
          {timeAgo((thread.createdAt as string) ?? '')}
        </p>

        <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-foreground">
          {bodyText}
        </div>

        {(isModerator || isAuthor) && (
          <ModActions
            threadId={thread.id as string}
            categorySlug={category}
            pinned={thread.pinned as boolean}
            locked={thread.locked as boolean}
            isModerator={isModerator}
            isAuthor={isAuthor}
          />
        )}
      </div>

      {/* Replies */}
      {replyResult.docs.length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold">
            {replyResult.docs.length} {replyResult.docs.length === 1 ? 'Reply' : 'Replies'}
          </h2>
          {replyResult.docs.map((reply) => {
            const replyAuthor =
              typeof reply.author === 'object'
                ? ((reply.author as { name?: string }).name ?? 'Member')
                : 'Member'
            const replyText = renderRichText(reply.body)
            const isNestedReply = !!reply.parentReply

            return (
              <div
                key={reply.id as string}
                className={`rounded-lg border border-border p-5 ${isNestedReply ? 'ml-8 border-l-2 border-l-primary/30' : ''}`}
              >
                <p className="mb-3 text-sm text-muted-foreground">
                  <strong className="text-foreground">{replyAuthor}</strong> &middot;{' '}
                  {timeAgo((reply.createdAt as string) ?? '')}
                </p>
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-foreground">
                  {replyText}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Reply form */}
      {thread.locked ? (
        <div className="rounded-lg border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
          🔒 This thread is locked. No new replies can be posted.
        </div>
      ) : (
        <ForumReplyForm
          threadId={thread.id as string}
          userId={user.id}
          categorySlug={category}
        />
      )}
    </main>
  )
}
