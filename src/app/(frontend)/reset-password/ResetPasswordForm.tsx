'use client'
// src/app/(frontend)/reset-password/ResetPasswordForm.tsx

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { KeyRound, Check } from 'lucide-react'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const required = searchParams.get('required') === '1'

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const submit = async () => {
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    try {
      // Get current user
      const meRes = await fetch('/api/users/me', { credentials: 'include' })
      const meData = await meRes.json()
      const userId = meData?.user?.id
      if (!userId) {
        setError('You must be logged in to reset your password.')
        return
      }

      // Update password and clear mustResetPassword flag
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          password,
          mustResetPassword: false,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message ?? 'Failed to update password.')
        return
      }

      setDone(true)
      setTimeout(() => router.push('/member'), 2000)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <p className="font-semibold text-foreground">Password updated!</p>
        <p className="text-sm text-muted-foreground">Redirecting you to your member area…</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 space-y-5">
      {required && (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 flex items-start gap-3">
          <KeyRound className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Your account was migrated from our previous site. Please set a new password to continue.
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Repeat your new password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <button
        onClick={submit}
        disabled={saving}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Set password & continue'}
      </button>
    </div>
  )
}
