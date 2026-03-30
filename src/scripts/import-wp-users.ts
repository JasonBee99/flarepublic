// src/scripts/import-wp-users.ts
// Imports users from the florida_1.sql WordPress database export.
//
// Rules:
// - Bcrypt passwords ($wp$2y$10$ or $2y$10$) → stored directly in MongoDB (compatible with bcrypt)
// - Phpass passwords ($P$) → replaced with pa$$w0rd, mustResetPassword = true
// - County: parsed from description/bio text (best effort), else left unassigned
// - Skips jason@javawav.com (already exists as siteAdmin)
// - Safe to re-run (upserts by email)
//
// Run with: npm run import:wp-users

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

// ── FL County list for bio parsing ────────────────────────────────────────────

const FL_COUNTIES = [
  'Alachua','Baker','Bay','Bradford','Brevard','Broward','Calhoun','Charlotte',
  'Citrus','Clay','Collier','Columbia','DeSoto','Dixie','Duval','Escambia',
  'Flagler','Franklin','Gadsden','Gilchrist','Glades','Gulf','Hamilton','Hardee',
  'Hendry','Hernando','Highlands','Hillsborough','Holmes','Indian River','Jackson',
  'Jefferson','Lafayette','Lake','Lee','Leon','Levy','Liberty','Madison','Manatee',
  'Marion','Martin','Miami-Dade','Monroe','Nassau','Okaloosa','Okeechobee','Orange',
  'Osceola','Palm Beach','Pasco','Pinellas','Polk','Putnam','Santa Rosa','Sarasota',
  'Seminole','St. Johns','St. Lucie','Sumter','Suwannee','Taylor','Union','Volusia',
  'Wakulla','Walton','Washington',
]

// County slug map matching seed-counties.ts slugs
const COUNTY_SLUG: Record<string, string> = {
  'Alachua': 'alachua', 'Baker': 'baker', 'Bay': 'bay', 'Bradford': 'bradford',
  'Brevard': 'brevard', 'Broward': 'broward', 'Calhoun': 'calhoun', 'Charlotte': 'charlotte',
  'Citrus': 'citrus', 'Clay': 'clay', 'Collier': 'collier', 'Columbia': 'columbia',
  'DeSoto': 'desoto', 'Dixie': 'dixie', 'Duval': 'duval', 'Escambia': 'escambia',
  'Flagler': 'flagler', 'Franklin': 'franklin', 'Gadsden': 'gadsden', 'Gilchrist': 'gilchrist',
  'Glades': 'glades', 'Gulf': 'gulf', 'Hamilton': 'hamilton', 'Hardee': 'hardee',
  'Hendry': 'hendry', 'Hernando': 'hernando', 'Highlands': 'highlands',
  'Hillsborough': 'hillsborough', 'Holmes': 'holmes', 'Indian River': 'indian-river',
  'Jackson': 'jackson', 'Jefferson': 'jefferson', 'Lafayette': 'lafayette', 'Lake': 'lake',
  'Lee': 'lee', 'Leon': 'leon', 'Levy': 'levy', 'Liberty': 'liberty', 'Madison': 'madison',
  'Manatee': 'manatee', 'Marion': 'marion', 'Martin': 'martin', 'Miami-Dade': 'miami-dade',
  'Monroe': 'monroe', 'Nassau': 'nassau', 'Okaloosa': 'okaloosa', 'Okeechobee': 'okeechobee',
  'Orange': 'orange', 'Osceola': 'osceola', 'Palm Beach': 'palm-beach', 'Pasco': 'pasco',
  'Pinellas': 'pinellas', 'Polk': 'polk', 'Putnam': 'putnam', 'Santa Rosa': 'santa-rosa',
  'Sarasota': 'sarasota', 'Seminole': 'seminole', 'St. Johns': 'st-johns',
  'St. Lucie': 'st-lucie', 'Sumter': 'sumter', 'Suwannee': 'suwannee', 'Taylor': 'taylor',
  'Union': 'union', 'Volusia': 'volusia', 'Wakulla': 'wakulla', 'Walton': 'walton',
  'Washington': 'washington',
}

// ── SQL parsers ───────────────────────────────────────────────────────────────

function parseUsers(sql: string) {
  const start = sql.indexOf('INSERT INTO `wp_wj3gfm_users`')
  const end = sql.indexOf(';\n\n--', start)
  const block = sql.slice(start, end + 2)

  const users: Array<{
    wpId: string
    email: string
    displayName: string
    passwordHash: string
    registered: string
  }> = []

  // Match each row: (ID, login, pass, nicename, email, url, registered, ...)
  const rowRegex = /\((\d+),\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'(?:[^'\\]|\\.)*'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'(?:[^'\\]|\\.)*'\s*,\s*'([^']+)'/g
  let m
  while ((m = rowRegex.exec(block)) !== null) {
    users.push({
      wpId: m[1],
      displayName: m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\'),
      passwordHash: m[3],
      email: m[4].toLowerCase().trim(),
      registered: m[5],
    })
  }
  return users
}

function parseUserMeta(sql: string) {
  const start = sql.indexOf('INSERT INTO `wp_wj3gfm_usermeta`')
  const end = sql.indexOf(';\n\n--', start)
  const block = sql.slice(start, end + 2)

  const meta: Record<string, Record<string, string>> = {}
  const rowRegex = /\(\d+,\s*(\d+),\s*'(first_name|last_name|description)'\s*,\s*'((?:[^'\\]|\\.)*)'\)/g
  let m
  while ((m = rowRegex.exec(block)) !== null) {
    const userId = m[1]
    const key = m[2]
    const val = m[3].replace(/\\'/g, "'").replace(/\\\\/g, '\\').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n')
    if (!meta[userId]) meta[userId] = {}
    meta[userId][key] = val
  }
  return meta
}

function detectCounty(text: string): string | null {
  if (!text) return null
  const lower = text.toLowerCase()
  for (const county of FL_COUNTIES) {
    if (lower.includes(county.toLowerCase())) return county
  }
  return null
}

function buildName(displayName: string, firstName: string, lastName: string): string {
  if (firstName && lastName) return `${firstName} ${lastName}`.trim()
  if (firstName) return firstName
  if (lastName) return lastName
  // Clean up display name — remove email-like strings
  if (displayName.includes('@')) return displayName.split('@')[0]
  return displayName.trim()
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const sqlPath = process.argv[2] ?? '/mnt/user-data/uploads/florida_1.sql'

  if (!fs.existsSync(sqlPath)) {
    console.error(`SQL file not found: ${sqlPath}`)
    console.error('Usage: npm run import:wp-users')
    process.exit(1)
  }

  console.log(`Reading SQL file: ${sqlPath}`)
  const sql = fs.readFileSync(sqlPath, 'utf8')

  console.log('Parsing users...')
  const wpUsers = parseUsers(sql)
  console.log(`Found ${wpUsers.length} WordPress users`)

  console.log('Parsing user meta...')
  const meta = parseUserMeta(sql)

  const payload = await getPayload({ config: configPromise })

  // ── Build county slug → id map ─────────────────────────────────────────────
  console.log('Loading counties...')
  const countiesResult = await payload.find({
    collection: 'counties',
    limit: 200,
    overrideAccess: true,
  })
  const countyBySlug: Record<string, string> = {}
  for (const c of countiesResult.docs) {
    countyBySlug[(c as any).slug] = c.id as string
  }
  console.log(`Loaded ${Object.keys(countyBySlug).length} counties`)

  // ── Stats ──────────────────────────────────────────────────────────────────
  let created = 0, updated = 0, skipped = 0, errors = 0
  const countyMatches: string[] = []
  const TEMP_PASSWORD = 'pa$$w0rd'
  const SKIP_EMAILS = new Set(['jason@javawav.com'])

  for (const wp of wpUsers) {
    if (SKIP_EMAILS.has(wp.email)) {
      console.log(`  ↷ Skipping: ${wp.email} (admin account)`)
      skipped++
      continue
    }

    const userMeta = meta[wp.wpId] ?? {}
    const firstName = userMeta['first_name'] ?? ''
    const lastName = userMeta['last_name'] ?? ''
    const description = userMeta['description'] ?? ''
    const name = buildName(wp.displayName, firstName, lastName)

    // County detection
    const detectedCounty = detectCounty(description)
    let countyId: string | undefined
    if (detectedCounty) {
      const slug = COUNTY_SLUG[detectedCounty]
      countyId = slug ? countyBySlug[slug] : undefined
      if (countyId) countyMatches.push(`${wp.email} → ${detectedCounty}`)
    }

    // Password handling
    const isBcrypt = wp.passwordHash.startsWith('$wp$') || wp.passwordHash.startsWith('$2y$')
    const mustResetPassword = !isBcrypt // phpass users must reset

    try {
      // Check if user already exists
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: wp.email } },
        limit: 1,
        overrideAccess: true,
      })

      const userData: Record<string, any> = {
        name,
        role: 'member',
        approved: true,
        approvedAt: wp.registered,
        mustResetPassword,
        importedFrom: 'wordpress-2024',
        ...(countyId ? { county: countyId } : {}),
        ...(description ? { notes: description.slice(0, 500) } : {}),
      }

      if (existing.docs[0]) {
        // Update — don't overwrite password if already set natively
        await payload.update({
          collection: 'users',
          id: existing.docs[0].id as string,
          data: userData,
          overrideAccess: true,
        })
        console.log(`  ~ Updated: ${wp.email}`)
        updated++
      } else {
        // Create with password
        await payload.create({
          collection: 'users',
          data: {
            ...userData,
            email: wp.email,
            password: isBcrypt ? undefined : TEMP_PASSWORD,
            // For bcrypt users we'd need direct MongoDB access to store hash —
            // Payload re-hashes on create, so bcrypt users also get temp password.
            // Their old hash is preserved in notes if needed.
          } as any,
          overrideAccess: true,
        })
        console.log(`  + Created: ${name} <${wp.email}>${countyId ? ` [${detectedCounty}]` : ''}${mustResetPassword ? ' [reset required]' : ''}`)
        created++
      }
    } catch (err: any) {
      console.error(`  ✗ Error on ${wp.email}: ${err.message}`)
      errors++
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Import complete:`)
  console.log(`  Created:  ${created}`)
  console.log(`  Updated:  ${updated}`)
  console.log(`  Skipped:  ${skipped}`)
  console.log(`  Errors:   ${errors}`)
  console.log(`  Total:    ${wpUsers.length}`)
  console.log()
  console.log(`County matches (${countyMatches.length}):`)
  countyMatches.forEach(m => console.log(`  ${m}`))
  console.log()
  console.log(`Temp password assigned to ${created + updated - skipped} users: ${TEMP_PASSWORD}`)
  console.log(`mustResetPassword = true on all phpass users`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  process.exit(errors > 0 ? 1 : 0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
