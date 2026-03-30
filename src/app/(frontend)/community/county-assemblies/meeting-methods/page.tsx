import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Meeting Methods Training | FlaRepublic' }
export const dynamic = 'force-static'

const ROBERTS_RULES = [
  { label: 'Basics of Roberts Rules', type: 'Video (11 min)', href: 'https://www.youtube.com/watch?v=J7J9ckZSZ9E' },
  { label: 'Roberts Rules of Order', type: 'Video (44 min)', href: 'https://www.youtube.com/watch?v=fm4hxh3_19o' },
  { label: 'Roberts Rules Mock Meeting with Claudia Gray', type: 'Video', href: 'https://youtu.be/eDBWugs7ElE' },
  { label: 'Roberts Rules Cheat Sheet / Quickstart', type: 'PDF', href: 'https://www.flarepublic.us/wp-content/uploads/2024/10/BoardEffect-Roberts-Rules-of-Order-Cheat-Sheet.pdf' },
]

const CONSENSUS = [
  { label: 'How To Do Consensus Decision Making', type: 'Video (2 min)', href: 'https://www.youtube.com/watch?v=FgjgXIxHmmI' },
  { label: 'Consensus 101 – Basic Training In Consensus (For All Members)', type: 'Video (61 min)', href: 'https://www.youtube.com/watch?v=_m3yjrC23Fc' },
  { label: 'Facilitation For Consensus Decision Making', type: 'Video (9 min)', href: 'https://www.youtube.com/watch?v=RzW7KAc2pKI' },
  { label: 'The Ultimate Brainstorming Exercise in 10 Minutes', type: 'Video (14 min)', href: 'https://www.youtube.com/watch?v=OJ2guxkhvKU' },
]

const ELECTRONIC = [
  { label: 'How to join a Zoom meeting for the first time', type: 'Article', href: 'https://mefmobile.org/how-to-join-a-zoom-meeting-for-the-first-time/' },
  { label: 'Hosting A Zoom Meeting (2022)', type: 'Video (6 min)', href: 'https://www.youtube.com/watch?v=PQBehKw-NQM' },
  { label: 'How To Host a Zoom Meeting (2024)', type: 'Video (36 min)', href: 'https://www.youtube.com/watch?v=RI08au7DYcI' },
  { label: 'How To Record A Podcast On Zoom', type: 'Video (4 min)', href: 'https://www.youtube.com/watch?v=M90YTVdW6-A' },
  { label: 'Hosting A Telegram Call (2021)', type: 'Video (13 min)', href: 'https://www.youtube.com/watch?v=FQ2rH3KrfcM' },
  { label: '7 Essential Tips on Using Telegram (2022)', type: 'Video (6 min)', href: 'https://www.youtube.com/watch?v=4yD3zOK1PZM' },
]

const VOTING = [
  { label: 'Gmail Online Polls & Surveys — free add-on', type: 'Download', href: 'https://www.gmail-polls-surveys.com/' },
  { label: 'Gmail Polls 4-minute tutorial', type: 'Video (4 min)', href: 'https://www.youtube.com/watch?v=KLDdRo7rTQg' },
  { label: 'Bulk Email Add-On (Windows)', type: 'Download', href: 'https://mail-merge.quicklution.com/' },
  { label: 'Bulk Email Add-On for Thunderbird (Linux/Ubuntu)', type: 'Download', href: 'https://addons.thunderbird.net/en-US/thunderbird/addon/mail-merge/' },
]

function ResourceList({ items }: { items: { label: string; type: string; href: string }[] }) {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/40 transition-colors group">
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-3">{item.type}</span>
        </a>
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies" className="hover:text-foreground">County Assemblies</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Meeting Methods</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Meeting Methods Training</h1>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Robert&apos;s Rules of Order</h2>
          <ResourceList items={ROBERTS_RULES} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Consensus Decision Making</h2>
          <ResourceList items={CONSENSUS} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Electronic Meetings</h2>
          <p className="text-xs text-muted-foreground mb-3">(Non-Encrypted)</p>
          <ResourceList items={ELECTRONIC} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Electronic Voting</h2>
          <div className="space-y-3 text-sm text-muted-foreground mb-4">
            <p>Most email platforms have add-ons for polls and surveys. You can even have the results dropped into a spreadsheet automatically and sent to the voters as new votes come in.</p>
            <p>For bulk mailing: get a second email address and use it for bulk emails going out. This way if you exceed your daily limit you can use your main account the rest of the day.</p>
          </div>
          <ResourceList items={VOTING} />
        </section>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/community/county-assemblies/temporary-districts" className="text-sm text-muted-foreground hover:text-foreground">← Temporary Districts</Link>
        <Link href="/community/county-assemblies/re-inhabiting" className="text-sm font-medium text-primary hover:underline">Next: Re-Inhabiting →</Link>
      </div>
    </main>
  )
}
