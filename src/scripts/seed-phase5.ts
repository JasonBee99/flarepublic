// src/scripts/seed-phase5.ts
// Phase 5 — Seeds all reference data:
//   Counties -> Roles -> DocumentCategories -> FileTypes -> Contacts
//
// Run with:
//   npx tsx src/scripts/seed-phase5.ts
//
// Safe to re-run — skips records that already exist.

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

type IdMap = Record<string, string>
type AnyPayload = Awaited<ReturnType<typeof getPayload>>

// ── Data ─────────────────────────────────────────────────────────────────────

const COUNTIES = [
  { name: 'Escambia County',   state: 'Florida', displayOrder: 1, isActive: true },
  { name: 'Santa Rosa County', state: 'Florida', displayOrder: 2, isActive: true },
  { name: 'Statewide',         state: 'Florida', displayOrder: 3, isActive: true },
  { name: 'Other',             state: 'Florida', displayOrder: 4, isActive: true },
]

const ROLES = [
  { title: 'County Organizer', displayOrder: 1 },
  { title: 'Webmaster',        displayOrder: 2 },
  { title: 'Justice',          displayOrder: 3 },
  { title: 'Clerk',            displayOrder: 4 },
  { title: 'Coach',            displayOrder: 5 },
]

// DocumentCategories collection uses field: title
const DOCUMENT_CATEGORIES = [
  { title: 'Founders',          displayOrder: 1 },
  { title: 'Training',          displayOrder: 2 },
  { title: 'County Assemblies', displayOrder: 3 },
  { title: 'Reigning In Corps', displayOrder: 4 },
  { title: 'Meeting Methods',   displayOrder: 5 },
  { title: 'Focus Groups',      displayOrder: 6 },
]

// FileTypes collection uses fields: label, value, icon
const FILE_TYPES = [
  { label: 'PDF',           value: 'pdf',         icon: 'FileText' },
  { label: 'Spreadsheet',   value: 'spreadsheet', icon: 'Table' },
  { label: 'External Link', value: 'link',        icon: 'ExternalLink' },
]

const CONTACTS_DATA = [
  { name: 'Susan Gray',          county: 'Escambia County',   role: 'County Organizer', displayOrder: 1 },
  { name: 'Tabitha Benton',      county: 'Escambia County',   role: 'Clerk',            displayOrder: 2 },
  { name: 'Barbara Clayberger',  county: 'Santa Rosa County', role: 'County Organizer', displayOrder: 1 },
  { name: 'David Charles',       county: 'Santa Rosa County', role: 'Justice',          displayOrder: 2 },
  { name: 'Jim Costa',           county: 'Statewide',         role: 'Coach',            displayOrder: 1 },
]

// ── Seed helpers ──────────────────────────────────────────────────────────────

async function seedCounties(payload: AnyPayload): Promise<IdMap> {
  const map: IdMap = {}
  for (const data of COUNTIES) {
    const existing = await payload.find({ collection: 'counties', where: { name: { equals: data.name } }, limit: 1 })
    if (existing.docs.length > 0) {
      console.log(`  ✓ County exists: ${data.name}`)
      map[data.name] = existing.docs[0].id as string
    } else {
      const created = await payload.create({ collection: 'counties', data: data as any })
      console.log(`  + County created: ${data.name}`)
      map[data.name] = created.id as string
    }
  }
  return map
}

async function seedRoles(payload: AnyPayload): Promise<IdMap> {
  const map: IdMap = {}
  for (const data of ROLES) {
    const existing = await payload.find({ collection: 'roles', where: { title: { equals: data.title } }, limit: 1 })
    if (existing.docs.length > 0) {
      console.log(`  ✓ Role exists: ${data.title}`)
      map[data.title] = existing.docs[0].id as string
    } else {
      const created = await payload.create({ collection: 'roles', data: data as any })
      console.log(`  + Role created: ${data.title}`)
      map[data.title] = created.id as string
    }
  }
  return map
}

async function seedDocumentCategories(payload: AnyPayload): Promise<IdMap> {
  const map: IdMap = {}
  for (const data of DOCUMENT_CATEGORIES) {
    const existing = await payload.find({ collection: 'document-categories', where: { title: { equals: data.title } }, limit: 1 })
    if (existing.docs.length > 0) {
      console.log(`  ✓ DocumentCategory exists: ${data.title}`)
      map[data.title] = existing.docs[0].id as string
    } else {
      const created = await payload.create({ collection: 'document-categories', data: data as any })
      console.log(`  + DocumentCategory created: ${data.title}`)
      map[data.title] = created.id as string
    }
  }
  return map
}

async function seedFileTypes(payload: AnyPayload): Promise<IdMap> {
  const map: IdMap = {}
  for (const data of FILE_TYPES) {
    const existing = await payload.find({ collection: 'file-types', where: { value: { equals: data.value } }, limit: 1 })
    if (existing.docs.length > 0) {
      console.log(`  ✓ FileType exists: ${data.label}`)
      map[data.label] = existing.docs[0].id as string
    } else {
      const created = await payload.create({ collection: 'file-types', data: data as any })
      console.log(`  + FileType created: ${data.label}`)
      map[data.label] = created.id as string
    }
  }
  return map
}

async function seedContacts(payload: AnyPayload, countyMap: IdMap, roleMap: IdMap) {
  for (const c of CONTACTS_DATA) {
    const existing = await payload.find({ collection: 'contacts', where: { name: { equals: c.name } }, limit: 1 })
    if (existing.docs.length > 0) {
      console.log(`  ✓ Contact exists: ${c.name}`)
      continue
    }
    const countyId = countyMap[c.county]
    const roleId   = roleMap[c.role]
    if (!countyId) { console.warn(`  ⚠ Skipping ${c.name} — county not found: ${c.county}`); continue }
    const data: Record<string, unknown> = { name: c.name, county: countyId, displayOrder: c.displayOrder, isActive: true }
    if (roleId) data.role = roleId
    await payload.create({ collection: 'contacts', data: data as any })
    console.log(`  + Contact created: ${c.name}`)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config: configPromise })

  console.log('\n📍 Seeding Counties...')
  const countyMap = await seedCounties(payload)

  console.log('\n👤 Seeding Roles...')
  const roleMap = await seedRoles(payload)

  console.log('\n📂 Seeding Document Categories...')
  await seedDocumentCategories(payload)

  console.log('\n🗂  Seeding File Types...')
  await seedFileTypes(payload)

  console.log('\n📇 Seeding Contacts...')
  await seedContacts(payload, countyMap, roleMap)

  console.log('\n✅ Phase 5 seed complete.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
