// src/scripts/seed-forum.ts
// Seeds ForumCategories — one per active county + a Statewide board.
//
// Run with:
//   npm run seed:forum
//
// Safe to re-run — skips categories whose slug already exists.
// The manual "Escambia County Forum" you created in admin is fine —
// it will be skipped if the slug matches.

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

type AnyPayload = Awaited<ReturnType<typeof getPayload>>
type IdMap = Record<string, string>

// ── Forum category definitions ────────────────────────────────────────────────
// Each entry maps to a county name (must match what was seeded in Phase 5).
// countyName: null = statewide (no county relationship).

const FORUM_CATEGORIES = [
  // County-specific boards
  { title: 'Escambia County Forum',   slug: 'escambia',   countyName: 'Escambia County',   description: 'Discussion for Escambia County members.',   displayOrder: 1 },
  { title: 'Santa Rosa County Forum', slug: 'santa-rosa', countyName: 'Santa Rosa County', description: 'Discussion for Santa Rosa County members.',   displayOrder: 2 },

  // Statewide / general boards
  { title: 'Statewide Discussion',    slug: 'statewide',  countyName: 'Statewide',         description: 'Topics relevant to all Florida counties.',   displayOrder: 50 },
  { title: 'General',                 slug: 'general',    countyName: null,                description: 'Open discussion for all approved members.',  displayOrder: 51 },
  { title: 'Announcements',           slug: 'announcements', countyName: null,             description: 'Official announcements from FlaRepublic.',   displayOrder: 52 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getCountyMap(payload: AnyPayload): Promise<IdMap> {
  const result = await payload.find({
    collection: 'counties',
    limit: 100,
    overrideAccess: true,
  })
  const map: IdMap = {}
  for (const county of result.docs) {
    map[county.name as string] = county.id as string
  }
  return map
}

async function seedForumCategories(payload: AnyPayload, countyMap: IdMap) {
  for (const cat of FORUM_CATEGORIES) {
    // Skip if slug already exists
    const existing = await payload.find({
      collection: 'forum-categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      console.log(`  ✓ Exists:  ${cat.title}`)
      continue
    }

    const data: Record<string, unknown> = {
      title: cat.title,
      slug: cat.slug,
      description: cat.description,
      displayOrder: cat.displayOrder,
      isActive: true,
    }

    if (cat.countyName) {
      const countyId = countyMap[cat.countyName]
      if (countyId) {
        data.county = countyId
      } else {
        console.warn(`  ⚠ County not found for "${cat.title}": ${cat.countyName} — creating without county link`)
      }
    }

    await payload.create({ collection: 'forum-categories', data })
    console.log(`  + Created: ${cat.title}`)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config: configPromise })

  console.log('\n🗂  Loading counties...')
  const countyMap = await getCountyMap(payload)
  console.log(`   Found ${Object.keys(countyMap).length} counties: ${Object.keys(countyMap).join(', ')}`)

  console.log('\n💬 Seeding Forum Categories...')
  await seedForumCategories(payload, countyMap)

  console.log('\n✅ Forum seed complete.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
