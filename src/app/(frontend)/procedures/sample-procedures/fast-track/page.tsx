import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Fast Track | Sample Assembly Procedures | FlaRepublic' }
export const dynamic = 'force-static'

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures" className="hover:text-foreground">Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/procedures/sample-procedures" className="hover:text-foreground">Sample Procedures</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Fast Track</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">Fast Track to Raising a County Assembly in One Week</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa</p>

      <div className="space-y-6">
        <div className="space-y-3">
          {[
            { step: 1, text: 'Watch the Spotting Personalities seminar to understand the four personality types and how to identify them quickly.' },
            { step: 2, text: 'During Member Intake, identify the Cholerics.' },
            { step: 3, text: 'Contact them and volunteer them for an Immediate Focus Group (or multiple groups).', link: { href: '/procedures/sample-procedures/immediate-focus-groups', label: 'See Immediate Focus Groups' } },
            { step: 4, text: 'If they are the first to join the group they want, appoint them the leader. Either way, tell them they are free to bring in Ringers.' },
            { step: 5, text: 'Tell them it will be impossible to reach the goal in one week.' },
            { step: 6, text: 'Get out of their way!' },
          ].map(({ step, text, link }) => (
            <div key={step} className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{step}</span>
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p>{text}</p>
                {link && <Link href={link.href} className="mt-1 inline-block text-primary hover:underline">{link.label} →</Link>}
              </div>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="text-base font-semibold text-foreground mb-3">How to Identify a Choleric</h2>
          <p className="text-sm text-muted-foreground mb-4">Ask them to pick their motto:</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { n: 1, motto: 'Do it the Fun Way.', type: 'Sanguine' },
              { n: 2, motto: 'Do it My Way and Now.', type: 'Choleric', highlight: true },
              { n: 3, motto: 'Do it the Right Way.', type: 'Melancholy' },
              { n: 4, motto: 'Do it the Easy Way.', type: 'Phlegmatic' },
            ].map(({ n, motto, type, highlight }) => (
              <div key={n} className={`rounded-lg border px-4 py-3 text-sm ${highlight ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-card'}`}>
                <span className={`font-semibold ${highlight ? 'text-blue-400' : 'text-foreground'}`}>{n}. {motto}</span>
                <span className="ml-2 text-xs text-muted-foreground">({type})</span>
                {highlight && <span className="ml-2 text-xs font-bold text-blue-400">← Choleric</span>}
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-muted-foreground">
          See also the full <Link href="/resources/personality-profile" className="text-primary hover:underline">Personality Profile test</Link> on FlaRepublic to identify all four types among your members.
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/procedures/sample-procedures" className="text-sm text-muted-foreground hover:text-foreground">← Back to Sample Procedures</Link>
        <Link href="/procedures/sample-procedures/immediate-focus-groups" className="text-sm font-medium text-primary hover:underline">Next: Immediate Focus Groups →</Link>
      </div>
    </main>
  )
}
