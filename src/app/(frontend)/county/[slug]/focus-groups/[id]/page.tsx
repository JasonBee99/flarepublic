// src/app/(frontend)/county/[slug]/focus-groups/[id]/page.tsx
// Focus group detail — shows members, capacity, join/waitlist button.
// Join logic runs as a server action.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { FocusGroupDetail } from './FocusGroupDetail'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string; id: string }> }

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
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Focus Group | FlaRepublic` }
}

export default async function FocusGroupDetailPage({ params }: Props) {
  const { slug, id } = await params
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

  // Non-admin must belong to this county
  if (user.role !== 'siteAdmin') {
    const userCountyId = typeof user.county === 'object' ? user.county?.id : user.county
    if (userCountyId !== county.id) redirect(`/county/${slug}`)
  }

  // Fetch the group
  let group: any
  try {
    group = await payload.findByID({ collection: 'focus-groups' as any, id, depth: 1 })
  } catch { return notFound() }
  if (!group || !group.isActive) return notFound()

  // Fetch all memberships for this group
  const membershipsResult = await payload.find({
    collection: 'focus-group-members' as any,
    where: { focusGroup: { equals: id } },
    limit: 200,
    depth: 1,
  })
  const memberships = membershipsResult.docs

  // Find current user's membership if any
  const myMembership = memberships.find((m: any) => {
    const uid = typeof m.user === 'object' ? m.user.id : m.user
    return uid === user.id
  }) ?? null

  const activeCount = memberships.filter((m: any) => m.status === 'active').length
  const waitlistCount = memberships.filter((m: any) => m.status === 'waitlist').length
  const expertCount = memberships.filter((m: any) => m.status === 'expert-volunteer').length
  const maxMembers = group.maxMembers ?? 6
  const isFull = activeCount >= maxMembers

  // Check if user is Choleric (for display warning)
  const personalityResult = await payload.find({
    collection: 'personality-results',
    where: { user: { equals: user.id } },
    limit: 1,
  })
  const isCholeric = personalityResult.docs[0]?.dominantType === 'C'

  const isOrganizer = user.role === 'countyOrganizer' || user.role === 'siteAdmin'

  // Build member list for display (active + waitlist, not experts)
  const displayMembers = memberships
    .filter((m: any) => m.status === 'active' || m.status === 'waitlist')
    .map((m: any) => ({
      id: m.id,
      name: typeof m.user === 'object' ? (m.user.name ?? 'Member') : 'Member',
      status: m.status,
      role: m.role,
      joinedAt: m.joinedAt,
    }))

  const expertMembers = memberships
    .filter((m: any) => m.status === 'expert-volunteer')
    .map((m: any) => ({
      id: m.id,
      name: typeof m.user === 'object' ? (m.user.name ?? 'Expert') : 'Expert',
      status: m.status,
      role: m.role,
      joinedAt: m.joinedAt,
    }))

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/county/${slug}`} className="hover:text-foreground">{county.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/county/${slug}/focus-groups`} className="hover:text-foreground">Focus Groups</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{group.title}</span>
      </div>

      <FocusGroupDetail
        group={{
          id: group.id,
          title: group.title,
          description: group.description ?? null,
          stage: group.stage,
          maxMembers,
          isActive: group.isActive,
          organizer: group.organizer
            ? { name: typeof group.organizer === 'object' ? (group.organizer.name ?? null) : null }
            : null,
        }}
        countySlug={slug}
        countyName={county.name}
        currentUserId={user.id}
        currentUserRole={user.role}
        myMembership={myMembership ? { id: myMembership.id, status: myMembership.status, role: myMembership.role } : null}
        activeCount={activeCount}
        waitlistCount={waitlistCount}
        expertCount={expertCount}
        isFull={isFull}
        isCholeric={isCholeric}
        isOrganizer={isOrganizer}
        displayMembers={displayMembers}
        expertMembers={expertMembers}
      />
    </main>
  )
}
