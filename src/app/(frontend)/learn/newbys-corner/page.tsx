// src/app/(frontend)/learn/newbys-corner/page.tsx
// Newby's Corner — orientation for new members.

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, HelpCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: "Newby's Corner | FlaRepublic",
  description:
    "New to the Florida Republic? Start here. Newby's Corner covers the essential concepts every new member needs to understand.",
}

export const dynamic = 'force-static'

const FAQ = [
  {
    q: 'What is the Florida Republic?',
    a: "The Florida Republic is the lawful, de jure government of the people of Florida — distinct from the corporate STATE OF FLORIDA. It operates under the original organic laws of America and the common law, and is populated by American nationals who have corrected their political status.",
  },
  {
    q: "What's the difference between a U.S. citizen and an American national?",
    a: "A U.S. citizen is a subject of the federal corporation. An American national is a sovereign man or woman, a Floridian by birth or choice, operating under the law of the land. Correcting your political status means establishing this distinction on the public record.",
  },
  {
    q: 'What is a county assembly?',
    a: "A county assembly is the lawful governing body of a county, populated by American nationals. It elects officers (Justice, Clerk, Bailiff), keeps records, issues findings, and represents the people's interests at the county level.",
  },
  {
    q: 'Do I have to do anything special to join?',
    a: "You start by learning and correcting your political status. There is no fee. Once you've corrected your status and attended an assembly, you're a participating member of your county assembly.",
  },
  {
    q: 'Is this legal?',
    a: "Yes. The right to assemble and to self-govern is protected by the First Amendment and deeply rooted in American history. County assemblies operate under the common law — the original law of the land.",
  },
]

export default function NewbysCornerPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Newby&#x2019;s Corner</span>
      </div>

      <h1 className="mb-3 text-4xl font-bold tracking-tight">Newby&#x2019;s Corner</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        Welcome. If you&#x2019;re new to the Florida Republic movement, this is where to start.
        Below you&#x2019;ll find answers to the most common questions — and a clear path forward.
      </p>

      {/* FAQ */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Common Questions</h2>
        </div>
        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border bg-card"
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium list-none">
                {item.q}
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Next steps */}
      <section>
        <h2 className="mb-5 text-xl font-semibold">Ready to take the next step?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Fast Track',
              desc: 'The six-step checklist to get oriented and active as quickly as possible.',
              href: '/learn/fast-track',
            },
            {
              title: 'Contact Your County',
              desc: 'Connect with your county organizer to start the process with guidance.',
              href: '/contacts',
            },
            {
              title: 'Documents Library',
              desc: 'Browse the full collection of foundational and training documents.',
              href: '/resources/documents',
            },
            {
              title: 'Assembly Procedures',
              desc: 'Learn how county assemblies work before attending your first one.',
              href: '/procedures/assembly',
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"
            >
              <div>
                <p className="font-semibold group-hover:text-primary">{card.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
              </div>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
