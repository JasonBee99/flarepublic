// src/app/(frontend)/resources/documents/page.tsx
// Documents library — server component fetches data, passes to client DocumentViewer.

import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { DocumentViewer, type CategoryGroup } from './DocumentViewer'

export const metadata: Metadata = {
  title: 'Documents | FlaRepublic',
  description: 'Browse PDFs, spreadsheets, and reference materials for Florida Republic members.',
}

export const revalidate = 600

export default async function DocumentsPage() {
  const payload = await getPayload({ config: configPromise })

  const catResult = await payload.find({
    collection: 'document-categories',
    limit: 50,
    sort: 'displayOrder',
    overrideAccess: false,
  })

  const docResult = await payload.find({
    collection: 'documents',
    limit: 200,
    depth: 2,
    overrideAccess: false,
  })

  // Build serialisable groups to pass to the client component
  const grouped: Record<string, CategoryGroup> = {}

  for (const cat of catResult.docs) {
    grouped[cat.id as string] = { id: cat.id as string, title: cat.title as string, docs: [] }
  }

  for (const doc of docResult.docs) {
    const catId = typeof doc.category === 'object' ? (doc.category as { id: string })?.id : doc.category as string
    if (!catId || !grouped[catId]) continue

    const ftValue = typeof doc.fileType === 'object' ? (doc.fileType as { value?: string })?.value ?? null : null
    const href =
      (doc.externalUrl as string | undefined) ??
      (typeof doc.file === 'object' && (doc.file as { url?: string })?.url
        ? (doc.file as { url: string }).url
        : null)

    grouped[catId].docs.push({
      id: doc.id as string,
      title: doc.title as string,
      description: (doc.description as string | undefined) ?? null,
      ftValue,
      href,
    })
  }

  const groups = catResult.docs
    .map((cat) => grouped[cat.id as string])
    .filter((g) => g.docs.length > 0)

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Documents</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse reference materials, forms, and guides organized by topic.
          Click <strong>View</strong> to preview before downloading.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="text-muted-foreground">No documents available yet.</p>
      ) : (
        <DocumentViewer groups={groups} />
      )}
    </main>
  )
}
