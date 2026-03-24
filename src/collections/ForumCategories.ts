// src/collections/ForumCategories.ts
// Forum categories — one per county (or statewide). Moderators can be county organizers.

import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const ForumCategories: CollectionConfig = {
  slug: 'forum-categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'county', 'displayOrder', 'isActive'],
    useAsTitle: 'title',
    group: 'Forum',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Escambia County Forum" or "Statewide Discussion"' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug — e.g. "escambia" — lowercase, no spaces',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Short description shown on the forum index' },
    },
    {
      name: 'county',
      type: 'relationship',
      relationTo: 'counties',
      admin: { description: 'Associated county (leave blank for statewide)' },
    },
    {
      name: 'moderators',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Users who can moderate this category (pin/lock/delete threads)',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Inactive categories are hidden from the forum index' },
    },
  ],
  timestamps: true,
}
