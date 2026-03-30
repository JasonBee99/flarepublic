// src/app/(frontend)/procedures/reigning-in-corps/page.tsx
// Reigning In Corporations — Jim Costa's actual strategy and legal procedures.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Reigning In Corporations | FlaRepublic',
  description: 'Strategy and legal procedures for county assemblies to reign in large corporations. By Jim Costa.',
}
export const dynamic = 'force-static'

const STRATEGY_ASSUMPTIONS = [
  'The US will have 6,000 new County Assemblies with the Reset of the Corporate Government. It appears none of them have plans and procedures to reign in corporations that no longer serve the community.',
  'When County Assemblies stand up we will have returned to Common Law prior to 1871. However we will retain other forms of law that we currently use.',
  'Corporations are Chartered by states. Historically the state has the authority to dissolve a corporation if it no longer served the community — but this right was abandoned decades ago.',
  'Corporations are managed by their Board of Directors, who oversee their CEO. All states have laws requiring directors to act in the "best interest of the Stockholders" — meaning maximizing profits.',
  'Directors are provided Liability Insurance covering most of their actions. The directors and most corporate officers are exempt from most criminal actions taken against the public.',
  'County assemblies will soon have sovereignty over their county land and can create laws and Tariffs within their lands.',
  'Other County Assemblies are free to imitate, replicate and ratify what one county does in this nation.',
]

const STRATEGY_PLAN = [
  'Create Law exempting corporate officers from some exemptions of criminality.',
  'Convene a De Jure Grand Jury to act on a complaint(s) about specific acts by a corporation in the county.',
  'If Indictment is granted, serve it to County Prosecutor to investigate and act on it.',
  'Serve copy of indictment to the Defendant and open channel to negotiate a more harmonious outcome for both parties going forward.',
  'If campaign is successful, readily share evidence and working documents freely with other counties.',
  'Never settle with the Assembly signing a Non-Disclosure Agreement — always leave the door open for other counties.',
]

const PROCEDURE_PLAN = [
  'Receive the Complaint when it is ready to be presented for action.',
  'Convene a De Jure Grand Jury.',
  'If indictment is awarded, consider allowing the jury to suggest variable remedies from a pick list.',
  'Turn the indictment and recommendations over to the County Prosecutor for investigation and prosecution if warranted.',
]

const RELIEF_TYPES = [
  'Past Damages','Future Damages','Deposit of funds for future damages','Tariffs to county',
  'Product warning labels','Prohibiting certain product sales in this county',
  'Amending the State Charter to exclude this county of all corporation activity',
  'Corrective action on products and services',
]

export default function ReigningInCorpsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Reigning In Corporations</span>
      </div>
      <p className="text-sm text-muted-foreground mb-1">To: EscaRosa Train Wreck Preppers · From: Jim Costa · Date: Feb. 24, 2026</p>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Reigning In Corporations</h1>

      <section id="strategy" className="space-y-6 mb-12">
        <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Strategy</h2>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-2">The Problem</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">How can new County Assemblies reign in large corporations without destroying our current economic system? With a new downsized Federal Government, how can one new "David" County Assembly revamp "Goliath" Corporations that will resist change?</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3">Facts & Assumptions</h3>
          <div className="space-y-3">
            {STRATEGY_ASSUMPTIONS.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(64+i+1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3">Types of Relief Sought</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {RELIEF_TYPES.map(item => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3">The Plan</h3>
          <div className="space-y-3">
            {STRATEGY_PLAN.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{i+1})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Multiple Complainants:</strong> All Complaints are suggested to have multiple complainants — perhaps ten — to show the Respondent it is not one lone nut to be ignored.</p>
          <p><strong className="text-foreground">Pros:</strong> Evens the playing field. Shows position of your power while offering cooperation.</p>
        </div>
      </section>

      <section id="procedure" className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Legal Procedure</h2>
        <p className="text-xs text-muted-foreground">Draft 1 · From: Jim Costa · Date: Feb. 22, 2026</p>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-2">The Problem</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">How can a new County Assembly reign in a giant corporation doing business in their county?</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3">Key Considerations Before Acting</h3>
          <div className="space-y-3">
            {[
              'County Assemblies and De Jure Grand Juries have not been used since 1871. A lot of their accepted practices have been forgotten or removed from our attention.',
              'The most important step is the Complaint itself. It would be preferable if made by one with research and knowledge of the problem, along with the passion to insure its success.',
              'Understand the Zeitgeist that corporation is operating in at time of the formal Complaint. Realize the possibility that the complaint may be the "straw that breaks the camel\'s back."',
              'Recognize the impact on the Corporation\'s current Business plan — do they need your push or should you wait?',
              'Understand and prioritize all successful outcomes available, leaving room for negotiation.',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(64+i+1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3">The Plan</h3>
          <div className="space-y-3">
            {PROCEDURE_PLAN.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{i+1})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Costs:</strong> May require research costs, expert witnesses, surveying residents, and future costs in sharing work products with other Assemblies.</p>
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
        <Link href="/procedures/sample-procedures" className="text-sm text-muted-foreground hover:text-foreground">← Back to Sample Procedures</Link>
        <Link href="/procedures" className="text-sm text-muted-foreground hover:text-foreground">← All Procedures</Link>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">By Jim Costa — <a href="mailto:Costa4670@Gmail.com" className="hover:text-foreground">Costa4670@Gmail.com</a>. Originally at <a href="https://costa4669.wixsite.com/website-1" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">costa4669.wixsite.com/website-1</a>.</p>
    </main>
  )
}
