import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Finding Members | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Finding Members</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Finding Members &amp; Forms</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">The Problem</h2>
          <p className="text-muted-foreground leading-relaxed">How can an Assembly begin finding members? What should the admission requirements be?</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Facts &amp; Assumptions</h2>
          <div className="space-y-3">
            {[
              'No one knows which group will take us back to the Republic and away from the Corporation government.',
              'Some competing groups require paperwork rejecting the Corporate government. We do not know if that will still be required after the Announcement. Therefore, it may be hard to require paperwork for Assembly members until the Announcement is made.',
              'Consider the minimum requirements for membership being "English Speaking Registered Voter in your county."',
              'There are many groups in a county that are Patriotic and wish to become involved in a new Assembly. We just have to reach out and invite them to join in the only Assembly to be up in each county. The last thing a county needs is chaos over several competing Assemblies all with the same goal.',
              'Run ads in local publications advertising your website to collect members.',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(64 + i + 1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="text-base font-semibold text-foreground mb-3">Your Plan Here</h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="font-bold text-primary">1)</span>List and canvas all organizations in your county — including Political, religious, trades, and social organizations.</li>
            <li className="flex gap-2"><span className="font-bold text-primary">2)</span>Allow them to enter with proof of ???</li>
            <li className="flex gap-2"><span className="font-bold text-primary">3)</span>Alert them that paperwork may be required after the Announcement.</li>
          </ol>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/legal-plan-b" className="text-sm text-muted-foreground hover:text-foreground">← Legal Plan B</Link>
        <Link href="/procedures/sample-procedures/member-intake" className="text-sm font-medium text-primary hover:underline">Next: Member Intake →</Link>
      </div>
    </main>
  )
}
