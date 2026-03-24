// src/app/(frontend)/logout/page.tsx
// Server component that calls Payload's /api/users/logout, clears the cookie,
// then redirects to home.

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LogoutPage() {
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
      // best-effort — clear cookie regardless
    }

    // Delete the cookie server-side
    cookieStore.delete('payload-token')
  }

  redirect('/')
}
