// src/scripts/seed-documents.ts
// Downloads all PDFs from source URLs and imports them into Payload.
//
// IMPORTANT: The dev server must be running (npm run dev) before you run this.
// This script uses the Payload local API directly (no HTTP needed for Payload
// operations) but downloads files via HTTP from the source URLs.
//
// Run with:
//   npx tsx src/scripts/seed-documents.ts
//
// If a document with the same title already exists it is skipped (idempotent).
// If a PDF download fails, the document is created as an External Link instead.

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import os from 'os'

// ── Document manifest ─────────────────────────────────────────────────────────
// category: must match exactly a DocumentCategory title seeded in Phase 5
// fileType: 'pdf' | 'spreadsheet' | 'link'  (matches file-types value field)

const DOCUMENTS = [
  // ── Founders ──────────────────────────────────────────────────────────────
  {
    title: 'Judicial Document Cleanse (How To Cleanse The Land)',
    category: 'Founders',
    fileType: 'pdf',
    url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Judicial-Document-Cleanse.pdf',
  },
  {
    title: '1825 Crimes Act',
    category: 'Founders',
    fileType: 'pdf',
    url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/1825-Crimes-Act.pdf',
  },
  {
    title: 'Judicial Code of Ethics',
    category: 'Founders',
    fileType: 'pdf',
    url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Judicial-Code-of-Ethics.pdf',
  },
  {
    title: 'The Judicial Guide Book',
    category: 'Founders',
    fileType: 'pdf',
    url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/The-Judicial-Guide-Book.pdf',
  },
  {
    title: 'Judicial Branch Manual',
    category: 'Founders',
    fileType: 'pdf',
    url: 'https://a63b2252-e6f8-44bd-89ad-7ecae9189fb3.filesusr.com/ugd/3c6104_2deadb81a3fb495b95ac1fcbf5918d1d.pdf',
  },
  {
    title: 'Re-Inhabitation Plan, Overview and Background',
    category: 'Founders',
    fileType: 'pdf',
    url: 'https://www.flarepublic.us/wp-content/uploads/2024/10/Re-Inhabitation-Plan-Overview-n-Background.pdf',
  },

  // ── Training ──────────────────────────────────────────────────────────────
  {
    title: 'Personality Plus Reference',
    category: 'Training',
    fileType: 'link',
    url: 'http://www.co-opvillagefoundation.org/pdf/Leadership%20Classes/Personality%20Plus.pdf',
  },
  {
    title: 'Body Types Reference',
    category: 'Training',
    fileType: 'link',
    url: 'http://www.co-opvillagefoundation.org/pdf/Leadership%20Classes/Personality%20Physical.pdf',
  },
  {
    title: 'Personality Profile Test',
    category: 'Training',
    fileType: 'pdf',
    url: 'https://www.flarepublic.us/wp-content/uploads/2024/09/Personality-Profile.pdf',
  },
  {
    title: 'Body Types PDF',
    category: 'Training',
    fileType: 'pdf',
    url: 'https://www.flarepublic.us/wp-content/uploads/2024/09/Body-types.pdf',
  },

  // ── Focus Groups ──────────────────────────────────────────────────────────
  {
    title: 'Focus Groups Overview',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_ce6d7528749d4c64af6524f028f86c53.pdf',
  },
  {
    title: 'Office Space',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_d3cf0ef6c62b49599e7ec50844175d35.pdf',
  },
  {
    title: 'Office Budgeting',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_1b58d4b9a37f4c8cb973f6b9860b0f84.pdf',
  },
  {
    title: 'Office Budget Spreadsheet',
    category: 'Focus Groups',
    fileType: 'spreadsheet',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_166e039f9ea24a77b313c96f26c59b06.xlsx',
  },
  {
    title: 'Salaries',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_68b35ddd265742f1819af337bedb0a10.pdf',
  },
  {
    title: 'Funding',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_73a11634e09d480482eb862b7fdd82a8.pdf',
  },
  {
    title: 'Legal Structure',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_71b1235840274b5da8b4beb9909fb1d1.pdf',
  },
  {
    title: 'Finding Members & Forms',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_bebfe711eb184459af0f0659b168911d.pdf',
  },
  {
    title: 'Website Re-Purpose',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_45fde8b2a2c14b33b3a12bab7c145e99.pdf',
  },
  {
    title: 'Committees & Focus Groups',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_bd282cecaedd4b7d95f6b9d3d0891fd9.pdf',
  },
  {
    title: 'Santa Rosa County Focus Groups',
    category: 'Focus Groups',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_3fe342ced37543768d08221dc65c4d91.pdf',
  },

  // ── Reigning In Corps ─────────────────────────────────────────────────────
  {
    title: 'Reigning In Corps — Strategy',
    category: 'Reigning In Corps',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_9793b18996854fe8b90ff9884bad1de4.pdf',
  },
  {
    title: 'Reigning In Corps — Legal Procedures',
    category: 'Reigning In Corps',
    fileType: 'pdf',
    url: 'https://00439986-df9d-4409-9f32-68e250134358.filesusr.com/ugd/3c6104_08b90f08ed3d472e9eff4d1e8acdba4b.pdf',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

type AnyPayload = Awaited<ReturnType<typeof getPayload>>

/** Download a URL to a temp file. Returns the temp path or null on failure. */
function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proto = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(destPath)

    const request = proto.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120',
        'Accept': 'application/pdf,application/octet-stream,*/*',
        'Referer': 'https://www.flarepublic.us/',
      },
      timeout: 30000,
    }, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        const location = res.headers.location
        if (location) {
          file.close()
          fs.unlinkSync(destPath)
          downloadFile(location, destPath).then(resolve)
          return
        }
      }

      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(destPath)
        console.log(`    ✗ HTTP ${res.statusCode}`)
        resolve(false)
        return
      }

      res.pipe(file)
      file.on('finish', () => {
        file.close()
        const size = fs.statSync(destPath).size
        if (size < 1000) {
          // Too small — probably an error page
          fs.unlinkSync(destPath)
          console.log(`    ✗ Response too small (${size} bytes) — likely blocked`)
          resolve(false)
        } else {
          console.log(`    ↓ Downloaded ${(size / 1024).toFixed(0)} KB`)
          resolve(true)
        }
      })
    })

    request.on('error', (err) => {
      file.close()
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
      console.log(`    ✗ Network error: ${err.message}`)
      resolve(false)
    })

    request.on('timeout', () => {
      request.destroy()
      file.close()
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
      console.log(`    ✗ Timeout`)
      resolve(false)
    })
  })
}

/** Upload a local file to Payload's media collection. Returns the media doc id. */
async function uploadToMedia(payload: AnyPayload, filePath: string, filename: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const ext = path.extname(filename).toLowerCase()
    const mimeType = ext === '.pdf'  ? 'application/pdf'
                   : ext === '.xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                   : 'application/octet-stream'

    const result = await payload.create({
      collection: 'media',
      data: { alt: filename },
      file: {
        data: fileBuffer,
        mimetype: mimeType,
        name: filename,
        size: fileBuffer.length,
      },
    })
    return result.id as string
  } catch (err) {
    console.log(`    ✗ Media upload failed: ${err}`)
    return null
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config: configPromise })
  const tmpDir = os.tmpdir()

  // Pre-load category and file-type id maps
  const catResult = await payload.find({ collection: 'document-categories', limit: 50 })
  const ftResult  = await payload.find({ collection: 'file-types', limit: 20 })

  const catMap: Record<string, string> = {}
  for (const c of catResult.docs) catMap[c.title as string] = c.id as string

  const ftMap: Record<string, string> = {}
  for (const f of ftResult.docs) ftMap[f.value as string] = f.id as string

  console.log(`\nCategories found: ${Object.keys(catMap).join(', ')}`)
  console.log(`File types found: ${Object.keys(ftMap).join(', ')}\n`)

  let created = 0, skipped = 0, fallback = 0, failed = 0

  for (const doc of DOCUMENTS) {
    console.log(`\n📄 ${doc.title}`)

    // Skip if already exists
    const existing = await payload.find({
      collection: 'documents',
      where: { title: { equals: doc.title } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  ✓ Already exists — skipping`)
      skipped++
      continue
    }

    const catId = catMap[doc.category]
    const ftId  = ftMap[doc.fileType]

    if (!catId) { console.log(`  ✗ Category not found: ${doc.category}`); failed++; continue }
    if (!ftId)  { console.log(`  ✗ File type not found: ${doc.fileType}`); failed++; continue }

    // External links — just create the record with the URL, no download
    if (doc.fileType === 'link') {
      await payload.create({
        collection: 'documents',
        data: {
          title: doc.title,
          category: catId,
          fileType: ftId,
          externalUrl: doc.url,
        },
      })
      console.log(`  + Created as external link`)
      created++
      continue
    }

    // Attempt download
    const urlObj = new URL(doc.url)
    const filename = path.basename(urlObj.pathname) || `${doc.title.replace(/[^a-z0-9]/gi, '-')}.pdf`
    const tmpPath = path.join(tmpDir, filename)

    console.log(`  Downloading from ${urlObj.hostname}…`)
    const downloaded = await downloadFile(doc.url, tmpPath)

    if (downloaded) {
      // Upload to Payload media
      console.log(`  Uploading to Payload media…`)
      const mediaId = await uploadToMedia(payload, tmpPath, filename)
      fs.unlinkSync(tmpPath)

      if (mediaId) {
        await payload.create({
          collection: 'documents',
          data: {
            title: doc.title,
            category: catId,
            fileType: ftId,
            file: mediaId,
          },
        })
        console.log(`  + Created with uploaded file`)
        created++
      } else {
        failed++
      }
    } else {
      // Download failed — fall back to external link so the record still exists
      const linkFtId = ftMap['link']
      if (linkFtId) {
        await payload.create({
          collection: 'documents',
          data: {
            title: doc.title,
            category: catId,
            fileType: linkFtId,
            externalUrl: doc.url,
          },
        })
        console.log(`  ~ Created as external link fallback (download failed)`)
        fallback++
      } else {
        failed++
      }
    }
  }

  console.log(`\n── Summary ──────────────────────────────`)
  console.log(`  ✓ Created:        ${created}`)
  console.log(`  ~ Link fallbacks: ${fallback}`)
  console.log(`  ↷ Skipped:        ${skipped}`)
  console.log(`  ✗ Failed:         ${failed}`)
  console.log(`─────────────────────────────────────────\n`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
