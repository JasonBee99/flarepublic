'use client'
// src/app/(frontend)/county/[slug]/dashboard/OrganizerDashboard.tsx
// Interactive County Organizer Dashboard.
// All data is passed in as props from the server component — no client-side fetching
// except when saving organizer notes.

import React, { useState, useMemo } from 'react'
import {
  Users, Brain, BookOpen, Clock, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Search, SlidersHorizontal, Save, Check,
  Phone, MapPin, Mail,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PersonalityResult {
  id: string
  sanguine: number
  choleric: number
  melancholy: number
  phlegmatic: number
  dominantType: 'S' | 'C' | 'M' | 'P'
  organizerNote?: string
  completedAt: string
}

interface MemberRow {
  id: string
  name: string
  email: string
  approved: boolean
  role: string
  joinedAt: string | null
  personality: PersonalityResult | null
  lessonsCompleted: number
  totalLessons: number
  contactInfo: { phone?: string; address?: string; secondaryEmail?: string } | null
}

interface Props {
  countySlug: string
  countyName: string
  currentUserId: string
  members: MemberRow[]
}

// ── Data: personality type display info ───────────────────────────────────────
// Header colors are intentional branding (solid colored element, not a background
// that needs to adapt). All other colors use theme tokens.

const PERSONALITY_TYPE: Record<string, {
  label: string
  headerBg: string
  isCholeric: boolean
}> = {
  S: { label: 'Sanguine',   headerBg: 'bg-orange-500', isCholeric: false },
  C: { label: 'Choleric',   headerBg: 'bg-blue-600',   isCholeric: true  },
  M: { label: 'Melancholy', headerBg: 'bg-violet-600', isCholeric: false },
  P: { label: 'Phlegmatic', headerBg: 'bg-emerald-600',isCholeric: false },
}

const FILTER_OPTIONS = [
  { value: 'all',       label: 'All members' },
  { value: 'approved',  label: 'Approved only' },
  { value: 'pending',   label: 'Pending approval' },
  { value: 'S',         label: 'Sanguine dominant' },
  { value: 'C',         label: 'Choleric dominant' },
  { value: 'M',         label: 'Melancholy dominant' },
  { value: 'P',         label: 'Phlegmatic dominant' },
  { value: 'no_test',   label: 'No personality test' },
]

const SORT_OPTIONS = [
  { value: 'name',     label: 'Name' },
  { value: 'joined',   label: 'Joined date' },
  { value: 'progress', label: 'Learning progress' },
  { value: 'type',     label: 'Personality type' },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
        {completed}/{total} ({pct}%)
      </span>
    </div>
  )
}

function OrganizerNoteField({ memberId, initialNote }: { memberId: string; initialNote: string }) {
  const [note, setNote] = useState(initialNote)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      // Find the personality-results record for this user then PATCH organizerNote
      const searchRes = await fetch(
        `/api/personality-results?where[user][equals]=${memberId}&limit=1`,
        { credentials: 'include' }
      )
      const searchData = await searchRes.json()
      const recordId = searchData?.docs?.[0]?.id
      if (!recordId) return

      await fetch(`/api/personality-results/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ organizerNote: note }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to save note:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Organizer note (private)</p>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={2}
        placeholder="Add a private note about this member..."
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
      />
      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
      >
        {saved ? <Check className="h-3 w-3 text-green-500" /> : <Save className="h-3 w-3" />}
        {saved ? 'Saved' : saving ? 'Saving…' : 'Save note'}
      </button>
    </div>
  )
}

function MemberCard({ member, expanded, onToggle }: {
  member: MemberRow
  expanded: boolean
  onToggle: () => void
}) {
  const p = member.personality
  const typeInfo = p ? PERSONALITY_TYPE[p.dominantType] : null

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Row summary — always visible */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
      >
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
          {member.name.split(' ').map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2)}
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
            {member.role === 'countyOrganizer' && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Organizer
              </span>
            )}
            {!member.approved && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                Pending
              </span>
            )}
            {p?.dominantType === 'C' && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                Choleric
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
        </div>

        {/* Personality badge */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          {typeInfo ? (
            <span className={`text-xs font-semibold px-2 py-1 rounded text-white ${typeInfo.headerBg}`}>
              {typeInfo.label}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">No test</span>
          )}
        </div>

        {/* Progress */}
        <div className="hidden md:block w-36 flex-shrink-0">
          <ProgressBar completed={member.lessonsCompleted} total={member.totalLessons} />
        </div>

        {/* Joined */}
        <p className="hidden lg:block text-xs text-muted-foreground flex-shrink-0 w-24 text-right">
          {member.joinedAt
            ? new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
            : '—'}
        </p>

        {expanded
          ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-5 py-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* Member info */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Member Info</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium flex items-center gap-1 ${member.approved ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {member.approved
                    ? <><CheckCircle2 className="h-3 w-3 text-green-500" /> Approved</>
                    : <><XCircle className="h-3 w-3" /> Pending</>}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium text-foreground capitalize">{member.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium text-foreground">
                  {member.joinedAt
                    ? new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground truncate max-w-[160px]">{member.email}</span>
              </div>
              {/* Contact info */}
              {member.contactInfo && (member.contactInfo.phone || member.contactInfo.address || member.contactInfo.secondaryEmail) && (
                <div className="pt-2 mt-2 border-t border-border space-y-1.5">
                  {member.contactInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{member.contactInfo.phone}</span>
                    </div>
                  )}
                  {member.contactInfo.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{member.contactInfo.address}</span>
                    </div>
                  )}
                  {member.contactInfo.secondaryEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{member.contactInfo.secondaryEmail}</span>
                    </div>
                  )}
                </div>
              )}
              {member.contactInfo && !member.contactInfo.phone && !member.contactInfo.address && !member.contactInfo.secondaryEmail && (
                <p className="text-muted-foreground pt-1 italic">No contact info provided.</p>
              )}
              {!member.contactInfo && (
                <p className="text-muted-foreground pt-1 italic">No contact info provided.</p>
              )}
            </div>
          </div>

          {/* Learning progress */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Learning Progress</p>
            <div className="space-y-3">
              <div className="text-center py-3 rounded-lg bg-muted">
                <p className="text-3xl font-bold text-foreground">{member.lessonsCompleted}</p>
                <p className="text-xs text-muted-foreground">of {member.totalLessons} lessons complete</p>
              </div>
              <ProgressBar completed={member.lessonsCompleted} total={member.totalLessons} />
              {member.lessonsCompleted === 0 && (
                <p className="text-xs text-muted-foreground">No lessons started yet.</p>
              )}
            </div>
          </div>

          {/* Personality results */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Personality Profile</p>
            {!p ? (
              <p className="text-xs text-muted-foreground">Test not taken yet.</p>
            ) : (
              <div className="space-y-2">
                {/* Dominant type badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded text-white ${PERSONALITY_TYPE[p.dominantType]?.headerBg}`}>
                    {PERSONALITY_TYPE[p.dominantType]?.label}
                  </span>
                  {p.dominantType === 'C' && (
                    <span className="text-xs text-muted-foreground">⚑ Choleric — review before group placement</span>
                  )}
                </div>
                {/* Score bars */}
                {([
                  { key: 'S', label: 'Sanguine',   score: p.sanguine   },
                  { key: 'C', label: 'Choleric',   score: p.choleric   },
                  { key: 'M', label: 'Melancholy', score: p.melancholy },
                  { key: 'P', label: 'Phlegmatic', score: p.phlegmatic },
                ] as const).map(({ key, label, score }) => (
                  <div key={key} className="grid grid-cols-[70px_1fr_24px] items-center gap-2">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${PERSONALITY_TYPE[key].headerBg}`}
                        style={{ width: `${Math.round((score / 40) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-right font-medium text-foreground">{score}</span>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground pt-1">
                  Taken {new Date(p.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}

            {/* Organizer note — only shown if personality result exists (note stored there) */}
            {p && (
              <OrganizerNoteField
                memberId={member.id}
                initialNote={p.organizerNote ?? ''}
              />
            )}
          </div>

        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function OrganizerDashboard({ countySlug, countyName, currentUserId, members }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('name')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalLessons = members[0]?.totalLessons ?? 0
  const approved = members.filter(m => m.approved).length
  const pending = members.length - approved
  const testTaken = members.filter(m => m.personality).length
  const cholerics = members.filter(m => m.personality?.dominantType === 'C').length
  const avgProgress = members.length
    ? Math.round(members.reduce((acc, m) => acc + (totalLessons > 0 ? m.lessonsCompleted / totalLessons : 0), 0) / members.length * 100)
    : 0

  // ── Filter + sort ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = members.filter(m => {
      const q = search.toLowerCase()
      if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false
      if (filter === 'approved') return m.approved
      if (filter === 'pending') return !m.approved
      if (filter === 'no_test') return !m.personality
      if (['S', 'C', 'M', 'P'].includes(filter)) return m.personality?.dominantType === filter
      return true
    })

    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'joined') return (b.joinedAt ?? '').localeCompare(a.joinedAt ?? '')
      if (sort === 'progress') return b.lessonsCompleted - a.lessonsCompleted
      if (sort === 'type') return (a.personality?.dominantType ?? 'Z').localeCompare(b.personality?.dominantType ?? 'Z')
      return 0
    })

    return list
  }, [members, search, filter, sort])

  return (
    <div className="space-y-8">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5" />}      label="Total members"     value={members.length} />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Approved"        value={approved} />
        <StatCard icon={<Brain className="h-5 w-5" />}       label="Test completed"   value={testTaken} />
        <StatCard icon={<BookOpen className="h-5 w-5" />}    label="Avg lesson progress" value={`${avgProgress}%`} />
      </div>

      {/* Choleric callout */}
      {cholerics > 0 && (
        <div className="rounded-xl border border-border bg-muted/40 px-5 py-4 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">⚑</span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {cholerics} Choleric member{cholerics !== 1 ? 's' : ''} in {countyName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cholerics are not auto-assigned to Focus Groups — review their profiles and place manually based on group dynamics.
            </p>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="appearance-none rounded-lg border border-border bg-background pl-9 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            {FILTER_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="appearance-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>Sort: {o.label}</option>
          ))}
        </select>
      </div>

      {/* ── Member list ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
          {pending > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted border border-border text-foreground">
              {pending} pending approval
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No members match your filters.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                expanded={expandedId === member.id}
                onToggle={() => setExpandedId(prev => prev === member.id ? null : member.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Pending approval section ── */}
      {pending > 0 && (
        <section className="pt-4 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Pending Approval</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These members have registered but not yet been approved. Approve them in the{' '}
            <a
              href="/admin/collections/users"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Payload admin panel
            </a>.
          </p>
          <div className="space-y-2">
            {members.filter(m => !m.approved).map(member => (
              <div key={member.id} className="rounded-lg border border-border bg-card px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    Registered {member.joinedAt
                      ? new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </p>
                  <a
                    href={`/admin/collections/users/${member.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Review →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
