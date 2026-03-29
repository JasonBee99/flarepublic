// src/scripts/migrate-roles.ts
// One-time migration: sets role field on existing users.
// - jason@javawav.com → siteAdmin
// - everyone else → member (default)
//
// Run with: npm run migrate:roles

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function main() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'users',
    limit: 500,
    overrideAccess: true,
  })

  console.log(`Found ${result.docs.length} users`)

  for (const user of result.docs) {
    const email = user.email
    const currentRole = (user as any).role

    // Determine correct role
    let role = 'member'
    if (email === 'jason@javawav.com') role = 'siteAdmin'

    if (currentRole === role) {
      console.log(`  ✓ Already set: ${email} → ${role}`)
      continue
    }

    await payload.update({
      collection: 'users',
      id: user.id as string,
      data: { role } as any,
      overrideAccess: true,
    })
    console.log(`  ✓ Updated: ${email} → ${role}`)
  }

  console.log('\nMigration complete.')
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
