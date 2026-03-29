// src/components/PersonalityCard.tsx
// Permanent personality profile card shown on the member dashboard.
// Shows scores if test taken, prompt if not.

import React from 'react'
import Link from 'next/link'
import { Brain, Download, BookOpen, RotateCcw, ExternalLink } from 'lucide-react'

const TYPE_INFO: Record<string, { label: string; sub: string; color: string; bg: string }> = {
  S: { label: 'Sanguine',    sub: 'Popular',  color: 'text-orange-600', bg: 'bg-orange-100' },
  C: { label: 'Choleric',    sub: 'Powerful', color: 'text-blue-600',   bg: 'bg-blue-100'   },
  M: { label: 'Melancholy',  sub: 'Perfect',  color: 'text-violet-600', bg: 'bg-violet-100' },
  P: { label: 'Phlegmatic',  sub: 'Peaceful', color: 'text-emerald-600',bg: 'bg-emerald-100'},
}

interface Props {
  result?: {
    sanguine: number
    choleric: number
    melancholy: number
    phlegmatic: number
    dominantType: string
    completedAt: string
  } | null
}

export function PersonalityCard({ result }: Props) {
  const dominant = result ? TYPE_INFO[result.dominantType] : null
  const total = result
    ? result.sanguine + result.choleric + result.melancholy + result.phlegmatic
    : 40

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Personality Profile</h2>
        </div>
        {result && (
          <Link
            href="/resources/personality-profile"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Retake
          </Link>
        )}
      </div>

      {!result ? (
        // ── Not taken yet ────────────────────────────────────────────────
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Understanding your personality type helps your County Organizer place you in the right
            Focus Group and identify leadership potential. The test takes about 10 minutes.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/resources/personality-profile"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              <Brain className="h-4 w-4" /> Take the test
            </Link>
            <a
              href="/documents/personality-profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-primary/40 transition"
            >
              <Download className="h-4 w-4" /> Download PDF version
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Prefer the printed version? Download the original 6-page test and complete it by hand.
          </p>
        </div>
      ) : (
        // ── Results ──────────────────────────────────────────────────────
        <div className="space-y-4">
          {/* Dominant type badge */}
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${dominant?.bg} ${dominant?.color}`}>
              {dominant?.label} — {dominant?.sub}
            </span>
            <span className="text-xs text-muted-foreground">
              Completed {new Date(result.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Score bars */}
          <div className="space-y-2">
            {[
              { key: 'S', label: 'Sanguine',   score: result.sanguine   },
              { key: 'C', label: 'Choleric',   score: result.choleric   },
              { key: 'M', label: 'Melancholy', score: result.melancholy },
              { key: 'P', label: 'Phlegmatic', score: result.phlegmatic },
            ].map(({ key, label, score }) => {
              const info = TYPE_INFO[key]
              const pct = Math.round((score / total) * 100)
              return (
                <div key={key} className="grid grid-cols-[90px_1fr_32px] items-center gap-2">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${info.bg.replace('bg-', 'bg-').replace('100', '400')}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-right font-medium">{score}</span>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/resources/personality-profile?tab=results"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/40 transition"
            >
              <Brain className="h-3.5 w-3.5" /> View full results &amp; guide
            </Link>
            <a
              href="/documents/personality-profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/40 transition"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF test
            </a>
            <a
              href="https://www.amazon.com/Personality-Plus-Understand-Understanding-Yourself-ebook/dp/B009LNDFAE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/40 transition"
            >
              <BookOpen className="h-3.5 w-3.5" /> Personality Plus book
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>
      )}

      {/* Book reference — always shown */}
      {!result && (
        <div className="mt-4 pt-4 border-t border-border">
          <a
            href="https://www.amazon.com/Personality-Plus-Understand-Understanding-Yourself-ebook/dp/B009LNDFAE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Based on <em className="mx-1">Personality Plus</em> by Florence Littauer
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      )}
    </div>
  )
}
