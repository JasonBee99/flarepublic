// src/app/(frontend)/member/page.tsx
// Protected member dashboard — shows county page link, forum, and resources.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata: Metadata = {
  title: 'Member Area | FlaRepublic',
}

export const dynamic = 'force-dynamic'

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

export default async function MemberPage({
  searchParams,
}: {
  searchParams: Promise<{ no_county?: string }>
}) {
  const { no_county } = await searchParams
  const user = await getCurrentUser()

  if (!user) redirect('/login?redirect=/member')

  // Resolve county slug for the county page link
  let countySlug: string | null = null
  let countyName: string | null = null
  let learningStats: { completed: number; total: number; nextCourse: any } = { completed: 0, total: 0, nextCourse: null }

  if (user.approved || user.role === 'siteAdmin') {
    const payload = await getPayload({ config: configPromise })

    // County lookup (only if user has a county)
    if (user.county) {
      const countyId = typeof user.county === 'object' ? user.county.id : user.county
      try {
        const county = await payload.findByID({ collection: 'counties', id: countyId })
        countySlug = (county as any)?.slug ?? null
        countyName = (county as any)?.name ?? null
      } catch { }
    }

    // Learning progress — available to all approved users + admins
    try {
      const [allLessons, completedLessons, courses, personalityResult] = await Promise.all([
        payload.find({ collection: 'lessons', where: { isActive: { equals: true } }, limit: 0 }),
        payload.find({ collection: 'user-progress', where: { user: { equals: user.id } }, limit: 0 }),
        payload.find({ collection: 'courses', where: { isActive: { equals: true } }, sort: 'order', limit: 5 }),
        payload.find({ collection: 'personality-results', where: { user: { equals: user.id } }, limit: 1 }),
      ])
      learningStats.total = allLessons.totalDocs
      learningStats.completed = completedLessons.totalDocs
      learningStats.nextCourse = courses.docs[0] ?? null
      ;(learningStats as any).hasPersonalityResult = personalityResult.totalDocs > 0
    } catch { }
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Member Area</h1>

      {/* No county warning */}
      {no_county && (
        <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          Your account doesn&apos;t have a county assigned. Please contact{' '}
          <a href="mailto:admin@flarepublic.us" className="underline">admin@flarepublic.us</a>{' '}
          to have your county set.
        </div>
      )}

      {!user.approved ? (
        // ── Pending approval ────────────────────────────────────────────────
        <div className="mt-8 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-8 text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h2 className="text-xl font-semibold">Your account is pending approval</h2>
          <p className="mt-2 text-muted-foreground">
            Welcome, {user.name}! An administrator will review and approve your account. Once
            approved you&#x2019;ll have full access to the forum, your county page, and member
            resources.
          </p>
          {user.county && (
            <p className="mt-3 text-sm text-muted-foreground">
              You registered for{' '}
              <span className="font-medium text-foreground">
                {typeof user.county === 'object' ? (user.county as any).name : 'your county'}
              </span>
              . Your county page will be available once approved.
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Questions? Email{' '}
            <a href="mailto:admin@flarepublic.us" className="text-primary underline underline-offset-4">
              admin@flarepublic.us
            </a>
          </p>
        </div>
      ) : (
        // ── Approved member ─────────────────────────────────────────────────
        <div className="mt-6 space-y-6">
          <p className="text-muted-foreground">
            Welcome back, <span className="font-semibold text-foreground">{user.name}</span>!
            {countyName && (
              <span className="ml-2 text-sm">
                — Member of{' '}
                <span className="font-medium text-foreground">{countyName}</span>
              </span>
            )}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* County page — primary card */}
            {countySlug && (
              <MemberCard
                href={`/county/${countySlug}`}
                icon="🏛"
                title={countyName ?? 'My County'}
                description="View county posts, announcements, and your local forum."
                highlight
              />
            )}
            <MemberCard
              href="/forum"
              icon="💬"
              title="Forum"
              description="Join the statewide member discussion."
            />
            <MemberCard
              href="/resources/documents"
              icon="📄"
              title="Documents"
              description="Browse PDFs, forms, and reference materials."
            />
            {user.role === 'siteAdmin' && (
              <MemberCard
                href="/admin"
                icon="⚙️"
                title="Admin Panel"
                description="Manage users, posts, counties, and forum content."
              />
            )}
            {!(learningStats as any).hasPersonalityResult && (
              <MemberCard
                href="/resources/personality-profile"
                icon="🧠"
                title="Personality Profile"
                description="Take the optional personality test — helps your County Organizer place you in the right Focus Group."
                highlight
              />
            )}
          </div>

          {/* Learning progress */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Training Progress</h2>
              <Link href="/learn/courses" className="text-sm text-primary hover:underline">
                View all courses →
              </Link>
            </div>
            {learningStats.total === 0 ? (
              <p className="text-sm text-muted-foreground">
                No courses available yet.{' '}
                <Link href="/learn/courses" className="text-primary hover:underline">Check back soon →</Link>
              </p>
            ) : (
              <>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lessons completed</span>
                  <span className="font-medium">{learningStats.completed} / {learningStats.total}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${learningStats.total > 0 ? Math.round((learningStats.completed / learningStats.total) * 100) : 0}%` }}
                  />
                </div>
                {learningStats.nextCourse && (
                  <Link
                    href={`/learn/courses/${(learningStats.nextCourse as any).slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary/40 transition"
                  >
                    📚 {(learningStats.nextCourse as any).title} →
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-border pt-6">
        <Link href="/logout" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          Sign out
        </Link>
      </div>
    </main>
  )
}

function MemberCard({
  href,
  icon,
  title,
  description,
  highlight = false,
}: {
  href: string
  icon: string
  title: string
  description: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-2 rounded-lg border p-5 shadow-sm transition hover:shadow-md ${
        highlight
          ? 'border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10'
          : 'border-border bg-card hover:border-primary/40'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold group-hover:text-primary">{title}</span>
      <span className="text-sm text-muted-foreground">{description}</span>
    </Link>
  )
}
