import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Possible Projects | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

const CATEGORIES = [
  {
    label: 'Business & Jobs',
    items: [
      'Job & Skills Bank / Employment Center',
      'Ad Hoc Business formations',
      'Outreach to other communities (seeking contracts for our community to work)',
      'Free Business Development Center',
      'Free Business Leadership School',
      'Revamping Chamber of Commerce (Focus & Revenue)',
    ],
  },
  {
    label: 'Food & Supplies',
    items: [
      'Consumer Supported Agriculture (CSA)',
      'Community Canning Kitchens, Harvesting, etc.',
      'Trucking — consumer purchasing by the truckload or bulk orders',
      'Regional Trading / Purchasing agents',
    ],
  },
  {
    label: 'Finance',
    items: [
      'Local Currency Creation and Management',
      'Barter (See Local Currency Management)',
      'Local Banking & Investment',
    ],
  },
  {
    label: 'Legal',
    items: [
      'De Jure Grand Juries',
      'Local Personal Property Attachments (UCC1)',
      'Arbitration Board',
      'Legal Assistance for common law courts',
    ],
  },
  {
    label: 'Calming & Security',
    items: [
      'Local Deputies & Neighborhood Watch',
      'Seminars on spotting personalities',
      'Seminars on The Secret — Law of Attraction',
      'Group Meditation (Dr. John Hageland proved that group meditation done by just a few can calm and physically heal all inhabitants in an entire community)',
    ],
  },
  {
    label: 'Health',
    items: ['Group Meditation', 'Homeopathy', 'Self Insurance: Fire, Health, Auto'],
  },
  {
    label: 'Housing',
    items: ['Co-op Village communities'],
  },
  {
    label: 'Entertainment & Education',
    items: [
      'Local Cable Vision',
      'Library',
      'Home schooling K-12 plus career mentoring',
      'Community Center, club organizer',
      'DIY Home Center with free advisers, helpers, tools and equipment',
      'Small Cooperative Living communities & Job Creations',
    ],
  },
  {
    label: 'Governance Involvement',
    items: [
      'Liaison between citizens and local government',
      'Revamping Chamber of Commerce',
      'Focusing attention on local development with less reliance on globalist and national grants',
      'Developing local future grants and self-generated revenue to self support',
    ],
  },
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Possible Projects</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Possible County Projects</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa — A list of potential projects for an active county assembly.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map(cat => (
          <div key={cat.label} className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">{cat.label}</h2>
            <ul className="space-y-1.5">
              {cat.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <ChevronRight className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures/common-law-courts" className="text-sm text-muted-foreground hover:text-foreground">← Common Law Courts</Link>
        <Link href="/procedures/sample-procedures" className="text-sm font-medium text-primary hover:underline">← Back to Sample Procedures</Link>
      </div>
    </main>
  )
}
