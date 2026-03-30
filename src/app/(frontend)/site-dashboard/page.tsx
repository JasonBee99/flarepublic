// src/app/(frontend)/site-dashboard/page.tsx
// Site Admin Dashboard — siteAdmin only.
// Cross-county overview: members, personality results, learning progress,
// approval queue, and county health summary.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { SiteAdminDashboard } from './SiteAdminDashboard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Site Admin Dashboard | FlaRepublic',
  description: 'Cross-county overview of members, progress, and county health.',
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
  } catch { return null }
}

export default async function SiteDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'siteAdmin') redirect('/member')

  const payload = await getPayload({ config: configPromise })

  // ── Fetch everything in parallel ──────────────────────────────────────────
  const [
    countiesResult,
    usersResult,
    personalityResult,
    progressResult,
    lessonsResult,
    focusGroupsResult,
  ] = await Promise.all([
    payload.find({
      collection: 'counties',
      where: { isActive: { equals: true } },
      sort: 'name',
      limit: 200,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'users',
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'personality-results',
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'user-progress',
      limit: 5000,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'lessons',
      where: { isActive: { equals: true } },
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'focus-groups' as any,
      where: { isActive: { equals: true } },
      limit: 500,
      depth: 0,
      overrideAccess: true,
    }),
  ])

  const counties = countiesResult.docs
  const users = usersResult.docs
  const personalityDocs = personalityResult.docs
  const progressDocs = progressResult.docs
  const totalLessons = lessonsResult.totalDocs
  const focusGroups = focusGroupsResult.docs

  // ── Index by userId ───────────────────────────────────────────────────────
  const personalityByUser: Record<string, any> = {}
  for (const r of personalityDocs) {
    const uid = typeof r.user === 'object' ? r.user.id : r.user
    personalityByUser[uid] = r
  }

  const progressCountByUser: Record<string, number> = {}
  for (const p of progressDocs) {
    const uid = typeof p.user === 'object' ? p.user.id : p.user
    progressCountByUser[uid] = (progressCountByUser[uid] ?? 0) + 1
  }

  // ── Focus groups per county ───────────────────────────────────────────────
  const focusGroupsByCounty: Record<string, number> = {}
  for (const fg of focusGroups) {
    const cid = typeof fg.county === 'object' ? fg.county.id : fg.county
    focusGroupsByCounty[cid] = (focusGroupsByCounty[cid] ?? 0) + 1
  }

  // ── Build member rows (exclude siteAdmin accounts) ────────────────────────
  const memberRows = users
    .filter((u: any) => u.role !== 'siteAdmin')
    .map((u: any) => {
      const countyId = typeof u.county === 'object' ? u.county?.id : u.county
      const county = counties.find((c: any) => c.id === countyId)
      return {
        id: u.id,
        name: u.name ?? '—',
        email: u.email ?? '—',
        approved: u.approved ?? false,
        role: u.role ?? 'member',
        countyId: countyId ?? null,
        countyName: county?.name ?? 'No county',
        countySlug: county?.slug ?? null,
        joinedAt: u.createdAt ?? null,
        personality: personalityByUser[u.id] ?? null,
        lessonsCompleted: progressCountByUser[u.id] ?? 0,
        totalLessons,
      }
    })

  // ── County health rows ────────────────────────────────────────────────────
  // Deduplicate counties by slug first
  const EXCLUDE = new Set(['other', 'statewide'])
  const seenSlugs = new Set<string>()
  const cleanCounties = counties.filter((c: any) => {
    const key = c.slug ?? c.name?.toLowerCase()
    if (!key || EXCLUDE.has(key) || seenSlugs.has(key)) return false
    seenSlugs.add(key)
    return true
  })

  const countyHealth = cleanCounties.map((c: any) => {
    const countyMembers = memberRows.filter(m => m.countyId === c.id)
    const approved = countyMembers.filter(m => m.approved).length
    const pending = countyMembers.length - approved
    const hasOrganizer = countyMembers.some(m => m.role === 'countyOrganizer')
    const testTaken = countyMembers.filter(m => m.personality).length
    const activeFocusGroups = focusGroupsByCounty[c.id] ?? 0
    const avgProgress = countyMembers.length > 0
      ? Math.round(
          countyMembers.reduce((acc, m) =>
            acc + (totalLessons > 0 ? m.lessonsCompleted / totalLessons : 0), 0
          ) / countyMembers.length * 100
        )
      : 0

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      totalMembers: countyMembers.length,
      approved,
      pending,
      hasOrganizer,
      testTaken,
      activeFocusGroups,
      avgProgress,
    }
  })

  // ── Personality type distribution ─────────────────────────────────────────
  const typeCounts = { S: 0, C: 0, M: 0, P: 0, none: 0 }
  for (const m of memberRows) {
    if (!m.personality) { typeCounts.none++; continue }
    const t = m.personality.dominantType as keyof typeof typeCounts
    if (t in typeCounts) typeCounts[t]++
  }

  // ── Top-level stats ───────────────────────────────────────────────────────
  const stats = {
    totalMembers: memberRows.length,
    approved: memberRows.filter(m => m.approved).length,
    pending: memberRows.filter(m => !m.approved).length,
    testTaken: memberRows.filter(m => m.personality).length,
    countiesWithMembers: cleanCounties.filter(c =>
      memberRows.some(m => m.countyId === c.id)
    ).length,
    countiesWithOrganizer: countyHealth.filter(c => c.hasOrganizer).length,
    totalFocusGroups: focusGroups.length,
    typeCounts,
    totalLessons,
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/member" className="hover:text-foreground">My Area</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Site Admin Dashboard</span>
      </div>

      <div className="mb-10">
        <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wide">Site Admin</p>
        <h1 className="text-4xl font-bold tracking-tight">Statewide Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Cross-county overview of all members, learning progress, personality results, and county health.
        </p>
      </div>

      <SiteAdminDashboard
        stats={stats}
        memberRows={memberRows}
        countyHealth={countyHealth}
      />
    </main>
  )
}
