// src/Header/Component.tsx
// Server Component — fetches nav data and current user, then renders
// the client Nav component. This keeps data-fetching on the server
// while dropdowns/interactions stay client-side.

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { fetchMainNav } from './fetchNav'
import { Nav } from './Nav/index'

// ---------------------------------------------------------------------------
// Fetch current Payload user (server-side, using session cookie)
// ---------------------------------------------------------------------------

async function fetchCurrentUser() {
  try {
    const cookieStore = await cookies()
    const payloadToken = cookieStore.get('payload-token')?.value

    if (!payloadToken) return null

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Authorization: `JWT ${payloadToken}` },
      next: { revalidate: 0 }, // always fresh — auth must not be cached
    })

    if (!res.ok) return null

    const data = await res.json()
    return data?.user ?? null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Header Server Component
// ---------------------------------------------------------------------------

export async function Header() {
  const [navData, user] = await Promise.all([fetchMainNav(), fetchCurrentUser()])

  const groups = navData?.groups ?? []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo / Site name */}
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <Image
            src="/logo.png"
            alt="FlaRepublic — Florida Free State Restored Republic"
            width={260}
            height={60}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center" aria-label="Main navigation">
          <Nav groups={groups} user={user} />
        </nav>

        {/* Mobile: hamburger placeholder — wire up in a future session */}
        <button
          className="flex md:hidden items-center rounded-md p-2 text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
