// src/components/PersonalityGuide.tsx
// Displays the full Personality Plus reference material (pages 3 & 5 of the PDF):
//   1. Strengths & Weaknesses trait table (Emotions / Work / Friends sections)
//   2. Understanding Your Personality Profile Scores (interpretation guide)
// The dominant type column is highlighted throughout.
//
// COLOR RULE: No hardcoded Tailwind color classes (no -50, -100, -200, bg-white, etc.).
// All backgrounds use CSS theme tokens: bg-background, bg-card, bg-muted, bg-primary/N,
// border-border, text-foreground, text-muted-foreground. This ensures correct rendering
// in both light and dark themes. Only the colored column headers (bg-orange-500 etc.)
// and border accents (border-orange-500 etc.) are allowed as fixed colors since they
// are intentional branding, not backgrounds that need to adapt.

'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type TypeKey = 'S' | 'C' | 'M' | 'P'

// Only headerBg (solid colored header) and colBorder (accent border on dominant column)
// use fixed Tailwind colors. Everything else uses theme tokens in the render functions.
const TYPE_STYLE: Record<TypeKey, {
  label: string
  sub: string
  headerBg: string   // solid color for the column header — intentional, not background
  colBorder: string  // accent border for dominant column only
}> = {
  S: { label: 'Sanguine',   sub: 'Popular',  headerBg: 'bg-orange-500', colBorder: 'border-orange-500' },
  C: { label: 'Choleric',   sub: 'Powerful', headerBg: 'bg-blue-600',   colBorder: 'border-blue-500'   },
  M: { label: 'Melancholy', sub: 'Perfect',  headerBg: 'bg-violet-600', colBorder: 'border-violet-500' },
  P: { label: 'Phlegmatic', sub: 'Peaceful', headerBg: 'bg-emerald-600',colBorder: 'border-emerald-500'},
}

// ── Page 5 data: Strengths & Weaknesses trait table ──────────────────────────

interface TraitSection {
  label: string
  rows: Record<TypeKey, string[]>
}

const STRENGTH_SECTIONS: TraitSection[] = [
  {
    label: 'Emotions',
    rows: {
      S: [
        'Appealing personality',
        'Talkative, storyteller',
        'Life of the party',
        'Good sense of humor',
        'Memory for color',
        'Physically holds on to listener',
        'Emotional and demonstrative',
        'Enthusiastic and expressive',
        'Cheerful and bubbling over',
        'Curious',
        'Good on stage',
        'Wide-eyed and innocent',
        'Lives in the present',
        'Changeable disposition',
        'Sincere at heart',
        'Always a child',
      ],
      C: [
        'Born leader',
        'Dynamic and active',
        'Compulsive need for change',
        'Must correct wrongs',
        'Strong-willed and decisive',
        'Unemotional',
        'Not easily discouraged',
        'Independent and self-sufficient',
        'Exudes confidence',
        'Can run anything',
      ],
      M: [
        'Deep and thoughtful',
        'Analytical',
        'Serious and purposeful',
        'Genius prone',
        'Talented and creative',
        'Artistic or musical',
        'Philosophical and poetic',
        'Appreciative of beauty',
        'Sensitive to others',
        'Self-sacrificing',
        'Conscientious',
        'Idealistic',
      ],
      P: [
        'Low-key personality',
        'Easygoing and relaxed',
        'Calm, cool, and collected',
        'Patient, well balanced',
        'Consistent life',
        'Quiet, but witty',
        'Sympathetic and kind',
        'Keeps emotions hidden',
        'Happily reconciled to life',
        'All-purpose person',
      ],
    },
  },
  {
    label: 'Work',
    rows: {
      S: [
        'Volunteers for jobs',
        'Thinks up new activities',
        'Looks great on the surface',
        'Has energy and enthusiasm',
        'Starts in a flashy way',
        'Inspires others to join',
        'Charms others to work',
      ],
      C: [
        'Goal oriented',
        'Sees the whole picture',
        'Organizes well',
        'Seeks practical solutions',
        'Moves quickly to action',
        'Delegates work',
        'Insists on production',
        'Makes the goal',
        'Stimulates activity',
        'Thrives on opposition',
      ],
      M: [
        'Schedule oriented',
        'Perfectionist, high standards',
        'Detail conscious',
        'Persistent and thorough',
        'Orderly and organized',
        'Neat and tidy',
        'Economical',
        'Sees the problems',
        'Finds creative solutions',
        'Needs to finish what he starts',
        'Likes charts, graphs, figures, lists',
      ],
      P: [
        'Competent and steady',
        'Peaceful and agreeable',
        'Has administrative ability',
        'Mediates problems',
        'Avoids conflicts',
        'Good under pressure',
        'Finds the easy way',
      ],
    },
  },
  {
    label: 'Friends',
    rows: {
      S: [
        'Makes friends easily',
        'Loves people',
        'Thrives on compliments',
        'Seems exciting',
        'Envied by others',
        "Doesn't hold grudges",
        'Apologizes quickly',
        'Prevents dull moments',
        'Likes spontaneous activities',
      ],
      C: [
        'Has little need for friends',
        'Will work for group activity',
        'Will lead and organize',
        'Is usually right',
        'Excels in emergencies',
      ],
      M: [
        'Makes friends cautiously',
        'Content to stay in background',
        'Avoids causing attention',
        'Faithful and devoted',
        'Will listen to complaints',
        "Can solve other's problems",
        'Deep concern for other people',
        'Moved to tears with compassion',
        'Seeks ideal mate',
      ],
      P: [
        'Easy to get along with',
        'Pleasant and enjoyable',
        'Inoffensive',
        'Good listener',
        'Dry sense of humor',
        'Enjoys watching people',
        'Has many friends',
        'Has compassion and concern',
      ],
    },
  },
]

const WEAKNESS_SECTIONS: TraitSection[] = [
  {
    label: 'Emotions',
    rows: {
      S: [
        'Compulsive talker',
        'Exaggerates and elaborates',
        'Dwells on trivia',
        "Can't remember names",
        'Scares others off',
        'Too happy for some',
        'Has restless energy',
        'Egotistical',
        'Blusters and complains',
        'Naive, gets taken in',
        'Has loud voice and laugh',
        'Controlled by circumstances',
        'Gets angry easily',
        'Seems phony to some',
        'Never grows up',
      ],
      C: [
        'Bossy',
        'Impatient',
        'Quick-tempered',
        "Can't relax",
        'Too impetuous',
        'Enjoys controversy and arguments',
        "Won't give up when losing",
        'Comes on too strong',
        'Inflexible',
        'Is not complimentary',
        'Dislikes tears and emotions',
        'Is unsympathetic',
      ],
      M: [
        'Remembers the negatives',
        'Moody and depressed',
        'Enjoys being hurt',
        'Has false humility',
        'Off in another world',
        'Low self-image',
        'Has selective hearing',
        'Self-centered',
        'Too introspective',
        'Guilt feelings',
        'Persecution complex',
        'Tends to hypochondria',
      ],
      P: [
        'Unenthusiastic',
        'Fearful and worried',
        'Indecisive',
        'Avoids responsibility',
        'Quiet will of iron',
        'Selfish',
        'Too shy and reticent',
        'Too compromising',
        'Self-righteous',
      ],
    },
  },
  {
    label: 'Work',
    rows: {
      S: [
        'Would rather talk',
        'Forgets obligations',
        "Doesn't follow through",
        'Confidence fades fast',
        'Undisciplined',
        'Priorities out of order',
        'Decides by feelings',
        'Easily distracted',
        'Wastes time talking',
      ],
      C: [
        'Little tolerance for mistakes',
        "Doesn't analyze details",
        'Bored by trivia',
        'May make rash decisions',
        'May be crude or tactless',
        'Manipulates people',
        'Demanding of others',
        'End justifies the means',
        'Work may become his god',
        'Demands loyalty in the ranks',
      ],
      M: [
        'Not people oriented',
        'Depressed over imperfections',
        'Chooses difficult work',
        'Hesitant to start projects',
        'Spends too much time planning',
        'Prefers analysis to work',
        'Self-deprecating',
        'Hard to please',
        'Standards often too high',
        'Deep need for approval',
      ],
      P: [
        'Not goal oriented',
        'Lacks self-motivation',
        'Hard to get moving',
        'Resents being pushed',
        'Lazy and careless',
        'Discourages others',
        'Would rather watch',
      ],
    },
  },
  {
    label: 'Friends',
    rows: {
      S: [
        'Hates to be alone',
        'Needs to be center stage',
        'Wants to be popular',
        'Looks for credit',
        'Dominates conversations',
        "Interrupts and doesn't listen",
        'Answers for others',
        'Fickle and forgetful',
        'Makes excuses',
        'Repeats stories',
      ],
      C: [
        'Tends to use people',
        'Dominates others',
        'Decides for others',
        'Knows everything',
        'Can do everything better',
        'Is too independent',
        'Possessive of friends and mate',
        "Can't say, 'I'm sorry'",
        'May be right, but unpopular',
      ],
      M: [
        'Lives through others',
        'Insecure socially',
        'Withdrawn and remote',
        'Critical of others',
        'Holds back affection',
        'Dislikes those in opposition',
        'Suspicious of people',
        'Antagonistic and vengeful',
        'Unforgiving',
        'Full of contradictions',
        'Skeptical of compliments',
      ],
      P: [
        'Dampens enthusiasm',
        'Stays uninvolved',
        'Is not exciting',
        'Indifferent to plans',
        'Judges others',
        'Sarcastic and teasing',
        'Resists change',
      ],
    },
  },
]

// ── Page 3 data: Interpretation guide ────────────────────────────────────────

const NATURAL_COMBOS = [
  'Sanguine / Choleric',
  'Choleric / Melancholy',
  'Phlegmatic / Sanguine',
  'Melancholy / Phlegmatic',
]

const UNNATURAL_COMBOS = [
  'Sanguine / Melancholy',
  'Choleric / Phlegmatic',
]

const MASKING_CAUSES = [
  { n: 1,  text: 'A domineering parent in childhood, constantly requiring the child to conform to the personality they want the child to have.' },
  { n: 2,  text: 'An alcoholic parent in childhood, forcing unnatural pressures for the child to perform, often assuming parental roles not natural for a child.' },
  { n: 3,  text: 'Strong rejection feelings in childhood — a child who does not feel the love of one or both parents will often try to "be perfect" for the unloving parent.' },
  { n: 4,  text: 'Any form of emotional or physical abuse will quickly teach the child that the only way to stop the harsh treatment is to conform to the demands of the abusing parent.' },
  { n: 5,  text: "Childhood sexual interference or violation. The child subconsciously rationalizes that maybe if they were just good enough, they would be left alone." },
  { n: 6,  text: "Single Parent Home. A first-born child may often be required to fulfill some of the roles of the absent parent, which are not consistent with the child's natural personality." },
  { n: 7,  text: 'Birth Order. Young parents frequently pour an overzealous energy into making their first child conform to their concept of what he/she should be.' },
  { n: 8,  text: "Legalistic Religious Home. Intensely regulatory standards where appearance and conformance are required will often throttle a child's natural personality and zest for living." },
  { n: 9,  text: 'A domineering and controlling spouse in adult life can have a similar effect as a domineering parent in childhood.' },
  { n: 10, text: 'Adult abuse or rejection in marriage will often have the same effect of distorting the natural personality, as the lonely or hurting person puts on a mask and simply gives up.' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-2">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

function TraitTable({ section, dominant }: { section: TraitSection; dominant: TypeKey }) {
  const types: TypeKey[] = ['S', 'C', 'M', 'P']
  const maxRows = Math.max(...types.map(t => section.rows[t].length))

  return (
    <div className="mb-6">
      <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">{section.label}</h4>
      <div className="grid grid-cols-4 gap-0 rounded-xl overflow-hidden border border-border">
        {/* Column headers — solid color intentional branding, always readable */}
        {types.map(t => {
          const style = TYPE_STYLE[t]
          const isDom = t === dominant
          return (
            <div
              key={t}
              className={`px-3 py-2.5 text-center text-white ${style.headerBg} ${isDom ? 'ring-2 ring-inset ring-white/40' : 'opacity-60'}`}
            >
              <p className="text-xs font-bold">{style.label}</p>
              <p className="text-[10px] opacity-80">{style.sub}</p>
              {isDom && (
                <p className="text-[9px] font-semibold mt-0.5 bg-white/20 rounded px-1 py-0.5 inline-block">
                  Your type
                </p>
              )}
            </div>
          )
        })}
        {/* Data rows — all backgrounds use theme tokens, no hardcoded light colors */}
        {Array.from({ length: maxRows }).map((_, rowIdx) => (
          types.map(t => {
            const style = TYPE_STYLE[t]
            const isDom = t === dominant
            const trait = section.rows[t][rowIdx]
            return (
              <div
                key={`${t}-${rowIdx}`}
                className={`px-3 py-1.5 text-xs border-t border-border/50 ${
                  isDom
                    ? `bg-primary/10 font-medium text-foreground border-l-2 border-r-2 ${style.colBorder}`
                    : 'bg-card text-muted-foreground'
                }`}
              >
                {trait ?? ''}
              </div>
            )
          })
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  dominant: TypeKey
}

export function PersonalityGuide({ dominant }: Props) {
  const [interpretOpen, setInterpretOpen] = useState(false)
  const domStyle = TYPE_STYLE[dominant]

  return (
    <div className="mt-10 pt-8 border-t border-border space-y-8">

      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Reference Guide</p>
        <h2 className="text-2xl font-bold text-foreground">Personality Type Deep Dive</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Based on <em>Personality Plus</em> by Florence Littauer. The tables below cover every personality
          type — your dominant type (<span className="font-semibold text-foreground">{domStyle.label}</span>) is highlighted throughout.
        </p>
      </div>

      {/* ── Strengths table ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-foreground text-xs font-semibold px-3 py-1 border border-border">
            ✦ Strengths
          </span>
        </div>
        {STRENGTH_SECTIONS.map(section => (
          <TraitTable key={section.label} section={section} dominant={dominant} />
        ))}
      </section>

      {/* ── Weaknesses table ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-foreground text-xs font-semibold px-3 py-1 border border-border">
            ✦ Weaknesses
          </span>
        </div>
        {WEAKNESS_SECTIONS.map(section => (
          <TraitTable key={section.label} section={section} dominant={dominant} />
        ))}
      </section>

      {/* ── Understanding Your Scores (page 3) — collapsible ── */}
      <section>
        <button
          onClick={() => setInterpretOpen(v => !v)}
          className="w-full flex items-center justify-between rounded-xl border border-border bg-muted/30 px-5 py-4 hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Understanding Your Personality Profile Scores</p>
            <p className="text-xs text-muted-foreground mt-0.5">Normal patterns · Unnatural combinations · Causes of masking</p>
          </div>
          {interpretOpen
            ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
        </button>

        {interpretOpen && (
          <div className="mt-3 rounded-xl border border-border bg-card p-6 space-y-7 text-sm leading-relaxed">

            {/* Normal Healthy Patterns */}
            <div>
              <h3 className="font-bold text-foreground mb-3">Normal Healthy Patterns</h3>
              <p className="text-muted-foreground mb-3">
                Natural combinations of birth personalities are listed below. One of the two will be your dominant
                and the other will be your secondary. Most everyone has a dominant and a secondary, but the numbers
                may vary greatly — for example, 32 Choleric with 8 Melancholy would be a very strong Choleric with
                some Melancholy traits.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {NATURAL_COMBOS.map(combo => (
                  <div
                    key={combo}
                    className="rounded-lg border border-border bg-muted px-3 py-2.5 text-xs font-medium text-foreground text-center"
                  >
                    {combo}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-xs">
                It is also quite possible to have more evenly balanced scores in two columns. One or two checks
                in the remaining two columns can generally be ignored as insignificant. Normal healthy patterns
                are usually characterized by similar and balancing scores of strengths and weaknesses in any
                single column.
              </p>
            </div>

            <SectionDivider label="Unnatural Combinations" />

            {/* Unnatural Combinations */}
            <div>
              <p className="text-muted-foreground mb-3">
                There are two combinations that, though often seen, are not natural birth personality combinations:
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {UNNATURAL_COMBOS.map(combo => (
                  <div
                    key={combo}
                    className="rounded-lg border border-border bg-muted px-3 py-2.5 text-xs font-semibold text-foreground text-center"
                  >
                    ⚠ {combo}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-xs">
                Either of these appearing in significant numbers on the scoring sheet is evidence of a
                &quot;personality mask&quot; — they are diametrically opposite and are not natural birth personality
                combinations. They are inevitably the result of outside forces working in our life to make us conform
                to someone else&apos;s concept of who we should be, or put on in childhood to survive a difficult or
                dysfunctional family living situation.
              </p>
            </div>

            <SectionDivider label="Causes of Masking" />

            {/* Causes of Masking */}
            <div>
              <p className="text-muted-foreground mb-4 text-xs">
                It takes a great deal of energy to wear a mask and live in a personality role that is not naturally
                yours. Our goal should be to take off the mask and live life to the fullest for which we were created.
                Common causes of personality masking include:
              </p>
              <div className="space-y-3">
                {MASKING_CAUSES.map(({ n, text }) => (
                  <div key={n} className="flex gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground mt-0.5">
                      {n}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <SectionDivider label="Combination of Three or Four" />

            {/* Combination of Three / Four */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Combination of Three</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Any combination of three personalities indicates one must be a mask. Generally, the &quot;center&quot; of
                  the three is the natural, and one of the &quot;ends&quot; is a mask. For example, for a person scoring
                  relatively evenly in Sanguine/Choleric/Melancholy, the Choleric is generally the natural and either
                  the Sanguine or the Melancholy is the mask, as you were not born with both. A person who knows you
                  well can often objectively review your two columns in question and help you select the word that
                  describes you better.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Combination of Four</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When your profile scores are fairly even across all four, there are two possibilities. One, you
                  really don&apos;t know yourself and probably don&apos;t care; or you are phlegmatic, it doesn&apos;t matter,
                  and you have trouble making choices. Or two, you are &quot;double masked.&quot; The way you perceive
                  yourself has been so distorted by life&apos;s experiences that you really don&apos;t know who you are.
                  Refer to the Causes of Masking to see if any apply to you.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 text-xs text-muted-foreground">
              <strong className="text-foreground">Resources for Further Study:</strong>{' '}
              <em>Personality Plus</em> by Florence Littauer (Fleming H. Revell Co) ·{' '}
              <em>Your Personality Tree</em> by Florence Littauer ·{' '}
              <em>Freeing Your Mind from Memories that Bind</em> by Fred &amp; Florence Littauer ·{' '}
              <em>Put Power in Your Personality</em> by Florence Littauer (Fleming H. Revell Co)
            </div>

          </div>
        )}
      </section>

      {/* Attribution */}
      <p className="text-xs text-muted-foreground pb-4">
        Reprinted by permission from <em>After Every Wedding Comes a Marriage</em> (Florence Littauer, Harvest House Publishers)
        and <em>Personality Plus</em> (Florence Littauer, Fleming H. Revell Publishers). All rights reserved.
      </p>
    </div>
  )
}
