// src/app/(frontend)/learn/courses/[slug]/[lessonId]/page.tsx
// Lesson player — renders the lesson content and handles mark-complete.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, ChevronRight as Next } from 'lucide-react'
import RichText from '@/components/RichText'
import { LessonCompleteButton } from './LessonCompleteButton'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string; lessonId: string }> }

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

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    let videoId: string | null = null
    if (u.hostname.includes('youtube.com')) videoId = u.searchParams.get('v')
    else if (u.hostname === 'youtu.be') videoId = u.pathname.slice(1)
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}`
    }
  } catch { }
  return null
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?redirect=/learn/courses/${slug}/${lessonId}`)
  if (!user.approved) redirect('/member')

  const payload = await getPayload({ config: configPromise })

  // Fetch course
  const courseResult = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const course = courseResult.docs[0]
  if (!course) return notFound()

  // Fetch lesson
  let lesson: any
  try {
    lesson = await payload.findByID({ collection: 'lessons', id: lessonId })
  } catch { return notFound() }
  if (!lesson || !lesson.isActive) return notFound()

  // Verify lesson belongs to this course
  const lessonCourseId = typeof lesson.course === 'object' ? lesson.course.id : lesson.course
  if (lessonCourseId !== course.id) return notFound()

  // Fetch all lessons for prev/next navigation
  const allLessons = await payload.find({
    collection: 'lessons',
    where: { and: [{ course: { equals: course.id } }, { isActive: { equals: true } }] },
    sort: 'order',
    limit: 100,
  })
  const lessonList = allLessons.docs
  const currentIdx = lessonList.findIndex((l: any) => l.id === lessonId)
  const prevLesson = currentIdx > 0 ? lessonList[currentIdx - 1] : null
  const nextLesson = currentIdx < lessonList.length - 1 ? lessonList[currentIdx + 1] : null

  // Check if already completed
  const progressResult = await payload.find({
    collection: 'user-progress',
    where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lessonId } }] },
    limit: 1,
  })
  const isCompleted = progressResult.docs.length > 0

  const userCountyId = typeof user.county === 'object' ? user.county?.id : user.county

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/learn/courses" className="hover:text-foreground">Courses</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/learn/courses/${slug}`} className="hover:text-foreground">{course.title}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">
          Lesson {currentIdx + 1} of {lessonList.length}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
      </div>

      {/* Lesson content */}
      <div className="mb-10">
        {lesson.type === 'richtext' && lesson.content && (
          <div className="prose dark:prose-invert max-w-none">
            <RichText data={lesson.content} />
          </div>
        )}

        {lesson.type === 'video' && lesson.videoUrl && (() => {
          const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl)
          return embedUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
              <iframe
                src={embedUrl}
                className="h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer"
               className="text-primary hover:underline">
              Watch video →
            </a>
          )
        })()}
        {lesson.type === 'video' && lesson.videoCaption && (
          <p className="mt-2 text-sm text-muted-foreground">{lesson.videoCaption}</p>
        )}

        {lesson.type === 'pdf' && (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            {(lesson.pdfUrl || lesson.pdfFile) ? (
              <>
                <p className="mb-4 text-muted-foreground">Open the PDF to read this lesson.</p>
                <a
                  href={lesson.pdfUrl ?? (typeof lesson.pdfFile === 'object' ? lesson.pdfFile?.url : null)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
                >
                  Open PDF →
                </a>
              </>
            ) : (
              <p className="text-muted-foreground">PDF coming soon.</p>
            )}
          </div>
        )}

        {/* Notes */}
        {lesson.notes && (
          <div className="mt-8 rounded-lg border border-border bg-muted/40 p-5">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
            <div className="prose dark:prose-invert max-w-none text-sm">
              <RichText data={lesson.notes} />
            </div>
          </div>
        )}
      </div>

      {/* Mark complete + navigation */}
      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <LessonCompleteButton
          lessonId={lessonId}
          courseId={course.id as string}
          countyId={userCountyId ?? null}
          courseSlug={slug}
          isCompleted={isCompleted}
          nextLessonId={nextLesson?.id ?? null}
        />

        <div className="flex items-center justify-between">
          {prevLesson ? (
            <Link
              href={`/learn/courses/${slug}/${prevLesson.id}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> {prevLesson.title}
            </Link>
          ) : <span />}
          {nextLesson ? (
            <Link
              href={`/learn/courses/${slug}/${nextLesson.id}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {nextLesson.title} <Next className="h-4 w-4" />
            </Link>
          ) : (
            <Link href={`/learn/courses/${slug}`} className="text-sm text-primary hover:underline">
              Back to course →
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
