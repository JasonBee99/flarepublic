// src/app/(frontend)/county-dashboards/page.tsx
// Site Admin only — lists all 67 FL counties with a link to each organizer dashboard.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight, LayoutDashboard } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'County Dashboards | FlaRepublic',
  description: 'Access organizer dashboards for any Florida county.',
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

export default async function CountyDashboardsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'siteAdmin') redirect('/member')

  const payload = await getPayload({ config: configPromise })

  const countiesResult = await payload.find({
    collection: 'counties',
    where: { isActive: { equals: true } },
    sort: 'name',
    limit: 200,
  })

  // Deduplicate by slug and exclude non-county placeholder records
  const EXCLUDE = new Set(['other', 'statewide'])
  const seen = new Set<string>()
  const counties = countiesResult.docs.filter((c: any) => {
    const key = c.slug ?? c.name?.toLowerCase()
    if (!key || EXCLUDE.has(key) || seen.has(key)) return false
    seen.add(key)
    return true
  })

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/member" className="hover:text-foreground">My Area</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">County Dashboards</span>
      </div>

      <div className="mb-10">
        <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wide">Site Admin</p>
        <h1 className="text-4xl font-bold tracking-tight">County Dashboards</h1>
        <p className="mt-2 text-muted-foreground">
          Select any county to view its organizer dashboard — member roster, learning progress, and personality results.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {counties.map((county: any) => (
          <Link
            key={county.id}
            href={`/county/${county.slug}/dashboard`}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/40 hover:bg-muted/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{county.name}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </main>
  )
}
