import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Securing Funding | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Securing Funding</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Securing Funding</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">The Problem</h2>
          <p className="text-muted-foreground leading-relaxed">Can we afford to wait until we get Government Funding before building our Assembly? Can we find Bridge funding in the interim?</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Facts &amp; Assumptions</h2>
          <div className="space-y-3">
            {[
              'Ultimately we will have unlimited Government funding — we just don\'t know when.',
              'The project is too important to rely on donations, as they cannot be counted on.',
              'Deep Pocket Bridge Loans are best for the interim. They allow immediate start-up and training and alleviate cash-flow worries.',
              'Bridge Loan Terms might be a 2:1 or 3:1 repayment rate — this can be negotiated. This may be necessary to entice the lender. There is always the possibility the Government might not recognize your Assembly and not fund you.',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(64 + i + 1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="text-base font-semibold text-foreground mb-2">Your Plan Here</h2>
          <p className="text-sm text-muted-foreground">Identify your county's potential deep pocket bridge lenders and develop terms.</p>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/salaries" className="text-sm text-muted-foreground hover:text-foreground">← Salaries</Link>
        <Link href="/procedures/sample-procedures/legal-structure" className="text-sm font-medium text-primary hover:underline">Next: Legal Structure →</Link>
      </div>
    </main>
  )
}
