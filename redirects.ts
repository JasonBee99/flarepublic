import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Phase 3 — nav URL aliases
  // The seeded MainNav global uses short flat URLs; pages live at nested paths.
  // These redirects bridge the gap without requiring a database update.
  const navAliases = [
    { source: '/newbys',              destination: '/learn/newbys-corner',            permanent: false },
    { source: '/fast-track',          destination: '/learn/fast-track',               permanent: false },
    { source: '/academy',             destination: '/learn/newbys-corner',            permanent: false },
    { source: '/county-assemblies',   destination: '/procedures/assembly',            permanent: false },
    { source: '/assembly-procedures', destination: '/procedures/assembly',            permanent: false },
    { source: '/reigning-in-corps',   destination: '/procedures/reigning-in-corps',  permanent: false },
    { source: '/electronic-meetings', destination: '/procedures/electronic-meetings', permanent: false },
    { source: '/escarosa',            destination: '/community/escarosa',             permanent: false },
    { source: '/documents',           destination: '/resources/documents',            permanent: false },
    { source: '/contact',             destination: '/contacts',                       permanent: false },
  ]

  return [internetExplorerRedirect, ...navAliases]
}
