// src/app/(frontend)/member/page.tsx
// Protected member dashboard — redirects to login if not authenticated,
// shows pending-approval message if not yet approved.

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Member Area | FlaRepublic',
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

export default async function MemberPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/member')
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Member Area</h1>

      {!user.approved ? (
        // ── Pending approval ─────────────────────────────────────────────────
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
            approved you&#x2019;ll have full access to the forum and member resources.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Questions? Email{' '}
            <a
              href="mailto:admin@flarepublic.us"
              className="text-primary underline underline-offset-4"
            >
              admin@flarepublic.us
            </a>
          </p>
        </div>
      ) : (
        // ── Approved member ───────────────────────────────────────────────────
        <div className="mt-6 space-y-6">
          <p className="text-muted-foreground">
            Welcome back, <span className="font-semibold text-foreground">{user.name}</span>!
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MemberCard
              href="/forum"
              icon="💬"
              title="Forum"
              description="Join the member discussion on Discord."
            />
            <MemberCard
              href="/resources/documents"
              icon="📄"
              title="Documents"
              description="Browse PDFs, forms, and reference materials."
            />
            <MemberCard
              href="/community/escarosa"
              icon="🏛"
              title="EscaRosa Chapter"
              description="Local chapter info for Escambia &amp; Santa Rosa."
            />
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-border pt-6">
        <Link
          href="/logout"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
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
}: {
  href: string
  icon: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold group-hover:text-primary">{title}</span>
      <span
        className="text-sm text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </Link>
  )
}
