// src/app/(frontend)/resources/documents/page.tsx
// Documents library — fetches all documents from Payload, groups by category.
// Static generation with 10-min revalidation.

import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { FileText, Table, ExternalLink, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Documents | FlaRepublic',
  description: 'Browse PDFs, spreadsheets, and reference materials for Florida Republic members.',
}

export const revalidate = 600

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf:         <FileText className="h-5 w-5 text-red-500" />,
  spreadsheet: <Table className="h-5 w-5 text-green-600" />,
  link:        <ExternalLink className="h-5 w-5 text-blue-500" />,
}

export default async function DocumentsPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all categories (ordered)
  const catResult = await payload.find({
    collection: 'document-categories',
    limit: 50,
    sort: 'displayOrder',
    overrideAccess: false,
  })

  // Fetch all documents with relationships populated
  const docResult = await payload.find({
    collection: 'documents',
    limit: 200,
    depth: 2,
    overrideAccess: false,
  })

  const docs = docResult.docs
  const categories = catResult.docs

  // Group documents by category id
  const grouped: Record<string, typeof docs> = {}
  for (const doc of docs) {
    const catId = typeof doc.category === 'object' ? doc.category?.id : doc.category
    if (!catId) continue
    if (!grouped[catId]) grouped[catId] = []
    grouped[catId].push(doc)
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Documents</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse reference materials, forms, and guides organized by topic.
        </p>
      </div>

      {categories.length === 0 && (
        <p className="text-muted-foreground">No documents available yet.</p>
      )}

      <div className="space-y-12">
        {categories.map((cat) => {
          const catDocs = grouped[cat.id] ?? []
          if (catDocs.length === 0) return null

          return (
            <section key={cat.id}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xl font-semibold">{cat.title}</h2>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  {catDocs.length}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {catDocs.map((doc) => {
                  const ftValue =
                    typeof doc.fileType === 'object' ? doc.fileType?.value : null
                  const icon = FILE_ICONS[ftValue ?? 'pdf'] ?? FILE_ICONS.pdf

                  // Determine href — external URL takes priority over uploaded file
                  const href =
                    doc.externalUrl ??
                    (typeof doc.file === 'object' && doc.file?.url ? doc.file.url : null)

                  return (
                    <div
                      key={doc.id}
                      className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
                    >
                      <span className="mt-0.5 shrink-0">{icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug">{doc.title}</p>
                        {doc.description && (
                          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      {href && (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label={`Open ${doc.title}`}
                        >
                          {ftValue === 'link' ? (
                            <ExternalLink className="h-4 w-4" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
