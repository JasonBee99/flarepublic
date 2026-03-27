// src/scripts/seed-county-slugs.ts
// Adds slug field to all existing County documents.
// Safe to re-run — skips counties that already have a slug.
//
// Run with:  npm run seed:county-slugs

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

// Mapping county name → slug
const COUNTY_SLUGS: Record<string, string> = {
  'Alachua County': 'alachua',
  'Baker County': 'baker',
  'Bay County': 'bay',
  'Bradford County': 'bradford',
  'Brevard County': 'brevard',
  'Broward County': 'broward',
  'Calhoun County': 'calhoun',
  'Charlotte County': 'charlotte',
  'Citrus County': 'citrus',
  'Clay County': 'clay',
  'Collier County': 'collier',
  'Columbia County': 'columbia',
  'DeSoto County': 'desoto',
  'Dixie County': 'dixie',
  'Duval County': 'duval',
  'Escambia County': 'escambia',
  'Flagler County': 'flagler',
  'Franklin County': 'franklin',
  'Gadsden County': 'gadsden',
  'Gilchrist County': 'gilchrist',
  'Glades County': 'glades',
  'Gulf County': 'gulf',
  'Hamilton County': 'hamilton',
  'Hardee County': 'hardee',
  'Hendry County': 'hendry',
  'Hernando County': 'hernando',
  'Highlands County': 'highlands',
  'Hillsborough County': 'hillsborough',
  'Holmes County': 'holmes',
  'Indian River County': 'indian-river',
  'Jackson County': 'jackson',
  'Jefferson County': 'jefferson',
  'Lafayette County': 'lafayette',
  'Lake County': 'lake',
  'Lee County': 'lee',
  'Leon County': 'leon',
  'Levy County': 'levy',
  'Liberty County': 'liberty',
  'Madison County': 'madison',
  'Manatee County': 'manatee',
  'Marion County': 'marion',
  'Martin County': 'martin',
  'Miami-Dade County': 'miami-dade',
  'Monroe County': 'monroe',
  'Nassau County': 'nassau',
  'Okaloosa County': 'okaloosa',
  'Okeechobee County': 'okeechobee',
  'Orange County': 'orange',
  'Osceola County': 'osceola',
  'Palm Beach County': 'palm-beach',
  'Pasco County': 'pasco',
  'Pinellas County': 'pinellas',
  'Polk County': 'polk',
  'Putnam County': 'putnam',
  'Saint Johns County': 'saint-johns',
  'Saint Lucie County': 'saint-lucie',
  'Santa Rosa County': 'santa-rosa',
  'Sarasota County': 'sarasota',
  'Seminole County': 'seminole',
  'Sumter County': 'sumter',
  'Suwannee County': 'suwannee',
  'Taylor County': 'taylor',
  'Union County': 'union',
  'Volusia County': 'volusia',
  'Wakulla County': 'wakulla',
  'Walton County': 'walton',
  'Washington County': 'washington',
}

async function main() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'counties',
    limit: 200,
    sort: 'name',
  })

  const counties = result.docs
  console.log(`Found ${counties.length} counties`)

  let updated = 0
  let skipped = 0
  let notMapped = 0

  for (const county of counties) {
    const existing = (county as any).slug
    if (existing) {
      skipped++
      continue
    }

    const slug = COUNTY_SLUGS[county.name]
    if (!slug) {
      console.warn(`  ⚠ No slug mapping for: "${county.name}"`)
      notMapped++
      continue
    }

    await payload.update({
      collection: 'counties',
      id: county.id as string,
      data: { slug } as any,
    })
    console.log(`  ✓ ${county.name} → ${slug}`)
    updated++
  }

  console.log(`\nDone — updated: ${updated}, skipped (already had slug): ${skipped}, unmapped: ${notMapped}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
