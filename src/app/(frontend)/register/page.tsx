// src/app/(frontend)/register/page.tsx
// Public registration form — submits to Payload REST API, then redirects to login.

import type { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Register | FlaRepublic',
  description: 'Create your FlaRepublic member account.',
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join FlaRepublic. After registering, an admin will approve your account before you can
            access member-only areas.
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}
