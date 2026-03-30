// src/scripts/import-docs.ts
// Scrapes all articles from www.flarepublic.us/docs/ and imports them into
// the Payload 'documents' collection with clean article content.
//
// Run from the VPS: npm run import:docs
// To clean up first: npm run clean:docs

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const BASE = 'https://www.flarepublic.us/docs'

const DOCS: [string, string, string][] = [
  ['jims-fast-track-assembly-method',         "Jim's Fast-Track Assembly Method",                                        'Core Documentation'],
  ['inroduction-to-assembly-by-laws',          'Introduction To Assembly By Laws',                                       'Core Documentation'],
  ['proposal-giant-steps-to-assemblies',       'Giant Steps To Assemblies',                                              'Fast Track to Assemblies'],
  ['article-how-lawful-is-the-fast-track',     'Article – How Lawful Is The Fast Track?',                               'Fast Track to Assemblies'],
  ['article-ad-hoc-coach-for-county-assemblies','Article – Ad Hoc Coach For County Assemblies',                         'Fast Track to Assemblies'],
  ['article-getting-two-delegates-in-an-hour', 'Article – Getting Two Delegates In An Hour',                            'Fast Track to Assemblies'],
  ['free-website-cloning',                     'Free Website Cloning',                                                   'Fast Track to Assemblies'],
  ['proposal-radification',                    'PROPOSAL – Ratification',                                                'Fast Track to Assemblies'],
  ['electing-county-delegates',                'Electing County Delegates',                                              'Fast Track to Assemblies'],
  ['obtaining-tigers-for-county-leaders-immediately', 'Obtaining Tigers For County Leaders Immediately',                 'Fast Track to Assemblies'],
  ['proposal-how-to-raise-all-of-your-county-assemblies-immediately', 'PROPOSAL – How To Raise All Of Your County Assemblies Immediately', 'Fast Track to Assemblies'],
  ['article-why-doesnt-national-republic-push-the-fast-track-method', "Article – Why Doesn't National Republic Push The Fast Track Method?", "Why Break From Nat'l to Use the Fast Track?"],
  ['reading-to-county',                        'PROPOSAL – Reading To County',                                           "Why Break From Nat'l to Use the Fast Track?"],
  ['laches-squatter-rights',                   'Article – Laches and Squatter Rights',                                  "Why Break From Nat'l to Use the Fast Track?"],
  ['proposal-mergers-and-military-softball',   'PROPOSAL – Mergers and Military Softball',                              "Why Break From Nat'l to Use the Fast Track?"],
  ['article-signing-oaths-to-the-national-republic-for-the-u-s', 'Article – Signing Oaths To The National Republic For The U.S.', "Why Break From Nat'l to Use the Fast Track?"],
  ['article-whats-the-risk-of-not-taking-tha-land', "Article – What's The Risk Of Not \"Taking Tha Land?\"",            "Why Break From Nat'l to Use the Fast Track?"],
  ['article-the-future-of-county-assemblies',  'Article – The Future Of County Assemblies',                             'Training for Assembly and Congress'],
  ['proposal-maxing-meetings',                 'PROPOSAL – Maxing Meetings',                                             'Training for Assembly and Congress'],
  ['proposal-one-secretary-server-computer-proposal-method-part-iii', 'PROPOSAL – One Secretary Server Computer (Part III)', 'Training for Assembly and Congress'],
  ['proposal-electronic-leadership-of-the-future-now-proposal-method-part-ii', 'PROPOSAL – Electronic Leadership Of The Future Now (Part II)', 'Training for Assembly and Congress'],
  ['first-time-meeting-in-congress',           'First Time Meeting In Congress',                                         'Training for Assembly and Congress'],
  ['proposal-electronic-voting-methods',       'PROPOSAL – Electronic Voting Methods',                                  'Training for Assembly and Congress'],
  ['proposal-assembly-training-after-delegates-elected', 'Proposal – Assembly Training After Delegates Elected',         'Training for Assembly and Congress'],
  ['the-proposal-method',                      'The Proposal Method',                                                    'Training for Assembly and Congress'],
  ['proposal-florida-congressional-training',  'PROPOSAL – Florida Congressional Training',                             'Training for Assembly and Congress'],
  ['ad-hoc-board-of-directors',               'Ad Hoc Board of Directors',                                              'Interim Holding Time Period'],
  ['golden-handcuffs',                         'Golden Handcuffs',                                                       'Interim Holding Time Period'],
  ['board-of-directors',                       'Board Of Directors',                                                     'Interim Holding Time Period'],
  ['article-what-are-the-county-assembly-goals-after-electing-delegates', 'Article – What are The County Assembly Goals After Electing Delegates?', 'Interim Holding Time Period'],
  ['article-simple-arbitration-board-for-dispute-settlement', 'Article – Simple Arbitration Board For Dispute Settlement', 'Interim Holding Time Period'],
  ['article-working-with-other-county-assembly-groups', 'Article – Working With Other County Assembly Groups?',          'Interim Holding Time Period'],
  ['article-should-we-be-working-on-our-constitutions', 'Article – Should We Be Working On Our Constitutions?',         'Interim Holding Time Period'],
  ['ratification-by-the-senate',              'PROPOSAL – Ratification By The Senate',                                  'Creating the Congresses'],
  ['proposal-ratification-of-assemblies',      'PROPOSAL – Ratification of Assemblies',                                 'Creating the Congresses'],
  ['proposal-manning-the-federal-congress',    'PROPOSAL – Manning The Federal Congress',                               'Creating the Congresses'],
  ['proposal-manning-the-florida-congress',    'PROPOSAL – Manning The Florida Congress',                               'Creating the Congresses'],
  ['proposal-updating-website-for-next-phase', 'PROPOSAL – Updating Website For Next Phase',                            'Creating the Congresses'],
  ['proposal-creating-the-florida-house-of-representatives', 'PROPOSAL – Creating The Florida House Of Representatives', 'Creating the Congresses'],
  ['article-procedures-to-create-all-republic-congresses', 'Article – Procedures to Create All Republic Congresses',    'Creating the Congresses'],
  ['article-who-has-the-power-to-create-a-republic-government', 'Article – Who has The Power To Create A Republic Government?', 'Creating the Congresses'],
  ['article-challenge-to-opening-the-florida-congress', 'Article – Challenge To Opening The Florida Congress',          'Creating the Congresses'],
  ['proposal-how-to-finance-all-the-republics-immediately', 'PROPOSAL – How To Finance All The Republics Immediately',  'Financing and Investment Opportunities'],
  ['business-proposal-idas-assembly-support',  "Business Proposal – Ida's Assembly Support",                            'Financing and Investment Opportunities'],
  ['jims-daily-rant-no-bs-ometer-when-sci-fi-merges-into-our-nuvo-reality', "Jim's Daily Rant – No-BS-Ometer",          'Financing and Investment Opportunities'],
  ['proposal-creating-a-fast-track-to-co-op-villages-ending-poverty-homelessness', 'PROPOSAL – Creating A Fast Track To Co-Op Villages, Ending Poverty & Homelessness', 'Financing and Investment Opportunities'],
  ['proposal-training-county-court-clerks',    'PROPOSAL – Training County Court Clerks',                               'Training Legal Officers'],
  ['proposal-training-judicial-officers',      'PROPOSAL – Training Judicial Officers',                                 'Training Legal Officers'],
  ['proposal-returning-to-the-land',           'PROPOSAL – Returning To The Land',                                      'Other'],
  ['proposal-lawyer-up',                       'PROPOSAL – LAWYER UP',                                                   'Other'],
  ['create-corporations-for-republic',         'Create Corporations for Republic',                                       'Other'],
  ['index-implementation-of-nw-ord',           'Index – Implementation of NW Ord',                                      'Other'],
  ['proof-of-30000-persons-on-the-land-the-shot-gun-method', 'Proof of 30,000 Persons on the Land – The Shot Gun Method', 'Other'],
  ['training-academy-for-new-leaders',         'Training Academy for New Leaders',                                       'Other'],
  ['creation-of-internet-team',                'Creation of Internet Team',                                              'Other'],
  ['looking-backward-brain-storming',          'Looking Backward; Brain Storming',                                       'Other'],
  ['article-republic-for-n-america',           'Article – Republic for N. America',                                     'Other'],
  ['proposal-for-the-assemblies-of-the-re-inhabited-republic-for-florida-dictated-constitutional-religious-interference', 'PROPOSAL – Dictated Constitutional Religious Interference', 'Other'],
]

// ── Extract clean article text from HTML ──────────────────────────────────────
function extractContent(html: string): string {
  // Cut off everything after "Share This Article" (footer/social links)
  const shareIdx = html.indexOf('Share This Article')
  const working = shareIdx > 0 ? html.slice(0, shareIdx) : html

  // The article body follows the breadcrumb nav which ends with the page title
  // Pattern: the sidebar ends, then breadcrumbs, then author, then content
  // Find the LAST occurrence of a docs/ link in the sidebar, then take everything after the next </ul>
  const lastDocLink = working.lastIndexOf('href="https://www.flarepublic.us/docs/')
  let startIdx = 0
  if (lastDocLink > 0) {
    const closingUl = working.indexOf('</ul>', lastDocLink)
    if (closingUl > 0) startIdx = closingUl + 5
  }

  // Also try to find the author byline and start after it
  const authorMatch = working.search(/Jim Costa\s*\n\s*Updated on/)
  if (authorMatch > 0 && authorMatch > startIdx) {
    const nextNewline = working.indexOf('\n', authorMatch + 60)
    if (nextNewline > 0) startIdx = nextNewline
  }

  const contentHtml = working.slice(startIdx)

  // Strip HTML
  let text = contentHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<hr[^>]*>/gi, '\n---\n')
    .replace(/<[^>]+>/g, '')

  // Decode entities
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
  text = text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()

  // Stop at footer nav content
  const stopPhrases = [
    'Training Links', 'Recommended Viewing', 'Current Event Coverage',
    'Clone this Website', 'Scroll to Top', 'Florida free State',
    'Complete Business Plan for all States\n', 'FAST TRACK County Assembly Method\n',
    'Recently Added Documents\n',
  ]
  let endIdx = text.length
  for (const phrase of stopPhrases) {
    const idx = text.indexOf(phrase)
    if (idx > 100 && idx < endIdx) endIdx = idx
  }

  return text.slice(0, endIdx).trim()
}

async function fetchDoc(slug: string): Promise<string> {
  const url = `${BASE}/${slug}/`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 FlaRepublic-Importer/1.0' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) { process.stdout.write(`[${res.status}] `); return '' }
    return extractContent(await res.text())
  } catch (e: any) {
    process.stdout.write(`[ERR: ${e.message}] `)
    return ''
  }
}

async function main() {
  const payload = await getPayload({ config: configPromise })
  console.log('Connected\n')

  // Ensure categories
  const catMap: Record<string, string> = {}
  const catOrder: Record<string, number> = {
    'Core Documentation': 1, 'Fast Track to Assemblies': 2,
    "Why Break From Nat'l to Use the Fast Track?": 3,
    'Training for Assembly and Congress': 4, 'Interim Holding Time Period': 5,
    'Creating the Congresses': 6, 'Financing and Investment Opportunities': 7,
    'Training Legal Officers': 8, 'Other': 9,
  }

  for (const name of [...new Set(DOCS.map(d => d[2]))]) {
    const ex = await payload.find({ collection: 'document-categories', where: { title: { equals: name } }, limit: 1, overrideAccess: true })
    if (ex.docs.length > 0) {
      catMap[name] = ex.docs[0].id as string
    } else {
      const c = await payload.create({ collection: 'document-categories', data: { title: name, displayOrder: catOrder[name] ?? 99 } as any, overrideAccess: true })
      catMap[name] = c.id as string
      console.log(`+ category: ${name}`)
    }
  }

  // Ensure Web Article file type
  let ftId: string
  const ftEx = await payload.find({ collection: 'file-types', where: { label: { equals: 'Web Article' } }, limit: 1, overrideAccess: true })
  if (ftEx.docs.length > 0) {
    ftId = ftEx.docs[0].id as string
  } else {
    const ft = await payload.create({ collection: 'file-types', data: { label: 'Web Article', value: 'web-article' } as any, overrideAccess: true })
    ftId = ft.id as string
    console.log('+ file type: Web Article')
  }

  console.log('\nImporting...')
  let imported = 0, skipped = 0, failed = 0

  for (const [slug, title, cat] of DOCS) {
    const ex = await payload.find({ collection: 'documents', where: { title: { equals: title } }, limit: 1, overrideAccess: true })
    if (ex.docs.length > 0) { process.stdout.write(`  ~ ${title}\n`); skipped++; continue }

    process.stdout.write(`  ↓ ${slug} ... `)
    const content = await fetchDoc(slug)
    console.log(content.length > 30 ? `${content.length} chars` : 'EMPTY')

    try {
      await payload.create({
        collection: 'documents',
        data: { title, category: catMap[cat], fileType: ftId, externalUrl: `${BASE}/${slug}/`, content, sourceUrl: `${BASE}/${slug}/`, _status: 'published', publishedAt: new Date().toISOString() } as any,
        overrideAccess: true,
      })
      imported++
    } catch (e: any) {
      console.error(`    ✗ ${e.message}`)
      failed++
    }

    await new Promise(r => setTimeout(r, 400))
  }

  console.log(`\nDone — imported: ${imported}, skipped: ${skipped}, failed: ${failed}`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
