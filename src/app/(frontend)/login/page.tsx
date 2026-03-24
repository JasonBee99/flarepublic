// src/app/(frontend)/login/page.tsx
// Login page — authenticates via Payload REST API, sets cookie, redirects.

import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | FlaRepublic',
  description: 'Sign in to your FlaRepublic member account.',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your FlaRepublic account.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
