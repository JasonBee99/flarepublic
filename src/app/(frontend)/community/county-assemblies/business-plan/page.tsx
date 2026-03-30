import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Complete Business Plan for All States | FlaRepublic' }
export const dynamic = 'force-static'

const CATEGORIES = [
  {
    title: 'Fast Track to Assemblies',
    count: 9,
    baseUrl: 'https://www.flarepublic.us/docs-category/fast-track-to-assemblies/',
    items: [
      { label: 'Giant Steps To Assemblies', href: 'https://www.flarepublic.us/docs/proposal-giant-steps-to-assemblies/' },
      { label: 'Article – How Lawful Is The Fast Track?', href: 'https://www.flarepublic.us/docs/article-how-lawful-is-the-fast-track/' },
      { label: 'Article – Ad Hoc Coach For County Assemblies', href: 'https://www.flarepublic.us/docs/article-ad-hoc-coach-for-county-assemblies/' },
      { label: 'Article – Getting Two Delegates In An Hour', href: 'https://www.flarepublic.us/docs/article-getting-two-delegates-in-an-hour/' },
    ],
  },
  {
    title: 'Why Break From Nat\'l to Use the Fast Track?',
    count: 6,
    baseUrl: 'https://www.flarepublic.us/docs-category/why-break-from-natl-to-use-the-fast-track/',
    items: [
      { label: 'Article – Why Doesn\'t National Republic Push The Fast Track Method?', href: 'https://www.flarepublic.us/docs/article-why-doesnt-national-republic-push-the-fast-track-method/' },
      { label: 'PROPOSAL – Reading To County', href: 'https://www.flarepublic.us/docs/reading-to-county/' },
      { label: 'Article – Laches and Squatter Rights', href: 'https://www.flarepublic.us/docs/laches-squatter-rights/' },
      { label: 'PROPOSAL – Mergers and Military Softball', href: 'https://www.flarepublic.us/docs/proposal-mergers-and-military-softball/' },
    ],
  },
  {
    title: 'Training for Assembly and Congress',
    count: 9,
    baseUrl: 'https://www.flarepublic.us/docs-category/training-for-assembly-and-congress/',
    items: [
      { label: 'Article – The Future Of County Assemblies', href: 'https://www.flarepublic.us/docs/article-the-future-of-county-assemblies/' },
      { label: 'PROPOSAL – Maxing Meetings', href: 'https://www.flarepublic.us/docs/proposal-maxing-meetings/' },
      { label: 'PROPOSAL – One Secretary Server Computer', href: 'https://www.flarepublic.us/docs/proposal-one-secretary-server-computer-proposal-method-part-iii/' },
      { label: 'PROPOSAL – Electronic Leadership Of The Future Now', href: 'https://www.flarepublic.us/docs/proposal-electronic-leadership-of-the-future-now-proposal-method-part-ii/' },
    ],
  },
  {
    title: 'Interim Holding Time Period',
    count: 7,
    baseUrl: 'https://www.flarepublic.us/docs-category/interim-holding-time-period/',
    items: [
      { label: 'Ad Hoc Board of Directors', href: 'https://www.flarepublic.us/docs/ad-hoc-board-of-directors/' },
      { label: 'Golden Handcuffs', href: 'https://www.flarepublic.us/docs/golden-handcuffs/' },
      { label: 'Board Of Directors', href: 'https://www.flarepublic.us/docs/board-of-directors/' },
      { label: 'Article – What are The County Assembly Goals After Electing Delegates?', href: 'https://www.flarepublic.us/docs/article-what-are-the-county-assembly-goals-after-electing-delegates/' },
    ],
  },
  {
    title: 'Creating the Congresses',
    count: 9,
    baseUrl: 'https://www.flarepublic.us/docs-category/creating-the-congresses/',
    items: [
      { label: 'PROPOSAL – Ratification By The Senate', href: 'https://www.flarepublic.us/docs/ratification-by-the-senate/' },
      { label: 'PROPOSAL – Ratification of Assemblies', href: 'https://www.flarepublic.us/docs/proposal-ratification-of-assemblies/' },
      { label: 'PROPOSAL – Manning The Federal Congress', href: 'https://www.flarepublic.us/docs/proposal-manning-the-federal-congress/' },
      { label: 'PROPOSAL – Manning The Florida Congress', href: 'https://www.flarepublic.us/docs/proposal-manning-the-florida-congress/' },
    ],
  },
  {
    title: 'Training Legal Officers',
    count: 2,
    baseUrl: 'https://www.flarepublic.us/docs-category/training-legal-officers/',
    items: [
      { label: 'PROPOSAL – Training County Court Clerks', href: 'https://www.flarepublic.us/docs/proposal-training-county-court-clerks/' },
      { label: 'PROPOSAL – Training Judicial Officers', href: 'https://www.flarepublic.us/docs/proposal-training-judicial-officers/' },
    ],
  },
  {
    title: 'Financing and Investment Opportunities',
    count: 4,
    baseUrl: 'https://www.flarepublic.us/docs-category/financing-and-investment-opportunities/',
    items: [
      { label: 'PROPOSAL – HOW TO FINANCE ALL THE REPUBLICS IMMEDIATELY', href: 'https://www.flarepublic.us/docs/proposal-how-to-finance-all-the-republics-immediately/' },
      { label: 'Business Proposal – Ida\'s Assembly Support', href: 'https://www.flarepublic.us/docs/business-proposal-idas-assembly-support/' },
      { label: 'PROPOSAL – Creating A Fast Track To Co-Op Villages, Ending Poverty & Homelessness', href: 'https://www.flarepublic.us/docs/proposal-creating-a-fast-track-to-co-op-villages-ending-poverty-homelessness/' },
    ],
  },
  {
    title: 'Other',
    count: 9,
    baseUrl: 'https://www.flarepublic.us/docs-category/other/',
    items: [
      { label: 'PROPOSAL – Returning To The Land', href: 'https://www.flarepublic.us/docs/proposal-returning-to-the-land/' },
      { label: 'PROPOSAL – LAWYER UP', href: 'https://www.flarepublic.us/docs/proposal-lawyer-up/' },
      { label: 'Create Corporations for Republic', href: 'https://www.flarepublic.us/docs/create-corporations-for-republic/' },
      { label: 'Index – Implementation of NW Ord', href: 'https://www.flarepublic.us/docs/index-implementation-of-nw-ord/' },
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
          <div key={cat.title} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">{cat.title}</h2>
              <span className="text-xs text-muted-foreground">{cat.count} articles</span>
            </div>
            <ul className="space-y-1.5 mb-3">
              {cat.items.map(item => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-0.5">
                    <ChevronRight className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            {cat.count > cat.items.length && (
              <a href={cat.baseUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-primary hover:underline">
                View all {cat.count} articles →
              </a>
            )}
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
