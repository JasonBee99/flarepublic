import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Legal Plan B | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Legal Plan B</span>
      </div>
      <div className="mb-2 text-xs text-muted-foreground">To: Train Wreck Preppers · From: Jim Costa · Date: March 25, 2026</div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Trust Leadership or Have Legal Plan &ldquo;B&rdquo;?</h1>
      <p className="text-sm text-muted-foreground mb-8">Memorandum</p>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-semibold text-foreground mb-2">The Battle Of New Orleans</p>
          <p>The Battle Of New Orleans was won because of the leadership of General Andrew Jackson and because of a blunder by a British Company Commander. The problem began when the British column began its march on the American Cotton-Bale wall. The front company marched a few miles before its Commander realized he did not command his troops to carry the scaling ladders. They had to return to get them — and by that time they were at the rear of the line. The new companies at the front were eventually pushed forward, defenseless against that wall where they stood and were slaughtered, all 2,000 of them.</p>
        </div>

        <p>Today we have 6,000 County Assemblies waiting to activate but they too may be standing unable to perform due to lack of ladders. Their ladders are the Catch 22 of being a County Assembly — no longer recognized in state Constitutions as a "government agency" — and therefore must become a corporation in order to do banking.</p>

        <p>Do we hope that our leadership already knows this and has a plan to resolve it before we are ordered to Activate? If so, are they afraid to reveal it before Announcement date? Or are we to believe the Military will give us the plan? If so, aren't they committing treason by creating a government?</p>

        <p>This behooves us to look ahead and see this is a crippling move to make without a Plan "B" in hand. No army can survive without food or money.</p>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="font-semibold text-foreground mb-2">The Plan</p>
          <p>Create two organizations until the State Constitutions can be amended after the Battle for the Land:</p>
          <ol className="mt-3 space-y-2 list-decimal list-inside">
            <li>A County Assembly to do all the work.</li>
            <li>A Non-Profit Corporation (different name) to pay the bills as a public service.</li>
          </ol>
          <p className="mt-3">Later, when the Catch 22 is corrected, we can recognize the Assembly as a Government Agency able to do its own banking.</p>
        </div>

        <p>See also: <Link href="/procedures/sample-procedures/corp-or-assembly" className="text-primary hover:underline">Corp or Assembly?</Link> for the full proposal with costs and implementation details.</p>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/corp-or-assembly" className="text-sm text-muted-foreground hover:text-foreground">← Corp or Assembly?</Link>
        <Link href="/procedures/sample-procedures/finding-members" className="text-sm font-medium text-primary hover:underline">Next: Finding Members →</Link>
      </div>
    </main>
  )
}
