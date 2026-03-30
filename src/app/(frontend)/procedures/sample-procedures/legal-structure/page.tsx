import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Legal Structure | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Legal Structure</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Legal Structures</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">The Problem</h2>
          <p className="text-muted-foreground leading-relaxed">What legal entity should the County Assembly take?</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Facts &amp; Assumptions</h2>
          <div className="space-y-3">
            {[
              'Realizing corporations have bad reputations, they are a requirement in our current world to conduct business. Other businesses will not deal with a busload of unknown gin drinkers — they need to know who they are dealing with. This is especially true of banks. Our current world requires Federal ID Numbers.',
              'The difference between an Assembly and a Non-Profit Corporation: In Florida it costs more to file for a fictitious name than to file for a non-profit corporation — and you get the name for free.',
              'If you go by an Assembly only, it may be impossible to open a bank account or enter a contract.',
              'Therefore, filing with your state as a Non-Profit Corporation is recommended. In Florida that is less than $100 and locks up your county name. Suggested name: "County Assembly For [Your County], FL". Keep it as short as possible.',
              'Members will require protection against financial responsibility for the full bar tabs from that missed bus trip.',
              'Possibilities to satisfy the above: the suggested one is a non-profit Corporation at about $100 in Florida if you do it yourself. Another route is an Association at the same cost.',
              'This can be done with the State Division of Corporations. After you get your Charter, apply for a federal ID Number.',
              'If uncomfortable, consult an Attorney or CPA for advice.',
              'If unsure, consider filing as both a Fictitious Name and as a Non-Profit corporation — this controls both names until you decide which way to go.',
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
          <p className="text-sm text-muted-foreground">Decide on your legal structure and initiate the filing process. As a CPA and Paralegal, Jim Costa recommends Non-Profit Corporation for the county assembly.</p>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/funding" className="text-sm text-muted-foreground hover:text-foreground">← Funding</Link>
        <Link href="/procedures/sample-procedures/corp-or-assembly" className="text-sm font-medium text-primary hover:underline">Next: Corp or Assembly? →</Link>
      </div>
    </main>
  )
}
