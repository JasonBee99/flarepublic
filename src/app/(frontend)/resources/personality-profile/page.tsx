// src/app/(frontend)/resources/personality-profile/page.tsx
// Personality Profile page — server component shell wrapping the interactive client component.

import type { Metadata } from 'next'
import PersonalityTest from './PersonalityTest'

export const metadata: Metadata = {
  title: 'Personality Profile | FlaRepublic',
  description:
    'Discover your leadership personality type — Sanguine, Choleric, Melancholy, or Phlegmatic — using the Personality Plus profile. Understand your strengths, growth areas, and how you contribute to your county assembly.',
}

export default function PersonalityProfilePage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Resources</p>
        <h1 className="text-4xl font-bold tracking-tight">Personality Profile</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Understanding your personality type helps you know how you lead, communicate, and contribute
          within your county assembly. Select the one word per row that most applies to you —
          hover any word to see its definition.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Sanguine', color: 'bg-orange-100 text-orange-800' },
            { label: 'Choleric', color: 'bg-blue-100 text-blue-800' },
            { label: 'Melancholy', color: 'bg-violet-100 text-violet-800' },
            { label: 'Phlegmatic', color: 'bg-emerald-100 text-emerald-800' },
          ].map(({ label, color }) => (
            <span key={label} className={`text-xs font-medium px-2.5 py-1 rounded-full ${color}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <PersonalityTest />

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Based on the Personality Profile by Fred Littauer, adapted from{' '}
          <em>Personality Plus</em> (Fleming H. Revell Publishers). Word definitions adapted from{' '}
          <em>Personality Patterns</em> by Lana Bateman. Reprinted by permission.
        </p>
      </div>
    </main>
  )
}
