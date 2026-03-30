import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Re-Inhabiting the Country | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies" className="hover:text-foreground">County Assemblies</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Re-Inhabiting the Country</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Re-Inhabiting the Country</h1>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>This section covers the plan, overview and background for re-inhabiting the Republic — returning lawful self-governance to the people of the United States through county assemblies.</p>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Recommended Viewing</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground">The Great American Hicks Show – Episode #8</p>
              <p className="text-xs mt-1">Sovereign Freedom is our BIRTHRIGHT… Upholding it is our Eternal RESPONSIBILITY!</p>
              <p className="text-xs mt-1">The Patriots, The Republic, The Plan – PART III. Features James Turner, our first President and Current Attorney General.</p>
              <p className="text-xs mt-1 font-semibold text-primary">DEFINITELY A MUST SEE for ALL Officers and County Leaders!</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-3">Re-Inhabitation Plan, Overview and Background</h2>
          <p className="mb-4">Download the full Re-Inhabitation Plan document for a comprehensive overview of the background, legal basis, and implementation strategy.</p>
          <a
            href="https://www.flarepublic.us/wp-content/uploads/2024/10/Re-Inhabitation-Plan-Overview-n-Background.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary/40 transition-colors"
          >
            Download PDF →
          </a>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="font-semibold text-foreground mb-2">Complete Business Plan</p>
          <p>For the full set of proposals, articles, and implementation guides covering every aspect of standing up the Republic, see the Complete Business Plan for All States.</p>
          <Link href="/community/county-assemblies/business-plan" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">View Business Plan →</Link>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/community/county-assemblies/meeting-methods" className="text-sm text-muted-foreground hover:text-foreground">← Meeting Methods</Link>
        <Link href="/community/county-assemblies/business-plan" className="text-sm font-medium text-primary hover:underline">Next: Business Plan →</Link>
      </div>
    </main>
  )
}
