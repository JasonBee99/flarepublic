import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Salaries & Founders | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Salaries &amp; Founders</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Office Salaries &amp; Founders</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Problem — Part I: Office Staff</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">How do we select, secure and train an office staff before we stand up and receive funding?</p>
          <div className="space-y-3">
            {[
              'We will need a functioning office in place immediately, even before we are formally funded.',
              'We do not know if Common Law Courts will be held in the current County Court system or if the Assembly will have to host them.',
              'The Purpose of the Office will be to: meet new members and intake them; provide training; house secretaries to assist members in writing Initiatives and Proposals; make computers available; provide Meeting Rooms; house a paid staff to maintain business hours.',
              'The Purpose of the Office Staff will be to be trained in all of their duties and software before they are needed. Once we stand up, they will run the support duties and serve all members in communicating better.',
              'One staff member will be required as soon as possible and a second when needed.',
              'Requirements: Computer literate (preferably Ubuntu or Windows OS; MS Office or LibreOffice); preferably a Melancholy personality; primary duties will be partial Secretary to members and Training, Training, Training.',
              'It would be a bonus if they could accept deferred salary for a month or two, at a payment rate of triple salary upon any funding.',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(64 + i + 1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Problem — Part II: Founders</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">How do we insure the Assembly Organization is stood up completely while a newly elected Assembly leader begins addressing the outside problems? Who can train, support and coach the new leader in the first few months?</p>

          <div className="rounded-xl border border-border bg-card p-5 mb-4">
            <p className="text-sm font-semibold text-foreground mb-2">The Fire Truck Story</p>
            <p className="text-sm text-muted-foreground leading-relaxed">An oil storage tank farm had one tank on fire near twenty other above ground tanks. The owner was told the City Fire Dept could not help — it was too dangerous. He contacted county volunteer units and offered $3,000 just to attempt it. One responded. A few minutes later an old truck sped in and finally stopped just 30 yards from the fire. The four volunteers jumped off and immediately began hosing down each other and the truck. Then they put out the fire. The proud owner asked "That's a lot of money, what are you going to do with it?" The response was "First we are going to fix the brakes on that damn truck!" — When your Assembly Stands-Up, this is what it will be facing.</p>
          </div>

          <div className="space-y-3">
            {[
              'It might be best to place Golden Handcuffs on some of the Founders to keep them focused on strengthening the Assembly structure so the newly elected leader can focus on county problems.',
              'It would be a bonus if they could accept deferred salary for a few months, at a payment rate of triple salary upon any funding.',
              'This is great insurance the Assembly performs immediately and survives the fast growth.',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(76 + i + 1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="text-base font-semibold text-foreground mb-2">Your Plan Here</h2>
          <p className="text-sm text-muted-foreground">Adapt for your county's specific situation and available resources.</p>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/office-space" className="text-sm text-muted-foreground hover:text-foreground">← Office Space</Link>
        <Link href="/procedures/sample-procedures/funding" className="text-sm font-medium text-primary hover:underline">Next: Funding →</Link>
      </div>
    </main>
  )
}
