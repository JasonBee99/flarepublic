// src/app/(frontend)/logout/page.tsx
// Logout via a Server Action — Next.js only allows cookie mutation in
// Server Actions or Route Handlers, not directly in page components.

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

async function logoutAction() {
  'use server'
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
    cookieStore.delete('payload-token')
  }

  redirect('/')
}

export default async function LogoutPage() {
  // Trigger the server action immediately on page load
  await logoutAction()
}
