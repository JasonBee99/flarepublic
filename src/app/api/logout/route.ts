// src/app/api/logout/route.ts
// Route Handler — Next.js allows cookie deletion here.

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (token) {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    try {
      await fetch(`${baseUrl}/api/users/logout`, {
        method: 'POST',
        headers: { Authorization: `JWT ${token}` },
      })
    } catch {
      // best-effort
    }
    cookieStore.delete('payload-token')
  }

  return NextResponse.redirect(new URL('/', baseUrl()), { status: 302 })
}

function baseUrl() {
  return process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
}
