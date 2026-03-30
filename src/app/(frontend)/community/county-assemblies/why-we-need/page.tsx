import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Why We Need County Assemblies | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies" className="hover:text-foreground">County Assemblies</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Why We Need County Assemblies</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Why We Urgently Need County Assemblies</h1>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base text-foreground leading-relaxed">We urgently need County Assemblies because we need each county to convene a lawful assembly, composed of 7 or 13 adult residents, to declare the county is a Republic.</p>

        <p>This meeting must occur immediately as the governments collapse from bankruptcy. This will demonstrate to the Military that we are prepared to "Stand Up" and claim the land as its government.</p>

        <p>The corporate governments were notified about 10 years ago that the Republics will be waiting in the wings to "stand up" when they collapse, so we are not a threat to them. Everything we do is lawful and we have the Military backing us.</p>

        <p>We were notified by the military that we were soon to be up to bat. Therefore, we need the Assembly members up to speed and ready to meet. That can be trained now — review all that they need to vote on in our private chat room. Then when you hold your in-person meeting, it should be a straight up/down vote.</p>

        <p className="font-medium text-foreground">The time is running out. But you can see that for yourself.</p>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">The County Assembly Must Accomplish This:</h2>
          <ol className="space-y-4">
            {[
              { n: 1, text: 'Ratify or adjust the Assembly By Laws and elect officers.' },
              { n: 2, text: 'Elect a delegate to represent the county in the Florida House of Representatives.' },
              { n: 3, text: 'The State House of Representatives will elect and send one Representative to the Federal House of Representatives.' },
              { n: 4, text: 'The Federal House of Representatives must adopt their new Republic Constitution.' },
            ].map(({ n, text }) => (
              <li key={n} className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{n}</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="font-semibold text-foreground mb-2">Next Step</p>
          <p>Read Jim's Fast Track Assembly Method to stand up your county assembly immediately.</p>
          <Link href="/procedures/sample-procedures/fast-track" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Fast Track Guide →</Link>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/community/county-assemblies" className="text-sm text-muted-foreground hover:text-foreground">← County Assemblies</Link>
        <Link href="/community/county-assemblies/how-to-organize" className="text-sm font-medium text-primary hover:underline">Next: How to Organize →</Link>
      </div>
    </main>
  )
}
