// src/app/(frontend)/learn/courses/[slug]/page.tsx
// Course detail — list of lessons with completion status.
// Requires login + approval.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight, Clock, CheckCircle2, Circle, PlayCircle, FileText, BookOpen } from 'lucide-react'

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

const TYPE_ICON: Record<string, any> = {
  richtext: BookOpen,
  pdf: FileText,
  video: PlayCircle,
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `Course | FlaRepublic`, description: `Training course: ${slug}` }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?redirect=/learn/courses/${slug}`)
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  // Fetch course
  const courseResult = await payload.find({
    collection: 'courses',
    where: { and: [{ slug: { equals: slug } }, { isActive: { equals: true } }] },
    limit: 1,
  })
  const course = courseResult.docs[0]
  if (!course) return notFound()

  // Fetch lessons for this course
  const lessonsResult = await payload.find({
    collection: 'lessons',
    where: { and: [{ course: { equals: course.id } }, { isActive: { equals: true } }] },
    sort: 'order',
    limit: 100,
  })
  const lessons = lessonsResult.docs

  // Fetch user's completed lessons for this course
  const progressResult = await payload.find({
    collection: 'user-progress',
    where: { and: [{ user: { equals: user.id } }, { course: { equals: course.id } }] },
    limit: 200,
  })
  const completedIds = new Set(
    progressResult.docs.map((p: any) => {
      const lesson = p.lesson
      return typeof lesson === 'object' ? lesson.id : lesson
    })
  )

  const completedCount = completedIds.size
  const totalCount = lessons.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // First incomplete lesson
  const nextLesson = lessons.find((l: any) => !completedIds.has(l.id))

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/learn/courses" className="hover:text-foreground">Courses</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{course.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
        {course.description && (
          <p className="mt-3 text-lg text-muted-foreground">{course.description}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {course.estimatedMinutes && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              ~{course.estimatedMinutes} min total
            </span>
          )}
          <span>{totalCount} lesson{totalCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="mb-8 rounded-lg border border-border bg-card p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Your progress</span>
            <span className="text-muted-foreground">{completedCount} / {totalCount} completed</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 ? (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Course complete!
            </p>
          ) : nextLesson ? (
            <Link
              href={`/learn/courses/${slug}/${nextLesson.id}`}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              {completedCount === 0 ? 'Start course' : 'Continue'} →
            </Link>
          ) : null}
        </div>
      )}

      {/* Lesson list */}
      <div className="space-y-2">
        {lessons.map((lesson: any, idx: number) => {
          const done = completedIds.has(lesson.id)
          const Icon = TYPE_ICON[lesson.type] ?? BookOpen
          return (
            <Link
              key={lesson.id}
              href={`/learn/courses/${slug}/${lesson.id}`}
              className={`flex items-center gap-4 rounded-lg border p-4 transition hover:shadow-sm ${
                done
                  ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="text-muted-foreground">
                {done
                  ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                  : <Circle className="h-5 w-5" />
                }
              </span>
              <span className="flex-1">
                <span className="block font-medium">{lesson.title}</span>
                {lesson.estimatedMinutes && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> {lesson.estimatedMinutes} min
                  </span>
                )}
              </span>
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          )
        })}
      </div>
    </main>
  )
}
