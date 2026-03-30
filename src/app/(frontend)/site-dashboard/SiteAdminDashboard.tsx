'use client'
// src/app/(frontend)/site-dashboard/SiteAdminDashboard.tsx
// Interactive Site Admin Dashboard — tabs for Overview, Members, County Health,
// Personality Results, and Approval Queue.

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users, Brain, BookOpen, CheckCircle2, XCircle, MapPin,
  Search, SlidersHorizontal, LayoutDashboard, AlertTriangle,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface MemberRow {
  id: string
  name: string
  email: string
  approved: boolean
  role: string
  countyId: string | null
  countyName: string
  countySlug: string | null
  joinedAt: string | null
  personality: { dominantType: string; sanguine: number; choleric: number; melancholy: number; phlegmatic: number } | null
  lessonsCompleted: number
  totalLessons: number
}

interface CountyHealth {
  id: string
  name: string
  slug: string
  totalMembers: number
  approved: number
  pending: number
  hasOrganizer: boolean
  testTaken: number
  activeFocusGroups: number
  avgProgress: number
}

interface Props {
  stats: {
    totalMembers: number
    approved: number
    pending: number
    testTaken: number
    countiesWithMembers: number
    countiesWithOrganizer: number
    totalFocusGroups: number
    typeCounts: { S: number; C: number; M: number; P: number; none: number }
    totalLessons: number
  }
  memberRows: MemberRow[]
  countyHealth: CountyHealth[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PERSONALITY_TYPE: Record<string, { label: string; headerBg: string }> = {
  S: { label: 'Sanguine',   headerBg: 'bg-orange-500' },
  C: { label: 'Choleric',   headerBg: 'bg-blue-600'   },
  M: { label: 'Melancholy', headerBg: 'bg-violet-600' },
  P: { label: 'Phlegmatic', headerBg: 'bg-emerald-600'},
}

const TABS = [
  { id: 'overview',     label: 'Overview'         },
  { id: 'members',      label: 'All Members'      },
  { id: 'counties',     label: 'County Health'    },
  { id: 'personality',  label: 'Personality'      },
  { id: 'pending',      label: 'Approval Queue'   },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-primary mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right shrink-0">{pct}%</span>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2)
  return (
    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
      {initials}
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({ stats, memberRows, countyHealth }: Props) {
  const { typeCounts, totalLessons } = stats
  const typeTotal = typeCounts.S + typeCounts.C + typeCounts.M + typeCounts.P

  // Counties needing attention
  const needsAttention = countyHealth.filter(
    c => c.totalMembers > 0 && (!c.hasOrganizer || c.pending > 0)
  ).slice(0, 8)

  // Top counties by member count
  const topCounties = [...countyHealth]
    .filter(c => c.totalMembers > 0)
    .sort((a, b) => b.totalMembers - a.totalMembers)
    .slice(0, 8)

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5" />}        label="Total members"      value={stats.totalMembers} />
        <StatCard icon={<XCircle className="h-5 w-5" />}      label="Pending approval"   value={stats.pending}
          sub={stats.pending > 0 ? 'Needs review' : undefined} />
        <StatCard icon={<Brain className="h-5 w-5" />}        label="Tests completed"    value={stats.testTaken}
          sub={`${stats.totalMembers > 0 ? Math.round(stats.testTaken / stats.totalMembers * 100) : 0}% of members`} />
        <StatCard icon={<MapPin className="h-5 w-5" />}       label="Counties w/ members" value={stats.countiesWithMembers}
          sub={`${stats.countiesWithOrganizer} have organizers`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Personality type distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Personality Type Distribution</h2>
          {typeTotal === 0 ? (
            <p className="text-sm text-muted-foreground">No test results yet.</p>
          ) : (
            <div className="space-y-3">
              {(['S', 'C', 'M', 'P'] as const).map(t => {
                const info = PERSONALITY_TYPE[t]
                const count = typeCounts[t]
                const pct = Math.round((count / typeTotal) * 100)
                return (
                  <div key={t}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{info.label}</span>
                      <span className="text-xs text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${info.headerBg}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {typeCounts.none > 0 && (
                <p className="text-xs text-muted-foreground pt-1">{typeCounts.none} members haven't taken the test yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Counties needing attention */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Counties Needing Attention</h2>
          {needsAttention.length === 0 ? (
            <p className="text-sm text-muted-foreground">All active counties look good.</p>
          ) : (
            <div className="space-y-2">
              {needsAttention.map(c => (
                <Link
                  key={c.id}
                  href={`/county/${c.slug}/dashboard`}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 hover:border-primary/40 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary">{c.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      {!c.hasOrganizer && (
                        <span className="text-[10px] text-muted-foreground">No organizer</span>
                      )}
                      {c.pending > 0 && (
                        <span className="text-[10px] text-muted-foreground">{c.pending} pending</span>
                      )}
                    </div>
                  </div>
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Top counties by membership */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Top Counties by Membership</h2>
        <div className="space-y-2">
          {topCounties.map(c => (
            <div key={c.id} className="grid grid-cols-[1fr_80px_80px_100px_32px] items-center gap-4">
              <Link href={`/county/${c.slug}/dashboard`} className="text-sm font-medium text-foreground hover:text-primary truncate">
                {c.name}
              </Link>
              <span className="text-xs text-muted-foreground text-right">{c.totalMembers} members</span>
              <span className="text-xs text-muted-foreground text-right">{c.testTaken} tested</span>
              <ProgressBar completed={c.avgProgress} total={100} />
              <Link href={`/county/${c.slug}/dashboard`} className="text-muted-foreground hover:text-primary">
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Members Tab ───────────────────────────────────────────────────────────────

function MembersTab({ memberRows }: { memberRows: MemberRow[] }) {
  const [search, setSearch] = useState('')
  const [countyFilter, setCountyFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const counties = useMemo(() => {
    const seen = new Set<string>()
    const list: { id: string; name: string }[] = []
    for (const m of memberRows) {
      if (m.countyId && !seen.has(m.countyId) && m.countyName !== 'No county') {
        seen.add(m.countyId)
        list.push({ id: m.countyId, name: m.countyName })
      }
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [memberRows])

  const filtered = useMemo(() => {
    let list = memberRows.filter(m => {
      const q = search.toLowerCase()
      if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false
      if (countyFilter !== 'all' && m.countyId !== countyFilter) return false
      if (typeFilter !== 'all') {
        if (typeFilter === 'none') return !m.personality
        return m.personality?.dominantType === typeFilter
      }
      return true
    })
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'county') return a.countyName.localeCompare(b.countyName)
      if (sortBy === 'progress') return b.lessonsCompleted - a.lessonsCompleted
      if (sortBy === 'joined') return (b.joinedAt ?? '').localeCompare(a.joinedAt ?? '')
      return 0
    })
  }, [memberRows, search, countyFilter, typeFilter, sortBy])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={countyFilter}
          onChange={e => setCountyFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">All counties</option>
          {counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">All types</option>
          <option value="S">Sanguine</option>
          <option value="C">Choleric</option>
          <option value="M">Melancholy</option>
          <option value="P">Phlegmatic</option>
          <option value="none">No test</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="name">Sort: Name</option>
          <option value="county">Sort: County</option>
          <option value="progress">Sort: Progress</option>
          <option value="joined">Sort: Joined</option>
        </select>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} of {memberRows.length} members</p>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_80px_120px_80px] bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Name</span>
          <span>County</span>
          <span>Type</span>
          <span>Progress</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">No members match your filters.</div>
          ) : filtered.map(m => (
            <div key={m.id} className="grid grid-cols-[1fr_1fr_80px_120px_80px] items-center px-4 py-3 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar name={m.name} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
              </div>
              <div className="min-w-0">
                {m.countySlug ? (
                  <Link href={`/county/${m.countySlug}/dashboard`} className="text-xs text-primary hover:underline truncate block">
                    {m.countyName}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">{m.countyName}</span>
                )}
                {m.role === 'countyOrganizer' && (
                  <span className="text-[10px] text-primary font-medium">Organizer</span>
                )}
              </div>
              <div>
                {m.personality ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${PERSONALITY_TYPE[m.personality.dominantType]?.headerBg}`}>
                    {PERSONALITY_TYPE[m.personality.dominantType]?.label ?? m.personality.dominantType}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
              <ProgressBar completed={m.lessonsCompleted} total={m.totalLessons} />
              <div>
                {m.approved
                  ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                  : <XCircle className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── County Health Tab ─────────────────────────────────────────────────────────

function CountyHealthTab({ countyHealth }: { countyHealth: CountyHealth[] }) {
  const [showEmpty, setShowEmpty] = useState(false)
  const list = showEmpty ? countyHealth : countyHealth.filter(c => c.totalMembers > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{list.length} counties shown</p>
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={showEmpty} onChange={e => setShowEmpty(e.target.checked)} />
          Show counties with no members
        </label>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_60px_60px_80px_70px_80px_36px] bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide gap-2">
          <span>County</span>
          <span className="text-right">Members</span>
          <span className="text-right">Pending</span>
          <span>Organizer</span>
          <span className="text-right">Tested</span>
          <span>Avg Progress</span>
          <span></span>
        </div>
        <div className="divide-y divide-border">
          {list.map(c => (
            <div key={c.id} className="grid grid-cols-[1fr_60px_60px_80px_70px_80px_36px] items-center px-4 py-3 hover:bg-muted/30 transition-colors gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                {c.activeFocusGroups > 0 && (
                  <p className="text-[10px] text-muted-foreground">{c.activeFocusGroups} focus group{c.activeFocusGroups !== 1 ? 's' : ''}</p>
                )}
              </div>
              <span className="text-sm text-right text-foreground">{c.totalMembers}</span>
              <span className={`text-sm text-right ${c.pending > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {c.pending > 0 ? c.pending : '—'}
              </span>
              <div>
                {c.hasOrganizer
                  ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                  : c.totalMembers > 0
                    ? <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    : <span className="text-xs text-muted-foreground">—</span>}
              </div>
              <span className="text-sm text-right text-muted-foreground">
                {c.totalMembers > 0 ? `${c.testTaken}/${c.totalMembers}` : '—'}
              </span>
              <ProgressBar completed={c.avgProgress} total={100} />
              <Link href={`/county/${c.slug}/dashboard`} className="text-muted-foreground hover:text-primary transition-colors">
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Personality Tab ───────────────────────────────────────────────────────────

function PersonalityTab({ memberRows }: { memberRows: MemberRow[] }) {
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = useMemo(() =>
    memberRows.filter(m => {
      if (!m.personality) return typeFilter === 'none' || typeFilter === 'all'
      if (typeFilter === 'all') return true
      if (typeFilter === 'none') return false
      return m.personality.dominantType === typeFilter
    }).sort((a, b) => {
      if (!a.personality && !b.personality) return a.name.localeCompare(b.name)
      if (!a.personality) return 1
      if (!b.personality) return -1
      return a.personality.dominantType.localeCompare(b.personality.dominantType) || a.name.localeCompare(b.name)
    }),
    [memberRows, typeFilter]
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all', 'S', 'C', 'M', 'P', 'none'].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              typeFilter === t
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            {t === 'all' ? 'All' : t === 'none' ? 'No test' : PERSONALITY_TYPE[t].label}
            {' '}({t === 'all'
              ? memberRows.length
              : t === 'none'
                ? memberRows.filter(m => !m.personality).length
                : memberRows.filter(m => m.personality?.dominantType === t).length})
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_60px_60px_60px_60px] bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide gap-2">
          <span>Member</span>
          <span>Type</span>
          <span className="text-right">San</span>
          <span className="text-right">Cho</span>
          <span className="text-right">Mel</span>
          <span className="text-right">Phg</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map(m => (
            <div key={m.id} className="grid grid-cols-[1fr_100px_60px_60px_60px_60px] items-center px-4 py-3 hover:bg-muted/30 gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                <p className="text-xs text-muted-foreground truncate">{m.countyName}</p>
              </div>
              <div>
                {m.personality ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${PERSONALITY_TYPE[m.personality.dominantType]?.headerBg}`}>
                    {PERSONALITY_TYPE[m.personality.dominantType]?.label}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Not taken</span>
                )}
              </div>
              <span className="text-sm text-right text-muted-foreground">{m.personality?.sanguine ?? '—'}</span>
              <span className="text-sm text-right text-muted-foreground">{m.personality?.choleric ?? '—'}</span>
              <span className="text-sm text-right text-muted-foreground">{m.personality?.melancholy ?? '—'}</span>
              <span className="text-sm text-right text-muted-foreground">{m.personality?.phlegmatic ?? '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Approval Queue Tab ────────────────────────────────────────────────────────

function ApprovalQueueTab({ memberRows }: { memberRows: MemberRow[] }) {
  const pending = memberRows.filter(m => !m.approved).sort((a, b) =>
    (a.joinedAt ?? '').localeCompare(b.joinedAt ?? '')
  )

  if (pending.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500 opacity-60" />
        <p className="text-sm text-muted-foreground">No pending approvals — you're all caught up.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {pending.length} member{pending.length !== 1 ? 's' : ''} waiting for approval.
        Approve in the{' '}
        <a href="/admin/collections/users" target="_blank" className="text-primary hover:underline">
          Payload admin panel
        </a>.
      </p>
      <div className="space-y-2">
        {pending.map(m => (
          <div key={m.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={m.name} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                <p className="text-xs text-muted-foreground truncate">{m.email}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-muted-foreground">{m.countyName}</p>
              <p className="text-xs text-muted-foreground">
                {m.joinedAt
                  ? new Date(m.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </p>
            </div>
            <a
              href={`/admin/collections/users/${m.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors flex-shrink-0"
            >
              Review →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function SiteAdminDashboard({ stats, memberRows, countyHealth }: Props) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex border-b border-border gap-1 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.label}
            {t.id === 'pending' && stats.pending > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {stats.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview'    && <OverviewTab stats={stats} memberRows={memberRows} countyHealth={countyHealth} />}
      {activeTab === 'members'     && <MembersTab memberRows={memberRows} />}
      {activeTab === 'counties'    && <CountyHealthTab countyHealth={countyHealth} />}
      {activeTab === 'personality' && <PersonalityTab memberRows={memberRows} />}
      {activeTab === 'pending'     && <ApprovalQueueTab memberRows={memberRows} />}
    </div>
  )
}
