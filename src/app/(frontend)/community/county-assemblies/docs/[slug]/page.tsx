// src/app/(frontend)/community/county-assemblies/docs/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ExternalLink, Tag } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'documents',
    where: { sourceUrl: { contains: slug } },
    limit: 1,
    overrideAccess: true,
  })
  const doc = result.docs[0]
  return {
    title: doc ? `${doc.title} | FlaRepublic` : 'Document | FlaRepublic',
  }
}

function renderContent(raw: string) {
  const blocks = raw.split(/\n\n+/).map(b => b.trim()).filter(Boolean)

  return blocks.map((block, i) => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)

    // Divider
    if (block === '---') return <hr key={i} className="my-6 border-border" />

    // Memo header block (To: / From: / Date: / Re:)
    if (lines.length >= 2 && lines.filter(l => /^(To:|From:|Date:|Re:|RE:)/.test(l)).length >= 2) {
      return (
        <div key={i} className="rounded-xl border border-border bg-muted/40 px-5 py-4 my-6 text-sm space-y-1.5">
          {lines.map((line, j) => {
            const m = line.match(/^([^:]{1,8}:)\s*(.*)/)
            if (m) return (
              <div key={j} className="flex gap-3">
                <span className="font-semibold text-foreground w-12 flex-shrink-0">{m[1]}</span>
                <span className="text-muted-foreground">{m[2]}</span>
              </div>
            )
            return <p key={j} className="text-muted-foreground">{line}</p>
          })}
        </div>
      )
    }

    // Numbered list — multiple lines all starting with digit
    if (lines.length >= 2 && lines.every(l => /^\d+[\.\)]\s/.test(l))) {
      return (
        <ol key={i} className="space-y-2 my-5">
          {lines.map((line, j) => (
            <li key={j} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
              <span className="flex-shrink-0 font-bold text-primary w-6 text-right">{line.match(/^(\d+)/)?.[1]}.</span>
              <span>{line.replace(/^\d+[\.\)]\s*/, '')}</span>
            </li>
          ))}
        </ol>
      )
    }

    // Lettered list A) B) C)
    if (lines.length >= 2 && lines.every(l => /^[A-Z][\.\)]\s/.test(l))) {
      return (
        <ol key={i} className="space-y-2 my-5">
          {lines.map((line, j) => (
            <li key={j} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
              <span className="flex-shrink-0 font-bold text-primary w-6">{line[0]})</span>
              <span>{line.replace(/^[A-Z][\.\)]\s*/, '')}</span>
            </li>
          ))}
        </ol>
      )
    }

    // Section header — short single line, known heading words or ALL CAPS
    const singleLine = lines.length === 1
    const isKnownHeader = /^(The Problem|Facts & Assumptions|The Plan|Costs?|Pros|Cons|Action Requested|Background|Summary|Overview|Purpose|Findings?|Conclusion|Introduction|Problem|Notes?|Warning|Important|Update)/i.test(block)
    const isAllCaps = block === block.toUpperCase() && block.length > 3 && /[A-Z]/.test(block)
    if (singleLine && block.length < 80 && (isKnownHeader || isAllCaps)) {
      return (
        <h2 key={i} className="text-base font-semibold text-foreground mt-8 mb-3 pb-2 border-b border-border first:mt-0">
          {block}
        </h2>
      )
    }

    // Short line ending in colon = subheading
    if (singleLine && block.endsWith(':') && block.length < 60) {
      return <h3 key={i} className="text-sm font-semibold text-foreground mt-6 mb-2">{block}</h3>
    }

    // Regular paragraph
    return (
      <p key={i} className="text-sm text-muted-foreground leading-relaxed my-3">
        {block}
      </p>
    )
  })
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'documents',
    where: { sourceUrl: { contains: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const doc = result.docs[0]
  if (!doc) notFound()

  const category = typeof doc.category === 'object' ? (doc.category as any)?.title : null
  const content = (doc as any).content as string | undefined
  const sourceUrl = (doc as any).sourceUrl || (doc as any).externalUrl

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies" className="hover:text-foreground">County Assemblies</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies/business-plan" className="hover:text-foreground">Business Plan</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground truncate max-w-[200px]">{doc.title}</span>
      </div>

      {/* Header card */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        {category && (
          <div className="flex items-center gap-1.5 mb-3">
            <Tag className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wide">{category}</span>
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">{doc.title}</h1>
        <p className="text-sm text-muted-foreground">
          By <span className="font-medium text-foreground">Jim Costa</span> · Florida Republic
        </p>
      </div>

      {/* Article content */}
      {content && content.length > 30 ? (
        <article>{renderContent(content)}</article>
      ) : (
        <div className="rounded-xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          <p className="mb-3">This document is available at the original source:</p>
          {sourceUrl && (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
              View on flarepublic.us <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
        <Link href="/community/county-assemblies/business-plan"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Business Plan
        </Link>
        {sourceUrl && (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            View original <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </main>
  )
}
