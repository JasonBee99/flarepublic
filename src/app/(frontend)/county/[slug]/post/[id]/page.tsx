// src/app/(frontend)/county/[slug]/post/[id]/page.tsx
// Individual county post detail page.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react'
import RichText from '@/components/RichText'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string; id: string }>
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

export default async function CountyPostPage({ params }: Props) {
  const { slug, id } = await params

  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  // Fetch county
  const countyResult = await payload.find({
    collection: 'counties',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const county = countyResult.docs[0]
  if (!county) return notFound()

  // Secondary access check
  if (user.role !== 'siteAdmin') {
    const userCountyId = typeof user.county === 'object' ? user.county?.id : user.county
    if (userCountyId !== county.id) redirect('/member')
  }

  // Fetch the post
  let post: any
  try {
    post = await payload.findByID({ collection: 'county-posts', id })
  } catch {
    return notFound()
  }

  if (!post || post.status !== 'published') return notFound()

  // Ensure post belongs to this county
  const postCountyId = typeof post.county === 'object' ? post.county?.id : post.county
  if (postCountyId !== county.id) return notFound()

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/county/${slug}`} className="hover:text-foreground">{county.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </div>

      <Link
        href={`/county/${slug}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {county.name}
      </Link>

      <article>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
          )}
          {post.author && (
            <span>by {typeof post.author === 'object' ? post.author.name : 'Member'}</span>
          )}
        </div>

        <div className="mt-8 prose dark:prose-invert max-w-none">
          {post.content && <RichText data={post.content} />}
        </div>
      </article>
    </main>
  )
}
