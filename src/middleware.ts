// src/middleware.ts
// Protects routes that require authentication and/or approval.
// Runs on the edge — reads the payload-token cookie, verifies via /api/users/me.
//
// Protected routes:
//   /forum      — requires login AND approved === true
//   /member     — requires login (approval gate handled in the page itself)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/forum/:path*', '/member/:path*'],
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  const { pathname } = request.nextUrl

  // Not logged in — send to login with a redirect param
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For /forum — also check approved status
  if (pathname.startsWith('/forum')) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
      const res = await fetch(`${baseUrl}/api/users/me`, {
        headers: { Authorization: `JWT ${token}` },
        // No cache — must be fresh for auth checks
      })

      if (!res.ok) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      const data = await res.json()
      const user = data?.user

      if (!user?.approved) {
        // Logged in but not yet approved — show member page with pending message
        return NextResponse.redirect(new URL('/member', request.url))
      }
    } catch {
      // On network error fail open to avoid locking people out unexpectedly;
      // the forum page itself also checks approval server-side.
    }
  }

  return NextResponse.next()
}
