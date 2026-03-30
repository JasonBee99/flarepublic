import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Complete Business Plan for All States | FlaRepublic' }
export const dynamic = 'force-static'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const CATEGORIES = [
  {
    title: 'Core Documentation',
    items: [
      { label: "Jim's Fast-Track Assembly Method", href: '/community/county-assemblies/docs/jims-fast-track-assembly-method' },
      { label: 'Introduction To Assembly By Laws', href: '/community/county-assemblies/docs/inroduction-to-assembly-by-laws' },
    ],
  },
  {
    title: 'Fast Track to Assemblies',
    items: [
      { label: 'Giant Steps To Assemblies', href: '/community/county-assemblies/docs/proposal-giant-steps-to-assemblies' },
      { label: 'Article – How Lawful Is The Fast Track?', href: '/community/county-assemblies/docs/article-how-lawful-is-the-fast-track' },
      { label: 'Article – Ad Hoc Coach For County Assemblies', href: '/community/county-assemblies/docs/article-ad-hoc-coach-for-county-assemblies' },
      { label: 'Article – Getting Two Delegates In An Hour', href: '/community/county-assemblies/docs/article-getting-two-delegates-in-an-hour' },
      { label: 'Free Website Cloning', href: '/community/county-assemblies/docs/free-website-cloning' },
      { label: 'PROPOSAL – Ratification', href: '/community/county-assemblies/docs/proposal-radification' },
      { label: 'Electing County Delegates', href: '/community/county-assemblies/docs/electing-county-delegates' },
      { label: 'Obtaining Tigers For County Leaders Immediately', href: '/community/county-assemblies/docs/obtaining-tigers-for-county-leaders-immediately' },
      { label: 'PROPOSAL – How To Raise All Of Your County Assemblies Immediately', href: '/community/county-assemblies/docs/proposal-how-to-raise-all-of-your-county-assemblies-immediately' },
    ],
  },
  {
    title: "Why Break From Nat'l to Use the Fast Track?",
    items: [
      { label: "Article – Why Doesn't National Republic Push The Fast Track Method?", href: '/community/county-assemblies/docs/article-why-doesnt-national-republic-push-the-fast-track-method' },
      { label: 'PROPOSAL – Reading To County', href: '/community/county-assemblies/docs/reading-to-county' },
      { label: 'Article – Laches and Squatter Rights', href: '/community/county-assemblies/docs/laches-squatter-rights' },
      { label: 'PROPOSAL – Mergers and Military Softball', href: '/community/county-assemblies/docs/proposal-mergers-and-military-softball' },
      { label: 'Article – Signing Oaths To The National Republic For The U.S.', href: '/community/county-assemblies/docs/article-signing-oaths-to-the-national-republic-for-the-u-s' },
      { label: 'Article – What's The Risk Of Not "Taking Tha Land?"', href: '/community/county-assemblies/docs/article-whats-the-risk-of-not-taking-tha-land' },
    ],
  },
  {
    title: 'Training for Assembly and Congress',
    items: [
      { label: 'Article – The Future Of County Assemblies', href: '/community/county-assemblies/docs/article-the-future-of-county-assemblies' },
      { label: 'PROPOSAL – Maxing Meetings', href: '/community/county-assemblies/docs/proposal-maxing-meetings' },
      { label: 'PROPOSAL – One Secretary Server Computer (Part III)', href: '/community/county-assemblies/docs/proposal-one-secretary-server-computer-proposal-method-part-iii' },
      { label: 'PROPOSAL – Electronic Leadership Of The Future Now (Part II)', href: '/community/county-assemblies/docs/proposal-electronic-leadership-of-the-future-now-proposal-method-part-ii' },
      { label: 'First Time Meeting In Congress', href: '/community/county-assemblies/docs/first-time-meeting-in-congress' },
      { label: 'PROPOSAL – Electronic Voting Methods', href: '/community/county-assemblies/docs/proposal-electronic-voting-methods' },
      { label: 'Proposal – Assembly Training After Delegates Elected', href: '/community/county-assemblies/docs/proposal-assembly-training-after-delegates-elected' },
      { label: 'The Proposal Method', href: '/community/county-assemblies/docs/the-proposal-method' },
      { label: 'PROPOSAL – Florida Congressional Training', href: '/community/county-assemblies/docs/proposal-florida-congressional-training' },
    ],
  },
  {
    title: 'Interim Holding Time Period',
    items: [
      { label: 'Ad Hoc Board of Directors', href: '/community/county-assemblies/docs/ad-hoc-board-of-directors' },
      { label: 'Golden Handcuffs', href: '/community/county-assemblies/docs/golden-handcuffs' },
      { label: 'Board Of Directors', href: '/community/county-assemblies/docs/board-of-directors' },
      { label: 'Article – What are The County Assembly Goals After Electing Delegates?', href: '/community/county-assemblies/docs/article-what-are-the-county-assembly-goals-after-electing-delegates' },
      { label: 'Article – Simple Arbitration Board For Dispute Settlement', href: '/community/county-assemblies/docs/article-simple-arbitration-board-for-dispute-settlement' },
      { label: 'Article – Working With Other County Assembly Groups?', href: '/community/county-assemblies/docs/article-working-with-other-county-assembly-groups' },
      { label: 'Article – Should We Be Working On Our Constitutions?', href: '/community/county-assemblies/docs/article-should-we-be-working-on-our-constitutions' },
    ],
  },
  {
    title: 'Creating the Congresses',
    items: [
      { label: 'PROPOSAL – Ratification By The Senate', href: '/community/county-assemblies/docs/ratification-by-the-senate' },
      { label: 'PROPOSAL – Ratification of Assemblies', href: '/community/county-assemblies/docs/proposal-ratification-of-assemblies' },
      { label: 'PROPOSAL – Manning The Federal Congress', href: '/community/county-assemblies/docs/proposal-manning-the-federal-congress' },
      { label: 'PROPOSAL – Manning The Florida Congress', href: '/community/county-assemblies/docs/proposal-manning-the-florida-congress' },
      { label: 'PROPOSAL – Updating Website For Next Phase', href: '/community/county-assemblies/docs/proposal-updating-website-for-next-phase' },
      { label: 'PROPOSAL – Creating The Florida House Of Representatives', href: '/community/county-assemblies/docs/proposal-creating-the-florida-house-of-representatives' },
      { label: 'Article – Procedures to Create All Republic Congresses', href: '/community/county-assemblies/docs/article-procedures-to-create-all-republic-congresses' },
      { label: 'Article – Who has The Power To Create A Republic Government?', href: '/community/county-assemblies/docs/article-who-has-the-power-to-create-a-republic-government' },
      { label: 'Article – Challenge To Opening The Florida Congress', href: '/community/county-assemblies/docs/article-challenge-to-opening-the-florida-congress' },
    ],
  },
  {
    title: 'Financing and Investment Opportunities',
    items: [
      { label: 'PROPOSAL – How To Finance All The Republics Immediately', href: '/community/county-assemblies/docs/proposal-how-to-finance-all-the-republics-immediately' },
      { label: "Business Proposal – Ida's Assembly Support", href: '/community/county-assemblies/docs/business-proposal-idas-assembly-support' },
      { label: "Jim's Daily Rant – No-BS-Ometer", href: '/community/county-assemblies/docs/jims-daily-rant-no-bs-ometer-when-sci-fi-merges-into-our-nuvo-reality' },
      { label: 'PROPOSAL – Creating A Fast Track To Co-Op Villages, Ending Poverty & Homelessness', href: '/community/county-assemblies/docs/proposal-creating-a-fast-track-to-co-op-villages-ending-poverty-homelessness' },
    ],
  },
  {
    title: 'Training Legal Officers',
    items: [
      { label: 'PROPOSAL – Training County Court Clerks', href: '/community/county-assemblies/docs/proposal-training-county-court-clerks' },
      { label: 'PROPOSAL – Training Judicial Officers', href: '/community/county-assemblies/docs/proposal-training-judicial-officers' },
    ],
  },
  {
    title: 'Other',
    items: [
      { label: 'PROPOSAL – Returning To The Land', href: '/community/county-assemblies/docs/proposal-returning-to-the-land' },
      { label: 'PROPOSAL – LAWYER UP', href: '/community/county-assemblies/docs/proposal-lawyer-up' },
      { label: 'Create Corporations for Republic', href: '/community/county-assemblies/docs/create-corporations-for-republic' },
      { label: 'Index – Implementation of NW Ord', href: '/community/county-assemblies/docs/index-implementation-of-nw-ord' },
      { label: 'Proof of 30,000 Persons on the Land – The Shot Gun Method', href: '/community/county-assemblies/docs/proof-of-30000-persons-on-the-land-the-shot-gun-method' },
      { label: 'Training Academy for New Leaders', href: '/community/county-assemblies/docs/training-academy-for-new-leaders' },
      { label: 'Creation of Internet Team', href: '/community/county-assemblies/docs/creation-of-internet-team' },
      { label: 'Looking Backward; Brain Storming', href: '/community/county-assemblies/docs/looking-backward-brain-storming' },
      { label: 'Article – Republic for N. America', href: '/community/county-assemblies/docs/article-republic-for-n-america' },
      { label: 'PROPOSAL – Dictated Constitutional Religious Interference', href: '/community/county-assemblies/docs/proposal-for-the-assemblies-of-the-re-inhabited-republic-for-florida-dictated-constitutional-religious-interference' },
    ],
  },
]
export default function Page() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies" className="hover:text-foreground">County Assemblies</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Business Plan</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Complete Business Plan for All States</h1>
      <p className="text-sm text-muted-foreground mb-8">
        60+ articles, proposals, and guides covering every aspect of standing up county assemblies and the Republic. By Jim Costa — <a href="mailto:costa4670@gmail.com" className="text-primary hover:underline">costa4670@gmail.com</a>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {CATEGORIES.map(cat => (
          <div key={cat.title} id={slugify(cat.title)} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">{cat.title}</h2>
              <span className="text-xs text-muted-foreground">{cat.items.length} articles</span>
            </div>
            <ul className="space-y-1.5 mb-3">
              {cat.items.map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="flex items-start gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-0.5">
                    <ChevronRight className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        <p>These articles are living documents maintained at <a href="https://www.flarepublic.us/complete-business-plan-for-all-states/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">flarepublic.us/complete-business-plan-for-all-states</a>. For questions, contact <a href="mailto:costa4670@gmail.com" className="text-primary hover:underline">Jim Costa</a>.</p>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/community/county-assemblies/re-inhabiting" className="text-sm text-muted-foreground hover:text-foreground">← Re-Inhabiting</Link>
        <Link href="/community/county-assemblies" className="text-sm font-medium text-primary hover:underline">← Back to County Assemblies</Link>
      </div>
    </main>
  )
}
