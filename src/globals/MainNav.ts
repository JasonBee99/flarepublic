import type { GlobalConfig } from 'payload'

export const MainNav: GlobalConfig = {
  slug: 'main-nav',
  label: 'Main Navigation',
  admin: {
    description: 'Manage the site header navigation. Add, reorder, or toggle nav items and dropdown groups.',
  },
  fields: [
    {
      name: 'groups',
      type: 'array',
      label: 'Nav Groups',
      admin: {
        description: 'Each group can be a standalone link or a dropdown with child links.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Group Label',
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'dropdown',
          options: [
            { label: 'Standalone Link', value: 'link' },
            { label: 'Dropdown Group', value: 'dropdown' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL (for standalone links)',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'link',
          },
        },
        {
          name: 'requiresAuth',
          type: 'checkbox',
          label: 'Requires Login',
          defaultValue: false,
          admin: {
            description: 'Hide this item from logged-out visitors.',
          },
        },
        {
          name: 'requiresApproval',
          type: 'checkbox',
          label: 'Requires Approval',
          defaultValue: false,
          admin: {
            description: 'Only show to approved members (e.g. Forum).',
          },
        },
        {
          name: 'items',
          type: 'array',
          label: 'Dropdown Items',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              label: 'Short Description (optional)',
              admin: {
                description: 'Shown as a subtitle under the link in the dropdown.',
              },
            },
            {
              name: 'requiresAuth',
              type: 'checkbox',
              label: 'Requires Login',
              defaultValue: false,
            },
            {
              name: 'requiresApproval',
              type: 'checkbox',
              label: 'Requires Approval',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
