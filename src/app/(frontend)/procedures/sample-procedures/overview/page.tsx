import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Overview | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

const ASSUMPTIONS = [
  'No one knows which group will take us back to the Republic and away from the Corporation government.',
  'When the announcement is made, what will be the main goals, actions, and attention of the newly formed county assembly the first week?',
  'The Military cannot assist the Assembly — otherwise Military leadership will be guilty of Treason.',
  'It appears that competing groups only focused on taking down the Corp Government. There was no planning for after the hill is taken.',
  'There could be sheer panic upon the Announcement due to lack of planning — Goals, Procedures, who, when, where, with what, Membership requirements, Credentials, websites, etc.',
  'What membership paperwork requirement should be in place?',
  'Preacher Hair Problem: Elections will be held after enough members are in and trained. There may be a wanna-be wanting the leadership badly but not prepared to do the job. This cannot be prevented in an open election, but it can be softened until more trained members join.',
  'A new Assembly with no members cannot be accepted nor respected with only 5 members.',
  'What will banks require for opening a bank account to receive funds?',
]

const PLAN = [
  'Search Anna Von Ritz\'s team for a similar plan for after.',
  'Canvas local community groups for Members — including competing groups.',
  'Be aware that anything Founders do can later be made lawful by Ratification. Create opening articles, rules and traditions. They can be changed later.',
  'Make the main goals Membership, Training, Organizing and Procedures for contacting the County Government.',
  'Plan for an office and paid employees.',
  'Put Golden Handcuffs on Founders even if deferred salaries. This allows for organization construction to continue as the assembly formally opens after announcement. It insures the successful standing up and is a training ground for the newly elected leader.',
  'Create as many Procedures as possible during this time.',
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Overview</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Sample Procedure Overview</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">The Problem</h2>
          <p className="text-muted-foreground leading-relaxed">It appears no one in the US has a plan for their new County Assembly to stand up upon collapse of the Corporate government.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Facts &amp; Assumptions</h2>
          <div className="space-y-3">
            {ASSUMPTIONS.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{String.fromCharCode(64 + i + 1)})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Opening Plan For Discussion</h2>
          <div className="space-y-3">
            {PLAN.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 font-bold text-primary w-6">{i + 1})</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures" className="text-sm text-muted-foreground hover:text-foreground">← Back to Sample Procedures</Link>
        <Link href="/procedures/sample-procedures/office-space" className="text-sm font-medium text-primary hover:underline">Next: Office Space →</Link>
      </div>
    </main>
  )
}
