// src/scripts/clean-contacts.ts
// Removes all contacts except Jim Costa from the contacts collection.
// Run with: npm run clean:contacts

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function main() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'contacts',
    limit: 500,
    overrideAccess: true,
  })

  console.log(`Found ${result.docs.length} contacts`)

  for (const contact of result.docs) {
    const name = (contact as any).name ?? ''
    const isJimCosta = name.toLowerCase().includes('jim') && name.toLowerCase().includes('costa')

    if (isJimCosta) {
      console.log(`  ✓ Keeping: ${name}`)
      continue
    }

    await payload.delete({
      collection: 'contacts',
      id: contact.id as string,
      overrideAccess: true,
    })
    console.log(`  ✗ Deleted: ${name}`)
  }

  console.log('\nDone.')
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
