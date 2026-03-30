// src/app/(frontend)/procedures/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Procedures | FlaRepublic',
  description: 'Assembly procedures, training guides, and operational resources for Florida county assemblies.',
}

export const dynamic = 'force-static'

const SECTIONS = [
  {
    title: 'Sample Assembly Procedures',
    description: 'A complete business plan for standing up a county assembly — overview, office space, funding, legal structure, member intake, and more. By Jim Costa.',
    href: '/procedures/sample-procedures',
    items: ['Overview', 'Fast Track', 'Office Space', 'Funding', 'Legal Structure', 'Finding Members', 'Common Law Courts', 'Possible Projects'],
  },
  {
    title: 'Assembly Procedures',
    description: 'Foundational documents and training materials for properly convening and conducting a Florida Republic county assembly.',
    href: '/procedures/assembly',
    items: ['Organic Laws of America', 'Declaration of Independence', 'Articles of Confederation', 'The Constitution', 'How to Call an Assembly into Session'],
  },
  {
    title: 'Reigning In Corporations',
    description: 'Strategy and legal procedures for county assemblies to hold large corporations accountable under common law. By Jim Costa.',
    href: '/procedures/reigning-in-corps',
    items: ['Strategy Overview', 'De Jure Grand Jury', 'Types of Relief Sought', 'Legal Procedure'],
  },
  {
    title: 'Electronic Meetings',
    description: 'Training and guidance for running effective electronic meetings for county assemblies.',
    href: '/procedures/electronic-meetings',
    items: ['Meeting Methods', 'Platform Guidance', 'Robert\'s Rules Online'],
  },
]

export default function ProceduresPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Procedures</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Procedures</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Operational guides, training materials, and sample procedures for Florida county assemblies.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {SECTIONS.map(section => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {section.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {section.description}
            </p>
            <ul className="space-y-1">
              {section.items.slice(0, 4).map(item => (
                <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
              {section.items.length > 4 && (
                <li className="text-xs text-primary mt-1">+ {section.items.length - 4} more</li>
              )}
            </ul>
          </Link>
        ))}
      </div>
    </main>
  )
}
