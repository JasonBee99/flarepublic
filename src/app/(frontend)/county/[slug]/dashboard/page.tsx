// src/app/(frontend)/county/[slug]/dashboard/page.tsx
// County Organizer Dashboard — access: countyOrganizer (own county) or siteAdmin (any)
// Shows: member roster, learning progress per member, personality results, organizer notes

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { OrganizerDashboard } from './OrganizerDashboard'

export const dynamic = 'force-dynamic'

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Organizer Dashboard — ${slug} County | FlaRepublic`,
    description: 'County member progress, personality results, and organizer tools.',
  }
}

export default async function CountyOrganizerDashboardPage({ params }: Props) {
  const { slug } = await params
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (!user.approved) redirect('/member')

  // Only countyOrganizer and siteAdmin may access
  if (user.role !== 'countyOrganizer' && user.role !== 'siteAdmin') {
    redirect(`/county/${slug}`)
  }

  const payload = await getPayload({ config: configPromise })

  // Fetch the county
  const countyResult = await payload.find({
    collection: 'counties',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const county = countyResult.docs[0]
  if (!county) return notFound()

  // countyOrganizer must belong to this county
  if (user.role === 'countyOrganizer') {
    const userCountyId = typeof user.county === 'object' ? user.county?.id : user.county
    if (userCountyId !== county.id) redirect(`/county/${slug}`)
  }

  // ── Fetch all members in this county ──────────────────────────────────────
  const membersResult = await payload.find({
    collection: 'users',
    where: { county: { equals: county.id } },
    limit: 200,
    depth: 0,
  })
  const members = membersResult.docs

  const memberIds = members.map((m: any) => m.id)

  // ── Fetch personality results for all county members ──────────────────────
  const personalityResult = memberIds.length
    ? await payload.find({
        collection: 'personality-results',
        where: { user: { in: memberIds } },
        limit: 200,
        depth: 0,
      })
    : { docs: [] }

  // ── Fetch lesson progress for all county members ──────────────────────────
  const progressResult = memberIds.length
    ? await payload.find({
        collection: 'user-progress',
        where: { user: { in: memberIds } },
        limit: 1000,
        depth: 0,
      })
    : { docs: [] }

  // ── Total lesson count (denominator for progress bars) ───────────────────
  const lessonsResult = await payload.find({
    collection: 'lessons',
    where: { isActive: { equals: true } },
    limit: 0, // totalDocs only
  })
  const totalLessons = lessonsResult.totalDocs

  // ── Index results by userId for O(1) lookup ───────────────────────────────
  const personalityByUser: Record<string, any> = {}
  for (const r of personalityResult.docs) {
    const uid = typeof r.user === 'object' ? r.user.id : r.user
    personalityByUser[uid] = r
  }

  const progressCountByUser: Record<string, number> = {}
  for (const p of progressResult.docs) {
    const uid = typeof p.user === 'object' ? p.user.id : p.user
    progressCountByUser[uid] = (progressCountByUser[uid] ?? 0) + 1
  }

  // ── Assemble member rows ──────────────────────────────────────────────────
  const memberRows = members.map((m: any) => ({
    id: m.id,
    name: m.name ?? '—',
    email: m.email ?? '—',
    approved: m.approved ?? false,
    role: m.role ?? 'member',
    joinedAt: m.createdAt ?? null,
    personality: personalityByUser[m.id] ?? null,
    lessonsCompleted: progressCountByUser[m.id] ?? 0,
    totalLessons,
    contactInfo: m.contactInfo ?? null,
  }))

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/county/${slug}`} className="hover:text-foreground">{county.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Organizer Dashboard</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wide">County Organizer</p>
        <h1 className="text-4xl font-bold tracking-tight">{county.name} Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          {members.length} member{members.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} in the learning module
        </p>
      </div>

      {/* Interactive dashboard — client component */}
      <OrganizerDashboard
        countySlug={slug}
        countyName={county.name}
        currentUserId={user.id}
        members={memberRows}
      />
    </main>
  )
}
