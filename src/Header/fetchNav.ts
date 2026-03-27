// src/Header/fetchNav.ts
// Fetches the main-nav global directly via Payload's local API.
// Using the local API (not HTTP fetch) means this works at build time,
// during SSR, and in production without needing the server to be running.

import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { MainNavGlobal } from '@/globals/types'

export const fetchMainNav = cache(async (): Promise<MainNavGlobal | null> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await payload.findGlobal({
      slug: 'main-nav',
      depth: 1,
    })
    return data as unknown as MainNavGlobal
  } catch (err) {
    console.error('[fetchMainNav] Error:', err)
    return null
  }
})
