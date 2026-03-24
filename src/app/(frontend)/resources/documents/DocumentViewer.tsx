'use client'
// src/app/(frontend)/resources/documents/DocumentViewer.tsx
// Renders the documents grid with an inline PDF viewer modal.
// Opens on click — shows PDF in <iframe> with View/Download actions.

import React, { useState, useEffect, useCallback } from 'react'
import { FileText, Table, ExternalLink, Download, X, Maximize2, Eye } from 'lucide-react'

export interface DocItem {
  id: string
  title: string
  description?: string | null
  ftValue: string | null
  href: string | null
}

export interface CategoryGroup {
  id: string
  title: string
  docs: DocItem[]
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf:         <FileText className="h-5 w-5 text-red-500" />,
  spreadsheet: <Table className="h-5 w-5 text-green-600" />,
  link:        <ExternalLink className="h-5 w-5 text-blue-500" />,
}

// ── PDF Viewer Modal ──────────────────────────────────────────────────────────

function PdfModal({
  doc,
  onClose,
}: {
  doc: DocItem
  onClose: () => void
}) {
  const isExternal = doc.ftValue === 'link'
  const isSpreadsheet = doc.ftValue === 'spreadsheet'

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <div className="relative flex h-full w-full max-h-[90vh] max-w-5xl flex-col rounded-xl border border-border bg-background shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0">{FILE_ICONS[doc.ftValue ?? 'pdf'] ?? FILE_ICONS.pdf}</span>
            <div className="min-w-0">
              <h2 className="font-semibold leading-snug truncate">{doc.title}</h2>
              {doc.description && (
                <p className="mt-0.5 text-sm text-muted-foreground truncate">{doc.description}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {doc.href && !isExternal && !isSpreadsheet && (
              <a
                href={doc.href}
                download
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
            )}
            {doc.href && (isExternal || isSpreadsheet) && (
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </a>
            )}
            {doc.href && (
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition hover:border-primary/40"
                title="Open in new tab"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Full screen</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 bg-muted/30 overflow-hidden">
          {isExternal || isSpreadsheet ? (
            // External links / spreadsheets can't be embedded — show a prompt
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                {FILE_ICONS[doc.ftValue ?? 'pdf']}
              </div>
              <div>
                <p className="font-semibold">
                  {isSpreadsheet ? 'Spreadsheet file' : 'External document'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This file can't be previewed here. Use the button above to open it.
                </p>
              </div>
              {doc.href && (
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open document
                </a>
              )}
            </div>
          ) : doc.href ? (
            // PDF inline viewer
            <iframe
              src={`${doc.href}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              className="h-full w-full border-0"
              title={doc.title}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No file available.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Documents Grid ────────────────────────────────────────────────────────────

export function DocumentViewer({ groups }: { groups: CategoryGroup[] }) {
  const [activeDoc, setActiveDoc] = useState<DocItem | null>(null)
  const close = useCallback(() => setActiveDoc(null), [])

  return (
    <>
      <div className="space-y-12">
        {groups.map((cat) => (
          <section key={cat.id}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xl font-semibold">{cat.title}</h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                {cat.docs.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {cat.docs.map((doc) => (
                <div
                  key={doc.id}
                  className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
                >
                  <span className="mt-0.5 shrink-0">
                    {FILE_ICONS[doc.ftValue ?? 'pdf'] ?? FILE_ICONS.pdf}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{doc.title}</p>
                    {doc.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                  </div>
                  {doc.href && (
                    <div className="flex shrink-0 items-center gap-1">
                      {/* View button — opens modal */}
                      <button
                        onClick={() => setActiveDoc(doc)}
                        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label={`Preview ${doc.title}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      {/* Direct download / open */}
                      <a
                        href={doc.href}
                        target={doc.ftValue === 'link' ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        download={doc.ftValue !== 'link' && doc.ftValue !== 'spreadsheet' ? true : undefined}
                        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label={doc.ftValue === 'link' ? `Open ${doc.title}` : `Download ${doc.title}`}
                      >
                        {doc.ftValue === 'link'
                          ? <ExternalLink className="h-3.5 w-3.5" />
                          : <Download className="h-3.5 w-3.5" />
                        }
                        <span className="hidden sm:inline">
                          {doc.ftValue === 'link' ? 'Open' : 'Download'}
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Modal — rendered in portal-like fashion at the end of the tree */}
      {activeDoc && <PdfModal doc={activeDoc} onClose={close} />}
    </>
  )
}
