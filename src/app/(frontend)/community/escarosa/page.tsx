// src/app/(frontend)/community/escarosa/page.tsx
// EscaRosa Chapter — Escambia & Santa Rosa County local chapter page.

import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { Users, FileText, Calendar, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EscaRosa Chapter | FlaRepublic',
  description:
    'The EscaRosa Chapter serves Escambia and Santa Rosa counties in the Florida Republic movement.',
}

export const dynamic = 'force-static'

const SUBNAV = [
  { label: 'Contacts', href: '/contacts' },
  { label: 'Documents', href: '/resources/documents' },
  { label: 'Assembly Procedures', href: '/procedures/assembly' },
  { label: 'Forum', href: '/forum' },
]

export default function EscaRosaPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/community" className="hover:text-foreground">Community</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">EscaRosa Chapter</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">EscaRosa Chapter</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Serving Escambia &amp; Santa Rosa Counties — the northwest Florida hub for the Florida
          Republic movement.
        </p>
      </div>

      {/* Sub-navigation */}
      <nav className="mb-10 flex flex-wrap gap-2" aria-label="Chapter navigation">
        {SUBNAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition hover:border-primary hover:text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* About */}
      <section className="mb-12 prose dark:prose-invert max-w-none">
        <h2>About the Chapter</h2>
        <p>
          The EscaRosa Chapter is the local organizing body for Escambia County and Santa Rosa
          County members of the Florida Republic. We hold regular county assemblies, support new
          members through the Fast Track program, and coordinate with statewide leadership on
          legislation and outreach.
        </p>
        <p>
          Whether you&#x2019;re just learning about the Florida Republic or you&#x2019;re a seasoned
          member, the EscaRosa Chapter is your starting point for local engagement.
        </p>
      </section>

      {/* Quick links grid */}
      <section className="mb-12">
        <h2 className="mb-5 text-xl font-semibold">Chapter Resources</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <ChapterCard
            href="/contacts"
            icon={<Users className="h-6 w-6" />}
            title="Chapter Contacts"
            description="Find your county organizer and local team members."
          />
          <ChapterCard
            href="/resources/documents"
            icon={<FileText className="h-6 w-6" />}
            title="Documents"
            description="Forms, guides, and reference materials for your county."
          />
          <ChapterCard
            href="/procedures/assembly"
            icon={<Calendar className="h-6 w-6" />}
            title="Assembly Procedures"
            description="How to run and participate in a county assembly."
          />
        </div>
      </section>

      {/* Counties */}
      <section>
        <h2 className="mb-5 text-xl font-semibold">Counties We Serve</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold">Escambia County</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Includes Pensacola and surrounding areas. Contact Susan Gray for local assembly
              information and membership questions.
            </p>
            <Link
              href="/contacts"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View contacts <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold">Santa Rosa County</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Includes Milton, Gulf Breeze, and surrounding areas. Contact Barbara Clayberger for
              local assembly information and membership questions.
            </p>
            <Link
              href="/contacts"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View contacts <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function ChapterCard({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"
    >
      <span className="text-primary">{icon}</span>
      <span className="font-semibold group-hover:text-primary">{title}</span>
      <span className="text-sm text-muted-foreground">{description}</span>
    </Link>
  )
}
