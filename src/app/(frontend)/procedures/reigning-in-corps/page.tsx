// src/app/(frontend)/procedures/reigning-in-corps/page.tsx
// Reigning In Corporations — strategy and legal procedures.

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Scale, Shield, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Reigning In Corporations | FlaRepublic',
  description:
    'Legal strategies and procedures for holding corporations accountable under the Florida Republic.',
}

export const dynamic = 'force-static'

export default function ReigningInCorpsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Reigning In Corporations</span>
      </div>

      <h1 className="mb-3 text-4xl font-bold tracking-tight">Reigning In Corporations</h1>
      <p className="mb-12 text-lg text-muted-foreground">
        Corporations operating in America are bound by the law of the land. This section covers
        the lawful strategies available to American nationals for holding corporations
        accountable.
      </p>

      <div className="space-y-8">
        {/* Strategy */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold">Strategy Overview</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              The key principle is understanding the difference between the law of the land
              (common law) and the law of the sea (admiralty/maritime/commercial law). Corporations
              operate under commercial law and derive their authority from government charters.
              As an American national with corrected political status, you operate under common
              law and are not subject to many of the presumptions that bind U.S. citizens.
            </p>
            <p>
              Effective strategies include proper identification of your standing, use of
              lawful notices, and the invocation of your rights on the public record. The
              assembly can also act collectively to address corporate overreach at the county level.
            </p>
          </div>
        </section>

        {/* Legal Procedures */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Scale className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold">Legal Procedures</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Lawful Notice',
                body: 'Send proper written notice establishing your standing and giving the corporation an opportunity to respond before further action.',
              },
              {
                title: 'Public Record',
                body: 'File relevant documents on the public record through your county recorder to establish evidence and protect your rights.',
              },
              {
                title: 'Assembly Action',
                body: 'The county assembly can issue findings, declarations, and directives as part of its lawful authority in the county.',
              },
              {
                title: 'Common Law Courts',
                body: 'Common law courts provide an alternative venue operating under the law of the land, separate from the corporate court system.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Documents */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold">Reference Documents</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            The Documents library contains templates, guides, and reference materials for
            applying these procedures.
          </p>
          <Link
            href="/resources/documents"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse Reigning In Corps documents <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <strong>Note:</strong> This information is for educational purposes and reflects the
        philosophy of the Florida Republic movement. It is not legal advice. Consult with a
        knowledgeable professional before taking any legal action.
      </div>
    </main>
  )
}
