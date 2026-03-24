'use client'
// src/app/(frontend)/login/LoginForm.tsx

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Inner component that uses useSearchParams — must be wrapped in Suspense
function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const justRegistered = searchParams.get('registered') === '1'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json?.message ?? json?.errors?.[0]?.message ?? 'Invalid email or password.')
        return
      }

      const redirectTo = searchParams.get('redirect') ?? '/member'
      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-border bg-card p-8 shadow-sm"
    >
      {justRegistered && (
        <div className="rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-sm text-blue-700 dark:text-blue-300">
          Account created! An admin will approve it shortly. You can sign in now, but member
          areas require approval.
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? 'Signing in\u2026' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don&#x2019;t have an account?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}

// Public export wraps the inner component in Suspense (required by Next.js
// App Router whenever useSearchParams is used in a client component)
export function LoginForm() {
  return (
    <Suspense fallback={
      <div className="space-y-5 rounded-lg border border-border bg-card p-8 shadow-sm animate-pulse">
        <div className="h-10 rounded-md bg-muted" />
        <div className="h-10 rounded-md bg-muted" />
        <div className="h-10 rounded-md bg-muted" />
      </div>
    }>
      <LoginFormInner />
    </Suspense>
  )
}
