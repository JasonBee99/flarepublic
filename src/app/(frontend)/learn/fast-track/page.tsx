// src/app/(frontend)/learn/fast-track/page.tsx
// Fast Track — numbered checklist for new members.

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fast Track | FlaRepublic',
  description:
    'The Fast Track checklist — the quickest path to becoming an active Florida Republic member.',
}

export const dynamic = 'force-static'

const STEPS = [
  {
    title: 'Understand who you are',
    body: 'Study the difference between a U.S. citizen and an American national. Read the foundational documents that establish your standing.',
    link: { label: 'Browse founder documents', href: '/resources/documents' },
  },
  {
    title: "Read Newby's Corner",
    body: "Start with the introductory materials in Newby's Corner to get oriented to the Florida Republic and how it works.",
    link: { label: "Go to Newby's Corner", href: '/learn/newbys-corner' },
  },
  {
    title: 'Correct your political status',
    body: "File the paperwork to correct your political status on the public record. Your county organizer can walk you through the exact steps for Florida.",
    link: { label: 'Contact your county organizer', href: '/contacts' },
  },
  {
    title: 'Attend a county assembly',
    body: 'Participate in your first county assembly. Learn the procedures, meet other members, and begin participating in the lawful process.',
    link: { label: 'Assembly procedures', href: '/procedures/assembly' },
  },
  {
    title: 'Join the forum',
    body: 'Connect with other members in the members-only Discord forum. Ask questions, share resources, and stay current on statewide activity.',
    link: { label: 'Go to Forum', href: '/forum' },
  },
  {
    title: 'Stay engaged',
    body: 'Review new documents as they are added, attend regular assemblies, and support others who are just starting their journey.',
    link: { label: 'View all documents', href: '/resources/documents' },
  },
]

export default function FastTrackPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Fast Track</span>
      </div>

      <h1 className="mb-3 text-4xl font-bold tracking-tight">Fast Track</h1>
      <p className="mb-12 text-lg text-muted-foreground">
        New to the Florida Republic? This checklist covers the essential steps to get oriented,
        correct your status, and start participating — in the right order.
      </p>

      <ol className="space-y-6">
        {STEPS.map((step, i) => (
          <li key={i} className="group relative flex gap-5">
            {/* Step number + connector line */}
            <div className="flex flex-col items-center">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="mt-2 w-px flex-1 bg-border" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pb-6">
              <h2 className="text-lg font-semibold leading-tight">{step.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              {step.link && (
                <Link
                  href={step.link.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {step.link.label} <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Completion note */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/5 p-5">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
        <div>
          <p className="font-semibold text-sm">You&#x2019;re on your way</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Work through these steps at your own pace. Your county organizer is available to
            answer questions at any stage.
          </p>
          <Link
            href="/contacts"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Find your county contact <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
