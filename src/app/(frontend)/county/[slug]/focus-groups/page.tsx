// src/app/(frontend)/county/[slug]/focus-groups/page.tsx
// Lists all active focus groups for the county.
// Accessible to approved members, countyOrganizer, siteAdmin.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight, Users, Plus, Clock, CheckCircle2 } from 'lucide-react'

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
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `Focus Groups — ${slug} County | FlaRepublic` }
}

const STAGE_LABEL: Record<string, string> = {
  forming:   'Forming',
  active:    'Active',
  completed: 'Completed',
  'on-hold': 'On Hold',
}

export default async function FocusGroupsPage({ params }: Props) {
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

  // Non-admin must belong to this county
  if (user.role !== 'siteAdmin') {
    const userCountyId = typeof user.county === 'object' ? user.county?.id : user.county
    if (userCountyId !== county.id) redirect(`/county/${slug}`)
  }

  // Fetch active focus groups for this county
  const groupsResult = await payload.find({
    collection: 'focus-groups' as any,
    where: {
      and: [
        { county: { equals: county.id } },
        { isActive: { equals: true } },
      ],
    },
    sort: 'title',
    limit: 100,
    depth: 1,
  })
  const groups = groupsResult.docs

  // Fetch current user's memberships to show join status
  const membershipResult = await payload.find({
    collection: 'focus-group-members' as any,
    where: { user: { equals: user.id } },
    limit: 100,
    depth: 0,
  })
  const myGroupIds = new Set(
    membershipResult.docs.map((m: any) =>
      typeof m.focusGroup === 'object' ? m.focusGroup.id : m.focusGroup
    )
  )

  // Fetch active member counts per group
  const allMemberships = groups.length
    ? await payload.find({
        collection: 'focus-group-members' as any,
        where: {
          and: [
            { focusGroup: { in: groups.map((g: any) => g.id) } },
            { status: { equals: 'active' } },
          ],
        },
        limit: 1000,
        depth: 0,
      })
    : { docs: [] }

  const activeCounts: Record<string, number> = {}
  for (const m of allMemberships.docs) {
    const gid = typeof m.focusGroup === 'object' ? m.focusGroup.id : m.focusGroup
    activeCounts[gid] = (activeCounts[gid] ?? 0) + 1
  }

  const isOrganizer = user.role === 'countyOrganizer' || user.role === 'siteAdmin'

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/county/${slug}`} className="hover:text-foreground">{county.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Focus Groups</span>
      </div>

      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wide">{county.name}</p>
          <h1 className="text-4xl font-bold tracking-tight">Focus Groups</h1>
          <p className="mt-2 text-muted-foreground">
            Small groups of up to 6 members working together on civic action.
          </p>
        </div>
        {isOrganizer && (
          <Link
            href={`/county/${slug}/focus-groups/new`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition flex-shrink-0"
          >
            <Plus className="h-4 w-4" /> New Group
          </Link>
        )}
      </div>

      {/* Groups */}
      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No focus groups yet for {county.name}.</p>
          {isOrganizer && (
            <Link
              href={`/county/${slug}/focus-groups/new`}
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Create the first group →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map((group: any) => {
            const active = activeCounts[group.id] ?? 0
            const max = group.maxMembers ?? 6
            const full = active >= max
            const isMember = myGroupIds.has(group.id)
            const pct = Math.round((active / max) * 100)

            return (
              <Link
                key={group.id}
                href={`/county/${slug}/focus-groups/${group.id}`}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors"
              >
                {/* Stage + joined badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {STAGE_LABEL[group.stage] ?? group.stage}
                  </span>
                  {isMember && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Joined
                    </span>
                  )}
                </div>

                <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {group.title}
                </h2>
                {group.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{group.description}</p>
                )}

                {/* Capacity bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {active} / {max} members
                    </span>
                    {full && !isMember && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> Waitlist open
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${full ? 'bg-muted-foreground' : 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
