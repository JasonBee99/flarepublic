import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Office Budgeting | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

const BUDGET_LINES = [
  { category: 'Rent / Lease', note: 'Starting with a rented home; upgrade to commercial space upon funding' },
  { category: 'Utilities', note: 'Electric, water, internet (satellite preferred), phone' },
  { category: 'Insurance', note: 'Liability, contents, general business coverage' },
  { category: 'Equipment', note: 'Computers, printers, copier, audio-visual aids, conference furniture' },
  { category: 'Software / Subscriptions', note: 'Mass email, Zoom-type meetings, office suite (LibreOffice is free)' },
  { category: 'Signage', note: 'Exterior sign identifying the Assembly' },
  { category: 'Office Supplies', note: 'Binders, paper, printer ink, filing systems' },
  { category: 'Staff Salaries', note: 'One then two staff members; consider deferred salary at triple rate upon funding' },
  { category: 'Security', note: 'Basic security for the office and its contents' },
  { category: 'Miscellaneous / Operating', note: 'Miscellaneous operating expenses and contingency' },
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Office Budgeting</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Office Budgeting</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa — Sample budget line items for a county assembly office.</p>

      <div className="rounded-xl border border-border overflow-hidden mb-8">
        <div className="grid grid-cols-[1fr_2fr] bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Budget Category</span>
          <span>Notes</span>
        </div>
        <div className="divide-y divide-border">
          {BUDGET_LINES.map(row => (
            <div key={row.category} className="grid grid-cols-[1fr_2fr] px-4 py-3 text-sm hover:bg-muted/30 transition-colors">
              <span className="font-medium text-foreground">{row.category}</span>
              <span className="text-muted-foreground">{row.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-2">Approach</p>
        <p>Prepare your shopping lists and budget now. When you receive official funding you can be in business in a few days. If funding is unavailable, locate properties to be leased and hold them in mind — or seek a bridge loan from a local deep pocket.</p>
        <p className="mt-2">See: <Link href="/procedures/sample-procedures/funding" className="text-primary hover:underline">Securing Funding</Link> for bridge loan strategy.</p>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/office-space" className="text-sm text-muted-foreground hover:text-foreground">← Office Space</Link>
        <Link href="/procedures/sample-procedures/salaries" className="text-sm font-medium text-primary hover:underline">Next: Salaries →</Link>
      </div>
    </main>
  )
}
