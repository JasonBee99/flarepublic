import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Immediate Focus Groups | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

const FOCUS_GROUPS = [
  { name: 'Accounting', desc: 'An accounting spreadsheet program will be provided until your FG can provide an accounting system.' },
  { name: 'Bridge Loan', desc: 'Locate deep pockets to advance finance the Assembly.' },
  { name: 'Building Contents', desc: 'Inventory and manage the Assembly\'s physical assets.' },
  { name: 'Building Locator', desc: 'Find and secure appropriate office space.' },
  { name: 'Computers', desc: 'Procures and loads software on all office computers.' },
  { name: 'County Path Finders', desc: 'Learning the County Organizational Chart and how to navigate county government.' },
  { name: 'Founders', desc: 'Experienced in business start-ups. Provides continuity and guidance during the stand-up phase.' },
  { name: 'Hiring', desc: 'Experienced in hiring. Manages recruitment for paid staff positions.' },
  { name: 'Human Resources', desc: 'Survey new members as to wants, skills and interests. Tracks active Focus Group Members.' },
  { name: 'Insurance', desc: 'Secures liability, content, and other required insurance for the Assembly.' },
  { name: 'Legal Organization', desc: 'Experienced in forming a legal entity. Handles Non-Profit Corp and Fictitious Name filings.' },
  { name: 'Proposal Writers', desc: 'Helping others present their ideas in proper format.' },
  { name: 'Software Writers', desc: 'Builds spreadsheets, forms, and templates for Assembly use.' },
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Immediate Focus Groups</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Immediate Focus Groups</h1>
      <p className="text-sm text-muted-foreground mb-2">By Jim Costa</p>
      <div className="mb-8 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <strong className="text-foreground">Note:</strong> These Focus Groups will be limited to only 6 persons each. Needed to activate the Assembly.
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {FOCUS_GROUPS.map(fg => (
          <div key={fg.name} className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-1">{fg.name}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{fg.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-sm font-semibold text-foreground mb-2">On FlaRepublic</p>
        <p className="text-sm text-muted-foreground">Focus Groups are built into FlaRepublic — county members can join groups, organizers can manage them, and Choleric members are flagged for manual placement.</p>
        <Link href="/county" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Go to your county page →</Link>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/fast-track" className="text-sm text-muted-foreground hover:text-foreground">← Fast Track</Link>
        <Link href="/procedures/reigning-in-corps" className="text-sm font-medium text-primary hover:underline">Next: Reigning In Corps →</Link>
      </div>
    </main>
  )
}
