// src/app/(frontend)/procedures/electronic-meetings/page.tsx
// Electronic Meetings — Zoom and Wire training links.

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Video, MessageSquare, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Electronic Meetings | FlaRepublic',
  description: 'How to participate in Florida Republic assemblies via Zoom and Wire.',
}

export const dynamic = 'force-static'

export default function ElectronicMeetingsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Electronic Meetings</span>
      </div>

      <h1 className="mb-3 text-4xl font-bold tracking-tight">Electronic Meetings</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        Florida Republic assemblies can be held electronically. Here&#x2019;s how to set up and
        participate using our approved platforms.
      </p>

      <div className="space-y-6">
        {/* Zoom */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Video className="h-5 w-5 text-blue-500" />
            </span>
            <h2 className="text-xl font-semibold">Zoom</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            Zoom is used for video assemblies with screen sharing, recording capability, and
            breakout rooms for committee work. All county assemblies held electronically use Zoom
            as the primary platform.
          </p>
          <h3 className="mb-2 text-sm font-semibold">Getting started:</h3>
          <ul className="mb-5 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Download the Zoom app for your device (free account is sufficient)
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Your county organizer will send meeting link and passcode before each assembly
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Join 5 minutes early to test audio and video before the session starts
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Keep yourself muted when not speaking — use the Raise Hand feature to be recognized
            </li>
          </ul>
          <a
            href="https://zoom.us/download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Download Zoom <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>

        {/* Wire */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </span>
            <h2 className="text-xl font-semibold">Wire</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            Wire is a secure, end-to-end encrypted messaging platform used for inter-assembly
            communications. It&#x2019;s where members coordinate between assemblies, share
            documents, and stay connected without using corporate social media.
          </p>
          <h3 className="mb-2 text-sm font-semibold">Getting started:</h3>
          <ul className="mb-5 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Download Wire — available on iOS, Android, and desktop
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Create your account using your real name (not a username/handle)
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Contact your county organizer to be added to the county group
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              All assembly notices, agendas, and follow-up items are distributed via Wire
            </li>
          </ul>
          <a
            href="https://wire.com/en/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Download Wire <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>
      </div>

      {/* Help */}
      <div className="mt-8 rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        Having trouble connecting? Contact your{' '}
        <Link href="/contacts" className="font-medium text-primary hover:underline">
          county organizer
        </Link>{' '}
        for technical assistance before the meeting.
      </div>
    </main>
  )
}
