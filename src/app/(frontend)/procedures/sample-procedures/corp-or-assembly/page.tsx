import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Corp or Assembly? | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

const PLAN_ITEMS = [
  'Register the name and operate as an Assembly without a bank account. Name: "County Assembly For [Your County], FL".',
  'Create a Non-Profit corporation to contract and pay bills on behalf of the Assembly. Name: "County Assembly For [Your County], FL Paymaster, Inc."',
  'Once the State Constitution is amended, the Assembly can get a FEIN and open its own bank account. The Non-Profit Corp can then be closed.',
  'Leases, contracts and employees will all be under the Corporation, which will then gift its services to the Assembly.',
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Corp or Assembly?</span>
      </div>
      <div className="mb-2 text-xs text-muted-foreground">To: New County Assemblies · From: Jim Costa · Date: March 24, 2026</div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Assembly or Non-Profit Corporation?</h1>
      <p className="text-sm text-muted-foreground mb-8">Proposal — For The Re-Inhabited Republic For Florida</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">The Problem</h2>
          <p className="text-muted-foreground leading-relaxed">The new County Assembly needs to become a legal entity, but what type? It needs to protect its members from financial liability and be able to carry on for 200 years.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Facts &amp; Assumptions</h2>
          <div className="space-y-3">
            {[
              'In the current legal world, an Assembly must open a bank account to do business. It must have a Federal Employment Identification Number (FEIN) and be a legal organization to get that number.',
              'The state does not currently recognize a County Assembly as a Government Agency, so it cannot get a FEIN as a Government agency unless so declared in the State Constitution.',
              'The new Republic folks hate "Corporations" and want nothing to do with one.',
              'The Assembly can register itself as a Non-Profit Corporation and open a bank account — however, that goes against the rule in "C" above.',
              'It will take time for the State Constitution to be amended to recognize a County Assembly as a Government agency.',
              'In order to open your County Assembly it is caught in a "Catch 22" scenario — blocked from taking any action at all.',
              'The primary goal for the new Assembly is to tie up the name of "County Assembly For [Your County]". There are two ways: (1) Become a Non-Profit under the name "County Assembly For [Your County], Inc." or (2) Register the name as a Fictitious Name.',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(64 + i + 1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">The Plan</h2>
          <div className="space-y-3">
            {PLAN_ITEMS.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{i + 1})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Costs</h2>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2 text-sm">
            {[['Fictitious Name', '$250'], ['Non-Profit Corp', '$100'], ['Total', '$350']].map(([label, cost]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className={`font-medium ${label === 'Total' ? 'text-foreground' : 'text-muted-foreground'}`}>{cost}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="text-base font-semibold text-foreground mb-2">Pros</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Gets it done simply and immediately.</li>
            <li>Allows the Assembly to open early.</li>
          </ul>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/legal-structure" className="text-sm text-muted-foreground hover:text-foreground">← Legal Structure</Link>
        <Link href="/procedures/sample-procedures/legal-plan-b" className="text-sm font-medium text-primary hover:underline">Next: Legal Plan B →</Link>
      </div>
    </main>
  )
}
