// src/app/(frontend)/community/county-assemblies/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Creating County Assemblies | FlaRepublic',
  description: 'Everything you need to stand up and activate a Florida county assembly — guides, training, and resources by Jim Costa.',
}
export const dynamic = 'force-static'

const SECTIONS = [
  { href: '/community/county-assemblies/why-we-need', title: 'Why We Urgently Need County Assemblies', desc: 'The case for standing up county assemblies now and what they must accomplish.' },
  { href: '/community/county-assemblies/how-to-organize', title: 'How to Organize Your County Assembly', desc: "Jim Costa's step-by-step guide from 12 years of experience organizing counties." },
  { href: '/community/county-assemblies/temporary-districts', title: 'Florida Temporary Districts', desc: 'The 4 temporary districts dividing Florida for easier physical coordination.' },
  { href: '/community/county-assemblies/meeting-methods', title: 'Meeting Methods Training', desc: "Robert's Rules, Consensus, Electronic Meetings, and Voting tools." },
  { href: '/community/county-assemblies/re-inhabiting', title: 'Re-Inhabiting the Country', desc: 'The plan, overview and background for re-inhabiting the Republic.' },
  { href: '/community/county-assemblies/business-plan', title: 'Complete Business Plan for All States', desc: '60+ articles covering Fast Track, Training, Financing, Legal Officers, and more.' },
  { href: '/procedures/sample-procedures', title: 'Sample Assembly Procedures', desc: "Jim Costa's full procedural checklist — office space, funding, legal structure, member intake, and more." },
  { href: '/procedures/sample-procedures/fast-track', title: 'Fast Track — Stand Up in One Week', desc: 'Use Cholerics to stand up a county assembly in seven days.' },
]

export default function CountyAssembliesPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">County Assemblies</span>
      </div>

      <div className="mb-10">
        <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wide">Florida Republic</p>
        <h1 className="text-4xl font-bold tracking-tight">Creating County Assemblies</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Florida must organize all 67 counties. Everything you need to stand up and activate your county assembly — by Jim Costa.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground max-w-2xl">
          <strong className="text-foreground">34 County Assemblies Up!</strong> — Time is running out. Get your county activated now.
          Contact Jim Costa: <a href="mailto:costa4670@gmail.com" className="text-primary hover:underline">costa4670@gmail.com</a> · <a href="tel:8504637711" className="text-primary hover:underline">850-463-7711</a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
            <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Content by Jim Costa — originally published at <a href="https://www.flarepublic.us/county-assemblies/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">flarepublic.us/county-assemblies</a>.
      </p>
    </main>
  )
}
