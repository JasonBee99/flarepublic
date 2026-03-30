// src/app/(frontend)/community/county-assemblies/docs/[slug]/page.tsx
// Dynamic doc viewer — reads from Payload documents collection.

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
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

  const category = typeof doc.category === 'object' ? (doc.category as any)?.name : null
  const content = (doc as any).content as string | undefined

  // Parse paragraphs
  const paragraphs = content
    ? content.split('\n\n').map(p => p.trim()).filter(p => p.length > 0)
    : []

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies" className="hover:text-foreground">County Assemblies</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies/business-plan" className="hover:text-foreground">Business Plan</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{doc.title}</span>
      </div>

      {category && (
        <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">{category}</p>
      )}
      <h1 className="text-3xl font-bold tracking-tight mb-1">{doc.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa · Florida Republic</p>

      {paragraphs.length > 0 ? (
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          {paragraphs.map((para, i) => {
            // Detect headers (short lines in ALL CAPS or starting with #)
            const isHeader = para.length < 80 && (para === para.toUpperCase() || para.startsWith('The Problem') || para.startsWith('Facts &') || para.startsWith('The Plan'))
            if (isHeader) {
              return <h2 key={i} className="text-base font-semibold text-foreground mt-6 pt-4 border-t border-border first:border-t-0 first:pt-0 first:mt-0">{para}</h2>
            }
            // Detect numbered lists
            if (/^\d+[\.\)]/.test(para)) {
              const items = para.split('\n').filter(l => l.trim())
              return (
                <ol key={i} className="space-y-2 list-none">
                  {items.map((item, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="flex-shrink-0 font-bold text-primary">{item.match(/^\d+/)?.[0]}.</span>
                      <span>{item.replace(/^\d+[\.\)]\s*/, '')}</span>
                    </li>
                  ))}
                </ol>
              )
            }
            return <p key={i}>{para}</p>
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          <p className="mb-3">This document is available at the original source:</p>
          <a
            href={(doc as any).externalUrl || (doc as any).sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View on flarepublic.us →
          </a>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
        <Link href="/community/county-assemblies/business-plan" className="text-sm text-muted-foreground hover:text-foreground">← Back to Business Plan</Link>
        {((doc as any).externalUrl || (doc as any).sourceUrl) && (
          <a
            href={(doc as any).externalUrl || (doc as any).sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View original →
          </a>
        )}
      </div>
    </main>
  )
}
