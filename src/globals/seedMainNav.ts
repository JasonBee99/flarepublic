/**
 * Seed script: populates the main-nav Payload Global with the default
 * FlaRepublic nav structure. Run once after your first `npm run dev`:
 *
 *   npx ts-node --project tsconfig.json src/globals/seedMainNav.ts
 *
 * Or paste the fetch() call into your browser console while the dev
 * server is running and you are logged in as admin.
 */

const NAV_SEED = {
  groups: [
    {
      label: 'Learn',
      type: 'dropdown',
      requiresAuth: false,
      requiresApproval: false,
      items: [
        { label: "Newby's Corner", url: '/newbys', description: 'New to the Florida Republic? Start here.' },
        { label: 'Academy', url: '/academy', description: 'Leader and member training resources.' },
        { label: 'Fast Track', url: '/fast-track', description: 'Stand up a County Assembly in one week.' },
        { label: 'County Assemblies', url: '/county-assemblies', description: 'How to create and run a County Assembly.' },
      ],
    },
    {
      label: 'Procedures',
      type: 'dropdown',
      requiresAuth: false,
      requiresApproval: false,
      items: [
        { label: 'Assembly Procedures', url: '/assembly-procedures', description: 'Founders and training procedure guides.' },
        { label: 'Reigning In Corporations', url: '/reigning-in-corps', description: 'Corporate accountability strategy and legal steps.' },
        { label: 'Electronic Meetings', url: '/electronic-meetings', description: 'Zoom and Wire meeting training.' },
      ],
    },
    {
      label: 'Community',
      type: 'dropdown',
      requiresAuth: false,
      requiresApproval: false,
      items: [
        { label: 'EscaRosa Chapter', url: '/escarosa', description: 'Escambia & Santa Rosa Counties local chapter.' },
        { label: 'Forum', url: '/forum', description: 'Members-only Discord community.', requiresApproval: true },
      ],
    },
    {
      label: 'Resources',
      type: 'dropdown',
      requiresAuth: false,
      requiresApproval: false,
      items: [
        { label: 'Documents', url: '/documents', description: 'PDFs, spreadsheets, and reference files.' },
        { label: 'Contact Directory', url: '/contact', description: 'Find organizers and officers by county.' },
      ],
    },
    {
      label: 'Register',
      type: 'link',
      url: '/register',
      requiresAuth: false,
      requiresApproval: false,
    },
    {
      label: 'Member Login',
      type: 'link',
      url: '/login',
      requiresAuth: false,
      requiresApproval: false,
    },
  ],
}

// If running as a script, POST to the Payload REST API
async function seed() {
  const res = await fetch('http://localhost:3000/api/globals/main-nav', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // You must be logged in — grab your cookie from the browser or use
    // the Payload local API instead if running inside the project.
    credentials: 'include',
    body: JSON.stringify(NAV_SEED),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Seed failed:', err)
    process.exit(1)
  }

  console.log('✅ main-nav global seeded successfully.')
}

seed()
