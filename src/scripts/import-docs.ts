// src/scripts/import-docs.ts
// Run on VPS: npm run clean:docs && npm run import:docs

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

function extractContent(html: string): string {
  // The article body is reliably between the author avatar block and "Share This Article"
  // Author avatar URL always contains "avatars/7/"
  const avatarIdx = html.indexOf('avatars/7/')
  const shareIdx = html.indexOf('Share This Article')

  let body: string
  if (avatarIdx > 0 && shareIdx > avatarIdx) {
    // Find the closing > of the avatar anchor tag, then take content until Share
    const afterAvatar = html.indexOf('</a>', avatarIdx)
    body = afterAvatar > 0 ? html.slice(afterAvatar + 4, shareIdx) : html.slice(avatarIdx, shareIdx)
  } else if (shareIdx > 0) {
    // Fallback: take everything before Share This Article, after the last sidebar </ul>
    const lastUl = html.lastIndexOf('</ul>', shareIdx)
    body = lastUl > 0 ? html.slice(lastUl + 5, shareIdx) : html.slice(0, shareIdx)
  } else {
    body = html
  }

  // Strip HTML tags
  let text = body
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<hr[^>]*>/gi, '\n---\n')
    .replace(/<[^>]+>/g, '')

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—').replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"').replace(/&#160;/g, ' ')

  // Normalize whitespace
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
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
    process.stdout.write(`[ERR] `)
    return ''
  }
}

async function main() {
  const payload = await getPayload({ config: configPromise })
  console.log('Connected\n')

  const catOrder: Record<string, number> = {
    'Core Documentation': 1, 'Fast Track to Assemblies': 2,
    "Why Break From Nat'l to Use the Fast Track?": 3,
    'Training for Assembly and Congress': 4, 'Interim Holding Time Period': 5,
    'Creating the Congresses': 6, 'Financing and Investment Opportunities': 7,
    'Training Legal Officers': 8, 'Other': 9,
  }

  const catMap: Record<string, string> = {}
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
    if (ex.docs.length > 0) { console.log(`  ~ ${title}`); skipped++; continue }

    process.stdout.write(`  ↓ ${slug} ... `)
    const content = await fetchDoc(slug)
    console.log(content.length > 30 ? `${content.length} chars` : 'EMPTY')

    try {
      await payload.create({
        collection: 'documents',
        data: {
          title, category: catMap[cat], fileType: ftId,
          externalUrl: `${BASE}/${slug}/`,
          content, sourceUrl: `${BASE}/${slug}/`,
          _status: 'published', publishedAt: new Date().toISOString(),
        } as any,
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
