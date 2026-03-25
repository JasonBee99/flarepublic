// src/components/Pagination.tsx
// Simple prev/next + page number pagination component.
// Uses plain <a> tags so it works in server components without client JS.

type Props = {
  currentPage: number
  totalPages: number
  basePath: string // e.g. "/forum/escambia" — ?page=N is appended
}

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const pageUrl = (p: number) => `${basePath}?page=${p}`

  // Build page number list with ellipsis
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav className="mt-6 flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Prev */}
      {currentPage > 1 ? (
        <a
          href={pageUrl(currentPage - 1)}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          ← Prev
        </a>
      ) : (
        <span className="rounded-md border border-border px-3 py-1.5 text-sm opacity-40 cursor-not-allowed">
          ← Prev
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <a
            key={p}
            href={pageUrl(p)}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              p === currentPage
                ? 'border-primary bg-primary text-white'
                : 'border-border hover:bg-muted'
            }`}
          >
            {p}
          </a>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <a
          href={pageUrl(currentPage + 1)}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          Next →
        </a>
      ) : (
        <span className="rounded-md border border-border px-3 py-1.5 text-sm opacity-40 cursor-not-allowed">
          Next →
        </span>
      )}
    </nav>
  )
}
