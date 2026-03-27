// src/scripts/seed-documents-vps.ts
// Downloads PDFs to public/documents/ on the VPS (served as static files)
// and seeds the Documents collection using externalUrl — no Atlas storage used.
//
// Run with:
//   npm run seed:documents:vps
//
// The public/documents/ folder is served by Next.js as /documents/filename.pdf
// Safe to re-run — skips documents that already exist by title.

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

// ── Helpers ───────────────────────────────────────────────────────────────────

const PUBLIC_DOCS_DIR = path.resolve(process.cwd(), 'public', 'documents')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`  📁 Created: ${dir}`)
  }
}

function slugifyFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) + '.pdf'
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proto = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    const req = proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        downloadFile(res.headers.location!, dest).then(resolve)
        return
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        console.warn(`    ⚠ HTTP ${res.statusCode} for ${url}`)
        resolve(false)
        return
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(true) })
    })
    req.on('error', (err) => {
      file.close()
      if (fs.existsSync(dest)) fs.unlinkSync(dest)
      console.warn(`    ⚠ Download error: ${err.message}`)
      resolve(false)
    })
    req.setTimeout(15000, () => {
      req.destroy()
      file.close()
      if (fs.existsSync(dest)) fs.unlinkSync(dest)
      console.warn(`    ⚠ Timeout: ${url}`)
      resolve(false)
    })
  })
}

// ── Document manifest ─────────────────────────────────────────────────────────

const DOCUMENTS = [
  // ── Founders ──────────────────────────────────────────────────────────────
  { title: 'Judicial Document Cleanse (How To Cleanse The Land)', category: 'Founders', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Judicial-Document-Cleanse.pdf' },
  { title: '1825 Crimes Act',                                      category: 'Founders', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/1825-Crimes-Act.pdf' },
  { title: 'Judicial Code of Ethics',                              category: 'Founders', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Judicial-Code-of-Ethics.pdf' },
  { title: 'The Judicial Guide Book',                              category: 'Founders', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/The-Judicial-Guide-Book.pdf' },
  { title: 'Judicial Branch Manual',                               category: 'Founders', fileType: 'pdf', url: 'https://a63b2252-e6f8-44bd-89ad-7ecae9189fb3.filesusr.com/ugd/3c6104_2deadb81a3fb495b95ac1fcbf5918d1d.pdf' },
  { title: 'Re-Inhabitation Plan, Overview and Background',        category: 'Founders', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Re-Inhabitation-Plan-Overview-n-Background.pdf' },

  // ── Training ──────────────────────────────────────────────────────────────
  { title: 'Personality Plus Reference',  category: 'Training', fileType: 'link', url: 'http://www.co-opvillagefoundation.org/pdf/Leadership%20Classes/Personality%20Plus.pdf' },
  { title: 'Body Types Reference',        category: 'Training', fileType: 'link', url: 'http://www.co-opvillagefoundation.org/pdf/Leadership%20Classes/Personality%20Physical.pdf' },
  { title: 'Personality Profile Test',    category: 'Training', fileType: 'pdf',  url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Personality-Profile-Test.pdf' },
  { title: 'Leadership Training Manual',  category: 'Training', fileType: 'pdf',  url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Leadership-Training-Manual.pdf' },

  // ── County Assemblies ─────────────────────────────────────────────────────
  { title: 'County Assembly Overview',         category: 'County Assemblies', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/County-Assembly-Overview.pdf' },
  { title: 'How to Hold a County Assembly',    category: 'County Assemblies', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/How-to-Hold-a-County-Assembly.pdf' },
  { title: 'County Assembly Recording Sheet',  category: 'County Assemblies', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/County-Assembly-Recording-Sheet.pdf' },

  // ── Reigning In Corps ─────────────────────────────────────────────────────
  { title: 'Reigning In Corporations Overview', category: 'Reigning In Corps', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Reigning-In-Corporations-Overview.pdf' },
  { title: 'Corporate Accountability Steps',    category: 'Reigning In Corps', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Corporate-Accountability-Steps.pdf' },

  // ── Meeting Methods ───────────────────────────────────────────────────────
  { title: 'Zoom Meeting Setup Guide',  category: 'Meeting Methods', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Zoom-Meeting-Setup-Guide.pdf' },
  { title: 'Wire Meeting Setup Guide',  category: 'Meeting Methods', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Wire-Meeting-Setup-Guide.pdf' },

  // ── Focus Groups ──────────────────────────────────────────────────────────
  { title: 'Focus Group Guidelines',    category: 'Focus Groups', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Focus-Group-Guidelines.pdf' },
  { title: 'Focus Group Agenda Template', category: 'Focus Groups', fileType: 'pdf', url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Focus-Group-Agenda-Template.pdf' },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔌 Connecting to Payload...')
  const payload = await getPayload({ config: configPromise })
  console.log('✓ Connected')

  // Ensure public/documents directory exists
  ensureDir(PUBLIC_DOCS_DIR)

  // Load category and file type maps
  const catResult = await payload.find({ collection: 'document-categories', limit: 50, overrideAccess: true })
  const ftResult  = await payload.find({ collection: 'file-types',          limit: 20, overrideAccess: true })

  const catMap: Record<string, string> = {}
  const ftMap:  Record<string, string> = {}

  for (const c of catResult.docs) catMap[c.title as string] = c.id as string
  for (const f of ftResult.docs)  ftMap[f.value as string]  = f.id as string

  console.log(`\n📄 Seeding ${DOCUMENTS.length} documents...`)

  let created = 0
  let skipped = 0
  let failed  = 0

  for (const doc of DOCUMENTS) {
    // Skip if already exists
    const existing = await payload.find({
      collection: 'documents',
      where: { title: { equals: doc.title } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      console.log(`  ✓ Exists: ${doc.title}`)
      skipped++
      continue
    }

    const catId = catMap[doc.category]
    const ftId  = ftMap[doc.fileType]

    if (!catId) { console.warn(`  ⚠ Category not found: ${doc.category} — skipping "${doc.title}"`); failed++; continue }
    if (!ftId)  { console.warn(`  ⚠ FileType not found: ${doc.fileType} — skipping "${doc.title}"`);  failed++; continue }

    let externalUrl: string

    if (doc.fileType === 'link') {
      // External link — store URL directly
      externalUrl = doc.url
    } else {
      // PDF — download to public/documents/
      const filename = slugifyFilename(doc.title)
      const destPath = path.join(PUBLIC_DOCS_DIR, filename)

      if (fs.existsSync(destPath)) {
        console.log(`  ↩ Already downloaded: ${filename}`)
      } else {
        process.stdout.write(`  ⬇ Downloading: ${doc.title}...`)
        const ok = await downloadFile(doc.url, destPath)
        if (!ok) {
          // Fall back to external URL if download fails
          console.log(` failed — using external URL`)
          externalUrl = doc.url
        } else {
          console.log(` done`)
          externalUrl = `/documents/${filename}`
        }
      }
      externalUrl ??= `/documents/${filename}`
    }

    try {
      await payload.create({
        collection: 'documents',
        data: {
          title: doc.title,
          category: catId,
          fileType: ftId,
          externalUrl,
          _status: 'published',
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      })
      console.log(`  + Created: ${doc.title}`)
      created++
    } catch (err) {
      console.error(`  ✗ Failed to create: ${doc.title}`, err)
      failed++
    }
  }

  console.log(`\n✅ Done — ${created} created, ${skipped} skipped, ${failed} failed\n`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
