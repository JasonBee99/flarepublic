import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Common Law Courts | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Common Law Courts</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Common Law Courts</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>Soon we will see our new County Assemblies activated. When they stand up, we will know we are back to a Republic form of Government and returning to Common Law.</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Two Forms of Law</h2>
          <p>There are many forms of law. Two in particular are: Law of the Sea and Law of the Land. The Corporation governments (since 1871) have had us under Law of the Sea. Law of the Land is referred to as Common Law.</p>
          <p className="mt-3">Many think your country will be only one or the other. That is not the case. We will still rely on Contract Law, Agency Law, Corporation Law, Tort Law, etc. If we erase all of those from our world we will set all law back hundreds of years. They all must co-exist and be used when required based on the case, complaint and jurisdiction.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">The Lawyer Question</h2>
          <div className="rounded-xl border border-border bg-card p-5 mb-4">
            <p className="text-xs text-muted-foreground mb-2">Historical Note: Pol Pot</p>
            <p>Pol Pot, the Dictator of Cambodia during our Vietnam War, decided to commit genocide on a third of his countrymen because they were learned, could read, or wore glasses. In doing so he set his country back a hundred years in technology. The question of expelling all Lawyers from the US simply because of the BAR association would repeat this insanity.</p>
          </div>
          <p>Many lawyers spent years studying the law and then on the last semester found out things weren't what they studied in Civics class. But there they were, $200,000 in debt and needing a job to support a family. They didn't create that problem — they inherited it.</p>
          <p className="mt-3">Jim Costa's view: The American Bar Association will cut a deal with The Military and Trump for their profession to retrain all their brothers and the public in the ways of Common Law courts. Then we can continue to thrive together.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">What to Expect</h2>
          <p>Common Law Courts will likely be held in the normal court buildings. Therefore County Assemblies need not worry about training "their" Judges to be Judges in a 2-hour seminar. This cannot be done — it will require craftsmen to teach their craft.</p>
          <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 mt-4">
            <p className="font-semibold text-foreground mb-1">Key Takeaway</p>
            <p className="text-muted-foreground">Assemblies will be involved with Common Law Courts, but not in their first three months of activity. They must spend their energy getting organized and prepared to thrive first. Focus on membership, training, and structure before tackling courts.</p>
          </div>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/website" className="text-sm text-muted-foreground hover:text-foreground">← Website Re-Purpose</Link>
        <Link href="/procedures/sample-procedures/possible-projects" className="text-sm font-medium text-primary hover:underline">Next: Possible Projects →</Link>
      </div>
    </main>
  )
}
