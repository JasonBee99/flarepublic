// src/app/(frontend)/procedures/assembly/page.tsx
// Assembly Procedures — two-section layout: Founders / Training

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, BookOpen, GraduationCap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Assembly Procedures | FlaRepublic',
  description: 'Learn how to properly run and participate in a Florida Republic county assembly.',
}

export const dynamic = 'force-static'

export default function AssemblyProceduresPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Assembly Procedures</span>
      </div>

      <h1 className="mb-3 text-4xl font-bold tracking-tight">Assembly Procedures</h1>
      <p className="mb-12 text-lg text-muted-foreground">
        Understanding how to properly convene and conduct a Florida Republic county assembly is
        foundational to the movement. Below you&#x2019;ll find both the foundational documents and
        practical training materials.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Founders Section */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold">Founders</h2>
          </div>
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
            The foundational principles and historical basis for county assemblies in Florida.
            These documents establish the lawful authority and proper form for assembly proceedings.
          </p>
          <ul className="space-y-2">
            {[
              'The Organic Laws of America',
              'Declaration of Independence',
              'Articles of Confederation',
              'The Constitution',
              'Northwest Ordinance of 1787',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/resources/documents"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Browse founder documents <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* Training Section */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold">Training</h2>
          </div>
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
            Step-by-step guidance for running an assembly correctly — from calling the assembly
            into session to proper recording and adjournment procedures.
          </p>
          <ul className="space-y-2">
            {[
              'How to Call an Assembly into Session',
              'Quorum Requirements',
              'Election of Officers (Justice, Clerk, Bailiff)',
              'Making and Recording Motions',
              'Proper Adjournment',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/resources/documents"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Browse training documents <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>

      {/* Next step CTA */}
      <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6">
        <h3 className="font-semibold">Ready to participate?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Find your county assembly schedule and contact your local organizer to get involved.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contacts"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Find my county contact
          </Link>
          <Link
            href="/learn/fast-track"
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary/40"
          >
            Fast Track checklist
          </Link>
        </div>
      </div>
    </main>
  )
}
