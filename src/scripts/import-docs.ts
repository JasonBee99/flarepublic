// src/scripts/import-docs.ts
// Scrapes all articles from www.flarepublic.us/docs/ and imports them into
// the Payload 'documents' collection, grouped by category.
//
// Run from the VPS (which can reach flarepublic.us):
//   npm run import:docs
//
// Safe to re-run — skips docs that already exist by title.

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const BASE = 'https://www.flarepublic.us/docs'

// ── All 58 docs: [slug, title, category] ─────────────────────────────────────
const DOCS: [string, string, string][] = [
  // Core Documentation
  ['jims-fast-track-assembly-method',         "Jim's Fast-Track Assembly Method",                             'Core Documentation'],
  ['inroduction-to-assembly-by-laws',          'Introduction To Assembly By Laws',                            'Core Documentation'],

  // Fast Track to Assemblies
  ['proposal-giant-steps-to-assemblies',       'Giant Steps To Assemblies',                                   'Fast Track to Assemblies'],
  ['article-how-lawful-is-the-fast-track',     'Article – How Lawful Is The Fast Track?',                    'Fast Track to Assemblies'],
  ['article-ad-hoc-coach-for-county-assemblies','Article – Ad Hoc Coach For County Assemblies',              'Fast Track to Assemblies'],
  ['article-getting-two-delegates-in-an-hour', 'Article – Getting Two Delegates In An Hour',                 'Fast Track to Assemblies'],
  ['free-website-cloning',                     'Free Website Cloning',                                        'Fast Track to Assemblies'],
  ['proposal-radification',                    'PROPOSAL – Ratification',                                     'Fast Track to Assemblies'],
  ['electing-county-delegates',                'Electing County Delegates',                                   'Fast Track to Assemblies'],
  ['obtaining-tigers-for-county-leaders-immediately', 'Obtaining Tigers For County Leaders Immediately',      'Fast Track to Assemblies'],
  ['proposal-how-to-raise-all-of-your-county-assemblies-immediately', 'PROPOSAL – How To Raise All Of Your County Assemblies Immediately', 'Fast Track to Assemblies'],

  // Why Break From Natl
  ['article-why-doesnt-national-republic-push-the-fast-track-method', "Article – Why Doesn't National Republic Push The Fast Track Method?", "Why Break From Nat'l to Use the Fast Track?"],
  ['reading-to-county',                        'PROPOSAL – Reading To County',                                "Why Break From Nat'l to Use the Fast Track?"],
  ['laches-squatter-rights',                   'Article – Laches and Squatter Rights',                       "Why Break From Nat'l to Use the Fast Track?"],
  ['proposal-mergers-and-military-softball',   'PROPOSAL – Mergers and Military Softball',                   "Why Break From Nat'l to Use the Fast Track?"],
  ['article-signing-oaths-to-the-national-republic-for-the-u-s', 'Article – Signing Oaths To The National Republic For The U.S.', "Why Break From Nat'l to Use the Fast Track?"],
  ['article-whats-the-risk-of-not-taking-tha-land', 'Article – What\'s The Risk Of Not "Taking Tha Land?"', "Why Break From Nat'l to Use the Fast Track?"],

  // Training for Assembly and Congress
  ['article-the-future-of-county-assemblies',  'Article – The Future Of County Assemblies',                  'Training for Assembly and Congress'],
  ['proposal-maxing-meetings',                 'PROPOSAL – Maxing Meetings',                                  'Training for Assembly and Congress'],
  ['proposal-one-secretary-server-computer-proposal-method-part-iii', 'PROPOSAL – One Secretary Server Computer (Proposal Method, Part III)', 'Training for Assembly and Congress'],
  ['proposal-electronic-leadership-of-the-future-now-proposal-method-part-ii', 'PROPOSAL – Electronic Leadership Of The Future Now (Proposal Method, Part II)', 'Training for Assembly and Congress'],
  ['first-time-meeting-in-congress',           'First Time Meeting In Congress',                              'Training for Assembly and Congress'],
  ['proposal-electronic-voting-methods',       'PROPOSAL – Electronic Voting Methods',                       'Training for Assembly and Congress'],
  ['proposal-assembly-training-after-delegates-elected', 'Proposal – Assembly Training After Delegates Elected', 'Training for Assembly and Congress'],
  ['the-proposal-method',                      'The Proposal Method',                                         'Training for Assembly and Congress'],
  ['proposal-florida-congressional-training',  'PROPOSAL – Florida Congressional Training',                  'Training for Assembly and Congress'],

  // Interim Holding Time Period
  ['ad-hoc-board-of-directors',               'Ad Hoc Board of Directors',                                   'Interim Holding Time Period'],
  ['golden-handcuffs',                         'Golden Handcuffs',                                            'Interim Holding Time Period'],
  ['board-of-directors',                       'Board Of Directors',                                          'Interim Holding Time Period'],
  ['article-what-are-the-county-assembly-goals-after-electing-delegates', 'Article – What are The County Assembly Goals After Electing Delegates?', 'Interim Holding Time Period'],
  ['article-simple-arbitration-board-for-dispute-settlement', 'Article – Simple Arbitration Board For Dispute Settlement', 'Interim Holding Time Period'],
  ['article-working-with-other-county-assembly-groups', 'Article – Working With Other County Assembly Groups?', 'Interim Holding Time Period'],
  ['article-should-we-be-working-on-our-constitutions', 'Article – Should We Be Working On Our Constitutions?', 'Interim Holding Time Period'],

  // Creating the Congresses
  ['ratification-by-the-senate',              'PROPOSAL – Ratification By The Senate',                       'Creating the Congresses'],
  ['proposal-ratification-of-assemblies',      'PROPOSAL – Ratification of Assemblies',                      'Creating the Congresses'],
  ['proposal-manning-the-federal-congress',    'PROPOSAL – Manning The Federal Congress',                    'Creating the Congresses'],
  ['proposal-manning-the-florida-congress',    'PROPOSAL – Manning The Florida Congress',                    'Creating the Congresses'],
  ['proposal-updating-website-for-next-phase', 'PROPOSAL – Updating Website For Next Phase',                 'Creating the Congresses'],
  ['proposal-creating-the-florida-house-of-representatives', 'PROPOSAL – Creating The Florida House Of Representatives', 'Creating the Congresses'],
  ['article-procedures-to-create-all-republic-congresses', 'Article – Procedures to Create All Republic Congresses', 'Creating the Congresses'],
  ['article-who-has-the-power-to-create-a-republic-government', 'Article – Who has The Power To Create A Republic Government?', 'Creating the Congresses'],
  ['article-challenge-to-opening-the-florida-congress', 'Article – Challenge To Opening The Florida Congress', 'Creating the Congresses'],

  // Financing
  ['proposal-how-to-finance-all-the-republics-immediately', 'PROPOSAL – HOW TO FINANCE ALL THE REPUBLICS IMMEDIATELY', 'Financing and Investment Opportunities'],
  ['business-proposal-idas-assembly-support',  "Business Proposal – Ida's Assembly Support",                 'Financing and Investment Opportunities'],
  ['jims-daily-rant-no-bs-ometer-when-sci-fi-merges-into-our-nuvo-reality', "Jim's Daily Rant – No-BS-Ometer: When Sci-Fi Merges Into Our Nuvo-Reality", 'Financing and Investment Opportunities'],
  ['proposal-creating-a-fast-track-to-co-op-villages-ending-poverty-homelessness', 'PROPOSAL – Creating A Fast Track To Co-Op Villages, Ending Poverty & Homelessness', 'Financing and Investment Opportunities'],

  // Training Legal Officers
  ['proposal-training-county-court-clerks',    'PROPOSAL – Training County Court Clerks',                    'Training Legal Officers'],
  ['proposal-training-judicial-officers',      'PROPOSAL – Training Judicial Officers',                      'Training Legal Officers'],

  // Other
  ['proposal-returning-to-the-land',           'PROPOSAL – Returning To The Land',                           'Other'],
  ['proposal-lawyer-up',                       'PROPOSAL – LAWYER UP',                                        'Other'],
  ['create-corporations-for-republic',         'Create Corporations for Republic',                            'Other'],
  ['index-implementation-of-nw-ord',           'Index – Implementation of NW Ord',                           'Other'],
  ['proof-of-30000-persons-on-the-land-the-shot-gun-method', 'Proof of 30,000 Persons on the Land – The Shot Gun Method', 'Other'],
  ['training-academy-for-new-leaders',         'Training Academy for New Leaders',                            'Other'],
  ['creation-of-internet-team',                'Creation of Internet Team',                                   'Other'],
  ['looking-backward-brain-storming',          'Looking Backward; Brain Storming',                            'Other'],
  ['article-republic-for-n-america',           'Article – Republic for N. America',                          'Other'],
  ['proposal-for-the-assemblies-of-the-re-inhabited-republic-for-florida-dictated-constitutional-religious-interference',
   'PROPOSAL – Dictated Constitutional Religious Interference',                                               'Other'],
]

// ── Scrape a single doc page ──────────────────────────────────────────────────
async function scrapeDoc(slug: string): Promise<string> {
  const url = `${BASE}/${slug}/`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 FlaRepublic-Importer/1.0' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return ''
    const html = await res.text()

    // Extract content between the sidebar nav and the share section
    // The article content sits between the last </ul> of the sidebar and
    // the "Share This Article" section
    const shareIdx = html.indexOf('Share This Article')
    const relevant = shareIdx > 0 ? html.slice(0, shareIdx) : html

    // Strip all HTML tags, decode entities, clean whitespace
    const stripped = relevant
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      .replace(/&#8216;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    // Try to find where the actual article content starts
    // It's after all the navigation boilerplate
    const markers = [
      'For The Re-Inhabited Republic',
      'Jim Costa\nUpdated on',
      'The Problem:',
      'Facts & Assumptions:',
    ]
    let startIdx = 0
    for (const marker of markers) {
      const idx = stripped.indexOf(marker)
      if (idx > 0 && idx < stripped.length * 0.7) {
        startIdx = Math.max(startIdx, idx)
        break
      }
    }

    // Also try to find after "Training Legal Officers" sidebar section
    const sidebarEnd = stripped.lastIndexOf('Training Legal Officers')
    if (sidebarEnd > 0 && sidebarEnd < stripped.length * 0.5) {
      startIdx = Math.max(startIdx, sidebarEnd + 50)
    }

    const articleText = startIdx > 0 ? stripped.slice(startIdx) : stripped

    // Remove the last section (navigation/share/footer)
    const footerMarkers = ['Training Links', 'Recommended Viewing', 'Current Event Coverage', 'Clone this Website']
    let endIdx = articleText.length
    for (const marker of footerMarkers) {
      const idx = articleText.indexOf(marker)
      if (idx > articleText.length * 0.3) {
        endIdx = Math.min(endIdx, idx)
      }
    }

    return articleText.slice(0, endIdx).trim()
  } catch {
    return ''
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const payload = await getPayload({ config: configPromise })
  console.log('Connected to Payload\n')

  // 1. Get or create document-categories
  const catMap: Record<string, string> = {}
  const catNames = [...new Set(DOCS.map(d => d[2]))]

  console.log('Ensuring document categories exist...')
  for (const name of catNames) {
    const existing = await payload.find({
      collection: 'document-categories',
      where: { name: { equals: name } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      catMap[name] = existing.docs[0].id as string
      console.log(`  ✓ existing: ${name}`)
    } else {
      const created = await payload.create({
        collection: 'document-categories',
        data: { name } as any,
        overrideAccess: true,
      })
      catMap[name] = created.id as string
      console.log(`  + created: ${name}`)
    }
  }

  // 2. Get or create a "Web Article" file type
  let webFileTypeId: string
  const ftExisting = await payload.find({
    collection: 'file-types',
    where: { name: { equals: 'Web Article' } },
    limit: 1,
    overrideAccess: true,
  })
  if (ftExisting.docs.length > 0) {
    webFileTypeId = ftExisting.docs[0].id as string
  } else {
    const ft = await payload.create({
      collection: 'file-types',
      data: { name: 'Web Article', extension: 'html' } as any,
      overrideAccess: true,
    })
    webFileTypeId = ft.id as string
    console.log('\n+ Created "Web Article" file type')
  }

  // 3. Scrape and import each doc
  console.log('\nImporting docs...')
  let imported = 0, skipped = 0, failed = 0

  for (const [slug, title, catName] of DOCS) {
    // Check if already exists
    const existing = await payload.find({
      collection: 'documents',
      where: { title: { equals: title } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      console.log(`  ~ skip (exists): ${title}`)
      skipped++
      continue
    }

    // Scrape
    const sourceUrl = `${BASE}/${slug}/`
    console.log(`  ↓ fetching: ${slug}`)
    const content = await scrapeDoc(slug)

    if (!content || content.length < 50) {
      console.log(`    ✗ no content scraped`)
      failed++
    }

    try {
      await payload.create({
        collection: 'documents',
        data: {
          title,
          category: catMap[catName],
          fileType: webFileTypeId,
          externalUrl: sourceUrl,
          content: content || `See original at ${sourceUrl}`,
          sourceUrl,
          _status: 'published',
          publishedAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
      console.log(`    ✓ imported (${content.length} chars)`)
      imported++
    } catch (err: any) {
      console.error(`    ✗ create failed: ${err.message}`)
      failed++
    }

    // Small delay to be polite to the server
    await new Promise(r => setTimeout(r, 400))
  }

  console.log(`\n✅ Done — imported: ${imported}, skipped: ${skipped}, failed: ${failed}`)
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
