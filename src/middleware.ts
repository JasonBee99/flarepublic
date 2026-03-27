// src/middleware.ts
// Protects routes that require authentication and/or approval.
// /forum      — requires login AND approved === true
// /member     — requires login
// /county     — requires login + approved + matching county (or isAdmin)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/forum/:path*', '/member/:path*', '/county/:path*'],
}

async function getUser(token: string, baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.user ?? null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  const { pathname } = request.nextUrl

  // Not logged in — send to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

  // /forum — login + approved
  if (pathname.startsWith('/forum')) {
    const user = await getUser(token, baseUrl)
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (!user.approved) {
      return NextResponse.redirect(new URL('/member', request.url))
    }
  }

  // /county/[slug] — login + approved + county match (or isAdmin)
  if (pathname.startsWith('/county/')) {
    const user = await getUser(token, baseUrl)
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (!user.approved) {
      return NextResponse.redirect(new URL('/member', request.url))
    }

    // Site-wide admins bypass county check
    if (user.isAdmin) return NextResponse.next()

    // Extract requested county slug from path: /county/[slug]/...
    const segments = pathname.split('/').filter(Boolean)
    const requestedSlug = segments[1] // county slug

    if (requestedSlug) {
      const userCounty = user.county
      const userCountyId = typeof userCounty === 'object' ? userCounty?.id : userCounty

      if (userCountyId) {
        // Fetch the user's county to get its slug
        try {
          const countyRes = await fetch(`${baseUrl}/api/counties/${userCountyId}`, {
            headers: { Authorization: `JWT ${token}` },
          })
          if (countyRes.ok) {
            const countyData = await countyRes.json()
            const userCountySlug = countyData?.slug

            if (userCountySlug && userCountySlug !== requestedSlug) {
              // Wrong county — redirect to their own county page
              const redirectUrl = new URL(`/county/${userCountySlug}`, request.url)
              redirectUrl.searchParams.set('wrong_county', '1')
              return NextResponse.redirect(redirectUrl)
            }
          }
        } catch {
          // On error, let the page handle it
        }
      } else {
        // User has no county assigned
        return NextResponse.redirect(new URL('/member?no_county=1', request.url))
      }
    }
  }

  return NextResponse.next()
}
