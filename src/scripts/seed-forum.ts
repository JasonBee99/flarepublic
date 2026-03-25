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
  // ── 67 Florida County Forums ──────────────────────────────────────────────
  { title: 'Alachua County Forum',      slug: 'alachua',       countyName: null, displayOrder: 1  },
  { title: 'Baker County Forum',        slug: 'baker',         countyName: null, displayOrder: 2  },
  { title: 'Bay County Forum',          slug: 'bay',           countyName: null, displayOrder: 3  },
  { title: 'Bradford County Forum',     slug: 'bradford',      countyName: null, displayOrder: 4  },
  { title: 'Brevard County Forum',      slug: 'brevard',       countyName: null, displayOrder: 5  },
  { title: 'Broward County Forum',      slug: 'broward',       countyName: null, displayOrder: 6  },
  { title: 'Calhoun County Forum',      slug: 'calhoun',       countyName: null, displayOrder: 7  },
  { title: 'Charlotte County Forum',    slug: 'charlotte',     countyName: null, displayOrder: 8  },
  { title: 'Citrus County Forum',       slug: 'citrus',        countyName: null, displayOrder: 9  },
  { title: 'Clay County Forum',         slug: 'clay',          countyName: null, displayOrder: 10 },
  { title: 'Collier County Forum',      slug: 'collier',       countyName: null, displayOrder: 11 },
  { title: 'Columbia County Forum',     slug: 'columbia',      countyName: null, displayOrder: 12 },
  { title: 'DeSoto County Forum',       slug: 'desoto',        countyName: null, displayOrder: 13 },
  { title: 'Dixie County Forum',        slug: 'dixie',         countyName: null, displayOrder: 14 },
  { title: 'Duval County Forum',        slug: 'duval',         countyName: null, displayOrder: 15 },
  { title: 'Escambia County Forum',     slug: 'escambia',      countyName: 'Escambia County',   displayOrder: 16 },
  { title: 'Flagler County Forum',      slug: 'flagler',       countyName: null, displayOrder: 17 },
  { title: 'Franklin County Forum',     slug: 'franklin',      countyName: null, displayOrder: 18 },
  { title: 'Gadsden County Forum',      slug: 'gadsden',       countyName: null, displayOrder: 19 },
  { title: 'Gilchrist County Forum',    slug: 'gilchrist',     countyName: null, displayOrder: 20 },
  { title: 'Glades County Forum',       slug: 'glades',        countyName: null, displayOrder: 21 },
  { title: 'Gulf County Forum',         slug: 'gulf',          countyName: null, displayOrder: 22 },
  { title: 'Hamilton County Forum',     slug: 'hamilton',      countyName: null, displayOrder: 23 },
  { title: 'Hardee County Forum',       slug: 'hardee',        countyName: null, displayOrder: 24 },
  { title: 'Hendry County Forum',       slug: 'hendry',        countyName: null, displayOrder: 25 },
  { title: 'Hernando County Forum',     slug: 'hernando',      countyName: null, displayOrder: 26 },
  { title: 'Highlands County Forum',    slug: 'highlands',     countyName: null, displayOrder: 27 },
  { title: 'Hillsborough County Forum', slug: 'hillsborough',  countyName: null, displayOrder: 28 },
  { title: 'Holmes County Forum',       slug: 'holmes',        countyName: null, displayOrder: 29 },
  { title: 'Indian River County Forum', slug: 'indian-river',  countyName: null, displayOrder: 30 },
  { title: 'Jackson County Forum',      slug: 'jackson',       countyName: null, displayOrder: 31 },
  { title: 'Jefferson County Forum',    slug: 'jefferson',     countyName: null, displayOrder: 32 },
  { title: 'Lafayette County Forum',    slug: 'lafayette',     countyName: null, displayOrder: 33 },
  { title: 'Lake County Forum',         slug: 'lake',          countyName: null, displayOrder: 34 },
  { title: 'Lee County Forum',          slug: 'lee',           countyName: null, displayOrder: 35 },
  { title: 'Leon County Forum',         slug: 'leon',          countyName: null, displayOrder: 36 },
  { title: 'Levy County Forum',         slug: 'levy',          countyName: null, displayOrder: 37 },
  { title: 'Liberty County Forum',      slug: 'liberty',       countyName: null, displayOrder: 38 },
  { title: 'Madison County Forum',      slug: 'madison',       countyName: null, displayOrder: 39 },
  { title: 'Manatee County Forum',      slug: 'manatee',       countyName: null, displayOrder: 40 },
  { title: 'Marion County Forum',       slug: 'marion',        countyName: null, displayOrder: 41 },
  { title: 'Martin County Forum',       slug: 'martin',        countyName: null, displayOrder: 42 },
  { title: 'Miami-Dade County Forum',   slug: 'miami-dade',    countyName: null, displayOrder: 43 },
  { title: 'Monroe County Forum',       slug: 'monroe',        countyName: null, displayOrder: 44 },
  { title: 'Nassau County Forum',       slug: 'nassau',        countyName: null, displayOrder: 45 },
  { title: 'Okaloosa County Forum',     slug: 'okaloosa',      countyName: null, displayOrder: 46 },
  { title: 'Okeechobee County Forum',   slug: 'okeechobee',    countyName: null, displayOrder: 47 },
  { title: 'Orange County Forum',       slug: 'orange',        countyName: null, displayOrder: 48 },
  { title: 'Osceola County Forum',      slug: 'osceola',       countyName: null, displayOrder: 49 },
  { title: 'Palm Beach County Forum',   slug: 'palm-beach',    countyName: null, displayOrder: 50 },
  { title: 'Pasco County Forum',        slug: 'pasco',         countyName: null, displayOrder: 51 },
  { title: 'Pinellas County Forum',     slug: 'pinellas',      countyName: null, displayOrder: 52 },
  { title: 'Polk County Forum',         slug: 'polk',          countyName: null, displayOrder: 53 },
  { title: 'Putnam County Forum',       slug: 'putnam',        countyName: null, displayOrder: 54 },
  { title: 'Saint Johns County Forum',  slug: 'saint-johns',   countyName: null, displayOrder: 55 },
  { title: 'Saint Lucie County Forum',  slug: 'saint-lucie',   countyName: null, displayOrder: 56 },
  { title: 'Santa Rosa County Forum',   slug: 'santa-rosa',    countyName: 'Santa Rosa County', displayOrder: 57 },
  { title: 'Sarasota County Forum',     slug: 'sarasota',      countyName: null, displayOrder: 58 },
  { title: 'Seminole County Forum',     slug: 'seminole',      countyName: null, displayOrder: 59 },
  { title: 'Sumter County Forum',       slug: 'sumter',        countyName: null, displayOrder: 60 },
  { title: 'Suwannee County Forum',     slug: 'suwannee',      countyName: null, displayOrder: 61 },
  { title: 'Taylor County Forum',       slug: 'taylor',        countyName: null, displayOrder: 62 },
  { title: 'Union County Forum',        slug: 'union',         countyName: null, displayOrder: 63 },
  { title: 'Volusia County Forum',      slug: 'volusia',       countyName: null, displayOrder: 64 },
  { title: 'Wakulla County Forum',      slug: 'wakulla',       countyName: null, displayOrder: 65 },
  { title: 'Walton County Forum',       slug: 'walton',        countyName: null, displayOrder: 66 },
  { title: 'Washington County Forum',   slug: 'washington',    countyName: null, displayOrder: 67 },

  // ── Statewide / General boards ────────────────────────────────────────────
  { title: 'Statewide Discussion', slug: 'statewide',    countyName: 'Statewide', displayOrder: 68 },
  { title: 'General',              slug: 'general',      countyName: null,        displayOrder: 69 },
  { title: 'Announcements',        slug: 'announcements', countyName: null,       displayOrder: 70 },
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
