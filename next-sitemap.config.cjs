const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://flarepublic.us'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  // Static Phase 3 pages to include explicitly
  additionalPaths: async (config) => [
    await config.transform(config, '/learn/newbys-corner'),
    await config.transform(config, '/learn/fast-track'),
    await config.transform(config, '/resources/documents'),
    await config.transform(config, '/contacts'),
    await config.transform(config, '/community/escarosa'),
    await config.transform(config, '/procedures/assembly'),
    await config.transform(config, '/procedures/electronic-meetings'),
    await config.transform(config, '/procedures/reigning-in-corps'),
    await config.transform(config, '/register'),
    await config.transform(config, '/login'),
  ],
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/*',
    '/posts/*',
    '/admin',
    '/admin/*',
    '/member',
    '/member/*',
    '/forum',
    '/forum/*',
    '/logout',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/admin', '/admin/', '/member', '/member/', '/logout'],
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
    ],
  },
}
