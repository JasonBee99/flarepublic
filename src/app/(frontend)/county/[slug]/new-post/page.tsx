// src/app/(frontend)/county/[slug]/new-post/page.tsx
// Create a new county-specific post.
// County members can post; only admins can assign to a different county.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { NewCountyPostForm } from './NewCountyPostForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'New County Post | FlaRepublic',
}

type Props = { params: Promise<{ slug: string }> }

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

export default async function NewCountyPostPage({ params }: Props) {
  const { slug } = await params

  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  const countyResult = await payload.find({
    collection: 'counties',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const county = countyResult.docs[0]
  if (!county) return notFound()

  // Non-admins must belong to this county
  if (!user.isAdmin) {
    const userCountyId = typeof user.county === 'object' ? user.county?.id : user.county
    if (userCountyId !== county.id) redirect(`/county/${slug}`)
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/county/${slug}`} className="hover:text-foreground">{county.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">New Post</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold tracking-tight">New Post for {county.name}</h1>

      <NewCountyPostForm
        countyId={county.id as string}
        countySlug={slug}
        authorId={user.id as string}
      />
    </main>
  )
}
