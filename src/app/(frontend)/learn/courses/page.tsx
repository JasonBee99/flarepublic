// src/app/(frontend)/learn/courses/page.tsx
// Course listing — all active courses, grouped by stage.
// Public page — anyone can see what's available, but lessons require login.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight, Clock, BookOpen, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Courses | FlaRepublic',
  description: 'Training courses for Florida Republic Assembly members.',
}

const STAGE_LABELS: Record<string, string> = {
  inactive: 'Inactive Stage — Start Here',
  stage1: 'Stage I — Founders',
  stage2: 'Stage II — Organization',
  stage3: 'Stage III — Assembly Operations',
  all: 'All Stages',
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

export default async function CoursesPage() {
  const user = await getCurrentUser()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'courses',
    where: { isActive: { equals: true } },
    sort: 'order',
    limit: 100,
  })

  const courses = result.docs

  // Group by stage
  const grouped: Record<string, typeof courses> = {}
  for (const course of courses) {
    const stage = (course.stage as string) ?? 'all'
    if (!grouped[stage]) grouped[stage] = []
    grouped[stage].push(course)
  }

  const stageOrder = ['inactive', 'stage1', 'stage2', 'stage3', 'all']

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Courses</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Training Courses</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Work through these courses to prepare for your role in the Florida Republic Assembly.
        </p>
        {!user && (
          <p className="mt-3 text-sm text-muted-foreground">
            <Link href="/register" className="text-primary hover:underline font-medium">Register</Link>
            {' '}or{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">sign in</Link>
            {' '}to track your progress.
          </p>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p>No courses published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {stageOrder.filter(s => grouped[s]?.length).map(stage => (
            <section key={stage}>
              <h2 className="mb-5 text-lg font-semibold text-muted-foreground uppercase tracking-wide text-sm">
                {STAGE_LABELS[stage] ?? stage}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {grouped[stage].map((course: any) => (
                  <Link
                    key={course.id}
                    href={user?.approved ? `/learn/courses/${course.slug}` : '/login?redirect=/learn/courses'}
                    className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"
                  >
                    {!user && (
                      <Lock className="absolute top-4 right-4 h-4 w-4 text-muted-foreground/50" />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold group-hover:text-primary transition">{course.title}</h3>
                    </div>
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    )}
                    {course.estimatedMinutes && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        ~{course.estimatedMinutes} min
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
