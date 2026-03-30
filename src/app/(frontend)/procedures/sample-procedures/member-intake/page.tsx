import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Member Intake | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Member Intake</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Member Intake Procedure</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Processing New Members</h2>
          <p>If you had prepared for the Announcement, you might have a Sign Up routine to capture prospective members' Name, Phone, and Email Address. If this is the case you will need to learn how to pull that data and place it into a spreadsheet to work with it.</p>
          <p className="mt-3">If not, build a spreadsheet for call-ins or random emails received. To start, you only need the above information.</p>
          <p className="mt-3">The Membership or Human Resource Focus Group then needs to contact them by phone. I know this is considered old fashioned, but these volunteers need the respect of a human call. The resulting conversation will not only set the hook into them but will also reveal their real history that we can work from. We need to understand their personality, work history, skills, and how they want to help.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Member Numbering System</h2>
          <p>All members get an assigned number starting from 1 going up to 9,999. They all have leading zeros so they all have 4 characters: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">0015</code></p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Filing Systems</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-2">Spreadsheet File</h3>
              <p>Using one Database Spreadsheet, the first column is the Member Number. The spreadsheet can hold as many columns as needed for the information.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3">Computer Files</h3>
              <div className="space-y-2">
                {[
                  ['Pictures', 'P0015', 'Head photo of each member'],
                  ['Forms/Notes', 'F0015', 'Interview notes, background, skills, interests'],
                ].map(([type, format, desc]) => (
                  <div key={type} className="flex items-start gap-3">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-xs flex-shrink-0">{format}</code>
                    <div>
                      <span className="font-medium text-foreground">{type}: </span>
                      <span>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs">Note: If more than one picture or form is collected, use a decimal place — e.g., P0015.2</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Focus Group Integration</h2>
          <p>As members join a Focus Group, all FG members will get a copy of the interview notes with a picture attached. After full funding and experience gained, the Assembly may wish to upgrade to sophisticated Human Resource software.</p>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/finding-members" className="text-sm text-muted-foreground hover:text-foreground">← Finding Members</Link>
        <Link href="/procedures/sample-procedures/website" className="text-sm font-medium text-primary hover:underline">Next: Website →</Link>
      </div>
    </main>
  )
}
