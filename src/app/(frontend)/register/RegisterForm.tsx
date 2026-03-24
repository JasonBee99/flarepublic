'use client'
// src/app/(frontend)/register/RegisterForm.tsx
// Client-side form — calls Payload's /api/users endpoint directly.

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface County {
  id: string
  name: string
}

export function RegisterForm() {
  const router = useRouter()
  const [counties, setCounties] = useState<County[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load counties for the select dropdown
  useEffect(() => {
    fetch('/api/counties?limit=100&sort=displayOrder')
      .then((r) => r.json())
      .then((data) => setCounties(data?.docs ?? []))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const body: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      password: data.password,
    }
    if (data.county) body.county = data.county

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json()

      if (!res.ok) {
        const msg =
          json?.errors?.[0]?.message ??
          json?.message ??
          'Registration failed. Please try again.'
        setError(msg)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login?registered=1'), 2500)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-6 text-center">
        <svg
          className="mx-auto mb-3 h-10 w-10 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-lg font-semibold">Account created!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account is pending admin approval. You&#x2019;ll be able to access member areas once
          approved. Redirecting to login&hellip;
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-border bg-card p-8 shadow-sm"
    >
      {/* Full name */}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Full name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Jane Smith"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email address <span className="text-destructive">*</span>
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

      {/* County */}
      {counties.length > 0 && (
        <div>
          <label htmlFor="county" className="mb-1.5 block text-sm font-medium">
            County <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <select
            id="county"
            name="county"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">— Select your county —</option>
            {counties.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password <span className="text-destructive">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Min. 8 characters"
        />
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
          Confirm password <span className="text-destructive">*</span>
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
