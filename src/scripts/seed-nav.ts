// src/scripts/seed-nav.ts
// Seeds the MainNav global with the full FlaRepublic navigation structure.
//
// Run with:
//   npm run seed:nav
//
// Safe to re-run — overwrites the existing nav with the canonical structure.

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const NAV_GROUPS = [
  {
    label: 'Learn',
    type: 'dropdown',
    requiresAuth: false,
    requiresApproval: false,
    items: [
      { label: "Newby's Corner",    url: '/learn/newbys-corner',      requiresAuth: false, requiresApproval: false },
      { label: 'Fast Track',        url: '/learn/fast-track',          requiresAuth: false, requiresApproval: false },
      { label: 'County Assemblies', url: '/community/county-assemblies', requiresAuth: false, requiresApproval: false },
      { label: 'Courses',           url: '/learn/courses',             requiresAuth: true,  requiresApproval: true  },
    ],
  },
  {
    label: 'Procedures',
    type: 'dropdown',
    requiresAuth: false,
    requiresApproval: false,
    items: [
      { label: 'Sample Assembly Procedures', url: '/procedures/sample-procedures',   requiresAuth: false, requiresApproval: false },
      { label: 'Assembly Procedures',       url: '/procedures/assembly',             requiresAuth: false, requiresApproval: false },
      { label: 'Reigning In Corporations',  url: '/procedures/reigning-in-corps',    requiresAuth: false, requiresApproval: false },
      { label: 'Electronic Meetings',       url: '/procedures/electronic-meetings',  requiresAuth: false, requiresApproval: false },
    ],
  },
  {
    label: 'Community',
    type: 'dropdown',
    requiresAuth: false,
    requiresApproval: false,
    items: [
      { label: 'County Assemblies', url: '/community/county-assemblies', requiresAuth: false, requiresApproval: false },
      { label: 'EscaRosa Chapter', url: '/community/escarosa', requiresAuth: false, requiresApproval: false },
      { label: 'Forum',            url: '/forum',              requiresAuth: true,  requiresApproval: true  },
    ],
  },
  {
    label: 'Resources',
    type: 'dropdown',
    requiresAuth: false,
    requiresApproval: false,
    items: [
      { label: 'Documents',           url: '/resources/documents',           requiresAuth: false, requiresApproval: false },
      { label: 'Personality Profile', url: '/resources/personality-profile', requiresAuth: false, requiresApproval: false },
      { label: 'Contact Directory', url: '/contacts',            requiresAuth: false, requiresApproval: false },
    ],
  },
  {
    label: 'Register',
    type: 'link',
    url: '/register',
    requiresAuth: false,
    requiresApproval: false,
  },
  {
    label: 'Member Login',
    type: 'link',
    url: '/login',
    requiresAuth: false,
    requiresApproval: false,
  },
]

async function main() {
  console.log('🔌 Connecting to Payload...')
  
  const payload = await getPayload({ config: configPromise })
  
  console.log('✓ Connected')
  console.log('\n🧭 Seeding MainNav global...')

  try {
    const result = await payload.updateGlobal({
      slug: 'main-nav',
      data: { groups: NAV_GROUPS } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    })
    console.log('  ✓ MainNav updated, groups saved:', result?.groups?.length ?? 0)
  } catch (err) {
    console.error('  ✗ updateGlobal failed:', err)
    process.exit(1)
  }

  console.log('\n✅ Nav seed complete.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('Nav seed failed:', err)
  process.exit(1)
})
