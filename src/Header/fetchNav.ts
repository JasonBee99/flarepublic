// src/Header/fetchNav.ts
// Fetches the main-nav global from Payload's REST API.
// Uses Next.js `cache` so the fetch is deduplicated per request
// and revalidates every 60 seconds (ISR-friendly).

import { cache } from 'react'
import type { MainNavGlobal } from '@/globals/types'

export const fetchMainNav = cache(async (): Promise<MainNavGlobal | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/globals/main-nav?depth=1`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.warn('[fetchMainNav] Non-OK response:', res.status)
      return null
    }

    const data = await res.json()
    return data as MainNavGlobal
  } catch (err) {
    console.error('[fetchMainNav] Fetch error:', err)
    return null
  }
})
