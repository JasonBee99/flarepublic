// src/scripts/seed-counties.ts
// Seeds all 67 Florida counties with name and slug.
// Safe to re-run — skips counties that already exist by slug.
//
// Run with: npm run seed:counties

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const FLORIDA_COUNTIES = [
  { name: 'Alachua County',       slug: 'alachua',       displayOrder: 1  },
  { name: 'Baker County',         slug: 'baker',         displayOrder: 2  },
  { name: 'Bay County',           slug: 'bay',           displayOrder: 3  },
  { name: 'Bradford County',      slug: 'bradford',      displayOrder: 4  },
  { name: 'Brevard County',       slug: 'brevard',       displayOrder: 5  },
  { name: 'Broward County',       slug: 'broward',       displayOrder: 6  },
  { name: 'Calhoun County',       slug: 'calhoun',       displayOrder: 7  },
  { name: 'Charlotte County',     slug: 'charlotte',     displayOrder: 8  },
  { name: 'Citrus County',        slug: 'citrus',        displayOrder: 9  },
  { name: 'Clay County',          slug: 'clay',          displayOrder: 10 },
  { name: 'Collier County',       slug: 'collier',       displayOrder: 11 },
  { name: 'Columbia County',      slug: 'columbia',      displayOrder: 12 },
  { name: 'DeSoto County',        slug: 'desoto',        displayOrder: 13 },
  { name: 'Dixie County',         slug: 'dixie',         displayOrder: 14 },
  { name: 'Duval County',         slug: 'duval',         displayOrder: 15 },
  { name: 'Escambia County',      slug: 'escambia',      displayOrder: 16 },
  { name: 'Flagler County',       slug: 'flagler',       displayOrder: 17 },
  { name: 'Franklin County',      slug: 'franklin',      displayOrder: 18 },
  { name: 'Gadsden County',       slug: 'gadsden',       displayOrder: 19 },
  { name: 'Gilchrist County',     slug: 'gilchrist',     displayOrder: 20 },
  { name: 'Glades County',        slug: 'glades',        displayOrder: 21 },
  { name: 'Gulf County',          slug: 'gulf',          displayOrder: 22 },
  { name: 'Hamilton County',      slug: 'hamilton',      displayOrder: 23 },
  { name: 'Hardee County',        slug: 'hardee',        displayOrder: 24 },
  { name: 'Hendry County',        slug: 'hendry',        displayOrder: 25 },
  { name: 'Hernando County',      slug: 'hernando',      displayOrder: 26 },
  { name: 'Highlands County',     slug: 'highlands',     displayOrder: 27 },
  { name: 'Hillsborough County',  slug: 'hillsborough',  displayOrder: 28 },
  { name: 'Holmes County',        slug: 'holmes',        displayOrder: 29 },
  { name: 'Indian River County',  slug: 'indian-river',  displayOrder: 30 },
  { name: 'Jackson County',       slug: 'jackson',       displayOrder: 31 },
  { name: 'Jefferson County',     slug: 'jefferson',     displayOrder: 32 },
  { name: 'Lafayette County',     slug: 'lafayette',     displayOrder: 33 },
  { name: 'Lake County',          slug: 'lake',          displayOrder: 34 },
  { name: 'Lee County',           slug: 'lee',           displayOrder: 35 },
  { name: 'Leon County',          slug: 'leon',          displayOrder: 36 },
  { name: 'Levy County',          slug: 'levy',          displayOrder: 37 },
  { name: 'Liberty County',       slug: 'liberty',       displayOrder: 38 },
  { name: 'Madison County',       slug: 'madison',       displayOrder: 39 },
  { name: 'Manatee County',       slug: 'manatee',       displayOrder: 40 },
  { name: 'Marion County',        slug: 'marion',        displayOrder: 41 },
  { name: 'Martin County',        slug: 'martin',        displayOrder: 42 },
  { name: 'Miami-Dade County',    slug: 'miami-dade',    displayOrder: 43 },
  { name: 'Monroe County',        slug: 'monroe',        displayOrder: 44 },
  { name: 'Nassau County',        slug: 'nassau',        displayOrder: 45 },
  { name: 'Okaloosa County',      slug: 'okaloosa',      displayOrder: 46 },
  { name: 'Okeechobee County',    slug: 'okeechobee',    displayOrder: 47 },
  { name: 'Orange County',        slug: 'orange',        displayOrder: 48 },
  { name: 'Osceola County',       slug: 'osceola',       displayOrder: 49 },
  { name: 'Palm Beach County',    slug: 'palm-beach',    displayOrder: 50 },
  { name: 'Pasco County',         slug: 'pasco',         displayOrder: 51 },
  { name: 'Pinellas County',      slug: 'pinellas',      displayOrder: 52 },
  { name: 'Polk County',          slug: 'polk',          displayOrder: 53 },
  { name: 'Putnam County',        slug: 'putnam',        displayOrder: 54 },
  { name: 'Saint Johns County',   slug: 'saint-johns',   displayOrder: 55 },
  { name: 'Saint Lucie County',   slug: 'saint-lucie',   displayOrder: 56 },
  { name: 'Santa Rosa County',    slug: 'santa-rosa',    displayOrder: 57 },
  { name: 'Sarasota County',      slug: 'sarasota',      displayOrder: 58 },
  { name: 'Seminole County',      slug: 'seminole',      displayOrder: 59 },
  { name: 'Sumter County',        slug: 'sumter',        displayOrder: 60 },
  { name: 'Suwannee County',      slug: 'suwannee',      displayOrder: 61 },
  { name: 'Taylor County',        slug: 'taylor',        displayOrder: 62 },
  { name: 'Union County',         slug: 'union',         displayOrder: 63 },
  { name: 'Volusia County',       slug: 'volusia',       displayOrder: 64 },
  { name: 'Wakulla County',       slug: 'wakulla',       displayOrder: 65 },
  { name: 'Walton County',        slug: 'walton',        displayOrder: 66 },
  { name: 'Washington County',    slug: 'washington',    displayOrder: 67 },
]

async function main() {
  const payload = await getPayload({ config: configPromise })

  // Get existing slugs to skip
  const existing = await payload.find({
    collection: 'counties',
    limit: 200,
    overrideAccess: true,
  })
  const existingSlugs = new Set(existing.docs.map((c: any) => c.slug).filter(Boolean))
  const existingNames = new Set(existing.docs.map((c: any) => c.name))

  console.log(`Found ${existing.docs.length} existing counties`)

  let created = 0
  let skipped = 0
  let updated = 0

  for (const county of FLORIDA_COUNTIES) {
    // If slug exists, skip
    if (existingSlugs.has(county.slug)) {
      skipped++
      continue
    }

    // If name exists but no slug, update to add slug
    const existing_doc = existing.docs.find((c: any) => c.name === county.name)
    if (existing_doc && !existing_doc.slug) {
      await payload.update({
        collection: 'counties',
        id: existing_doc.id as string,
        data: { slug: county.slug, displayOrder: county.displayOrder } as any,
        overrideAccess: true,
      })
      console.log(`  ~ Updated slug: ${county.name} → ${county.slug}`)
      updated++
      continue
    }

    // Create new
    await payload.create({
      collection: 'counties',
      data: {
        name: county.name,
        slug: county.slug,
        state: 'Florida',
        displayOrder: county.displayOrder,
        isActive: true,
      } as any,
      overrideAccess: true,
    })
    console.log(`  + Created: ${county.name}`)
    created++
  }

  console.log(`\nDone — created: ${created}, updated: ${updated}, skipped: ${skipped}`)
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
