// src/app/(frontend)/procedures/sample-procedures/page.tsx
// Sample County Assembly Procedures — index page mirroring Jim Costa's Wix site content.
// Organized into Founders and Training sections with links to detail pages.

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, BookOpen, GraduationCap, Zap, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sample County Assembly Procedures | FlaRepublic',
  description:
    'A free sample business plan with procedures that all county assemblies can use to stand up, become active, and thrive. By Jim Costa.',
}

export const dynamic = 'force-static'

const FOUNDERS_ITEMS = [
  { label: 'Overview',              href: '/procedures/sample-procedures/overview' },
  { label: 'Office Space',          href: '/procedures/sample-procedures/office-space' },
  { label: 'Office Budgeting',      href: '/procedures/sample-procedures/office-budgeting' },
  { label: 'Salaries & Founders',   href: '/procedures/sample-procedures/salaries' },
  { label: 'Securing Funding',      href: '/procedures/sample-procedures/funding' },
  { label: 'Legal Structure',       href: '/procedures/sample-procedures/legal-structure' },
  { label: 'Corp or Assembly?',     href: '/procedures/sample-procedures/corp-or-assembly' },
  { label: 'Legal Plan "B"',        href: '/procedures/sample-procedures/legal-plan-b' },
  { label: 'Finding Members',       href: '/procedures/sample-procedures/finding-members' },
  { label: 'Member Intake',         href: '/procedures/sample-procedures/member-intake' },
  { label: 'Website Re-Purpose',    href: '/procedures/sample-procedures/website' },
  { label: 'Common Law Courts',     href: '/procedures/sample-procedures/common-law-courts' },
  { label: 'Possible Projects',     href: '/procedures/sample-procedures/possible-projects' },
]

const TRAINING_ITEMS = [
  { label: 'Fast Track — Stand Up a County Assembly in One Week', href: '/procedures/sample-procedures/fast-track' },
  { label: 'Immediate Focus Groups',                               href: '/procedures/sample-procedures/immediate-focus-groups' },
  { label: 'Reigning In Corporations — Strategy',                 href: '/procedures/reigning-in-corps' },
]

export default function SampleProceduresPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Sample Assembly Procedures</span>
      </div>

      <div className="mb-10">
        <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wide">By Jim Costa</p>
        <h1 className="text-4xl font-bold tracking-tight">Sample County Assembly Procedures</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A free sample business plan with procedures that all county assemblies can use to stand up,
          become active, and thrive — a Cliff Notes style checklist for what to do when it's time to activate.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground max-w-2xl">
          <strong className="text-foreground">Caveat:</strong> This assumes at least 3 persons have
          already created an assembly and adopted bylaws. The purpose is to either stand it up early
          for training or be prepared to go into operation the day of the Announcement to Activate.
        </div>
      </div>

      {/* Fast Track CTA */}
      <div className="mb-10 rounded-xl border border-primary/30 bg-primary/5 p-6 flex items-start gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
          <Zap className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-foreground mb-1">In a hurry?</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Read the Fast Track guide to stand up a County Assembly in one week.
          </p>
          <Link
            href="/procedures/sample-procedures/fast-track"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Fast Track Guide <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Founders */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold">Founders</h2>
          </div>
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
            Foundational procedures for starting and structuring a county assembly — from
            securing office space to legal entity formation.
          </p>
          <ul className="space-y-1.5">
            {FOUNDERS_ITEMS.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors py-0.5"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Training */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold">Training</h2>
          </div>
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
            Practical training guides for activating your assembly quickly and effectively.
          </p>
          <ul className="space-y-1.5">
            {TRAINING_ITEMS.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors py-0.5"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-5 border-t border-border">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-semibold">Bonus Section</h2>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">How to reign in large corporations operating in your county.</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/procedures/reigning-in-corps" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors py-0.5">
                  <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  Strategy
                </Link>
              </li>
              <li>
                <Link href="/procedures/reigning-in-corps#procedure" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors py-0.5">
                  <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  Legal Procedure
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Content by Jim Costa — <a href="mailto:Costa4670@Gmail.com" className="hover:text-foreground transition">Costa4670@Gmail.com</a>.
        Originally published at <a href="https://costa4669.wixsite.com/website-1" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">costa4669.wixsite.com/website-1</a>.
        Free to use and adapt for any county assembly.
      </p>
    </main>
  )
}
