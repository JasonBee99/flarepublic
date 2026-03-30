import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Florida Temporary Districts | FlaRepublic' }
export const dynamic = 'force-static'

const DISTRICTS = [
  { n: 'I', name: 'Panhandle', note: 'Taylor County is a great meet-up place', counties: 'Escambia, Santa Rosa, Okaloosa, Walton, Holmes, Washington, Bay, Jackson, Calhoun, Gulf, Gadsden, Liberty, Franklin, Wakulla, Leon, Jefferson, Madison, Taylor' },
  { n: 'II', name: 'North Central', note: '', counties: 'Hamilton, Suwannee, Lafayette, Dixie, Columbia, Gilchrist, Levy, Alachua, Union, Bradford, Putnam, Flagler, Nassau, Duval, Baker, Clay, St. Johns' },
  { n: 'III', name: 'Central', note: '', counties: 'Marion, Citrus, Hernando, Pasco, Pinellas, Hillsborough, Polk, Manatee, Hardee, Sarasota, DeSoto, Sumter, Lake, Orange, Osceola, Brevard, Indian River, Seminole, Volusia' },
  { n: 'IV', name: 'South Eastern', note: '', counties: 'St. Lucie, Martin, Okeechobee, Highlands, Charlotte, Glades, Hendry, Lee, Collier, Palm Beach, Broward, Miami-Dade, Monroe' },
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies" className="hover:text-foreground">County Assemblies</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Temporary Districts</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Florida Temporary Districts</h1>

      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed mb-8">
        <p>These are Temporary Districts so if we need physical meetings it will cut down on driving time and the rental of a football stadium.</p>
        <p>If we have to have physical meetings outside of just our Counties, we are breaking the counties into four districts so people can voice their opinions in smaller groups. This will cut down on driving as well as not having to rent a huge meeting place.</p>
        <p className="font-medium text-foreground">Each District will have about 25 percent of the residential population.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DISTRICTS.map(d => (
          <div key={d.n} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">{d.n}</span>
              <div>
                <p className="font-semibold text-foreground">District {d.n} — {d.name}</p>
                {d.note && <p className="text-xs text-primary">{d.note}</p>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{d.counties}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/community/county-assemblies/how-to-organize" className="text-sm text-muted-foreground hover:text-foreground">← How to Organize</Link>
        <Link href="/community/county-assemblies/meeting-methods" className="text-sm font-medium text-primary hover:underline">Next: Meeting Methods →</Link>
      </div>
    </main>
  )
}
