// src/app/(frontend)/forum/new/page.tsx
// New thread form — server shell that passes category list to client form.

import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NewThreadForm } from './NewThreadForm'

export const metadata: Metadata = {
  title: 'New Thread | Forum | FlaRepublic',
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

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: defaultCategory } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/forum/new')
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  const catResult = await payload.find({
    collection: 'forum-categories',
    where: { isActive: { equals: true } },
    sort: 'displayOrder',
    limit: 100,
    overrideAccess: true,
  })

  const categories = catResult.docs.map((cat) => ({
    id: cat.id as string,
    title: cat.title as string,
    slug: cat.slug as string,
  }))

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Start a New Thread</h1>
      <NewThreadForm
        categories={categories}
        defaultCategorySlug={defaultCategory ?? ''}
        userId={user.id}
      />
    </main>
  )
}
