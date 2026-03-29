// src/scripts/approve-all-users.ts
// One-time script: approves all existing users.
// Run with: npm run approve:all

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
    if (user.approved) {
      console.log(`  ✓ Already approved: ${user.email}`)
      continue
    }
    await payload.update({
      collection: 'users',
      id: user.id as string,
      data: { approved: true, approvedAt: new Date().toISOString() } as any,
      overrideAccess: true,
    })
    console.log(`  ✓ Approved: ${user.email}`)
  }

  console.log('\nDone.')
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
