import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Office Space | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

const ASSUMPTIONS = [
  'We are always a few weeks away from the announcement that we need to Stand-Up our new County Assemblies. We will need a functioning office in place immediately, even before we are formally funded.',
  'We do not know if Common Law Courts will be held in the current County Court system or if the Assembly will have to host them.',
  'The Purpose of the Office will be to: meet new members and intake them; provide training; house secretaries to assist members in writing Initiatives, Proposals, etc.; make computer use available; provide Meeting Rooms; house a paid staff.',
  'Our size requirements may quickly change. In the beginning a rented home may suffice. After fast growth it can remain a hub office and large gatherings can be held in a community center nearby. Upon real funding, a commercial space with more parking can be leased. Once things settle down and the professional county government recognizes the Assembly, they may provide space, utilities and other support.',
  'Equipment Requirements might include: several computer stations with mostly free shareware Ubuntu software and one station with Windows; Printer(s), Photo Copier(s), Phone systems, Audio-Visual aids, Galley, Conference Tables, binders and paper supplies. Satellite Internet, Sign. Package software for mass mail-outs, Zoom type meetings, etc. Used equipment can be purchased cheap from local office supply businesses as they will be overstocked due to many bankruptcies.',
  'Non-Equipment needs: Liability Insurance, Content Insurance, Utilities, operating expenses, Security, etc.',
  'When no funding is available, the Assembly can locate optional properties to be leased and hold them in mind. Prepare your budget and shopping lists so when you receive official funding, you can be in business in a few days. Or seek a bridge loan from a local Deep Pocket.',
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Office Space</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Securing Office Space</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">The Problem</h2>
          <p className="text-muted-foreground leading-relaxed">How do we secure an office before we stand up and receive funding?</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Facts &amp; Assumptions</h2>
          <div className="space-y-3">
            {ASSUMPTIONS.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(64 + i + 1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="text-base font-semibold text-foreground mb-2">Your Plan Here</h2>
          <p className="text-sm text-muted-foreground">This is a template — adapt it for your county's specific situation and resources.</p>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/overview" className="text-sm text-muted-foreground hover:text-foreground">← Overview</Link>
        <Link href="/procedures/sample-procedures/salaries" className="text-sm font-medium text-primary hover:underline">Next: Salaries →</Link>
      </div>
    </main>
  )
}
