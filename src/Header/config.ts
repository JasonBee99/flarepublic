import type { GlobalConfig } from 'payload'

// Original scaffold Global — required by payload.config.ts
export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'link',
          type: 'group',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'url', type: 'text' },
          ],
        },
      ],
      maxRows: 6,
    },
  ],
}

// Our new dynamic nav global slug reference
export const headerConfig = {
  navGlobalSlug: 'main-nav',
} as const
