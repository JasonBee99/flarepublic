// src/scripts/import-docs-xml.ts
// Imports all BetterDocs articles from the WordPress XML export into Payload.
// Much cleaner than scraping — uses the exported content directly.
//
// Place the XML file at: ~/betterdocs_2026-03-30.xml
// Run with: npm run import:docs-xml
//
// Safe to re-run — skips docs that already exist by title.

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import { parseStringPromise } from 'xml2js'
import { readFileSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

// ── Find the XML file ────────────────────────────────────────────────────────
function findXmlFile(): string {
  const candidates = [
    join(homedir(), 'betterdocs_2026-03-30.xml'),
    join(homedir(), 'Downloads', 'betterdocs_2026-03-30.xml'),
    join(homedir(), 'Desktop', 'betterdocs_2026-03-30.xml'),
    join(process.cwd(), 'betterdocs_2026-03-30.xml'),
    // Accept any betterdocs*.xml in home dir
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  // Check arg
  if (process.argv[2] && existsSync(process.argv[2])) return process.argv[2]
  throw new Error(
    'XML file not found. Copy it to ~/betterdocs_2026-03-30.xml or pass path as argument:\n' +
    '  npm run import:docs-xml -- /path/to/betterdocs_2026-03-30.xml'
  )
}

// ── Clean WordPress block content to plain text ──────────────────────────────
function cleanContent(html: string): string {
  if (!html) return ''

  // Remove WordPress/BetterDocs block comment annotations and JSON metadata
  let text = html
    .replace(/<!-- wp:[^>]+ -->/g, '')
    .replace(/<!-- \/wp:[^>]+ -->/g, '')

  // Convert block elements to newlines before stripping
  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<hr[^>]*>/gi, '\n---\n')
    .replace(/<[^>]+>/g, '')  // strip all remaining tags

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#160;/g, ' ')

  // Normalize whitespace
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
}

// ── Category display order ───────────────────────────────────────────────────
const CAT_ORDER: Record<string, number> = {
  'Core Documentation': 1,
  'Fast Track to Assemblies': 2,
  "Why Break From Nat'l to Use the Fast Track?": 3,
  'Training for Assembly and Congress': 4,
  'Interim Holding Time Period': 5,
  'Creating the Congresses': 6,
  'Financing and Investment Opportunities': 7,
  'Training Legal Officers': 8,
  'Other': 9,
  // Newly Added is a cross-cutting tag, skip as a primary category
}

// Primary category priority — if a doc is in multiple categories, pick by order above
function pickPrimaryCategory(cats: string[]): string {
  // Filter out "Newly Added" — it's a recency tag not a real category
  const real = cats.filter(c => !c.includes('Newly Added'))
  if (real.length === 0) return cats[0] ?? 'Other'
  // Return the one with lowest order number
  return real.sort((a, b) => (CAT_ORDER[a] ?? 99) - (CAT_ORDER[b] ?? 99))[0]
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const xmlPath = findXmlFile()
  console.log(`Reading: ${xmlPath}`)

  const xml = readFileSync(xmlPath, 'utf-8')
  const parsed = await parseStringPromise(xml, { explicitArray: true, cdata: true })

  const channel = parsed.rss.channel[0]
  const items: any[] = channel.item ?? []
  const docs = items.filter(i => i['wp:post_type']?.[0] === 'docs' && i['wp:status']?.[0] === 'publish')

  console.log(`Found ${docs.length} published docs\n`)

  const payload = await getPayload({ config: configPromise })
  console.log('Connected to Payload\n')

  // ── Ensure categories ────────────────────────────────────────────────────
  const allCats = new Set<string>()
  for (const doc of docs) {
    for (const cat of (doc.category ?? [])) {
      const name = typeof cat === 'string' ? cat : cat._
      if (name && !name.includes('Newly Added')) allCats.add(name)
    }
  }
  allCats.add('Other') // ensure Other exists

  const catMap: Record<string, string> = {}
  for (const name of allCats) {
    const ex = await payload.find({ collection: 'document-categories', where: { title: { equals: name } }, limit: 1, overrideAccess: true })
    if (ex.docs.length > 0) {
      catMap[name] = ex.docs[0].id as string
    } else {
      const c = await payload.create({ collection: 'document-categories', data: { title: name, displayOrder: CAT_ORDER[name] ?? 99 } as any, overrideAccess: true })
      catMap[name] = c.id as string
      console.log(`+ category: ${name}`)
    }
  }

  // ── Ensure Web Article file type ─────────────────────────────────────────
  let ftId: string
  const ftEx = await payload.find({ collection: 'file-types', where: { label: { equals: 'Web Article' } }, limit: 1, overrideAccess: true })
  if (ftEx.docs.length > 0) {
    ftId = ftEx.docs[0].id as string
  } else {
    const ft = await payload.create({ collection: 'file-types', data: { label: 'Web Article', value: 'web-article' } as any, overrideAccess: true })
    ftId = ft.id as string
    console.log('+ file type: Web Article')
  }

  // ── Import docs ──────────────────────────────────────────────────────────
  console.log('\nImporting docs...')
  let imported = 0, skipped = 0, failed = 0

  for (const doc of docs) {
    const title = doc.title?.[0] ?? 'Untitled'
    const slug = doc['wp:post_name']?.[0] ?? ''
    const rawContent = doc['content:encoded']?.[0] ?? ''
    const content = cleanContent(rawContent)
    const sourceUrl = `https://www.flarepublic.us/docs/${slug}/`

    const cats = (doc.category ?? []).map((c: any) => typeof c === 'string' ? c : c._).filter(Boolean)
    const primaryCat = pickPrimaryCategory(cats)
    const catId = catMap[primaryCat] ?? catMap['Other']

    // Skip if already exists
    const ex = await payload.find({ collection: 'documents', where: { title: { equals: title } }, limit: 1, overrideAccess: true })
    if (ex.docs.length > 0) {
      console.log(`  ~ skip: ${title}`)
      skipped++
      continue
    }

    try {
      await payload.create({
        collection: 'documents',
        data: {
          title,
          category: catId,
          fileType: ftId,
          externalUrl: sourceUrl,
          content,
          sourceUrl,
          _status: 'published',
          publishedAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
      console.log(`  ✓ ${title} (${content.length} chars, cat: ${primaryCat})`)
      imported++
    } catch (e: any) {
      console.error(`  ✗ ${title}: ${e.message}`)
      failed++
    }
  }

  console.log(`\n✅ Done — imported: ${imported}, skipped: ${skipped}, failed: ${failed}`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
