// src/app/(frontend)/reset-password/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetPasswordForm } from './ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Set Your Password | FlaRepublic',
}

export default function ResetPasswordPage() {
  return (
    <main className="container mx-auto max-w-md px-4 py-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Set Your Password</h1>
        <p className="mt-2 text-muted-foreground">
          Please choose a new password for your account.
        </p>
      </div>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}
