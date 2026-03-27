// src/app/(frontend)/logout/page.tsx
// Redirects to the logout API route which handles cookie deletion.

import { redirect } from 'next/navigation'

export default function LogoutPage() {
  redirect('/api/logout')
}
