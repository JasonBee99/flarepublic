// src/scripts/clean-imported-docs.ts
// Deletes all documents imported from flarepublic.us/docs (identified by sourceUrl),
// then cleans up orphaned categories and the Web Article file type.
// Run with: npm run clean:docs

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function main() {
  const payload = await getPayload({ config: configPromise })
  console.log('Connected\n')

  // Delete ALL docs with a flarepublic.us/docs sourceUrl (catches both imports)
  const result = await payload.find({
    collection: 'documents',
    where: { sourceUrl: { contains: 'flarepublic.us/docs' } },
    limit: 200,
    overrideAccess: true,
  })

  // Also catch docs with empty sourceUrl but externalUrl pointing to flarepublic.us/docs
  const result2 = await payload.find({
    collection: 'documents',
    where: { externalUrl: { contains: 'flarepublic.us/docs' } },
    limit: 200,
    overrideAccess: true,
  })

  const allDocs = [...result.docs, ...result2.docs]
  const seen = new Set<string>()
  const toDelete = allDocs.filter(d => { if (seen.has(d.id as string)) return false; seen.add(d.id as string); return true })

  console.log(`Found ${toDelete.length} docs to delete`)
  for (const doc of toDelete) {
    await payload.delete({ collection: 'documents', id: doc.id as string, overrideAccess: true })
    console.log(`  ✗ ${doc.title}`)
  }

  // Clean up Web Article file type
  const ft = await payload.find({ collection: 'file-types', where: { value: { equals: 'web-article' } }, limit: 1, overrideAccess: true })
  if (ft.docs.length > 0) {
    await payload.delete({ collection: 'file-types', id: ft.docs[0].id as string, overrideAccess: true })
    console.log('\n✗ deleted Web Article file type')
  }

  // Clean up imported categories that are now empty
  const importedCats = [
    'Core Documentation', 'Fast Track to Assemblies', "Why Break From Nat'l to Use the Fast Track?",
    'Training for Assembly and Congress', 'Interim Holding Time Period', 'Creating the Congresses',
    'Financing and Investment Opportunities', 'Training Legal Officers', 'Other',
  ]
  for (const name of importedCats) {
    const cats = await payload.find({ collection: 'document-categories', where: { title: { equals: name } }, limit: 1, overrideAccess: true })
    if (cats.docs.length === 0) continue
    const cat = cats.docs[0]
    const docsInCat = await payload.find({ collection: 'documents', where: { category: { equals: cat.id } }, limit: 1, overrideAccess: true })
    if (docsInCat.docs.length === 0) {
      await payload.delete({ collection: 'document-categories', id: cat.id as string, overrideAccess: true })
      console.log(`✗ deleted empty category: ${name}`)
    }
  }

  console.log('\n✅ Done. Run npm run import:docs-xml to re-import.')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
