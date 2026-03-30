import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Website Re-Purpose | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

const STEPS = [
  'Immediately develop a Vision/Plan for your website, which is currently designed for marketing your group and national history. New pages can be prepared now so upon Announcement, you can replace some old pages with new ones instantly.',
  'Your new version of the website should be focused on: locating new members, allowing them to introduce themselves and analyzing their skills, and training them to be useful and productive.',
  'Move some history pages as links on a new page titled "Our Nation\'s History." Upon Announcement, all persons should know all of this anyway.',
  'Realize that now your website and Assembly will no longer represent a political group — it will only represent your county. So all political group information can be dropped. Purchase a new Domain Name and install it. Run it in conjunction with the current name.',
  'Begin today by updating your Meta Tags for a functioning assembly for your county. After Announcement, clear out the old political group Meta Tags. This makes a smooth changeover.',
  'Immediately add a Chat Forum to your website. Allow for a thread for Introductions, asking for a good Bio of skills.',
  'Somehow codify the Bios by Name, Bio, Skills, Personality, and a head-shot picture in a database so others can find you quickly.',
  'If there is no County Assembly website, build one (or copy from another), get a domain name and open it immediately. It takes about two weeks before search engines locate it.',
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Website Re-Purpose</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Website Re-Purposing</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">The Problem</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">What should we do with our original website after the Announcement to Stand-Up?</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">The Plan</h2>
          <div className="space-y-3">
            {STEPS.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{i + 1})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm">
          <p className="font-semibold text-foreground mb-1">Note</p>
          <p className="text-muted-foreground">FlaRepublic.us already implements many of these features — member registration, county pages, forum, document library, and training modules are all built in.</p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/member-intake" className="text-sm text-muted-foreground hover:text-foreground">← Member Intake</Link>
        <Link href="/procedures/sample-procedures/common-law-courts" className="text-sm font-medium text-primary hover:underline">Next: Common Law Courts →</Link>
      </div>
    </main>
  )
}
