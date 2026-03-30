// src/scripts/clean-imported-docs.ts
// Deletes all documents that were imported from www.flarepublic.us/docs/
// Run with: npm run clean:docs
// Then re-run: npm run import:docs

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function main() {
  const payload = await getPayload({ config: configPromise })
  console.log('Connected to Payload\n')

  const result = await payload.find({
    collection: 'documents',
    where: { sourceUrl: { contains: 'flarepublic.us/docs' } },
    limit: 200,
    overrideAccess: true,
  })

  console.log(`Found ${result.docs.length} imported docs to delete`)

  for (const doc of result.docs) {
    await payload.delete({
      collection: 'documents',
      id: doc.id as string,
      overrideAccess: true,
    })
    console.log(`  ✗ deleted: ${doc.title}`)
  }

  // Also clean up the "Web Article" file type if it exists
  const ft = await payload.find({
    collection: 'file-types',
    where: { value: { equals: 'web-article' } },
    limit: 1,
    overrideAccess: true,
  })
  if (ft.docs.length > 0) {
    await payload.delete({
      collection: 'file-types',
      id: ft.docs[0].id as string,
      overrideAccess: true,
    })
    console.log('\n  ✗ deleted "Web Article" file type')
  }

  // Clean up imported doc categories that have no remaining docs
  const cats = await payload.find({
    collection: 'document-categories',
    limit: 50,
    overrideAccess: true,
  })

  const importedCatNames = [
    'Core Documentation',
    'Fast Track to Assemblies',
    "Why Break From Nat'l to Use the Fast Track?",
    'Training for Assembly and Congress',
    'Interim Holding Time Period',
    'Creating the Congresses',
    'Financing and Investment Opportunities',
    'Training Legal Officers',
    'Other',
  ]

  for (const cat of cats.docs) {
    if (importedCatNames.includes((cat as any).title)) {
      // Check if any docs still use this category
      const docsInCat = await payload.find({
        collection: 'documents',
        where: { category: { equals: cat.id } },
        limit: 1,
        overrideAccess: true,
      })
      if (docsInCat.docs.length === 0) {
        await payload.delete({
          collection: 'document-categories',
          id: cat.id as string,
          overrideAccess: true,
        })
        console.log(`  ✗ deleted empty category: ${(cat as any).title}`)
      }
    }
  }

  console.log('\n✅ Done. Run npm run import:docs to re-import cleanly.')
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
