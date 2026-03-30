// src/scripts/seed-test-users.ts
// Seeds 10 test users in Hillsborough County with:
//   - Approved status, member role
//   - Personality test results (varied types)
//   - All added to a test focus group
// Run with: npm run seed:test-users

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

// ── Test user data ─────────────────────────────────────────────────────────────

const TEST_USERS = [
  { name: 'Alice Merritt',   email: 'user1@gmail.com',  dominant: 'S', s: 18, c: 8,  m: 7,  p: 7  },
  { name: 'Brian Colton',    email: 'user2@gmail.com',  dominant: 'C', s: 6,  c: 20, m: 8,  p: 6  },
  { name: 'Carol Dunbar',    email: 'user3@gmail.com',  dominant: 'M', s: 5,  c: 7,  m: 19, p: 9  },
  { name: 'Derek Osman',     email: 'user4@gmail.com',  dominant: 'P', s: 6,  c: 5,  m: 8,  p: 21 },
  { name: 'Elena Vasquez',   email: 'user5@gmail.com',  dominant: 'S', s: 16, c: 10, m: 7,  p: 7  },
  { name: 'Frank Bellamy',   email: 'user6@gmail.com',  dominant: 'C', s: 7,  c: 17, m: 9,  p: 7  },
  { name: 'Grace Howell',    email: 'user7@gmail.com',  dominant: 'M', s: 6,  c: 6,  m: 22, p: 6  },
  { name: 'Henry Strand',    email: 'user8@gmail.com',  dominant: 'P', s: 7,  c: 6,  m: 7,  p: 20 },
  { name: 'Isabelle Cross',  email: 'user9@gmail.com',  dominant: 'S', s: 15, c: 9,  m: 8,  p: 8  },
  { name: 'James Pittman',   email: 'user10@gmail.com', dominant: 'M', s: 7,  c: 8,  m: 18, p: 7  },
]

const PASSWORD = '*Domino77'

async function main() {
  const payload = await getPayload({ config: configPromise })

  // ── Find Hillsborough County ───────────────────────────────────────────────
  const countyResult = await payload.find({
    collection: 'counties',
    where: { slug: { equals: 'hillsborough' } },
    limit: 1,
    overrideAccess: true,
  })
  const county = countyResult.docs[0]
  if (!county) {
    console.error('Hillsborough County not found — run seed:counties first.')
    process.exit(1)
  }
  console.log(`✓ Found county: ${county.name} (${county.id})`)

  // ── Create or find a test focus group ─────────────────────────────────────
  const existingGroup = await payload.find({
    collection: 'focus-groups' as any,
    where: {
      and: [
        { county: { equals: county.id } },
        { title: { equals: 'Test Focus Group Alpha' } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  let focusGroup = existingGroup.docs[0]
  if (!focusGroup) {
    focusGroup = await payload.create({
      collection: 'focus-groups' as any,
      data: {
        title: 'Test Focus Group Alpha',
        county: county.id,
        description: 'Seeded test group for development and QA.',
        stage: 'active',
        maxMembers: 6,
        isActive: true,
      } as any,
      overrideAccess: true,
    })
    console.log(`✓ Created focus group: ${focusGroup.title} (${focusGroup.id})`)
  } else {
    console.log(`✓ Using existing focus group: ${focusGroup.title} (${focusGroup.id})`)
  }

  // ── Create users ──────────────────────────────────────────────────────────
  let activeSlots = 0 // track active slots — cap at maxMembers (6), rest go to waitlist

  // Count existing active members in this group
  const existingMemberships = await payload.find({
    collection: 'focus-group-members' as any,
    where: {
      and: [
        { focusGroup: { equals: focusGroup.id } },
        { status: { equals: 'active' } },
      ],
    },
    limit: 100,
    overrideAccess: true,
  })
  activeSlots = existingMemberships.totalDocs

  for (const u of TEST_USERS) {
    // ── Find or create user ──────────────────────────────────────────────────
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: u.email } },
      limit: 1,
      overrideAccess: true,
    })

    let userId: string

    if (existing.docs[0]) {
      userId = existing.docs[0].id as string
      // Update county + approval in case it wasn't set
      await payload.update({
        collection: 'users',
        id: userId,
        data: {
          county: county.id,
          approved: true,
          approvedAt: new Date().toISOString(),
          role: 'member',
        } as any,
        overrideAccess: true,
      })
      console.log(`  ~ Updated existing user: ${u.email}`)
    } else {
      const created = await payload.create({
        collection: 'users',
        data: {
          name: u.name,
          email: u.email,
          password: PASSWORD,
          county: county.id,
          role: 'member',
          approved: true,
          approvedAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
      userId = created.id as string
      console.log(`  + Created user: ${u.name} (${u.email})`)
    }

    // ── Personality results ──────────────────────────────────────────────────
    const existingResult = await payload.find({
      collection: 'personality-results',
      where: { user: { equals: userId } },
      limit: 1,
      overrideAccess: true,
    })

    if (existingResult.docs[0]) {
      await payload.update({
        collection: 'personality-results',
        id: existingResult.docs[0].id as string,
        data: {
          sanguine: u.s,
          choleric: u.c,
          melancholy: u.m,
          phlegmatic: u.p,
          dominantType: u.dominant,
          county: county.id,
          completedAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
      console.log(`    ~ Updated personality result: ${u.dominant} dominant`)
    } else {
      await payload.create({
        collection: 'personality-results',
        data: {
          user: userId,
          county: county.id,
          sanguine: u.s,
          choleric: u.c,
          melancholy: u.m,
          phlegmatic: u.p,
          dominantType: u.dominant,
          completedAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
      console.log(`    + Created personality result: ${u.dominant} dominant`)
    }

    // ── Focus group membership ───────────────────────────────────────────────
    const existingMembership = await payload.find({
      collection: 'focus-group-members' as any,
      where: {
        and: [
          { focusGroup: { equals: focusGroup.id } },
          { user: { equals: userId } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (!existingMembership.docs[0]) {
      // Cholerics go to waitlist regardless of slot count
      const isCholeric = u.dominant === 'C'
      const status = isCholeric
        ? 'waitlist'
        : activeSlots < (focusGroup.maxMembers ?? 6)
          ? 'active'
          : 'waitlist'

      if (!isCholeric && status === 'active') activeSlots++

      await payload.create({
        collection: 'focus-group-members' as any,
        data: {
          focusGroup: focusGroup.id,
          user: userId,
          role: 'member',
          status,
          joinedAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
      console.log(`    + Added to focus group: ${status}${isCholeric ? ' (Choleric — manual placement required)' : ''}`)
    } else {
      console.log(`    ~ Already in focus group: ${existingMembership.docs[0].status}`)
    }
  }

  console.log('\n✓ Done — 10 test users seeded in Hillsborough County.')
  console.log(`  Login: user1@gmail.com through user10@gmail.com`)
  console.log(`  Password: ${PASSWORD}`)
  console.log(`  Focus group: "${focusGroup.title}"`)
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
