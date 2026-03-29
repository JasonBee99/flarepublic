'use client'
// LessonCompleteButton.tsx
// Marks a lesson complete via the Payload REST API, then navigates to next lesson.

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle } from 'lucide-react'

interface Props {
  lessonId: string
  courseId: string
  countyId: string | null
  courseSlug: string
  isCompleted: boolean
  nextLessonId: string | null
}

export function LessonCompleteButton({
  lessonId,
  courseId,
  countyId,
  courseSlug,
  isCompleted: initialCompleted,
  nextLessonId,
}: Props) {
  const router = useRouter()
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    if (completed || loading) return
    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        lesson: lessonId,
        course: courseId,
        completedAt: new Date().toISOString(),
      }
      if (countyId) body.county = countyId

      // Need to get the current user id — fetch from /api/users/me
      const meRes = await fetch('/api/users/me', { credentials: 'include' })
      const meData = await meRes.json()
      const userId = meData?.user?.id
      if (userId) body.user = userId

      const res = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setCompleted(true)
        router.refresh()
        // Navigate to next lesson after short delay
        if (nextLessonId) {
          setTimeout(() => {
            router.push(`/learn/courses/${courseSlug}/${nextLessonId}`)
          }, 800)
        }
      }
    } catch {
      // silent fail — user can try again
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
        <CheckCircle2 className="h-5 w-5" />
        Lesson complete{nextLessonId ? ' — moving to next lesson…' : ' — course done!'}
      </div>
    )
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition"
    >
      <Circle className="h-4 w-4" />
      {loading ? 'Saving…' : 'Mark complete'}
    </button>
  )
}
