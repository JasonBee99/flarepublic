'use client'
// src/app/(frontend)/county/[slug]/focus-groups/[id]/FocusGroupDetail.tsx
// Interactive focus group detail — join, join waitlist, volunteer as expert, leave.

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Clock, CheckCircle2, Star, AlertTriangle } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const STAGE_LABEL: Record<string, string> = {
  forming:   'Forming',
  active:    'Active',
  completed: 'Completed',
  'on-hold': 'On Hold',
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface GroupMember {
  id: string
  name: string
  status: string
  role: string
  joinedAt: string | null
}

interface Props {
  group: {
    id: string
    title: string
    description: string | null
    stage: string
    maxMembers: number
    isActive: boolean
    organizer: { name: string | null } | null
  }
  countySlug: string
  countyName: string
  currentUserId: string
  currentUserRole: string
  myMembership: { id: string; status: string; role: string } | null
  activeCount: number
  waitlistCount: number
  expertCount: number
  isFull: boolean
  isCholeric: boolean
  isOrganizer: boolean
  displayMembers: GroupMember[]
  expertMembers: GroupMember[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FocusGroupDetail({
  group, countySlug, countyName, currentUserId, currentUserRole,
  myMembership, activeCount, waitlistCount, expertCount,
  isFull, isCholeric, isOrganizer, displayMembers, expertMembers,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pct = Math.round((activeCount / group.maxMembers) * 100)

  const doJoin = async (status: 'active' | 'waitlist' | 'expert-volunteer') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/focus-group-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          focusGroup: group.id,
          user: currentUserId,
          role: status === 'expert-volunteer' ? 'expert' : 'member',
          status,
          joinedAt: new Date().toISOString(),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message ?? 'Failed to join. Please try again.')
        return
      }
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const doLeave = async () => {
    if (!myMembership) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/focus-group-members/${myMembership.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        setError('Failed to leave group. Please try again.')
        return
      }
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
            {STAGE_LABEL[group.stage] ?? group.stage}
          </span>
          {myMembership && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {myMembership.status === 'active' ? 'Active member'
                : myMembership.status === 'waitlist' ? 'On waitlist'
                : 'Expert volunteer'}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{group.title}</h1>
        {group.organizer?.name && (
          <p className="mt-1 text-sm text-muted-foreground">Organized by {group.organizer.name}</p>
        )}
        {group.description && (
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">{group.description}</p>
        )}
      </div>

      {/* Capacity */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">Group Capacity</p>
          <span className="text-sm text-muted-foreground">{activeCount} / {group.maxMembers} active</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all ${isFull ? 'bg-muted-foreground' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-lg font-bold text-foreground">{activeCount}</p>
            <p>Active</p>
          </div>
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-lg font-bold text-foreground">{waitlistCount}</p>
            <p>Waitlist</p>
          </div>
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-lg font-bold text-foreground">{expertCount}</p>
            <p>Experts</p>
          </div>
        </div>
      </div>

      {/* Choleric notice */}
      {isCholeric && !myMembership && (
        <div className="rounded-xl border border-border bg-muted/40 px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Your personality profile shows a Choleric dominant type. Focus group placement for Cholerics
            is handled manually by your County Organizer to ensure healthy group dynamics.
            You may join the waitlist and your organizer will review your placement.
          </p>
        </div>
      )}

      {/* Join actions */}
      {!myMembership && group.stage !== 'completed' && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <p className="text-sm font-semibold text-foreground mb-1">Join this group</p>

          {error && (
            <p className="text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {/* Join active or waitlist */}
            <button
              onClick={() => doJoin(isFull ? 'waitlist' : 'active')}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
            >
              {isFull
                ? <><Clock className="h-4 w-4" /> Join Waitlist</>
                : <><Users className="h-4 w-4" /> Join Group</>}
            </button>

            {/* Expert volunteer — always available */}
            <button
              onClick={() => doJoin('expert-volunteer')}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition disabled:opacity-50"
            >
              <Star className="h-4 w-4" /> Volunteer as Expert
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            {isFull
              ? `This group is full (${group.maxMembers} members). You'll be added to the waitlist and notified if a spot opens.`
              : `Active members participate directly. Expert volunteers provide knowledge support as needed.`}
          </p>
        </div>
      )}

      {/* Leave button */}
      {myMembership && (
        <div className="flex items-center gap-4">
          <button
            onClick={doLeave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50"
          >
            Leave group
          </button>
          {error && <p className="text-sm text-destructive-foreground">{error}</p>}
        </div>
      )}

      {/* Member roster */}
      {displayMembers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Members ({activeCount} active{waitlistCount > 0 ? `, ${waitlistCount} waitlisted` : ''})
          </h2>
          <div className="space-y-2">
            {displayMembers.map(m => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
                  {m.name.split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase().slice(0, 2)}
                </div>
                <p className="text-sm font-medium text-foreground flex-1">{m.name}</p>
                <div className="flex items-center gap-2">
                  {m.status === 'waitlist' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      Waitlist
                    </span>
                  )}
                  {m.role === 'organizer' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Organizer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expert volunteers */}
      {expertMembers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="h-4 w-4" /> Expert Volunteers ({expertCount})
          </h2>
          <div className="space-y-2">
            {expertMembers.map(m => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
                  {m.name.split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase().slice(0, 2)}
                </div>
                <p className="text-sm font-medium text-foreground">{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
